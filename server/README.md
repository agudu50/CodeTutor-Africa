# CodeTutor Africa - Backend Architecture

**Track**: Africa Deep Tech Challenge (ADTC) 2026 Laptop LLM Track  
**Objective**: Offline-First AI Programming Tutor optimized for Commodity Hardware (8 GB RAM, Core i5 / Ryzen 5, Integrated Graphics).

---

## 1. Hardware Budget & Scoring Alignment

| Metric | Target Laptop Constraint | ADTC Scoring Formula |
| :--- | :--- | :--- |
| **RAM Budget** | 8 GB DDR4 | $S_{eff} = \max(0, (7.0\text{ GB} - \text{Peak RSS}) / 7.0\text{ GB}) \times 100$ |
| **CPU Throughput** | Core i5 / Ryzen 5 (Integrated GPU) | $S_{perf} = \min(\text{TPS} / 15.0, 1.0) \times 100$ |
| **Thermals** | Fan cooling (No throttling) | $P_{thermal} = -10$ pts if CPU throttles or temp $> 85^\circ\text{C}$ |
| **Accuracy** | Socratic Guidance & Code Debugging | $S_{acc} = 50\%$ weight |

---

## 2. Directory Architecture

```
server/
├── app/
│   ├── main.py                      # FastAPI App Factory & Exception Handlers
│   ├── core/
│   │   ├── config.py                # Pydantic Settings & Memory Guardrails
│   │   ├── logging.py               # Low-overhead Structured Logging
│   │   ├── exceptions.py            # Centralized Domain Exceptions
│   │   └── lifecycle.py             # Lifespan Management (Warmup/Cleanup)
│   ├── api/
│   │   ├── router.py                # V1 API Aggregator
│   │   └── v1/
│   │       ├── health.py            # Lightweight O(1) Zero-RAM Health Check
│   │       ├── system.py            # Real-time Memory RSS & System Metrics
│   │       ├── tutor.py             # Socratic Chat & SSE Token Streaming
│   │       ├── practice.py          # Coding Problem Retrieval & Evaluation
│   │       ├── debugger.py          # Compiler Diagnostics & Guided Fixes
│   │       ├── learning.py          # Course Curriculum Endpoints
│   │       └── progress.py          # Student Mastery & Streaks
│   ├── schemas/                     # Pydantic Request/Response Models
│   ├── infrastructure/
│   │   ├── database/                # SQLite Engine & SQLAlchemy ORM
│   │   ├── llm/                     # LLMProvider, MockLLMProvider, LocalGGUFProvider
│   │   ├── monitoring/              # Performance & RSS Monitor
│   │   └── code_runner/             # CodeRunner Sandbox Abstraction
│   ├── repositories/                # Clean Async Database Repositories
│   └── services/
│       ├── model_manager/           # Single-instance Model Lifecycle & Discovery
│       ├── inference/               # Bounded Concurrency & Token Metrics
│       ├── tutor/                   # Socratic Pedagogical Mode Engine
│       ├── learning/                # Course Data Services
│       ├── practice/                # Test Evaluation Services
│       ├── debugger/                # Diagnostics Services
│       └── progress/                # Student Mastery Services
├── models/                          # Local GGUF Weights Storage
├── data/                            # Local SQLite DB, Courses, Embeddings
├── benchmarks/                      # Internal Throughput & Memory Profilers
├── tests/                           # Pytest Unit & Integration Suite
├── requirements.txt                 # Minimum Lightweight Dependencies
└── pyproject.toml                   # Project Metadata
```

---

## 3. Layer Separation & Data Flow

```
[ Frontend / HTTP Client ]
           │
           ▼
[ API Router Layer ] (app/api/v1/tutor.py)
           │
           ▼
[ Application Service Layer ] (app/services/tutor/tutor_service.py)
           │
           ▼
[ Inference Service ] (app/services/inference/inference_service.py)
           │ (asyncio.Semaphore enforces MAX_CONCURRENT_INFERENCES = 1)
           ▼
[ LLM Provider Abstraction ] (app/infrastructure/llm/base.py)
           │
     ┌─────┴────────────────────────┐
     ▼                              ▼
[ MockLLMProvider ]        [ LocalGGUFProvider ]
(Deterministic CPU)        (llama.cpp GGUF, 0 GPU layers, mmap=True)
```

---

## 4. Installation & Running

### A. Install Dependencies:
```bash
cd server
python -m pip install -r requirements.txt
```

### B. Run Development Server:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### C. Run Tests:
```bash
pytest
```

### D. Run Internal Benchmarks:
```bash
python benchmarks/benchmark_inference.py --rounds 3 --tokens 128
python benchmarks/benchmark_memory.py
```
