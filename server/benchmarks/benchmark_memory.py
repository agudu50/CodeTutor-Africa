"""
Internal Benchmark: Memory Footprint and ADTC Efficiency Score ($S_{eff}$).
"""

import sys
import os
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.infrastructure.monitoring.performance import performance_monitor
from app.core.config import get_settings


def run_memory_benchmark():
    settings = get_settings()
    print("=" * 65)
    print(f"ADTC MEMORY FOOTPRINT BENCHMARK - {settings.APP_NAME}")
    print(f"Budget Limit: {settings.PEAK_MEMORY_BUDGET_GB} GB RAM")
    print("=" * 65)

    metrics = performance_monitor.get_system_metrics()
    s_eff = performance_monitor.calculate_efficiency_score(metrics.process_rss_gb)

    print(f"Total System RAM     : {metrics.ram_total_gb:.2f} GB")
    print(f"Used System RAM      : {metrics.ram_used_gb:.2f} GB ({metrics.ram_percent}%)")
    print(f"CodeTutor Process RSS: {metrics.process_rss_mb:.2f} MB ({metrics.process_rss_gb:.4f} GB)")
    print(f"CPU Utilization      : {metrics.cpu_percent:.1f}%")
    if metrics.thermal_celsius is not None:
        print(f"CPU Thermal Temp     : {metrics.thermal_celsius:.1f}°C")
    print("-" * 65)
    print(f"Estimated Seff Score : {s_eff:.2f} / 100 points (ADTC Efficiency Score)")
    print("=" * 65)


if __name__ == "__main__":
    run_memory_benchmark()
