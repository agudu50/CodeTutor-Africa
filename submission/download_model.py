"""
Model Downloader for ADTC Submission.
Downloads candidate GGUF model files directly from HuggingFace.
"""

import os
import sys
import argparse
import urllib.request

DEFAULT_MODEL_URL = "https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"
DEFAULT_OUTPUT_NAME = "qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"


def download_file(url: str, output_path: str):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    downloaded_bytes = 0
    if os.path.exists(output_path):
        downloaded_bytes = os.path.getsize(output_path)

    headers = {}
    if downloaded_bytes > 0:
        headers["Range"] = f"bytes={downloaded_bytes}-"
        print(f"Resuming download from byte offset: {downloaded_bytes / (1024*1024):.2f} MB")

    print(f"Downloading model from: {url}")
    print(f"Destination: {output_path}")

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            total_size = response.getheader("Content-Length")
            total_bytes = downloaded_bytes + int(total_size) if total_size else 1116982464

            mode = "ab" if downloaded_bytes > 0 else "wb"
            with open(output_path, mode) as f:
                chunk_size = 1024 * 512
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

        print(f"\nDownload completed successfully: {output_path}")
    except Exception as e:
        print(f"\nDownload paused/interrupted: {e}", file=sys.stderr)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download ADTC GGUF Model")
    parser.add_argument("--url", default=DEFAULT_MODEL_URL, help="HuggingFace direct download URL")
    parser.add_argument("--output", default=os.path.join("models", DEFAULT_OUTPUT_NAME), help="Local output filepath")
    args = parser.parse_args()

    download_file(args.url, args.output)
