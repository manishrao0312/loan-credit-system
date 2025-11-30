from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import user, banker

# Initialize FastAPI app
app = FastAPI(
    title="Loan Management Backend",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database schema
Base.metadata.create_all(bind=engine)

# Health check
@app.get("/health")
def health():
    return {"status": "ok"}

# Include routers
app.include_router(user.router)
app.include_router(banker.router)
