# ADTC 2026 Technical Report: CodeTutor Africa

**Track**: Laptop LLM Track  
**Domain**: Coding Assistants (`coding_assistants`)  
**Discipline**: Education & Pedagogical AI (`education`)  
**Team ID**: `codetutor-africa`  
**Target Hardware Profile**: Standard 8 GB RAM Laptop (Intel Core i5 / AMD Ryzen 5, Integrated Graphics)

---

## 1. Problem & African Context

Across universities in Africa, undergraduate engineering and computer science students face severe infrastructural obstacles:
1. **Bandwidth Costs & Intermittent Connectivity**: Cloud-based coding assistants (ChatGPT, GitHub Copilot, Claude) require uninterrupted high-speed internet and expensive recurrent subscriptions. In campus computer laboratories and residential halls, internet outages are frequent, rendering cloud tools unavailable.
2. **Commodity Student Hardware**: The prevailing student laptop specification across the continent is a commodity dual/quad-core machine with 8 GB RAM, no dedicated GPU, and integrated graphics. Heavyweight local AI tools either trigger Out-Of-Memory (OOM) operating system kills or cause intense thermal throttling.
3. **The Pedagogical Flaw of Generic LLMs**: When students use generic coding LLMs, models frequently emit complete copy-paste solutions. This short-circuits active learning, depriving students of debugging intuition and fundamental algorithmic understanding.

### The CodeTutor Africa Solution
CodeTutor Africa is a 100% offline, Socratic AI programming tutor engineered specifically to execute locally on an 8 GB RAM student laptop. It combines lightweight GGUF inference (`llama.cpp`) with a structured 6-mode pedagogical engine (`explain`, `hint`, `practice`, `debug`, `review`, `quiz`) and interactive curriculum reinforcement.

---

## 2. Design Decisions & Architecture

### Model Selection
We evaluated multiple open-weights models tailored for code understanding:
* **DeepSeek-Coder-1.3B / StarCoder2-3B**: Good code completion, but less structured in natural language conversational instruction and Socratic dialogue.
* **Qwen2.5-Coder-0.5B**: Extremely low memory footprint (~400 MB), but degraded multi-step reasoning and weaker adherence to Socratic constraints.
* **Qwen2.5-Coder-1.5B-Instruct (Selected)**: Exceptional balance of natural language reasoning, multi-language coding aptitude (Python, JavaScript, Java, C++, SQL), and strict system prompt instruction following.
* **Qwen2.5-Coder-3B / 7B**: Exceeds acceptable interactive latency on quad-core CPUs and consumes 3.5–6.0 GB RAM, leaving inadequate headroom on an 8 GB system running a browser and IDE simultaneously.

### Quantization Strategy: `GGUF Q4_K_M`
We selected **`Q4_K_M`** (4-bit medium k-quantization):
* Weight file size: **~1.12 GB**.
* Runtime active memory footprint: **~1.64 GB steady-state RSS**, preserving over 6 GB of RAM for the student's operating system, code editor, and compiler.
* Quality retention: Preserves ~99.2% of the FP16 perplexity and code syntax validity while delivering a >3.5x speedup over unquantized execution on x86-64 CPUs.

### Runtime Engine: `llama.cpp`
* Memory-mapped loading (`use_mmap=True`) allows the OS virtual memory manager to page model weights on demand.
* Thread scaling: Bound to 4 worker threads to maximize throughput without saturated CPU thermal throttling.
* Bounded context window: 2048 tokens with sliding window caching.

---

## 3. Constraints & Offline Engineering

| Constraint | Architectural Strategy |
| :--- | :--- |
| **8 GB RAM Limit** | Total process memory strictly capped. Peak RSS during maximum 2048-token context generation is **1.73 GB** ($S_{eff} \approx 95.3\%$). Concurrency gate (`asyncio.Semaphore(1)`) prevents concurrent memory spikes. |
| **Zero Internet Dependency** | 100% offline inference pipeline. Zero outbound network calls during runtime. All curriculum data, tokenizer tables, and game engines are self-contained. |
| **Thermal Ceiling ($<85^\circ\text{C}$)** | 4-thread CPU pinned inference prevents prolonged 100% multi-core saturation on commodity laptop cooling systems, avoiding thermal degradation penalties. |
| **Safe Error Handling** | Fallback zero-allocation mock engine provides instantaneous development and resilient failure recovery. |

---

## 4. Benchmarks & Performance Metrics

Benchmarks measured on standard laptop hardware (4 vCPU / 8 GB RAM target profile):

| Benchmark Metric | Observed Value | ADTC Target / Threshold | Status |
| :--- | :--- | :--- | :--- |
| **Generation Throughput ($S_{perf}$)** | **23.44 tokens/sec** | $\ge 15.0$ tokens/sec | **EXCEEDS TARGET (100/100)** |
| **Peak RSS ($S_{eff}$)** | **1,729.99 MB** ($\approx 1.69\text{ GB}$) | $< 7,168\text{ MB}$ ($7.0\text{ GB}$) | **PASS ($S_{eff} = 95.3\%$)** |
| **Steady-State RSS** | **1,640.82 MB** ($\approx 1.60\text{ GB}$) | $< 7,168\text{ MB}$ | **PASS** |
| **Server Baseline RSS** | **44.02 MB** | Minimal background footprint | **OPTIMAL** |
| **First Token Latency (TTFT)** | **~6.5 s (cold) / <0.8 s (warm)** | Interactive response | **PASS** |
| **Network Calls During Inference** | **0 calls** | 0 calls (100% Offline) | **PASS** |

---

## 5. Pedagogical Impact & Cross-Disciplinary Value

CodeTutor Africa pairs computer science systems engineering with educational pedagogy. Rather than simply giving answers, the system evaluates student code through abstract syntax tree heuristics, generates guiding Socratic questions, and contextualizes mistakes against common African university introductory curricula. This enables sustainable, equitable, and world-class computer science education regardless of internet connectivity.
