import bcrypt
from fastapi import Depends, HTTPException, Request, status
from sqlmodel import Session

from backend.database import get_session
from backend.models import User

SESSION_USER_ID_KEY = "user_id"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def log_in_user(request: Request, user: User) -> None:
    request.session[SESSION_USER_ID_KEY] = user.id


def log_out_user(request: Request) -> None:
    request.session.pop(SESSION_USER_ID_KEY, None)


def get_current_user(
    request: Request, session: Session = Depends(get_session)
) -> User:
    user_id = request.session.get(SESSION_USER_ID_KEY)
    user = session.get(User, user_id) if user_id is not None else None
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user
