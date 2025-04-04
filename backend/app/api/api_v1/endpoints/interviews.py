from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.interview import Interview
from app.schemas.interview import InterviewCreate, Interview as InterviewSchema

router = APIRouter()

@router.get("/", response_model=List[InterviewSchema])
def read_interviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    interviews = db.query(Interview).offset(skip).limit(limit).all()
    return interviews

@router.post("/", response_model=InterviewSchema)
def create_interview(interview: InterviewCreate, db: Session = Depends(get_db)):
    db_interview = Interview(**interview.dict())
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview 