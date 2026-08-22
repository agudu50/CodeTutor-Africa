"""
ADTC Participant Inference Execution Script.
Executes prompt evaluation using llama-cpp-python / native llama.cpp.
"""

import os
import sys
import time
import json
import argparse


def execute_inference(model_path: str, prompt: str, max_tokens: int = 256, threads: int = 4):
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}", file=sys.stderr)
        print("Please run `python download_model.py` first.", file=sys.stderr)
        sys.exit(1)

    try:
        from llama_cpp import Llama
    except ImportError:
        print("Error: `llama-cpp-python` is not installed.", file=sys.stderr)
        print("Install via: pip install llama-cpp-python", file=sys.stderr)
        sys.exit(1)

    print(f"Loading model: {model_path} (threads={threads}, ctx=2048, gpu_layers=0)")
    start_load = time.perf_counter()
    llm = Llama(
        model_path=model_path,
        n_ctx=2048,
        n_threads=threads,
        n_batch=256,
        n_gpu_layers=0,
        use_mmap=True,
        verbose=False,
    )
    load_time_ms = round((time.perf_counter() - start_load) * 1000, 2)
    print(f"Model loaded in {load_time_ms} ms\n")

    print(f"Evaluating prompt: '{prompt}'")
    start_eval = time.perf_counter()
    output = llm.create_completion(
        prompt=f"<|im_start|>system\nYou are CodeTutor Africa, an AI programming tutor.<|im_end|>\n<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n",
        max_tokens=max_tokens,
        temperature=0.2,
        top_p=0.95,
        stop=["<|im_end|>"],
    )
    duration = time.perf_counter() - start_eval

    text = output["choices"][0]["text"].strip()
    usage = output.get("usage", {})
    completion_tokens = usage.get("completion_tokens", len(text.split()))
    tps = round(completion_tokens / max(0.001, duration), 2)

    result = {
        "output": text,
        "completion_tokens": completion_tokens,
        "duration_seconds": round(duration, 3),
        "tokens_per_second": tps,
        "load_time_ms": load_time_ms,
    }

    print("-" * 60)
    print(text)
    print("-" * 60)
    print(f"Generated {completion_tokens} tokens in {duration:.2f}s ({tps} tokens/sec)")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ADTC Local Inference Runner")
    parser.add_argument("--model", default="models/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf", help="Path to GGUF model")
    parser.add_argument("--prompt", default="Explain the difference between mutable and immutable types in Python.", help="Prompt to evaluate")
    parser.add_argument("--tokens", type=int, default=256, help="Max tokens to generate")
    parser.add_argument("--threads", type=int, default=4, help="CPU threads to use")
    args = parser.parse_args()

    execute_inference(args.model, args.prompt, args.tokens, args.threads)
