"""Smoke test / reference for the NVIDIA Nemotron integration.

Run from the ``backend`` directory:

    export NVIDIA_API_KEY=nvapi-...
    python -m scripts.test_nemotron

This exercises the same client the app uses (streaming + the thinking
channel), so it doubles as a connectivity check for the AI pipeline.
"""

from __future__ import annotations

import asyncio
import os
import sys

# Allow ``python scripts/test_nemotron.py`` as well as ``-m``.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ai.nemotron import NemotronClient, NemotronError  # noqa: E402


PROMPT = "Write a limerick about the wonders of GPU computing."


async def main() -> int:
    client = NemotronClient()
    if not client.configured:
        print(
            "ERROR: NVIDIA_API_KEY is not set.\n"
            "  export NVIDIA_API_KEY=nvapi-...",
            file=sys.stderr,
        )
        return 1

    print(f"Model: {client.model}")
    print(f"Endpoint: {client.base_url}")
    print("-" * 60)

    reasoning_started = False
    try:
        async for channel, text in client.stream(
            [{"role": "user", "content": PROMPT}]
        ):
            if channel == "reasoning":
                if not reasoning_started:
                    print("\n[thinking] ", end="", flush=True)
                    reasoning_started = True
                print(text, end="", flush=True)
            else:
                if reasoning_started:
                    print("\n\n[answer] ", end="", flush=True)
                    reasoning_started = False
                print(text, end="", flush=True)
    except NemotronError as exc:
        print(f"\nERROR: {exc}", file=sys.stderr)
        return 1

    print("\n" + "-" * 60)
    print("OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
