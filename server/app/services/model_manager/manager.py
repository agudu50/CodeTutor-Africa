"""
Model Manager Service.

Responsible for:
- Discovering local GGUF models in `./models/`
- Validating GGUF file structure and paths
- Enforcing single loaded model in memory (preventing memory blowups on 8GB RAM)
- Managing provider lifecycle (MockLLMProvider vs LocalGGUFProvider)
- Reporting real-time model status and metadata
"""

import os
import glob
from typing import Dict, Any, List, Optional
from app.core.config import Settings, get_settings
from app.core.logging import logger
from app.infrastructure.llm.base import LLMProvider
from app.infrastructure.llm.mock_provider import MockLLMProvider
from app.infrastructure.llm.gguf_provider import LocalGGUFProvider


class ModelManager:
    """Singleton model lifecycle and discovery manager."""

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()
        self._provider: Optional[LLMProvider] = None
        self._initialize_provider()

    def _initialize_provider(self):
        """Initializes the configured LLM provider."""
        if self.settings.MODEL_PROVIDER == "mock":
            logger.info("Initializing MockLLMProvider for lightweight CPU/memory baseline.")
            self._provider = MockLLMProvider(model_name=self.settings.MODEL_NAME)
        else:
            logger.info(f"Initializing LocalGGUFProvider with model path: {self.settings.MODEL_PATH}")
            self._provider = LocalGGUFProvider(self.settings)

    @property
    def provider(self) -> LLMProvider:
        """Returns active LLM provider instance."""
        if self._provider is None:
            self._initialize_provider()
        return self._provider

    def discover_local_models(self) -> List[Dict[str, Any]]:
        """Scans the models directory for available .gguf files."""
        models_dir = os.path.dirname(self.settings.MODEL_PATH)
        if not os.path.exists(models_dir):
            return []

        gguf_files = glob.glob(os.path.join(models_dir, "*.gguf"))
        discovered = []

        for path in gguf_files:
            file_size_mb = round(os.path.getsize(path) / (1024 * 1024), 2)
            discovered.append({
                "filename": os.path.basename(path),
                "path": path,
                "size_mb": file_size_mb,
                "is_active": os.path.abspath(path) == os.path.abspath(self.settings.MODEL_PATH),
            })

        return discovered

    async def load_model(self) -> bool:
        """Loads the active model into memory."""
        return await self.provider.load()

    async def unload_model(self) -> bool:
        """Unloads model to free memory for other tasks."""
        return await self.provider.unload()

    def get_status(self) -> Dict[str, Any]:
        """Returns active model metadata and load status."""
        info = self.provider.get_model_info()
        info["discovered_models"] = self.discover_local_models()
        return info


model_manager = ModelManager()
