from fastapi import APIRouter
from app.api.api_v1.endpoints import candidates, interviews

api_router = APIRouter()
api_router.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["interviews"]) 