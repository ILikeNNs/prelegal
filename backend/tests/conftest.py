import json
import os
import tempfile
from pathlib import Path

_TEST_DIR = Path(tempfile.mkdtemp(prefix="prelegal-test-"))
_STATIC_DIR = _TEST_DIR / "static"
_STATIC_DIR.mkdir()
(_STATIC_DIR / "index.html").write_text("<html><body>Prelegal</body></html>", encoding="utf-8")

_DOCUMENT_DATA_DIR = _TEST_DIR / "document_data"
_DOCUMENT_DATA_DIR.mkdir()

# Small synthetic document types, independent of the real templates/-derived
# data, so these tests don't depend on that content existing or its exact shape.
DOC_A = {
    "key": "doc-a",
    "name": "Document A",
    "description": "A test document with a text field and a choice field.",
    "fields": [
        {"name": "partyName", "label": "Party Name", "description": "The other party's name.", "type": "text"},
        {
            "name": "termOption",
            "label": "Term",
            "description": "How long the agreement lasts.",
            "type": "choice",
            "options": [
                {"key": "oneYear", "text": "One year from the Effective Date."},
                {"key": "perpetual", "text": "Perpetual."},
            ],
        },
    ],
    "coverPageTemplate": "# Document A\n\nParty: {{partyName}}\n- {{termOption=oneYear}} One year\n- {{termOption=perpetual}} Perpetual",
    "standardTerms": "# Standard Terms A\n\nSome static terms.",
}
DOC_B = {
    "key": "doc-b",
    "name": "Document B",
    "description": "A second, simpler test document.",
    "fields": [
        {"name": "title", "label": "Title", "description": "A title.", "type": "text"},
    ],
    "coverPageTemplate": "# Document B\n\nTitle: {{title}}",
    "standardTerms": "# Standard Terms B\n\nSome other static terms.",
}
for _doc in (DOC_A, DOC_B):
    (_DOCUMENT_DATA_DIR / f"{_doc['key']}.json").write_text(json.dumps(_doc), encoding="utf-8")

# Must be set before `backend.config` is first imported anywhere in the test
# session, since it reads these at import time.
os.environ["DATABASE_PATH"] = str(_TEST_DIR / "test.db")
os.environ["STATIC_DIR"] = str(_STATIC_DIR)
os.environ["SESSION_SECRET_KEY"] = "test-secret-key"
os.environ["DOCUMENT_DATA_DIR"] = str(_DOCUMENT_DATA_DIR)

import pytest
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client
