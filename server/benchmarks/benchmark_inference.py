"""
Internal Benchmark: Inference Latency and Token Throughput (TPS).
"""

import sys
import os
import asyncio
import time
import argparse

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import get_settings
from app.services.model_manager.manager import model_manager
from app.services.inference.inference_service import inference_service


async def run_inference_benchmark(rounds: int = 5, max_tokens: int = 256):
    settings = get_settings()
    print("=" * 65)
    print(f"ADTC INFERENCE BENCHMARK - {settings.APP_NAME}")
    print(f"Active Provider : {settings.MODEL_PROVIDER.upper()}")
    print(f"Model Name      : {settings.MODEL_NAME}")
    print(f"Threads         : {settings.MODEL_THREADS}")
    print(f"Rounds          : {rounds}")
    print(f"Target Max Token: {max_tokens}")
    print("=" * 65)

    test_prompts = [
        "Explain how memory allocation works in Python list slicing.",
        "What is the difference between a microtask and a macrotask in JavaScript?",
        "How does dynamic method dispatch work in Java polymorphism?",
    ]

    latencies = []
    tps_records = []

    for i in range(rounds):
        prompt = test_prompts[i % len(test_prompts)]
        print(f"\n[Round {i + 1}/{rounds}] Generating response...")

        start = time.perf_counter()
        text, metrics = await inference_service.generate_response(
            prompt=prompt,
            max_tokens=max_tokens,
        )
        duration = time.perf_counter() - start

        latencies.append(metrics.latency_ms)
        tps_records.append(metrics.tokens_per_second)

        print(f"  -> Generated {metrics.completion_tokens} tokens in {metrics.latency_ms:.1f}ms")
        print(f"  -> Throughput: {metrics.tokens_per_second:.1f} tokens/sec")

    avg_latency = sum(latencies) / len(latencies)
    avg_tps = sum(tps_records) / len(tps_records)
    s_perf = min(avg_tps / 15.0, 1.0) * 100.0

    print("\n" + "=" * 65)
    print("BENCHMARK SUMMARY RESULTS:")
    print(f"Average Latency   : {avg_latency:.2f} ms")
    print(f"Average Throughput: {avg_tps:.2f} tokens/sec")
    print(f"Estimated Sperf   : {s_perf:.2f} / 100 points (ADTC Performance Score)")
    print("=" * 65)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--rounds", type=int, default=3)
    parser.add_argument("--tokens", type=int, default=128)
    args = parser.parse_args()

    asyncio.run(run_inference_benchmark(rounds=args.rounds, max_tokens=args.tokens))
