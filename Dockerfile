# syntax=docker/dockerfile:1

FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim AS backend
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/
WORKDIR /app

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --locked --no-install-project --no-dev

COPY backend/ ./
RUN uv sync --locked --no-dev

COPY --from=frontend-build /frontend/out ./static

ENV PATH="/app/.venv/bin:${PATH}"
ENV STATIC_DIR=/app/static
ENV DATABASE_PATH=/app/data/app.db

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
