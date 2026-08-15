import backend.llm as llm
from backend.document_schemas import DocumentChatReply


def test_history_requires_auth(client):
    response = client.get("/api/history")

    assert response.status_code == 401


def test_history_empty_for_new_user(authed_client):
    response = authed_client.get("/api/history")

    assert response.status_code == 200
    assert response.json() == []


def test_history_lists_saved_documents(authed_client, monkeypatch):
    monkeypatch.setattr(
        llm,
        "generate_reply",
        lambda messages: DocumentChatReply(
            reply="ok", documentType="doc-a", fields={"partyName": "Acme"}
        ),
    )
    authed_client.post(
        "/api/document-chat", json={"messages": [{"role": "user", "content": "hi"}]}
    )

    response = authed_client.get("/api/history")

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["documentTypeKey"] == "doc-a"
    assert body[0]["documentName"] == "Document A"


def test_history_detail_returns_fields_and_messages(authed_client, monkeypatch):
    monkeypatch.setattr(
        llm,
        "generate_reply",
        lambda messages: DocumentChatReply(
            reply="ok", documentType="doc-a", fields={"partyName": "Acme"}
        ),
    )
    created = authed_client.post(
        "/api/document-chat", json={"messages": [{"role": "user", "content": "hi"}]}
    )
    document_id = created.json()["documentId"]

    response = authed_client.get(f"/api/history/{document_id}")

    assert response.status_code == 200
    body = response.json()
    assert body["fields"] == {"partyName": "Acme"}
    assert body["messages"][-1] == {"role": "assistant", "content": "ok"}


def test_history_detail_404_for_unknown_id(authed_client):
    response = authed_client.get("/api/history/999999")

    assert response.status_code == 404


def test_history_is_scoped_to_the_current_user(client, monkeypatch):
    monkeypatch.setattr(
        llm,
        "generate_reply",
        lambda messages: DocumentChatReply(reply="ok", documentType=None, fields={}),
    )
    client.post("/api/auth/signup", json={"email": "owner2@example.com", "password": "hunter22"})
    owned = client.post(
        "/api/document-chat", json={"messages": [{"role": "user", "content": "hi"}]}
    )
    document_id = owned.json()["documentId"]
    client.post("/api/auth/signout")

    client.post("/api/auth/signup", json={"email": "other2@example.com", "password": "hunter22"})
    list_response = client.get("/api/history")
    detail_response = client.get(f"/api/history/{document_id}")

    assert list_response.json() == []
    assert detail_response.status_code == 404
