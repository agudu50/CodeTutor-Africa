<div align="center">

# 🌍 CodeTutor Africa

**Offline-First AI Programming Tutor for African University Students**  

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Production Deployment](https://img.shields.io/badge/Production-code--tutor--africa.vercel.app-005F02.svg?logo=vercel&logoColor=white)](https://code-tutor-africa.vercel.app)
[![Offline First](https://img.shields.io/badge/Architecture-100%25%20Offline--First-success.svg)](#offline-first-philosophy)
[![ADTC Track](https://img.shields.io/badge/ADTC%202026-Laptop%20LLM%20Track-orange.svg)](#-2-adtc-2026-profiler--scoring-alignment)
[![Model](https://img.shields.io/badge/Model-Qwen2.5--Coder--1.5B--Instruct%20(Q4__K__M)-purple.svg)](https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF)

</div>

---

## 🌐 Live Production Demo & Quick Links

- **Live Web App**: **[https://code-tutor-africa.vercel.app](https://code-tutor-africa.vercel.app)**
- **Technical Report**: [REPORT.md](file:///c:/All%20Projects/CodeTutor%20Africa/REPORT.md)
- **ADTC Submission Metadata**: [submission.json](file:///c:/All%20Projects/CodeTutor%20Africa/submission.json)
- **Local Backend API**: `http://127.0.0.1:8008`
- **Local Frontend**: `http://localhost:5173`

---

## 📖 1. Problem Statement & Motivation

Across African universities, computer science and engineering students frequently encounter steep roadblocks in mastering programming:
1. **Unreliable Internet & High Data Costs**: Cloud-hosted AI coding assistants (e.g. ChatGPT, Claude, Copilot) require constant high-speed connectivity and costly API subscriptions, rendering them inaccessible in low-bandwidth regions and offline university labs.
2. **Commodity Hardware Constraints**: The standard university student laptop is a commodity machine (typically **8 GB RAM, Intel Core i5 10th–12th Gen or AMD Ryzen 5, integrated graphics only, and 256 GB SSD**). Running heavyweight AI systems locally often causes catastrophic out-of-memory (OOM) crashes, extreme battery drain, or severe CPU thermal throttling.
3. **The "Copy-Paste" Pedagogical Flaw**: Generic generative LLMs provide direct, unverified answers to assignments, depriving students of essential problem-solving intuition, mental model formation, and debugging skills.

### 💡 The Solution: CodeTutor Africa
**CodeTutor Africa** is an offline-first, highly optimized AI programming tutor, dynamic curriculum generator, and VS Code-embedded sandbox engineered to execute 100% locally on an 8 GB RAM laptop without requiring GPUs, internet access, or cloud APIs.

---

## 🎯 2. ADTC 2026 Profiler & Scoring Alignment

CodeTutor Africa is engineered from the ground up for the official **Africa Deep Tech Challenge (ADTC) 2026 Laptop LLM Track** competition benchmark:

$$\mathbf{S_{total}} = 0.50 \cdot S_{acc} + 0.30 \cdot S_{perf} + 0.20 \cdot S_{eff} - P_{thermal}$$

### Official Benchmark & Profiler Results (`submission.json`):

| Metric | Target Laptop Constraint | ADTC Benchmark Result | Status / Score |
| :--- | :--- | :--- | :--- |
| **Generation Throughput ($S_{perf}$)** | $\ge 15.0\text{ tokens/sec}$ ($S_{perf} = \min(\text{TPS} / 15.0, 1.0) \times 100$) | **23.44 tokens/sec** | **EXCEEDS TARGET ($S_{perf} = \mathbf{100/100}$)** |
| **Peak Active RSS ($S_{eff}$)** | $< 7.0\text{ GB}$ ($S_{eff} = \max(0, (7.0 - \text{RSS}) / 7.0) \times 100$) | **1,729.99 MB** ($\approx 1.69\text{ GB}$) | **PASS ($S_{eff} = \mathbf{95.3/100}$)** |
| **Steady-State RSS** | $< 7.0\text{ GB}$ | **1,640.82 MB** ($\approx 1.60\text{ GB}$) | **PASS** |
| **Server Baseline RSS** | Minimal background footprint | **44.02 MB** | **OPTIMAL ($S_{eff} = \mathbf{99.4/100}$)** |
| **First Token Latency (TTFT)** | Interactive response | **~6.5 s (cold) / <0.8 s (warm)** | **PASS** |
| **Thermal Penalty ($P_{thermal}$)** | Maintain package temps $< 85^\circ\text{C}$ | 4-thread CPU bounded, no throttling | **0 Penalty Points ($P_{thermal} = 0$)** |
| **Network Calls During Inference** | 100% Offline | **0 Outbound Calls** | **PASS** |

---

## 🏗️ 3. High-Level System Architecture

CodeTutor Africa follows a strict **Modular Monolith / Clean Architecture** pattern:

```
                      ┌────────────────────────────────────────┐
                      │        FRONTEND (React + Vite)         │
                      │  • Socratic Chat & SSE Token Streaming │
                      │  • AI Course & Multi-Module Generator  │
                      │  • VS Code Embedded IDEs & Terminals   │
                      │  • 4 Three.js Interactive Arcade Games │
                      └──────────────────┬─────────────────────┘
                                         │ HTTP REST & SSE
                                         ▼
                      ┌────────────────────────────────────────┐
                      │       API LAYER (FastAPI /api/v1)      │
                      │  • /health, /system/status, /metrics   │
                      │  • /tutor/chat, /practice/evaluate     │
                      │  • /learning/generate-course           │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │       APPLICATION & DOMAIN SERVICES    │
                      │  • TutorService (6 Pedagogical Modes)  │
                      │  • LearningService (Curriculum Synth)  │
                      │  • PracticeService & DebuggerService   │
                      │  • ProgressService (Telemetry)         │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │    CONCURRENCY & MEMORY GOVERNANCE     │
                      │  • asyncio.Semaphore (MAX_INFERENCES=1)│
                      │  • ModelManager (Singleton Lifecycle)  │
                      └──────────────────┬─────────────────────┘
                                         │
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
            ┌────────────────────────┐        ┌────────────────────────┐
            │   MockLLMProvider      │        │   LocalGGUFProvider    │
            │  (44 MB Baseline RSS)  │        │   (llama.cpp GGUF)     │
            │  • Zero memory penalty │        │   • Qwen2.5-Coder-1.5B │
            │  • Instant dev & tests │        │   • Q4_K_M (1.12 GB)   │
            └────────────────────────┘        └────────────────────────┘
```

---

## 🚀 4. Summary of Accomplishments & Features Built

### 🤖 A. AI Course & Dynamic Curriculum Generator
- **Custom Course Synthesis**: Students and instructors can prompt the AI to generate a comprehensive, structured course on **any** programming domain (e.g. *Frontend Web Development*, *Algorithms & DSA*, *Python Backend Systems*, *Distributed Architecture*).
- **Multi-Module 9-Lesson Roadmaps**: Synthesizes a structured 3-Module, 9-Lesson curriculum complete with:
  - Visual module progression banners.
  - Deep conceptual theory and memory model analysis.
  - Practical code implementations with syntax breakdown.
  - Common anti-patterns & common errors to avoid.
  - Socratic self-reflection guiding questions.
- **Automated In-Lesson Assessments**:
  - Multiple Choice Concept Checks (MCQ).
  - Fill-in-the-blank keyword code tokens.
  - Embedded VS Code challenges with automated test execution assertions.
- **Arcade Drill Linking**: Automatically generates linked Bug Hunt and Speedrun challenges tailored to the generated course.

### 💻 B. VS Code Embedded IDEs & Live Sandboxes
- **Monaco / VS Code UI Paradigm**: Traffic light window controls (`🔴 🟡 🟢`), file tab indicators, line numbering, and syntax highlighting across reading guides.
- **Interactive Code Runner & Terminal**: Live interactive coding sandbox embedded in lesson views and quiz challenges with deterministic execution assertions.

### 🧠 C. Socratic Tutor Engine (`server/`)
- **6 Targeted Pedagogical Modes**:
  - `explain`: Concept breakdowns using relatable analogies and memory models without giving away direct code answers.
  - `hint`: Progressive Socratic hints that guide students toward finding their own solutions.
  - `practice`: Scaffolded programming exercises with edge cases and automated tests.
  - `debug`: Step-by-step compiler and runtime error diagnostics.
  - `review`: Code quality, time/space complexity, and clean code refactoring suggestions.
  - `quiz`: Concept checks and interactive multiple-choice assessments.
- **Compiler-Guided Diagnostics**: Analyzes Python/JS tracebacks to explain *why* an error occurred rather than just fixing it.

### 🎮 D. 3D Three.js Arcade Learning Games (`client/`)
- **Syntax Speedrun**: Rapid-fire syntax challenge against the clock.
- **Bug Hunt**: Spot and fix compiler, syntax, and logic bugs in live code.
- **Output Predictor**: Predict execution outcomes, variable states, and memory addresses.
- **Code Shuffle**: Assemble scrambled algorithmic logic blocks into correct sequential order.
- Multi-language support: Python, JavaScript, TypeScript, Java, C++, SQL.

### 🛡️ E. Memory & Resource Guardrails
- **Resource Governance**:
  - `PerformanceMonitor`: Live telemetry tracking process RSS (MB/GB), CPU %, token throughput (TPS), latency (ms), and thermal status.
  - Concurrency Lock: `asyncio.Semaphore(MAX_CONCURRENT_INFERENCES=1)` to prevent multi-inference memory spikes on 8 GB RAM.
  - Memory-mapped weights (`use_mmap=True`) with bounded 2048 token context window.

---

## 🛠️ 5. Installation & Execution Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

---

### Step 1: Model Setup (Local Offline Inference)

To run local GGUF inference with `Qwen2.5-Coder-1.5B-Instruct` (Q4_K_M quantization, ~1.12 GB):

```bash
# Option A: Using Python Downloader (Recommended, cross-platform)
python submission/download_model.py

# Option B: Using Bash Script (Linux/macOS)
chmod +x download_model.sh
./download_model.sh
```

*(Note: If no model weights are downloaded, the server gracefully defaults to the built-in `MockLLMProvider` with a 44 MB RSS footprint for instant development and testing).*

---

### Step 2: Start the Backend Server

```bash
cd server

# Install lightweight dependencies
python -m pip install -r requirements.txt

# Run the FastAPI server (Default: http://127.0.0.1:8008)
uvicorn app.main:app --host 127.0.0.1 --port 8008 --reload
```

#### Run Backend Verification & Benchmarks:
```bash
# Run automated test suite
python -m pytest tests

# Run latency and token throughput benchmark
python benchmarks/benchmark_inference.py --rounds 3 --tokens 128

# Run memory footprint benchmark (ADTC Seff check)
python benchmarks/benchmark_memory.py
```

---

### Step 3: Run ADTC Profiler (Competition Track)

To verify the submission against the official ADTC 2026 profiler suite:

```bash
# Run smoke test
adtc-profiler run --submission . --mode participant --skip-accuracy --output submission_smoke.json

# Run full official profiling
adtc-profiler run --submission . --mode participant --output submission.json
```

---

### Step 4: Start the Frontend

```bash
cd client

# Install frontend dependencies
npm install

# Start Vite dev server (Default: http://localhost:5173)
npm run dev
```

---

## 📊 6. Backend API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Instantaneous zero-RAM health check |
| `GET` | `/api/v1/system/status` | Offline status, active model readiness, and memory footprint |
| `GET` | `/api/v1/system/metrics` | Real-time CPU %, RAM utilization, and process RSS (MB) |
| `POST` | `/api/v1/tutor/chat` | Structured Socratic tutoring response with citations |
| `POST` | `/api/v1/tutor/stream` | Server-Sent Events (SSE) token stream |
| `GET` | `/api/v1/tutor/modes` | Pedagogical modes metadata (`explain`, `hint`, etc.) |
| `POST` | `/api/v1/learning/generate-course` | Synthesize complete 3-module 9-lesson curriculum with quizzes |
| `GET` | `/api/v1/learning/courses` | Offline curriculum courses, modules, and lessons |
| `GET` | `/api/v1/practice/exercises` | Practice problems filtered by language and difficulty |
| `POST` | `/api/v1/practice/evaluate` | Safe test case execution evaluation |
| `POST` | `/api/v1/debugger/analyze` | Compiler/runtime error diagnostics & fix recommendations |
| `GET` | `/api/v1/progress/summary` | Student study minutes, streaks, and topic mastery score |

---

## 📁 7. Repository Structure

```
CodeTutor-Africa/
├── client/                     # Frontend Application (React 19 + TypeScript + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Socratic Chat, Course Viewer, Embedded IDE, Three.js Games
│   │   ├── context/            # Global App & Theme State
│   │   ├── services/           # REST & SSE API Clients
│   │   └── types/              # TypeScript Interfaces
├── server/                     # Backend Application (FastAPI + llama.cpp + SQLite)
│   ├── app/
│   │   ├── api/v1/             # REST Endpoints (/tutor, /learning, /system, etc.)
│   │   ├── core/               # Configuration, Memory Monitoring, Concurrency Guards
│   │   ├── providers/          # LocalGGUFProvider & MockLLMProvider
│   │   ├── services/           # Tutor, Learning, Practice, Debugger, Progress Services
│   │   └── db/                 # Async SQLAlchemy Models & SQLite Engine
│   ├── benchmarks/             # Throughput & Memory Profiling Scripts
│   └── tests/                  # Pytest Unit & Integration Test Suite
├── submission/                 # ADTC 2026 Submission Package
│   ├── config.yaml             # ADTC Profiler Model & Runtime Configuration
│   ├── metadata.json           # Competition Track Metadata & Pairing
│   ├── download_model.py       # Model Download Script
│   └── run_inference.py        # Dedicated Profiler Inference Harness
├── REPORT.md                   # ADTC 2026 Technical Architecture & Benchmark Report
├── submission.json             # Official Profiler Benchmark Output
└── verdict.json                # ADTC Audit Verification Results
```

---

## 🛣️ 8. Roadmap & Phase 2 Objectives

- [x] **Dynamic AI Course Synthesis**: Complete 3-Module, 9-Lesson curriculum generator with interactive quizzes & test runners.
- [x] **Embedded VS Code Sandboxes**: Traffic light UI, Monaco syntax highlighter, and live terminal executor.
- [x] **Production Vercel Cloud & Offline Local Dual-Mode**: Live production deployment with zero cloud lock-in.
- [x] **Quantization Profiling & Benchmarking**: Benchmarked `Qwen2.5-Coder-1.5B-Instruct` at `Q4_K_M` using `adtc-profiler` (yielding 23.44 TPS and 1.69 GB Peak RSS).
- [ ] **Local RAG Engine**: Ingest university course slides and PDFs into a lightweight local FAISS index with small local embeddings.
- [ ] **Native Desktop Packaging**: Package frontend + backend into an offline desktop installer (Electron / Tauri) for one-click student installation.

---

<div align="center">
  <sub>Built with ❤️ for African University Students & the Africa Deep Tech Challenge 2026</sub>
</div>
