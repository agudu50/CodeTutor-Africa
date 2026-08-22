"""
Unit Test: Core Configuration and Resource Constants.
"""

from app.core.config import get_settings


def test_settings_defaults():
    settings = get_settings()
    assert settings.APP_NAME == "CodeTutor Africa Backend"
    assert settings.MODEL_GPU_LAYERS == 0, "GPU layers must be 0 for ADTC CPU target"
    assert settings.PEAK_MEMORY_BUDGET_GB == 7.0
    assert settings.MAX_CONCURRENT_INFERENCES == 1
    assert settings.MODEL_THREADS >= 1
