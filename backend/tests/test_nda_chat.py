import backend.llm as llm
from backend.nda_schemas import ChatMessage, NdaChatReply, NdaFields


def test_chat_endpoint_returns_reply_and_fields(client, monkeypatch):
    def fake_generate_reply(messages: list[ChatMessage]) -> NdaChatReply:
        assert messages[-1].content == "Acme Inc and Beta LLC are evaluating a partnership."
        return NdaChatReply(
            reply="Got it, thanks!",
            fields=NdaFields(party1_company="Acme Inc", party2_company="Beta LLC"),
        )

    monkeypatch.setattr(llm, "generate_reply", fake_generate_reply)

    response = client.post(
        "/api/nda-chat",
        json={
            "messages": [
                {
                    "role": "user",
                    "content": "Acme Inc and Beta LLC are evaluating a partnership.",
                }
            ]
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["reply"] == "Got it, thanks!"
    assert body["fields"]["party1Company"] == "Acme Inc"
    assert body["fields"]["party2Company"] == "Beta LLC"
    assert body["fields"]["purpose"] is None


def test_chat_endpoint_requires_at_least_one_message(client):
    response = client.post("/api/nda-chat", json={"messages": []})

    assert response.status_code == 422


def test_generate_reply_parses_structured_output(monkeypatch):
    class FakeMessage:
        content = (
            '{"reply": "Sure!", "fields": {"purpose": "Evaluating a deal", '
            '"mndaTermOption": "expires", "mndaTermYears": 2}}'
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

    result = llm.generate_reply([ChatMessage(role="user", content="Hi")])

    assert result.reply == "Sure!"
    assert result.fields.purpose == "Evaluating a deal"
    assert result.fields.mnda_term_option == "expires"
    assert result.fields.mnda_term_years == 2
    assert captured["messages"][0] == {"role": "system", "content": llm.SYSTEM_PROMPT}
    assert captured["messages"][1] == {"role": "user", "content": "Hi"}
    assert captured["response_format"] is NdaChatReply
