from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

# bcrypt silently ignores/rejects input beyond 72 bytes.
MAX_PASSWORD_LENGTH = 72


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=MAX_PASSWORD_LENGTH)


class SigninRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=MAX_PASSWORD_LENGTH)


class UserRead(BaseModel):
    id: int
    email: str
    created_at: datetime
