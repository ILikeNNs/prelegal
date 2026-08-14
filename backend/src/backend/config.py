import os
import secrets
from pathlib import Path

# Recreated from scratch on every container start; not intended to persist.
DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "app.db"

DATABASE_PATH = Path(os.environ.get("DATABASE_PATH", str(DEFAULT_DB_PATH)))
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# Falls back to a random per-process secret when unset, which is fine since
# sessions and the database are both wiped on every fresh container start.
SESSION_SECRET_KEY = os.environ.get("SESSION_SECRET_KEY") or secrets.token_hex(32)

STATIC_DIR = Path(
    os.environ.get("STATIC_DIR", str(Path(__file__).resolve().parent.parent.parent / "static"))
)
