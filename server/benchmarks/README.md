# CodeTutor Africa - ADTC Benchmarks & Profiling Suite

This folder provides internal benchmarking utilities to prepare and optimize models for the **Africa Deep Tech Challenge (ADTC) 2026 Laptop LLM Track**.

---

## 1. Official ADTC Profiler Context

The official competition profiler measures GGUF models running through `llama.cpp`:
- Throughput (Tokens per second - TPS)
- Peak RSS Memory Footprint (GB)
- CPU Utilization & Thermal Throttling (< 85°C)
- Accuracy Metrics ($S_{acc}$)

### Scoring Formula:
$$S_{total} = 0.50 \times S_{acc} + 0.30 \times S_{perf} + 0.20 \times S_{eff} - P_{thermal}$$

- **Performance Score ($S_{perf}$)**: $\min(\text{TPS} / 15.0, 1.0) \times 100$
- **Efficiency Score ($S_{eff}$)**: $\max(0, (7.0\text{ GB} - \text{Peak RSS}) / 7.0\text{ GB}) \times 100$
- **Thermal Penalty ($P_{thermal}$)**: $-10$ points if CPU throttles or exceeds 85°C.

---

## 2. Running Internal Benchmarks

### A. Inference Latency & Throughput Benchmark:
```bash
python benchmarks/benchmark_inference.py --rounds 5 --tokens 256
```

### B. Process RSS Memory & CPU Utilization Benchmark:
```bash
python benchmarks/benchmark_memory.py
```

### C. Official ADTC Profiler Verification (Target Machine):
```bash
adtc-profiler run \
  --submission ./models \
  --mode participant \
  --output benchmarks/benchmark_results/submission.json
```
