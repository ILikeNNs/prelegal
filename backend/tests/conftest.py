import os
import tempfile
from pathlib import Path

_TEST_DIR = Path(tempfile.mkdtemp(prefix="prelegal-test-"))
_STATIC_DIR = _TEST_DIR / "static"
_STATIC_DIR.mkdir()
(_STATIC_DIR / "index.html").write_text("<html><body>Prelegal</body></html>", encoding="utf-8")

# Must be set before `backend.config` is first imported anywhere in the test
# session, since it reads these at import time.
os.environ["DATABASE_PATH"] = str(_TEST_DIR / "test.db")
os.environ["STATIC_DIR"] = str(_STATIC_DIR)
os.environ["SESSION_SECRET_KEY"] = "test-secret-key"

import pytest
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client
