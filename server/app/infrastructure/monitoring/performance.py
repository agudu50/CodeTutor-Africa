"""
Performance Monitoring Module for ADTC Profiling and Resource Governance.

Calculates:
- Peak Process RSS (Resident Set Size) memory against the 7.0 GB budget limit
- CPU utilization percentage
- Token throughput (Tokens Per Second - TPS)
- First-token and end-to-end inference latency
- Thermal safety status
"""

import os
import time
import psutil
from typing import Optional, Dict, Any
from app.core.config import get_settings
from app.schemas.system import SystemResourceMetrics, InferenceMetrics


class PerformanceMonitor:
    """Lightweight resource and inference performance tracker."""

    def __init__(self):
        self.settings = get_settings()
        self._process = psutil.Process(os.getpid())
        # Initial CPU sample
        self._process.cpu_percent(interval=None)

    def get_system_metrics(self) -> SystemResourceMetrics:
        """Reads current OS and backend process memory and CPU."""
        vm = psutil.virtual_memory()
        mem_info = self._process.memory_info()

        rss_bytes = mem_info.rss
        rss_mb = round(rss_bytes / (1024 * 1024), 2)
        rss_gb = round(rss_bytes / (1024 * 1024 * 1024), 3)

        cpu_pct = psutil.cpu_percent(interval=None)
        thermal_celsius = self._read_thermal_temp()

        is_throttled = False
        if thermal_celsius and thermal_celsius >= self.settings.THERMAL_ALERT_THRESHOLD_C:
            is_throttled = True

        return SystemResourceMetrics(
            cpu_percent=cpu_pct,
            ram_used_gb=round(vm.used / (1024 * 1024 * 1024), 2),
            ram_total_gb=round(vm.total / (1024 * 1024 * 1024), 2),
            ram_percent=vm.percent,
            process_rss_mb=rss_mb,
            process_rss_gb=rss_gb,
            thermal_celsius=thermal_celsius,
            is_throttled=is_throttled,
        )

    def calculate_efficiency_score(self, peak_rss_gb: float) -> float:
        """Calculates ADTC Seff = max(0, (7 GB - peak RSS) / 7 GB) * 100."""
        limit = self.settings.PEAK_MEMORY_BUDGET_GB
        if peak_rss_gb >= limit:
            return 0.0
        return max(0.0, (limit - peak_rss_gb) / limit) * 100.0

    def calculate_performance_score(self, tps: float) -> float:
        """Calculates ADTC Sperf = min(TPS / 15.0, 1.0) * 100."""
        return min(tps / 15.0, 1.0) * 100.0

    def _read_thermal_temp(self) -> Optional[float]:
        """Attempts to read CPU thermal sensor if supported by OS."""
        try:
            if hasattr(psutil, "sensors_temperatures"):
                temps = psutil.sensors_temperatures()
                if temps:
                    for name in ["coretemp", "k10temp", "cpu_thermal", "acpitz"]:
                        if name in temps and len(temps[name]) > 0:
                            return float(temps[name][0].current)
        except Exception:
            pass
        return None


performance_monitor = PerformanceMonitor()
