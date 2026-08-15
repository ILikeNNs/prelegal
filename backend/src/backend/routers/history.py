from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.auth import get_current_user
from backend.database import get_session
from backend.document_schemas import DocumentDetail, DocumentSummary
from backend.models import Document, User

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=list[DocumentSummary])
def list_history(
    user: User = Depends(get_current_user), session: Session = Depends(get_session)
) -> list[Document]:
    statement = (
        select(Document).where(Document.user_id == user.id).order_by(Document.updated_at.desc())
    )
    return session.exec(statement).all()


@router.get("/{document_id}", response_model=DocumentDetail)
def get_history_item(
    document_id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Document:
    doc = session.get(Document, document_id)
    if doc is None or doc.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc
