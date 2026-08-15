from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class DocumentChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1)
    documentId: int | None = None


class DocumentChatReply(BaseModel):
    reply: str
    documentType: str | None = None
    fields: dict[str, str | None] = {}
    documentId: int | None = None


class DocumentSummary(BaseModel):
    """Wire shape is camelCase; reads directly from the Document ORM model's
    snake_case attributes (see backend.models.Document)."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: int
    document_type_key: str | None
    document_name: str | None
    updated_at: datetime


class DocumentDetail(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: int
    document_type_key: str | None
    document_name: str | None
    fields: dict[str, str | None]
    messages: list[ChatMessage]
    updated_at: datetime
