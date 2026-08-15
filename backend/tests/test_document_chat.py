import backend.llm as llm
from backend.document_schemas import ChatMessage, DocumentChatReply


def test_get_documents_lists_all_types(client):
    response = client.get("/api/documents")

    assert response.status_code == 200
    keys = {doc["key"] for doc in response.json()}
    assert {"doc-a", "doc-b"}.issubset(keys)


def test_get_document_returns_matching_document(client):
    response = client.get("/api/documents/doc-a")

    assert response.status_code == 200
    assert response.json()["name"] == "Document A"


def test_get_document_404_for_unknown_key(client):
    response = client.get("/api/documents/nonexistent")

    assert response.status_code == 404


def test_chat_endpoint_requires_auth(client):
    response = client.post(
        "/api/document-chat",
        json={"messages": [{"role": "user", "content": "hi"}]},
    )

    assert response.status_code == 401


def test_chat_endpoint_returns_sanitized_reply(authed_client, monkeypatch):
    def fake_generate_reply(messages: list[ChatMessage]) -> DocumentChatReply:
        assert messages[-1].content == "I need document A for Acme"
        return DocumentChatReply(
            reply="Got it!",
            documentType="doc-a",
            fields={"partyName": "Acme"},
        )

    monkeypatch.setattr(llm, "generate_reply", fake_generate_reply)

    response = authed_client.post(
        "/api/document-chat",
        json={"messages": [{"role": "user", "content": "I need document A for Acme"}]},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["reply"] == "Got it!"
    assert body["documentType"] == "doc-a"
    assert body["fields"] == {"partyName": "Acme"}
    assert isinstance(body["documentId"], int)


def test_chat_endpoint_requires_at_least_one_message(authed_client):
    response = authed_client.post("/api/document-chat", json={"messages": []})

    assert response.status_code == 422


def test_chat_endpoint_updates_same_document_across_turns(authed_client, monkeypatch):
    replies = iter(
        [
            DocumentChatReply(reply="Turn 1", documentType=None, fields={}),
            DocumentChatReply(reply="Turn 2", documentType="doc-a", fields={"partyName": "Acme"}),
        ]
    )
    monkeypatch.setattr(llm, "generate_reply", lambda messages: next(replies))

    first = authed_client.post(
        "/api/document-chat", json={"messages": [{"role": "user", "content": "hi"}]}
    )
    document_id = first.json()["documentId"]

    second = authed_client.post(
        "/api/document-chat",
        json={
            "messages": [
                {"role": "user", "content": "hi"},
                {"role": "assistant", "content": "Turn 1"},
                {"role": "user", "content": "it's document A, party is Acme"},
            ],
            "documentId": document_id,
        },
    )

    assert second.status_code == 200
    assert second.json()["documentId"] == document_id
    assert second.json()["documentType"] == "doc-a"


def test_chat_endpoint_rejects_documentid_owned_by_another_user(client, monkeypatch):
    client.post("/api/auth/signup", json={"email": "owner@example.com", "password": "hunter22"})
    monkeypatch.setattr(
        llm,
        "generate_reply",
        lambda messages: DocumentChatReply(reply="hi", documentType=None, fields={}),
    )
    owned = client.post(
        "/api/document-chat", json={"messages": [{"role": "user", "content": "hi"}]}
    )
    document_id = owned.json()["documentId"]
    client.post("/api/auth/signout")

    client.post("/api/auth/signup", json={"email": "other@example.com", "password": "hunter22"})
    response = client.post(
        "/api/document-chat",
        json={"messages": [{"role": "user", "content": "hi"}], "documentId": document_id},
    )

    assert response.status_code == 404


def test_generate_reply_drops_unknown_document_type(monkeypatch):
    class FakeMessage:
        content = '{"reply": "Hi", "documentType": "nonexistent", "fields": {"x": "y"}}'

    class FakeChoice:
        message = FakeMessage()

    class FakeResponse:
        choices = [FakeChoice()]

    monkeypatch.setattr(llm, "completion", lambda **kwargs: FakeResponse())

    result = llm.generate_reply([ChatMessage(role="user", content="hi")])

    assert result.documentType is None
    assert result.fields == {}


def test_generate_reply_sanitizes_fields_for_settled_type(monkeypatch):
    class FakeMessage:
        content = (
            '{"reply": "Great", "documentType": "doc-a", '
            '"fields": {"partyName": "Beta", "termOption": "not-a-real-key", '
            '"hallucinatedField": "oops"}}'
        )

    class FakeChoice:
        message = FakeMessage()

    class FakeResponse:
        choices = [FakeChoice()]

    captured = {}

    def fake_completion(**kwargs):
        captured.update(kwargs)
        return FakeResponse()

    monkeypatch.setattr(llm, "completion", fake_completion)

    result = llm.generate_reply([ChatMessage(role="user", content="hi")])

    assert result.documentType == "doc-a"
    # Invalid choice key is dropped to null; hallucinated field name is dropped entirely;
    # known valid field is kept.
    assert result.fields == {"partyName": "Beta", "termOption": None}
    assert captured["messages"][0]["content"] == llm.SYSTEM_PROMPT
