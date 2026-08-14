from fastapi import APIRouter, HTTPException, status

from backend import documents, llm
from backend.document_schemas import DocumentChatReply, DocumentChatRequest
from backend.documents import DocumentType

router = APIRouter(prefix="/api", tags=["documents"])


@router.post("/document-chat", response_model=DocumentChatReply)
def chat(body: DocumentChatRequest) -> DocumentChatReply:
    return llm.generate_reply(body.messages)


@router.get("/documents", response_model=list[DocumentType])
def list_documents() -> list[DocumentType]:
    return documents.all_document_types()


@router.get("/documents/{key}", response_model=DocumentType)
def get_document(key: str) -> DocumentType:
    doc = documents.get_document_type(key)
    if doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown document type")
    return doc
