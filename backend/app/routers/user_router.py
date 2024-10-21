from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import UserCreate, UserResponse
from app.services import UserService
from app.db.database import get_db

router = APIRouter()


@router.post("/user/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService()
    return user_service.create_user(db=db, user=user)
