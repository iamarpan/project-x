from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InterviewBase(BaseModel):
    candidate_id: int
    scheduled_time: datetime
    duration: int
    status: str

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase):
    id: int

    class Config:
        orm_mode = True 