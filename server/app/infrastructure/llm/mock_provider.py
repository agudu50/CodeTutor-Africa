"""
Mock LLM Provider for Testing and Zero-RAM Offline Development.
Simulates realistic Socratic tutoring responses without loading gigabytes of weights.
"""

import asyncio
import time
from typing import AsyncGenerator, Dict, Any, Optional
from app.infrastructure.llm.base import LLMProvider
from app.schemas.system import InferenceMetrics


class MockLLMProvider(LLMProvider):
    """Deterministic, pedagogical mock tutor provider."""

    def __init__(self, model_name: str = "Mock-Qwen2.5-Coder-3B"):
        self.model_name = model_name
        self._is_loaded = True

    async def load(self) -> bool:
        self._is_loaded = True
        return True

    async def unload(self) -> bool:
        self._is_loaded = False
        return True

    def is_loaded(self) -> bool:
        return self._is_loaded

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "name": self.model_name,
            "provider": "mock",
            "format": "Simulated",
            "context_size": 2048,
            "threads": 4,
            "gpu_layers": 0,
            "is_loaded": self._is_loaded,
        }

    async def generate(
        self,
        prompt: str,
        temperature: float = 0.2,
        top_p: float = 0.95,
        max_tokens: int = 512,
        stop_sequences: Optional[list] = None,
    ) -> tuple[str, InferenceMetrics]:
        start_time = time.perf_counter()

        # Simulate small CPU inference latency
        await asyncio.sleep(0.05)

        response_text = self._synthesize_response(prompt)
        duration = time.perf_counter() - start_time
        latency_ms = round(duration * 1000, 2)

        prompt_tokens = len(prompt.split())
        completion_tokens = len(response_text.split())
        tps = round(completion_tokens / max(0.001, duration), 1)

        metrics = InferenceMetrics(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            latency_ms=latency_ms,
            tokens_per_second=tps,
            model_name=self.model_name,
        )

        return response_text, metrics

    async def stream(
        self,
        prompt: str,
        temperature: float = 0.2,
        top_p: float = 0.95,
        max_tokens: int = 512,
        stop_sequences: Optional[list] = None,
    ) -> AsyncGenerator[str, None]:
        response_text = self._synthesize_response(prompt)
        words = response_text.split(" ")

        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.01)

    def _synthesize_response(self, prompt: str) -> str:
        lower_p = prompt.lower()
        if "hint" in lower_p or "mode: hint" in lower_p:
            return (
                "Here is a targeted hint to guide your thinking:\n\n"
                "Look closely at the data flow. Remember that in Python, assignment operations (`b = a`) copy the memory pointer rather than allocating a new structure on the heap. "
                "How might slicing or `.copy()` protect the original collection?"
            )
        elif "debug" in lower_p or "mode: debug" in lower_p:
            return (
                "### Diagnostic Analysis\n\n"
                "1. **Root Cause**: The variable reference is accessed before resolution or mutated unintentionally in-place.\n"
                "2. **Guided Fix**: Consider checking your loop boundary or replacing in-place `.push()` / `.append()` mutations with an immutable copy."
            )
        elif "practice" in lower_p or "mode: practice" in lower_p:
            return (
                "### Practice Exercise\n\n"
                "**Goal**: Implement a function that filters all positive integers from a list without mutating the original input.\n\n"
                "```python\ndef filter_positives(nums: list) -> list:\n    # Your solution here\n    pass\n```"
            )
        else:
            return (
                "Let's break down this concept step by step:\n\n"
                "1. **Core Mechanism**: When working with asynchronous tasks or memory structures, the runtime queues operations to maintain execution predictability.\n"
                "2. **Pedagogical Example**: In JavaScript, microtasks (like Promises) always execute immediately after the current call stack clears, before macrotasks (like `setTimeout`).\n"
                "3. **Reflection Question**: What order would you expect if you nested a `Promise.resolve()` inside a loop?"
            )
