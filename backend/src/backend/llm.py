from litellm import completion

from backend import documents
from backend.document_schemas import ChatMessage, DocumentChatReply

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}


def _describe_field(field: documents.FieldSpec) -> str:
    description = f"- {field.name} ({field.type}): {field.label} - {field.description}"
    if field.type == "choice":
        keys = ", ".join(option.key for option in field.options)
        description += f" Valid keys: {keys}."
    return description


def _build_system_prompt() -> str:
    catalog_lines = [f"- {doc.key}: {doc.name} - {doc.description}" for doc in documents.all_document_types()]
    fields_sections = []
    for doc in documents.all_document_types():
        field_lines = "\n".join(_describe_field(field) for field in doc.fields)
        fields_sections.append(f"### {doc.key} fields\n{field_lines}")

    return f"""You are a friendly assistant helping a user create a legal document from a small \
catalog of supported document types, through natural conversation instead of a form.

## Supported document types
{chr(10).join(catalog_lines)}

## Your task
1. Figure out which ONE document type (by its exact key above) the user wants, through \
conversation. Until you and the user have clearly settled on one, leave `documentType` null \
in your reply and use natural conversation to ask what they need.
2. If the user describes something not in the catalog above, explain in your `reply` text that \
we can't generate that, and suggest whichever supported type above is the closest match, then \
continue the conversation to confirm if they want to proceed with it.
3. Once a document type is settled, set `documentType` to its exact key, and gather that \
document's fields listed below - ask about a few related fields at a time, not all at once. \
Every reply must include your complete best-known value for every field of the settled document \
type, based on the entire conversation so far, not just the latest message - never omit a field \
the user already answered earlier, including anything they already mentioned before the document \
type was settled.
4. For "choice" fields, the value in `fields` must be exactly one of the listed option keys (not \
the option text) or null.
5. Format any date field values in natural language, e.g. "January 15, 2026", not ISO format.
6. If the user is unsure about a field or wants to skip it, don't insist - move on and leave it \
null; a placeholder will be shown in the document instead.
7. Once every field the user is willing to answer has been covered, tell them the document is \
ready to download and stop asking questions.
8. Keep replies concise and conversational.

## Fields per document type

{chr(10).join(fields_sections)}"""


SYSTEM_PROMPT = _build_system_prompt()


def _sanitize_reply(reply: DocumentChatReply) -> DocumentChatReply:
    doc = documents.get_document_type(reply.documentType) if reply.documentType else None
    if doc is None:
        return DocumentChatReply(reply=reply.reply, documentType=None, fields={})

    sanitized_fields: dict[str, str | None] = {}
    for field in doc.fields:
        value = reply.fields.get(field.name)
        if value is not None and field.type == "choice":
            valid_keys = {option.key for option in field.options}
            if value not in valid_keys:
                value = None
        sanitized_fields[field.name] = value

    return DocumentChatReply(reply=reply.reply, documentType=doc.key, fields=sanitized_fields)


def generate_reply(messages: list[ChatMessage]) -> DocumentChatReply:
    llm_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + [
        {"role": message.role, "content": message.content} for message in messages
    ]
    response = completion(
        model=MODEL,
        messages=llm_messages,
        response_format=DocumentChatReply,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )
    reply = DocumentChatReply.model_validate_json(response.choices[0].message.content)
    return _sanitize_reply(reply)
