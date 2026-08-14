#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
IMAGE_NAME="prelegal"
CONTAINER_NAME="prelegal"

docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

docker build -t "$IMAGE_NAME" "$ROOT_DIR"

ENV_FILE_ARGS=()
if [ -f "$ROOT_DIR/.env" ]; then
  ENV_FILE_ARGS=(--env-file "$ROOT_DIR/.env")
fi

docker run -d \
  --name "$CONTAINER_NAME" \
  -p 8000:8000 \
  "${ENV_FILE_ARGS[@]}" \
  "$IMAGE_NAME"

echo "Prelegal is starting at http://localhost:8000"
