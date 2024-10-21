from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str
    confirm_password: str


class UserResponse(BaseModel):
    id: int
    email: str
