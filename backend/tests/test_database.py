from sqlmodel import Session, select

from backend.database import engine, init_db
from backend.models import User


def test_init_db_wipes_existing_data():
    with Session(engine) as session:
        session.add(User(email="leftover@example.com", hashed_password="x"))
        session.commit()

    init_db()

    with Session(engine) as session:
        assert session.exec(select(User)).all() == []
