"""
Local GGUF LLM Provider using llama.cpp / llama-cpp-python.

Designed for CPU-only 8 GB RAM target:
- n_ctx: 2048 bounded context
- n_threads: 4 CPU threads
- n_gpu_layers: 0 (Integrated graphics only)
- use_mmap: True (memory mapping)
- use_mlock: False (preserves RAM flexibility)
"""

import os
import time
from typing import AsyncGenerator, Dict, Any, Optional
from app.infrastructure.llm.base import LLMProvider
from app.core.config import Settings
from app.core.logging import logger
from app.core.exceptions import ModelNotReadyError
from app.schemas.system import InferenceMetrics


class LocalGGUFProvider(LLMProvider):
    """llama.cpp GGUF local model execution provider."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.model_path = settings.MODEL_PATH
        self.model_name = settings.MODEL_NAME
        self._llm = None

    async def load(self) -> bool:
        if self._llm is not None:
            return True

        if not os.path.exists(self.model_path):
            logger.warning(f"GGUF model file not found at {self.model_path}")
            return False

        try:
            import importlib
            llama_module = importlib.import_module("llama_cpp")
            llama_cls = getattr(llama_module, "Llama")

            logger.info(
                f"Loading GGUF model: {self.model_name} (threads={self.settings.MODEL_THREADS}, "
                f"ctx={self.settings.MODEL_CONTEXT_SIZE}, gpu_layers=0)"
            )

            self._llm = llama_cls(
                model_path=self.model_path,
                n_ctx=self.settings.MODEL_CONTEXT_SIZE,
                n_threads=self.settings.MODEL_THREADS,
                n_batch=self.settings.MODEL_BATCH_SIZE,
                n_gpu_layers=self.settings.MODEL_GPU_LAYERS,
                use_mmap=self.settings.MODEL_USE_MMAP,
                use_mlock=self.settings.MODEL_USE_MLOCK,
                verbose=False,
            )
            logger.info("GGUF model loaded successfully into memory.")
            return True
        except (ImportError, ModuleNotFoundError):
            logger.warning("llama-cpp-python is not installed in the current environment.")
            return False
        except Exception as e:
            logger.error(f"Failed to load GGUF model: {e}")
            return False

    async def unload(self) -> bool:
        if self._llm is not None:
            del self._llm
            self._llm = None
            logger.info("GGUF model unloaded from memory.")
        return True

    def is_loaded(self) -> bool:
        return self._llm is not None

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "name": self.model_name,
            "provider": "gguf",
            "format": "GGUF",
            "context_size": self.settings.MODEL_CONTEXT_SIZE,
            "threads": self.settings.MODEL_THREADS,
            "gpu_layers": self.settings.MODEL_GPU_LAYERS,
            "is_loaded": self.is_loaded(),
            "model_path": self.model_path,
        }

    async def generate(
        self,
        prompt: str,
        temperature: float = 0.2,
        top_p: float = 0.95,
        max_tokens: int = 512,
        stop_sequences: Optional[list] = None,
    ) -> tuple[str, InferenceMetrics]:
        if not self.is_loaded():
            loaded = await self.load()
            if not loaded:
                raise ModelNotReadyError(f"GGUF model at '{self.model_path}' could not be loaded.")

        start_time = time.perf_counter()

        output = self._llm.create_completion(
            prompt=prompt,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens,
            stop=stop_sequences or ["<|im_end|>", "<|endoftext|>"],
        )

        duration = time.perf_counter() - start_time
        text = output["choices"][0]["text"].strip()
        usage = output.get("usage", {})

        prompt_tokens = usage.get("prompt_tokens", len(prompt.split()))
        completion_tokens = usage.get("completion_tokens", len(text.split()))
        tps = round(completion_tokens / max(0.001, duration), 1)

        metrics = InferenceMetrics(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            latency_ms=round(duration * 1000, 2),
            tokens_per_second=tps,
            model_name=self.model_name,
        )

        return text, metrics

    async def stream(
        self,
        prompt: str,
        temperature: float = 0.2,
        top_p: float = 0.95,
        max_tokens: int = 512,
        stop_sequences: Optional[list] = None,
    ) -> AsyncGenerator[str, None]:
        if not self.is_loaded():
            loaded = await self.load()
            if not loaded:
                raise ModelNotReadyError(f"GGUF model at '{self.model_path}' could not be loaded.")

        stream_gen = self._llm.create_completion(
            prompt=prompt,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens,
            stop=stop_sequences or ["<|im_end|>", "<|endoftext|>"],
            stream=True,
        )

        for chunk in stream_gen:
            delta = chunk["choices"][0].get("text", "")
            if delta:
                yield delta
