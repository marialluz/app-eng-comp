from sqlalchemy.orm import Session
from app.repositories import UserRepository
from app.schemas import UserCreate
from passlib.context import CryptContext
from fastapi import HTTPException


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    def __init__(self) -> None:
        self.user_repository = UserRepository()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def _hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def create_user(self, db: Session, user: UserCreate):
        if user.password != user.confirm_password:
            raise HTTPException(
                status_code=400, detail="As senhas fornecidas não são iguais"
            )

        if self.get_user_by_email(db=db, email=user.email):
            raise HTTPException(
                status_code=400, detail="Já existe um usuário registrado com este email"
            )

        hashed_password = self._hash_password(user.password)
        return self.user_repository.create_user(
            db=db, email=user.email, hashed_password=hashed_password
        )

    def get_user_by_email(self, db: Session, email: str):
        return self.user_repository.get_user_by_email(db, email)
