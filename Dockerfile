# syntax=docker/dockerfile:1
# ══════════════════════════════════════════════════════════════════════
# STAGE 1: Build the React + TypeScript Frontend
# ══════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Install dependencies
COPY client/package*.json ./
RUN npm ci

# Copy source code and build production assets
COPY client/ ./
RUN npm run build

# ══════════════════════════════════════════════════════════════════════
# STAGE 2: Python 3.11 Backend & Offline Runtime
# ══════════════════════════════════════════════════════════════════════
FROM python:3.11-slim AS runtime

WORKDIR /app

# Install system utilities and C/C++ compilation tools for llama-cpp if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY server/requirements.txt ./server/
RUN python -m pip install --no-cache-dir --upgrade pip && \
    python -m pip install --no-cache-dir -r ./server/requirements.txt

# Copy server application
COPY server/ ./server/

# Copy built frontend static assets into server static directory
COPY --from=frontend-builder /app/client/dist ./client/dist

# Copy metadata and scripts
COPY metadata.json download_model.sh REPORT.md ./

# Create data and model directories
RUN mkdir -p /app/data/database /app/model /app/server/data/database

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    APP_ENV=production \
    HOST=0.0.0.0 \
    PORT=8000

EXPOSE 8000

# Start FastAPI server
CMD ["uvicorn", "server.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
