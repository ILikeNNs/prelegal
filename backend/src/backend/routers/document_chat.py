from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from backend import documents, llm
from backend.auth import get_current_user
from backend.database import get_session
from backend.document_schemas import DocumentChatReply, DocumentChatRequest
from backend.documents import DocumentType
from backend.models import Document, User

router = APIRouter(prefix="/api", tags=["documents"])


@router.post("/document-chat", response_model=DocumentChatReply)
def chat(
    body: DocumentChatRequest,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> DocumentChatReply:
    reply = llm.generate_reply(body.messages)

    if body.documentId is not None:
        doc = session.get(Document, body.documentId)
        if doc is None or doc.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    else:
        doc = Document(user_id=user.id)
        session.add(doc)

    doc.document_type_key = reply.documentType
    doc.document_name = (
        documents.get_document_type(reply.documentType).name if reply.documentType else None
    )
    doc.fields = reply.fields
    doc.messages = [message.model_dump() for message in body.messages] + [
        {"role": "assistant", "content": reply.reply}
    ]
    doc.updated_at = datetime.now(timezone.utc)
    session.commit()
    session.refresh(doc)

    return reply.model_copy(update={"documentId": doc.id})


@router.get("/documents", response_model=list[DocumentType])
def list_documents() -> list[DocumentType]:
    return documents.all_document_types()


@router.get("/documents/{key}", response_model=DocumentType)
def get_document(key: str) -> DocumentType:
    doc = documents.get_document_type(key)
    if doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown document type")
    return doc
