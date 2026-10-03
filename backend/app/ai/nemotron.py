"""NVIDIA NIM client for the Nemotron text model.

Nemotron 3.5 Lightning is a *text-only* model. It is used here for the
reasoning-heavy half of the clinical pipeline: turning a noisy OCR
transcription into the strict ``ExtractedPrescription`` JSON schema.

The original hand-written snippet this is based on has been hardened:

* API key is read from settings (never hard-coded / ``$NVIDIA_API_KEY``).
* Streaming is optional and the ``reasoning_content`` ("thinking") channel is
  captured separately from the final answer.
* Robust JSON extraction (handles ```json fences and surrounding prose).
* Exponential-backoff retries on transient HTTP / transport errors.
* Clear, typed errors so the API layer can return meaningful responses.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from typing import Any, AsyncIterator

import httpx
from pydantic import ValidationError

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class NemotronError(RuntimeError):
    """Raised when the Nemotron model cannot produce a usable response."""


# ─── Low-level client ────────────────────────────────────────────────────────


class NemotronClient:
    """Thin, async wrapper around the NVIDIA NIM chat-completions endpoint."""

    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        model: str | None = None,
    ) -> None:
        self.api_key = api_key or settings.NVIDIA_API_KEY
        self.base_url = (base_url or settings.NVIDIA_BASE_URL).rstrip("/")
        self.model = model or settings.NVIDIA_MODEL

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

    def _payload(
        self,
        messages: list[dict[str, str]],
        *,
        stream: bool,
        temperature: float | None = None,
        top_p: float | None = None,
        max_tokens: int | None = None,
        json_mode: bool = False,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": (
                settings.NVIDIA_TEMPERATURE if temperature is None else temperature
            ),
            "top_p": settings.NVIDIA_TOP_P if top_p is None else top_p,
            "max_tokens": settings.NVIDIA_MAX_TOKENS if max_tokens is None else max_tokens,
            "stream": stream,
            # Nemotron "thinking" controls, exactly as in the reference snippet.
            "extra_body": {
                "chat_template_kwargs": {
                    "enable_thinking": settings.NVIDIA_ENABLE_THINKING
                },
                "reasoning_budget": settings.NVIDIA_REASONING_BUDGET,
            },
        }
        # NIM honours OpenAI-style structured output when the model supports it.
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
        return payload

    # ── non-streaming ────────────────────────────────────────────────────────

    async def complete(
        self,
        messages: list[dict[str, str]],
        *,
        temperature: float | None = None,
        top_p: float | None = None,
        max_tokens: int | None = None,
        json_mode: bool = False,
    ) -> tuple[str, str]:
        """Return ``(answer, reasoning)`` for a single completion.

        Retries transient failures with exponential backoff.
        """
        if not self.configured:
            raise NemotronError("NVIDIA_API_KEY is not set.")

        url = f"{self.base_url}/chat/completions"
        payload = self._payload(
            messages,
            stream=False,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens,
            json_mode=json_mode,
        )

        last_exc: Exception | None = None
        for attempt in range(1, settings.NVIDIA_MAX_RETRIES + 1):
            try:
                async with httpx.AsyncClient(timeout=settings.NVIDIA_TIMEOUT_SECONDS) as client:
                    response = await client.post(url, headers=self._headers(), json=payload)
                if response.status_code in (429, 500, 502, 503, 504):
                    raise httpx.HTTPStatusError(
                        f"transient status {response.status_code}",
                        request=response.request,
                        response=response,
                    )
                response.raise_for_status()
                data = response.json()
                return self._parse_completion(data)
            except (httpx.HTTPError, NemotronError) as exc:
                last_exc = exc
                if attempt >= settings.NVIDIA_MAX_RETRIES:
                    break
                backoff = 2 ** (attempt - 1)
                logger.warning(
                    "Nemotron request failed (attempt %s/%s): %s — retrying in %ss",
                    attempt,
                    settings.NVIDIA_MAX_RETRIES,
                    exc,
                    backoff,
                )
                await asyncio.sleep(backoff)

        raise NemotronError(f"Nemotron completion failed: {last_exc}") from last_exc

    # ── streaming ────────────────────────────────────────────────────────────

    async def stream(
        self,
        messages: list[dict[str, str]],
        *,
        temperature: float | None = None,
        top_p: float | None = None,
        max_tokens: int | None = None,
    ) -> AsyncIterator[tuple[str, str]]:
        """Yield ``(channel, text)`` tuples as the model streams.

        ``channel`` is either ``"reasoning"`` (the thinking channel) or
        ``"content"`` (the final answer).
        """
        if not self.configured:
            raise NemotronError("NVIDIA_API_KEY is not set.")

        url = f"{self.base_url}/chat/completions"
        payload = self._payload(
            messages,
            stream=True,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens,
        )

        async with httpx.AsyncClient(timeout=settings.NVIDIA_TIMEOUT_SECONDS) as client:
            async with client.stream(
                "POST", url, headers=self._headers(), json=payload
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line or not line.startswith("data:"):
                        continue
                    chunk = line[len("data:") :].strip()
                    if chunk == "[DONE]":
                        break
                    try:
                        parsed = json.loads(chunk)
                    except json.JSONDecodeError:
                        continue
                    choices = parsed.get("choices")
                    if not choices:
                        continue
                    delta = choices[0].get("delta") or {}
                    reasoning = delta.get("reasoning_content")
                    if reasoning:
                        yield "reasoning", reasoning
                    content = delta.get("content")
                    if content:
                        yield "content", content

    # ── parsing ──────────────────────────────────────────────────────────────

    @staticmethod
    def _parse_completion(data: dict[str, Any]) -> tuple[str, str]:
        choices = data.get("choices")
        if not choices:
            raise NemotronError("Nemotron returned no choices.")
        message = choices[0].get("message") or {}
        content = message.get("content") or ""
        reasoning = message.get("reasoning_content") or ""
        if not content:
            raise NemotronError("Nemotron returned an empty response.")
        return content, reasoning


# ─── High-level helpers ──────────────────────────────────────────────────────


def _extract_json(text: str) -> str:
    """Pull the first JSON object out of a model response.

    Handles ```json fences and prose surrounding the object.
    """
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fenced:
        return fenced.group(1)
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start : end + 1]
    return text.strip()


async def structure_prescription(
    transcription: str,
    system_prompt: str,
    schema: dict[str, Any],
) -> tuple[dict[str, Any], str, str]:
    """Turn an OCR transcription into a validated-schema dictionary.

    Returns ``(structured_data, raw_answer, reasoning)``.
    """
    messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": (
                "Below is the OCR transcription of a clinical document. Extract every "
                "field into JSON matching this JSON Schema exactly:\n\n"
                f"{json.dumps(schema)}\n\n"
                "Transcription:\n"
                f"{transcription}"
            ),
        },
    ]

    client = NemotronClient()
    answer, reasoning = await client.complete(messages, json_mode=True)

    candidate = _extract_json(answer)
    try:
        parsed = json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise NemotronError(f"Nemotron returned invalid JSON: {exc}") from exc

    if not isinstance(parsed, dict):
        raise NemotronError("Nemotron returned JSON that is not an object.")
    return parsed, answer, reasoning
