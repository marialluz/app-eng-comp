from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
