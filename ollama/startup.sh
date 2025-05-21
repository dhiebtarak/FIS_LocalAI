#!/bin/bash

MODEL_REPO="dhieb/FIS_TinyLLama_GGUF"
VOLUME_PATH="/root/.ollama"
TOKEN="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"
MODEL_NAME="Clearing-workflow"

# Create the volume directory if it doesn't exist
mkdir -p "$VOLUME_PATH"

# Check if volume is mounted
if ! mountpoint -q "$VOLUME_PATH"; then
  echo "❌ $VOLUME_PATH is not a mounted volume. Exiting."
  exit 1
fi

# Download model files from Hugging Face
echo "📥 Downloading model from Hugging Face..."
huggingface-cli download "$MODEL_REPO" \
    --include "*" \
    --local-dir "$VOLUME_PATH/models" \
    --token "$TOKEN" \
    --cache-dir /tmp/hf_cache

# Check if download was successful
if [ $? -ne 0 ]; then
  echo "❌ Failed to download model from Hugging Face."
  exit 1
fi

# Check if Modelfile exists
if [ ! -f "$VOLUME_PATH/models/Modelfile" ]; then
  echo "❌ Modelfile not found at $VOLUME_PATH/models/Modelfile"
  exit 1
fi

# Start Ollama server in background
echo "🚀 Starting Ollama server..."
ollama serve &

# Wait for Ollama server to be ready
echo "⏳ Waiting for Ollama to start..."
timeout 30s bash -c "until curl -s http://localhost:11434 > /dev/null; do sleep 1; done"
if [ $? -ne 0 ]; then
  echo "❌ Ollama server failed to start."
  exit 1
fi

# Create the model
echo "🧠 Creating model with Ollama..."
ollama create $MODEL_NAME -f "$VOLUME_PATH/models/Modelfile"

# Check if model creation was successful
if [ $? -ne 0 ]; then
  echo "❌ Failed to create model."
  exit 1
fi

# Keep the container running
echo "📦 Model created. Container will now stay alive."
tail -f /dev/null