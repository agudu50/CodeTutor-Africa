"""
Structured Logging Module.

Provides memory-friendly, structured logging without verbose bloat.
Ensures sensitive user code and massive tokens are not unnecessarily dumped into memory buffers.
"""

import sys
import logging
from typing import Any, Dict


class StructuredFormatter(logging.Formatter):
    """Clean, structured console formatter with high readability."""

    def format(self, record: logging.LogRecord) -> str:
        timestamp = self.formatTime(record, "%Y-%m-%d %H:%M:%S")
        level = record.levelname.ljust(8)
        message = record.getMessage()
        location = f"{record.filename}:{record.lineno}"

        extra_info = ""
        if hasattr(record, "metrics") and isinstance(record.metrics, dict):
            extra_info = f" | metrics={record.metrics}"

        return f"[{timestamp}] [{level}] [{location}] {message}{extra_info}"


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Configures root application logger."""
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)

    root_logger = logging.getLogger("codetutor")
    root_logger.setLevel(numeric_level)

    # Avoid duplicate handlers on reload
    if not root_logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(numeric_level)
        handler.setFormatter(StructuredFormatter())
        root_logger.addHandler(handler)

    # Mute noisy third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("aiosqlite").setLevel(logging.WARNING)

    return root_logger


logger = setup_logging()
