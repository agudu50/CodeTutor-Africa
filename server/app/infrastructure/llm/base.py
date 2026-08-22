"""
Abstract LLM Provider Interface.

Defines the contract for all inference providers:
- LocalGGUFProvider (llama.cpp)
- MockLLMProvider (testing & offline baseline)
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Any, Optional
from app.schemas.system import InferenceMetrics


class LLMProvider(ABC):
    """Abstract Base Class for LLM Inference Runtimes."""

    @abstractmethod
    async def load(self) -> bool:
        """Loads model weights into memory if not already loaded."""
        pass

    @abstractmethod
    async def unload(self) -> bool:
        """Unloads model weights from memory to reclaim RAM."""
        pass

    @abstractmethod
    def is_loaded(self) -> bool:
        """Returns True if the model is loaded and ready for inference."""
        pass

    @abstractmethod
    def get_model_info(self) -> Dict[str, Any]:
        """Returns model metadata, context window, and quantization details."""
        pass

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        temperature: float = 0.2,
        top_p: float = 0.95,
        max_tokens: int = 512,
        stop_sequences: Optional[list] = None,
    ) -> tuple[str, InferenceMetrics]:
        """Generates a complete response and returns (text, metrics)."""
        pass

    @abstractmethod
    async def stream(
        self,
        prompt: str,
        temperature: float = 0.2,
        top_p: float = 0.95,
        max_tokens: int = 512,
        stop_sequences: Optional[list] = None,
    ) -> AsyncGenerator[str, None]:
        """Streams generated tokens one by one."""
        pass
