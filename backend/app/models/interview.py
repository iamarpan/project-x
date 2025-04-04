from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    scheduled_time = Column(DateTime)
    duration = Column(Integer)  # in minutes
    status = Column(String)  # Scheduled, Completed, Cancelled

    candidate = relationship("Candidate", back_populates="interviews") 