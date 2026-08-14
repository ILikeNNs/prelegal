from collections.abc import Iterator

from sqlmodel import Session, SQLModel, create_engine

from backend.config import DATABASE_PATH, DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def init_db() -> None:
    """(Re)create the schema from scratch so every fresh start begins empty."""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
