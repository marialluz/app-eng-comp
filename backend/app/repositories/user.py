from sqlalchemy.orm import Session
from app.models import User


class UserRepository:
    @staticmethod
    def create_user(db: Session, email: str, hashed_password: str) -> User:
        db_user = User(email=email, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        return db.query(User).filter(User.email == email).first()
