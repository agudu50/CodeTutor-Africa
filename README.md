<div align="center">

# 💻 CodeTutor

**Offline-First AI Programming Tutor, Dynamic Curriculum Generator & Interactive Sandbox**

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Production Deployment](https://img.shields.io/badge/Production-code--tutor--africa.vercel.app-005F02.svg?logo=vercel&logoColor=white)](https://code-tutor-africa.vercel.app)
[![Offline First](https://img.shields.io/badge/Architecture-100%25%20Offline--First-success.svg)](#-system-architecture)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 🌐 Live Demo & Endpoints

- **Live Production URL**: **[https://code-tutor-africa.vercel.app](https://code-tutor-africa.vercel.app)**
- **Local Backend**: `http://127.0.0.1:8008`
- **Local Frontend**: `http://localhost:5173`

---

## 📖 1. Overview & Motivation

Learning to program effectively requires active practice, guided debugging, and deep conceptual understanding. However, modern learners and academic institutions face significant hurdles:

1. **Connectivity & Cloud Dependency**: Mainstream AI coding assistants (e.g., ChatGPT, Claude, GitHub Copilot) demand continuous high-speed internet and expensive recurring subscriptions, rendering them unreliable in low-bandwidth regions, during commutes, or in offline campus environments.
2. **Hardware Constraints**: Heavyweight AI systems require high-end GPUs or massive RAM allocations, causing thermal throttling, rapid battery drain, and out-of-memory (OOM) errors on standard commodity laptops (8 GB RAM, integrated graphics).
3. **The "Copy-Paste" Pedagogical Flaw**: Generic generative models tend to dump ready-made solutions, depriving students of essential problem-solving intuition, mental model formation, and real debugging capability.

### 💡 The Solution: CodeTutor
**CodeTutor** is a lightweight, privacy-focused, offline-first AI programming tutor, dynamic curriculum generator, and embedded sandbox. It is engineered to run seamlessly on commodity hardware with zero external API dependencies or cloud lock-in, while emphasizing **Socratic pedagogy** to guide learners step-by-step.

---

## 🏗️ 2. System Architecture

CodeTutor follows a clean **Modular Monolith** architecture separating presentation, domain logic, and provider runtimes:

```
                      ┌────────────────────────────────────────┐
                      │        FRONTEND (React + Vite)         │
                      │  • Socratic Chat & SSE Token Streaming │
                      │  • AI Course & Multi-Module Generator  │
                      │  • VS Code Embedded IDEs & Terminals   │
                      │  • 3D Three.js Interactive Arcade Drill│
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
                      │  • asyncio.Semaphore (Inference Lock)  │
                      │  • ModelManager (Singleton Lifecycle)  │
                      └──────────────────┬─────────────────────┘
                                         │
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
            ┌────────────────────────┐        ┌────────────────────────┐
            │   MockLLMProvider      │        │   LocalGGUFProvider    │
            │  (Deterministic/Fast)  │        │   (llama.cpp GGUF)     │
            └────────────────────────┘        └────────────────────────┘
```

---

## 🚀 3. Key Features

### 🤖 A. Dynamic AI Course & Curriculum Generator
- **Custom Course Synthesis**: Generate tailored, comprehensive roadmaps for any topic (e.g., *Frontend Web Development*, *Algorithms & Data Structures*, *Systems Programming in Rust*, *Python Backend Engineering*).
- **Multi-Module Structured Lessons**: 3-Module, 9-Lesson curriculums packed with conceptual theory, syntax breakdowns, memory diagrams, anti-patterns, and Socratic reflection points.
- **Integrated Knowledge Checks**: Multiple-choice quizzes, code token completions, and automated unit-test challenge validations.

### 💻 B. VS Code-Style Embedded IDE & Sandbox
- **Familiar Developer Experience**: Monaco-powered code editor with syntax highlighting, line numbers, and file tree navigation.
- **Interactive Code Runner & Execution Engine**: In-browser and server-evaluated sandbox with deterministic assertion feedback and compiler error analysis.

### 🧠 C. Socratic AI Tutoring Engine
- **6 Targeted Pedagogical Modes**:
  - `explain`: Concept decomposition without giving away code answers.
  - `hint`: Incremental, guided hints to unblock learners.
  - `practice`: Custom micro-exercises targeted to weak areas.
  - `debug`: Step-by-step diagnostic guidance for compiler and runtime errors.
  - `review`: Code quality, time complexity, and style reviews.
  - `quiz`: Diagnostic knowledge evaluation.

### 🎮 D. Interactive 3D Arcade Learning Drills
- **Gamified Coding Modules**:
  - **Syntax Speedrun**: Fast-paced syntax accuracy challenges.
  - **Bug Hunt**: Identify and resolve subtle logic and syntax defects.
  - **Output Predictor**: Predict runtime behavior and variable state changes.
  - **Code Shuffle**: Reassemble scrambled algorithmic blocks into valid solutions.
  - Supports Python, JavaScript, TypeScript, Java, and SQL.

---

## 🛠️ 4. Getting Started

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** and **npm**

---

### 1. Backend Setup (FastAPI)
```bash
cd server

# Install dependencies
python -m pip install -r requirements.txt

# Start the development server (runs on http://127.0.0.1:8008)
uvicorn app.main:app --host 127.0.0.1 --port 8008 --reload
```

#### Run Backend Tests:
```bash
# Run unit & integration test suite
python -m pytest tests
```

---

### 2. Frontend Setup (React + Vite)
```bash
cd client

# Install frontend packages
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 📊 5. REST API Reference

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

## 🛣️ 6. Roadmap

- [x] **Dynamic AI Course Synthesis**: Complete 3-Module, 9-Lesson curriculum generator with interactive quizzes & test runners.
- [x] **Embedded VS Code Sandboxes**: Traffic light UI, Monaco syntax highlighter, and live terminal executor.
- [x] **Hybrid Cloud & Offline Local Modes**: Seamless operation locally or via cloud deployment.
- [ ] **Quantized Model Profiles**: Built-in support for multiple lightweight local LLMs (`Qwen2.5-Coder`, `DeepSeek-R1-Distill`, `Llama-3.2`) with custom quantization levels (`Q4_K_M`, `Q5_K_M`).
- [ ] **Local RAG Engine**: Ingest textbooks, university slides, and documentation into a local vector store (FAISS/Chroma) with small embedding models.
- [ ] **Desktop Application Package**: One-click installer via Tauri / Electron for standalone offline desktop usage.

---

<div align="center">
  <sub>Built with ❤️ for students, educators, and developers worldwide</sub>
</div>


