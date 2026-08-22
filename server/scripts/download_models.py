"""
Helper Script to Download and Validate Candidate GGUF Models for CodeTutor Africa.

Candidates:
1. Qwen2.5-Coder-1.5B-Instruct (Q4_K_M) - Fast, lightweight (~1.1 GB)
2. Qwen2.5-Coder-3B-Instruct (Q4_K_M) - High accuracy (~2.0 GB)
"""

import os
import sys
import argparse
import urllib.request

MODELS = {
    "1.5b": {
        "name": "qwen2.5-coder-1.5b-instruct-q4_k_m.gguf",
        "url": "https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf",
        "size_mb": 1065,
    },
    "3b": {
        "name": "qwen2.5-coder-3b-instruct-q4_k_m.gguf",
        "url": "https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct-GGUF/resolve/main/qwen2.5-coder-3b-instruct-q4_k_m.gguf",
        "size_mb": 1950,
    },
}


def download_model(model_key: str = "1.5b", target_dir: str = "models"):
    if model_key not in MODELS:
        print(f"Unknown model key '{model_key}'. Available: {list(MODELS.keys())}", file=sys.stderr)
        sys.exit(1)

    info = MODELS[model_key]
    os.makedirs(target_dir, exist_ok=True)
    out_path = os.path.join(target_dir, info["name"])

    if os.path.exists(out_path):
        size_mb = os.path.getsize(out_path) / (1024 * 1024)
        print(f"Model already present: {out_path} ({size_mb:.2f} MB)")
        return out_path

    print(f"Downloading {info['name']} (~{info['size_mb']} MB) into '{target_dir}'...")
    print(f"Source: {info['url']}")

    def progress_hook(block_num, block_size, total_size):
        downloaded = block_num * block_size
        if total_size > 0:
            pct = min(100.0, (downloaded / total_size) * 100)
            mb = downloaded / (1024 * 1024)
            tot_mb = total_size / (1024 * 1024)
            sys.stdout.write(f"\rProgress: [{pct:.1f}%] {mb:.1f} / {tot_mb:.1f} MB")
            sys.stdout.flush()

    try:
        urllib.request.urlretrieve(info["url"], out_path, reporthook=progress_hook)
        print(f"\nDownload complete: {out_path}")
        return out_path
    except Exception as e:
        print(f"\nDownload failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download candidate GGUF models")
    parser.add_argument("--model", choices=["1.5b", "3b"], default="1.5b", help="Model size to fetch")
    parser.add_argument("--dir", default="models", help="Output directory")
    args = parser.parse_args()

    download_model(args.model, args.dir)
