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

    if os.path.exists(output_path):
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"Model already exists at {output_path} ({size_mb:.2f} MB). Skipping download.")
        return

    print(f"Downloading model from: {url}")
    print(f"Destination: {output_path}")

    def progress_hook(block_num, block_size, total_size):
        downloaded = block_num * block_size
        if total_size > 0:
            percent = min(100.0, (downloaded / total_size) * 100)
            mb_downloaded = downloaded / (1024 * 1024)
            mb_total = total_size / (1024 * 1024)
            sys.stdout.write(f"\rProgress: [{percent:.1f}%] {mb_downloaded:.1f}/{mb_total:.1f} MB")
            sys.stdout.flush()

    try:
        urllib.request.urlretrieve(url, output_path, reporthook=progress_hook)
        print(f"\nDownload completed successfully: {output_path}")
    except Exception as e:
        print(f"\nError downloading model: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download ADTC GGUF Model")
    parser.add_argument("--url", default=DEFAULT_MODEL_URL, help="HuggingFace direct download URL")
    parser.add_argument("--output", default=os.path.join("models", DEFAULT_OUTPUT_NAME), help="Local output filepath")
    args = parser.parse_args()

    download_file(args.url, args.output)
