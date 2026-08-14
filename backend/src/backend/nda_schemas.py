from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class NdaFields(BaseModel):
    """The AI's complete best-known state of every Mutual NDA field, based on
    the whole conversation so far. `None` means the field hasn't come up yet.

    Field names mirror the frontend's NdaFormData exactly (via camelCase
    aliases) so the frontend can consume this response with no translation.
    """

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    purpose: str | None = None
    effective_date: str | None = None
    mnda_term_option: Literal["expires", "untilTerminated"] | None = None
    mnda_term_years: int | None = None
    confidentiality_term_option: Literal["years", "perpetuity"] | None = None
    confidentiality_term_years: int | None = None
    governing_law: str | None = None
    jurisdiction: str | None = None
    party1_company: str | None = None
    party2_company: str | None = None
    modifications: str | None = None


class NdaChatReply(BaseModel):
    reply: str
    fields: NdaFields


class NdaChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1)
