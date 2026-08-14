import os
import secrets
from pathlib import Path

from dotenv import load_dotenv

# In Docker, env vars (including OPENROUTER_API_KEY) come from `docker run
# --env-file`. For local `uv run` outside Docker, load them from the repo
# root .env instead; find_dotenv() walks up from the cwd to find it.
load_dotenv()

# Recreated from scratch on every container start; not intended to persist.
DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "app.db"

# Dev-only: the Next.js dev server runs on a different origin/port than the
# backend, unlike production where FastAPI serves the static export same-origin.
DEV_CORS_ORIGIN = "http://localhost:3000"

DATABASE_PATH = Path(os.environ.get("DATABASE_PATH", str(DEFAULT_DB_PATH)))
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# Falls back to a random per-process secret when unset, which is fine since
# sessions and the database are both wiped on every fresh container start.
SESSION_SECRET_KEY = os.environ.get("SESSION_SECRET_KEY") or secrets.token_hex(32)

STATIC_DIR = Path(
    os.environ.get("STATIC_DIR", str(Path(__file__).resolve().parent.parent.parent / "static"))
)
