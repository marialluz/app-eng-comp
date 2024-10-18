from fastapi import FastAPI
from db.database import engine, SessionLocal, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
