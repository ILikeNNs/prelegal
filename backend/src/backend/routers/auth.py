from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlmodel import Session, select

from backend.auth import (
    get_current_user,
    hash_password,
    log_in_user,
    log_out_user,
    verify_password,
)
from backend.database import get_session
from backend.models import User
from backend.schemas import SigninRequest, SignupRequest, UserRead

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(
    body: SignupRequest, request: Request, session: Session = Depends(get_session)
) -> User:
    existing = session.exec(select(User).where(User.email == body.email)).first()
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=body.email, hashed_password=hash_password(body.password))
    session.add(user)
    session.commit()
    session.refresh(user)

    log_in_user(request, user)
    return user


@router.post("/signin", response_model=UserRead)
def signin(
    body: SigninRequest, request: Request, session: Session = Depends(get_session)
) -> User:
    user = session.exec(select(User).where(User.email == body.email)).first()
    if user is None or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    log_in_user(request, user)
    return user


@router.post("/signout", status_code=status.HTTP_204_NO_CONTENT)
def signout(request: Request) -> None:
    log_out_user(request)


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)) -> User:
    return user
