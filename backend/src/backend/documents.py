import json
from functools import lru_cache
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from backend.config import DOCUMENT_DATA_DIR


class FieldOption(BaseModel):
    key: str
    text: str


class FieldSpec(BaseModel):
    name: str
    label: str
    description: str
    type: Literal["text", "choice"]
    options: list[FieldOption] = []


class DocumentType(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    key: str
    name: str
    description: str
    fields: list[FieldSpec]
    cover_page_template: str = Field(alias="coverPageTemplate")
    standard_terms: str = Field(alias="standardTerms")


@lru_cache
def _registry() -> dict[str, DocumentType]:
    types: dict[str, DocumentType] = {}
    for path in sorted(DOCUMENT_DATA_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        doc = DocumentType.model_validate(data)
        types[doc.key] = doc
    return types


def all_document_types() -> list[DocumentType]:
    return list(_registry().values())


def get_document_type(key: str) -> DocumentType | None:
    return _registry().get(key)
