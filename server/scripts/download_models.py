"""
Helper Script to Download and Validate Candidate GGUF Models with HTTP Range Resume Support.

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


def download_model(model_key: str = "1.5b", target_dir: str = "server/models"):
    if model_key not in MODELS:
        print(f"Unknown model key '{model_key}'. Available: {list(MODELS.keys())}", file=sys.stderr)
        sys.exit(1)

    info = MODELS[model_key]
    os.makedirs(target_dir, exist_ok=True)
    out_path = os.path.join(target_dir, info["name"])

    # Determine existing downloaded bytes for resume
    downloaded_bytes = 0
    if os.path.exists(out_path):
        downloaded_bytes = os.path.getsize(out_path)

    headers = {}
    if downloaded_bytes > 0:
        headers["Range"] = f"bytes={downloaded_bytes}-"
        print(f"Resuming download from byte offset: {downloaded_bytes / (1024*1024):.2f} MB")

    req = urllib.request.Request(info["url"], headers=headers)

    print(f"Connecting to: {info['url']}")
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            total_size = response.getheader("Content-Length")
            if total_size:
                total_bytes = downloaded_bytes + int(total_size)
            else:
                total_bytes = int(info["size_mb"] * 1024 * 1024)

            mode = "ab" if downloaded_bytes > 0 else "wb"
            with open(out_path, mode) as f:
                chunk_size = 1024 * 512  # 512 KB chunks
                curr_bytes = downloaded_bytes
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    f.write(chunk)
                    curr_bytes += len(chunk)
                    pct = min(100.0, (curr_bytes / total_bytes) * 100)
                    sys.stdout.write(f"\rProgress: [{pct:.1f}%] {curr_bytes/(1024*1024):.1f} / {total_bytes/(1024*1024):.1f} MB")
                    sys.stdout.flush()

        print(f"\nDownload completed successfully: {out_path}")
        return out_path
    except Exception as e:
        print(f"\nDownload paused/interrupted: {e}", file=sys.stderr)
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download candidate GGUF models")
    parser.add_argument("--model", choices=["1.5b", "3b"], default="1.5b", help="Model size to fetch")
    parser.add_argument("--dir", default="server/models", help="Output directory")
    args = parser.parse_args()

    download_model(args.model, args.dir)
