from fastapi import FastAPI

from .database import Base, engine
from .routers import user, banker

# Create DB schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Loan Management Backend",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(user.router)
app.include_router(banker.router)
