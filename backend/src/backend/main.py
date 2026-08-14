from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.staticfiles import StaticFiles

from backend.config import DEV_CORS_ORIGIN, SESSION_SECRET_KEY, STATIC_DIR
from backend.database import init_db
from backend.routers.auth import router as auth_router
from backend.routers.document_chat import router as document_chat_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    init_db()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY, https_only=False)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[DEV_CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(document_chat_router)

if STATIC_DIR.is_dir():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
