from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from .database import Base

class UserType(str, enum.Enum):
    recruiter = "recruiter"
    candidate = "candidate"
    admin = "admin"

class InterviewStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    expired = "expired"

class QuestionType(str, enum.Enum):
    text = "text"
    multiple_choice = "multiple_choice"
    video = "video"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    company = Column(String, nullable=True)
    position = Column(String, nullable=True)
    user_type = Column(Enum(UserType), default=UserType.candidate)
    profile_image = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    created_templates = relationship("InterviewTemplate", back_populates="creator")
    recruiter_interviews = relationship("Interview", foreign_keys="[Interview.recruiter_id]", back_populates="recruiter")
    candidate_interviews = relationship("Interview", foreign_keys="[Interview.candidate_id]", back_populates="candidate")

class InterviewTemplate(Base):
    __tablename__ = "interview_templates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    creator = relationship("User", back_populates="created_templates")
    questions = relationship("Question", back_populates="template", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="template")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("interview_templates.id"))
    text = Column(Text)
    type = Column(Enum(QuestionType))
    options = Column(JSON, nullable=True)  # For multiple choice questions
    time_limit = Column(Integer, nullable=True)  # For video questions (in seconds)
    required = Column(Boolean, default=True)
    order = Column(Integer)  # For ordering questions within a template

    # Relationships
    template = relationship("InterviewTemplate", back_populates="questions")
    responses = relationship("Response", back_populates="question")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("interview_templates.id"))
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    candidate_email = Column(String)  # In case the candidate doesn't have an account yet
    candidate_name = Column(String)
    status = Column(Enum(InterviewStatus), default=InterviewStatus.pending)
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    template = relationship("InterviewTemplate", back_populates="interviews")
    recruiter = relationship("User", foreign_keys=[recruiter_id], back_populates="recruiter_interviews")
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="candidate_interviews")
    responses = relationship("Response", back_populates="interview", cascade="all, delete-orphan")
    analysis = relationship("InterviewAnalysis", back_populates="interview", uselist=False, cascade="all, delete-orphan")

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    text_response = Column(Text, nullable=True)
    selected_option = Column(String, nullable=True)  # For multiple choice
    video_url = Column(String, nullable=True)  # For video responses
    video_transcript = Column(Text, nullable=True)  # For video responses
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    interview = relationship("Interview", back_populates="responses")
    question = relationship("Question", back_populates="responses")
    analysis = relationship("ResponseAnalysis", back_populates="response", uselist=False, cascade="all, delete-orphan")

class ResponseAnalysis(Base):
    __tablename__ = "response_analyses"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id"))
    score = Column(Float)  # 0-5 scale
    strengths = Column(JSON, nullable=True)  # List of strengths
    weaknesses = Column(JSON, nullable=True)  # List of areas for improvement
    notes = Column(Text, nullable=True)  # Additional notes
    keywords = Column(JSON, nullable=True)  # Extracted keywords
    sentiment = Column(Float, nullable=True)  # Sentiment analysis score (-1 to 1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    response = relationship("Response", back_populates="analysis")

class InterviewAnalysis(Base):
    __tablename__ = "interview_analyses"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    overall_score = Column(Float)  # 0-5 scale
    recommendation = Column(Text, nullable=True)  # AI-generated recommendation
    strengths = Column(JSON, nullable=True)  # List of strengths
    weaknesses = Column(JSON, nullable=True)  # List of areas for improvement
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    interview = relationship("Interview", back_populates="analysis") 