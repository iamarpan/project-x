from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from datetime import datetime, timedelta
from starlette.middleware.sessions import SessionMiddleware

from .database import engine, get_db
from . import models, schemas, crud, auth
from .routers import auth as auth_router, templates, interviews, analytics
from . import clerk_webhook

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Interview Assistant API",
    description="API for the AI Interview Assistant Application",
    version="0.1.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",           # React development server
    "http://localhost:5173",           # Vite development server
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    # Add production domains as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add session middleware for OAuth
app.add_middleware(
    SessionMiddleware, 
    secret_key=os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
)

# Include routers
app.include_router(auth_router.router)
app.include_router(templates.router)
app.include_router(interviews.router)
app.include_router(analytics.router)
app.include_router(clerk_webhook.router)

@app.get("/")
async def root():
    """
    Root endpoint to verify the API is running.
    """
    return {
        "message": "Welcome to the AI Interview Assistant API",
        "version": "0.1.0",
        "documentation": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return {"status": "ok"}

# Mock upload endpoint for development
@app.post("/mock-upload")
async def mock_upload(path: str):
    """
    Mock endpoint for file uploads during development.
    In production, this would be handled by S3 or similar.
    """
    return {
        "success": True,
        "message": "File uploaded successfully (mock)",
        "path": path
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 