from fastapi import APIRouter

from backend import llm
from backend.nda_schemas import NdaChatReply, NdaChatRequest

router = APIRouter(prefix="/api/nda-chat", tags=["nda-chat"])


@router.post("", response_model=NdaChatReply)
def chat(body: NdaChatRequest) -> NdaChatReply:
    return llm.generate_reply(body.messages)
