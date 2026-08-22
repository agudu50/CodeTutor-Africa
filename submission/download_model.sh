#!/usr/bin/env bash
set -e

# Download Qwen2.5-Coder-1.5B-Instruct-Q4_K_M GGUF model
MODEL_URL="https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"
OUTPUT_FILE="model.gguf"

if [ -f "$OUTPUT_FILE" ]; then
    echo "Model already exists at $OUTPUT_FILE. Skipping download."
    exit 0
fi

echo "Downloading $OUTPUT_FILE from $MODEL_URL..."
curl -L -C - "$MODEL_URL" -o "$OUTPUT_FILE"
echo "Download completed: $OUTPUT_FILE"
