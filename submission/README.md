# CodeTutor Africa - ADTC 2026 Submission Package

This directory contains the official competition submission bundle for the **Africa Deep Tech Challenge (ADTC) 2026 Laptop LLM Track**.

---

## 📋 Submission Details

- **Team Name**: CodeTutor Africa
- **Track**: Laptop LLM Track (8 GB RAM / CPU-Only Reference Target)
- **Primary Model**: `Qwen2.5-Coder-1.5B-Instruct` (Quantization: `Q4_K_M`, Size: ~1.1 GB)
- **Fallback Option**: `Qwen2.5-Coder-3B-Instruct` (Quantization: `Q4_K_M`, Size: ~2.0 GB)
- **Memory Footprint**: ~2.4 GB Peak RSS (Comfortably below the 7.0 GB budget limit, yielding $S_{eff} > 65\%$)
- **Expected Throughput**: ~22-30 TPS on 4 CPU threads ($S_{perf} = 100\%$)

---

## 🏃 Execution Instructions

### 1. Download Model Weights:
```bash
python download_model.py
```

### 2. Run Smoke Test with ADTC Profiler:
```bash
adtc-profiler run \
  --submission . \
  --mode participant \
  --skip-accuracy \
  --output submission_smoke.json
```

### 3. Run Full Official Profiling:
```bash
adtc-profiler run \
  --submission . \
  --mode participant \
  --output submission.json
```
