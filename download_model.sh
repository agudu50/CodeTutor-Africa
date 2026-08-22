#!/usr/bin/env bash
set -e

# Target directory and model path (must match _runtime.model_path in metadata.json)
TARGET_DIR="model"
OUTPUT_FILE="model/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"
MODEL_URL="https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"

# Create model directory if it does not exist
mkdir -p "$TARGET_DIR"

if [ -f "$OUTPUT_FILE" ]; then
    echo "Model already exists at $OUTPUT_FILE. Skipping download."
    exit 0
fi

echo "Downloading Qwen2.5-Coder-1.5B-Instruct-Q4_K_M GGUF model..."
curl -L -C - "$MODEL_URL" -o "$OUTPUT_FILE"
echo "Download completed successfully: $OUTPUT_FILE"
