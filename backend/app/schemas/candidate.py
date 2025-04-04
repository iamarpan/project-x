from pydantic import BaseModel
from typing import Optional

class CandidateBase(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    resume_url: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class Candidate(CandidateBase):
    id: int

    class Config:
        orm_mode = True 