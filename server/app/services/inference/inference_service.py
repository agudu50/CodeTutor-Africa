"""
Inference Service.

Responsible for:
- Enforcing MAX_CONCURRENT_INFERENCES concurrency limit via asyncio.Semaphore
- Applying prompt templates for Socratic tutoring and code explanation
- Delegating execution to the active LLMProvider
- Providing non-blocking streaming token generators
- Recording latency and token metrics
"""

import asyncio
from typing import AsyncGenerator, Optional, Dict, Any
from app.core.config import Settings, get_settings
from app.core.logging import logger
from app.core.exceptions import ConcurrencyLimitExceededError, ModelNotReadyError
from app.services.model_manager.manager import model_manager
from app.schemas.system import InferenceMetrics


class InferenceService:
    """Core LLM inference orchestrator with memory-bounded concurrency control."""

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()
        self._semaphore = asyncio.Semaphore(self.settings.MAX_CONCURRENT_INFERENCES)

    async def generate_response(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> tuple[str, InferenceMetrics]:
        """Generates complete response with strict concurrency locking."""
        temp = temperature if temperature is not None else self.settings.DEFAULT_TEMPERATURE
        tokens = max_tokens if max_tokens is not None else self.settings.DEFAULT_MAX_TOKENS

        full_prompt = self._format_prompt(prompt, system_prompt)

        try:
            # Non-blocking acquisition check or acquire
            async with self._semaphore:
                logger.info(f"Executing inference (tokens={tokens}, temp={temp})")
                text, metrics = await model_manager.provider.generate(
                    prompt=full_prompt,
                    temperature=temp,
                    max_tokens=tokens,
                )
                return text, metrics
        except Exception as e:
            logger.error(f"Inference generation error: {e}")
            raise

    async def stream_response(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """Streams token-by-token generation for Server-Sent Events (SSE)."""
        temp = temperature if temperature is not None else self.settings.DEFAULT_TEMPERATURE
        tokens = max_tokens if max_tokens is not None else self.settings.DEFAULT_MAX_TOKENS

        full_prompt = self._format_prompt(prompt, system_prompt)

        async with self._semaphore:
            logger.info("Starting streaming token generation.")
            async for token in model_manager.provider.stream(
                prompt=full_prompt,
                temperature=temp,
                max_tokens=tokens,
            ):
                yield token

    def _format_prompt(self, user_prompt: str, system_prompt: Optional[str] = None) -> str:
        """Formats prompt using standard ChatML template."""
        sys = system_prompt or (
            "You are CodeTutor Africa, an empathetic, highly knowledgeable programming tutor. "
            "Your goal is to guide African university students to master computer science through "
            "Socratic questioning, clear mental models, and structured hints rather than simply giving away complete solutions."
        )
        return (
            f"<|im_start|>system\n{sys}<|im_end|>\n"
            f"<|im_start|>user\n{user_prompt}<|im_end|>\n"
            f"<|im_start|>assistant\n"
        )


inference_service = InferenceService()
