"""Clinical document extraction pipeline.

Nemotron 3.5 Lightning is a text-only model, so extraction runs in two stages:

1. **Vision OCR (Gemini)** — transcribes the handwriting in the uploaded image.
2. **Structuring (Nemotron)** — converts the transcription into the strict
   ``ExtractedPrescription`` JSON schema, with per-field confidence, status,
   bounding regions and refusal reasons.

The deterministic ``post_process_extraction`` safety pass is applied last.
"""

from __future__ import annotations

import base64
import logging
import time

import httpx

from app.ai.nemotron import NemotronClient, NemotronError, structure_prescription
from app.ai.post_check import post_process_extraction
from app.core.config import get_settings
from app.schemas.clinical import ExtractedPrescription

logger = logging.getLogger(__name__)
settings = get_settings()


# ─── Stage 1: vision OCR ─────────────────────────────────────────────────────


OCR_PROMPT = """
You are a precise OCR engine for clinical documents.

Transcribe the document EXACTLY as written, preserving layout and line breaks.
Rules:
- Output plain text only. Do NOT summarise, translate, correct spelling, or add commentary.
- Preserve medicine names, dosages, frequencies (e.g. 1-0-1), durations and units verbatim.
- If a word or line is genuinely illegible, write [illegible] in its place.
- Never guess or invent content that is not visible.
"""


async def transcribe_with_gemini(
    image_bytes: bytes, mime_type: str = "image/jpeg"
) -> str:
    """Stage 1 — use Gemini's vision model to OCR the document."""
    if not settings.GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY is not set (required for vision OCR).")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_VISION_MODEL}:generateContent"
    )
    payload = {
        "systemInstruction": {"parts": [{"text": OCR_PROMPT}]},
        "contents": [
            {
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": base64.b64encode(image_bytes).decode("utf-8"),
                        }
                    },
                    {"text": "Transcribe this clinical document verbatim."},
                ]
            }
        ],
        "generationConfig": {"temperature": 0.0},
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            url, json=payload, headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        data = response.json()

    candidates = data.get("candidates")
    if not candidates:
        raise RuntimeError("Gemini OCR returned no candidates.")

    parts = candidates[0].get("content", {}).get("parts", [])
    text = "".join(part.get("text", "") for part in parts)
    if not text.strip():
        raise RuntimeError("Gemini OCR returned an empty transcription.")
    return text.strip()


# ─── Stage 2: Nemotron structuring ───────────────────────────────────────────


SYSTEM_PROMPT = """
You are a highly accurate clinical extraction AI. Your task is to convert an OCR
transcription of a handwritten prescription or clinical document into structured data.
Follow these rules strictly:
1. NEVER hallucinate. If something is illegible, ambiguous or missing, set the value
   to null, status to "illegible", and provide a reason. Never invent a drug or dose.
2. For EVERY field, you MUST return:
   - value: the extracted text/number or null
   - confidence: a float between 0.0 and 1.0 (0.0 if missing/illegible)
   - status: "ai_extracted" if confident, "needs_verification" if confidence < 0.8,
     "illegible" if unreadable
   - source_region: an explanation or null (bounding boxes are not available from text OCR)
   - reason: explanation if illegible or needs verification.
3. Your output MUST be a single JSON object that perfectly matches the JSON schema
   for ExtractedPrescription. Return JSON only — no markdown, no commentary.
""".strip()


async def structure_with_nemotron(transcription: str) -> tuple[ExtractedPrescription, str]:
    """Stage 2 — convert an OCR transcription into ``ExtractedPrescription``.

    Returns ``(prescription, model_text)`` where ``model_text`` is the raw answer
    (useful for audit/debugging).
    """
    schema = ExtractedPrescription.model_json_schema()
    try:
        parsed, raw_answer, reasoning = await structure_prescription(
            transcription, SYSTEM_PROMPT, schema
        )
    except NemotronError as exc:
        raise RuntimeError(f"Nemotron structuring failed: {exc}") from exc

    if reasoning:
        logger.debug("Nemotron reasoning (%s chars): %s", len(reasoning), reasoning[:2000])

    return ExtractedPrescription.model_validate(parsed), raw_answer


# ─── Orchestration ───────────────────────────────────────────────────────────


async def extract_prescription_data(
    image_bytes: bytes, mime_type: str = "image/jpeg"
) -> ExtractedPrescription:
    """Run the full OCR -> structuring -> safety-check pipeline."""
    started = time.perf_counter()

    transcription = await transcribe_with_gemini(image_bytes, mime_type)
    logger.info("Gemini OCR produced %s characters", len(transcription))

    prescription, _ = await structure_with_nemotron(transcription)
    prescription = post_process_extraction(prescription)

    elapsed_ms = int((time.perf_counter() - started) * 1000)
    logger.info("Extraction pipeline finished in %sms", elapsed_ms)
    return prescription


async def extract_prescription_data_verbose(
    image_bytes: bytes, mime_type: str = "image/jpeg"
) -> ExtractedPrescription:
    """Alias kept for backwards compatibility with existing call sites."""
    return await extract_prescription_data(image_bytes, mime_type)
