from fastapi import FastAPI
from app.routers import user_router
from app.db.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router.router, prefix="/api")
