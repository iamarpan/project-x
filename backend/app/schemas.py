from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
import enum

# Enums
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

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: Optional[int] = None
    user_type: Optional[str] = None
    user_name: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None
    user_type: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OAuthLogin(BaseModel):
    provider: str
    user_type: Optional[UserType] = UserType.candidate

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    company: Optional[str] = None
    position: Optional[str] = None
    user_type: UserType = UserType.candidate
    profile_image: Optional[str] = None

class UserCreate(UserBase):
    password: str = ""  # Password can be empty for OAuth users

class User(UserBase):
    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None
    oauth_provider: Optional[str] = None
    oauth_provider_id: Optional[str] = None

    class Config:
        orm_mode = True

# Question schemas
class QuestionBase(BaseModel):
    text: str
    type: QuestionType
    options: Optional[List[str]] = None  # For multiple choice
    time_limit: Optional[int] = None  # For video questions (in seconds)
    required: bool = True
    order: int

    @validator('options')
    def validate_options(cls, v, values):
        if values.get('type') == QuestionType.multiple_choice and (not v or len(v) < 2):
            raise ValueError('Multiple choice questions must have at least 2 options')
        if values.get('type') != QuestionType.multiple_choice and v:
            raise ValueError('Options should only be provided for multiple choice questions')
        return v

    @validator('time_limit')
    def validate_time_limit(cls, v, values):
        if values.get('type') == QuestionType.video and not v:
            raise ValueError('Video questions must have a time limit')
        if values.get('type') != QuestionType.video and v:
            raise ValueError('Time limit should only be provided for video questions')
        if v and (v < 10 or v > 300):
            raise ValueError('Time limit must be between 10 and 300 seconds')
        return v

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    template_id: int

    class Config:
        orm_mode = True

# Interview Template schemas
class InterviewTemplateBase(BaseModel):
    title: str
    description: Optional[str] = None

class InterviewTemplateCreate(InterviewTemplateBase):
    questions: List[QuestionCreate]

class InterviewTemplate(InterviewTemplateBase):
    id: int
    creator_id: int
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    questions: List[Question]

    class Config:
        orm_mode = True

# Interview schemas
class InterviewBase(BaseModel):
    template_id: int
    candidate_email: EmailStr
    candidate_name: str
    due_date: Optional[datetime] = None

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase):
    id: int
    recruiter_id: int
    candidate_id: Optional[int] = None
    status: InterviewStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    template: InterviewTemplate

    class Config:
        orm_mode = True

# Response schemas
class ResponseBase(BaseModel):
    question_id: int
    text_response: Optional[str] = None
    selected_option: Optional[str] = None
    video_url: Optional[str] = None
    video_transcript: Optional[str] = None

    @validator('text_response')
    def validate_text_response(cls, v, values, **kwargs):
        question_type = kwargs.get('question_type')
        if question_type == QuestionType.text and not v:
            raise ValueError('Text response is required for text questions')
        return v

    @validator('selected_option')
    def validate_selected_option(cls, v, values, **kwargs):
        question_type = kwargs.get('question_type')
        options = kwargs.get('options', [])
        if question_type == QuestionType.multiple_choice and not v:
            raise ValueError('Selected option is required for multiple choice questions')
        if v and options and v not in options:
            raise ValueError('Selected option must be one of the available options')
        return v

    @validator('video_url')
    def validate_video_url(cls, v, values, **kwargs):
        question_type = kwargs.get('question_type')
        if question_type == QuestionType.video and not v:
            raise ValueError('Video URL is required for video questions')
        return v

class ResponseCreate(ResponseBase):
    pass

class Response(ResponseBase):
    id: int
    interview_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Analysis schemas
class ResponseAnalysisBase(BaseModel):
    score: float
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    notes: Optional[str] = None
    keywords: Optional[List[str]] = None
    sentiment: Optional[float] = None

class ResponseAnalysis(ResponseAnalysisBase):
    id: int
    response_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class InterviewAnalysisBase(BaseModel):
    overall_score: float
    recommendation: Optional[str] = None
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None

class InterviewAnalysis(InterviewAnalysisBase):
    id: int
    interview_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# For submitting a complete interview
class InterviewResponseCreate(BaseModel):
    responses: List[ResponseCreate]

# Analytics schemas
class ChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Any]]

class RecruiterAnalytics(BaseModel):
    total_candidates: int
    pending_interviews: int
    completed_interviews: int
    avg_completion_time: float  # in minutes
    completion_rate: float  # percentage
    interviews_by_day: ChartData
    scores_distribution: ChartData
    candidate_sources: ChartData 