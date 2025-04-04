from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from typing import List, Optional, Dict, Any
import datetime
from . import models, schemas, auth
from .ai_engine import analyze_response, analyze_full_interview

# User operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        company=user.company,
        position=user.position,
        user_type=user.user_type,
        profile_image=user.profile_image
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Interview Template operations
def get_interview_template(db: Session, template_id: int):
    return db.query(models.InterviewTemplate).filter(models.InterviewTemplate.id == template_id).first()

def get_interview_templates(db: Session, skip: int = 0, limit: int = 100, user_id: Optional[int] = None):
    query = db.query(models.InterviewTemplate)
    if user_id:
        query = query.filter(models.InterviewTemplate.creator_id == user_id)
    return query.filter(models.InterviewTemplate.is_active == True).offset(skip).limit(limit).all()

def create_interview_template(db: Session, template: schemas.InterviewTemplateCreate, user_id: int):
    # Create template
    db_template = models.InterviewTemplate(
        title=template.title,
        description=template.description,
        creator_id=user_id
    )
    db.add(db_template)
    db.flush()  # Flush to get the template ID
    
    # Create questions
    for i, question in enumerate(template.questions):
        db_question = models.Question(
            template_id=db_template.id,
            text=question.text,
            type=question.type,
            options=question.options,
            time_limit=question.time_limit,
            required=question.required,
            order=question.order or i
        )
        db.add(db_question)
    
    db.commit()
    db.refresh(db_template)
    return db_template

def update_interview_template(db: Session, template_id: int, template: schemas.InterviewTemplateCreate):
    db_template = db.query(models.InterviewTemplate).filter(models.InterviewTemplate.id == template_id).first()
    if not db_template:
        return None
    
    # Update template fields
    db_template.title = template.title
    db_template.description = template.description
    
    # Delete existing questions
    db.query(models.Question).filter(models.Question.template_id == template_id).delete()
    
    # Create new questions
    for i, question in enumerate(template.questions):
        db_question = models.Question(
            template_id=db_template.id,
            text=question.text,
            type=question.type,
            options=question.options,
            time_limit=question.time_limit,
            required=question.required,
            order=question.order or i
        )
        db.add(db_question)
    
    db.commit()
    db.refresh(db_template)
    return db_template

# Interview operations
def get_interview(db: Session, interview_id: int):
    return db.query(models.Interview).filter(models.Interview.id == interview_id).first()

def get_recruiter_interviews(db: Session, recruiter_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Interview).filter(models.Interview.recruiter_id == recruiter_id).offset(skip).limit(limit).all()

def get_candidate_interviews(db: Session, candidate_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Interview).filter(models.Interview.candidate_id == candidate_id).offset(skip).limit(limit).all()

def get_interviews_by_email(db: Session, email: str, skip: int = 0, limit: int = 100):
    return db.query(models.Interview).filter(models.Interview.candidate_email == email).offset(skip).limit(limit).all()

def create_interview(db: Session, interview: schemas.InterviewCreate, recruiter_id: int):
    # Lookup if the candidate exists
    candidate = db.query(models.User).filter(
        models.User.email == interview.candidate_email,
        models.User.user_type == "candidate"
    ).first()
    
    # Create the interview
    db_interview = models.Interview(
        template_id=interview.template_id,
        recruiter_id=recruiter_id,
        candidate_id=candidate.id if candidate else None,
        candidate_email=interview.candidate_email,
        candidate_name=interview.candidate_name,
        due_date=interview.due_date
    )
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

def update_interview_status(db: Session, interview_id: int, status: models.InterviewStatus):
    db_interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not db_interview:
        return None
    
    db_interview.status = status
    
    # Set timestamps based on status
    if status == models.InterviewStatus.in_progress and not db_interview.started_at:
        db_interview.started_at = datetime.datetime.now()
    elif status == models.InterviewStatus.completed and not db_interview.completed_at:
        db_interview.completed_at = datetime.datetime.now()
    
    db.commit()
    db.refresh(db_interview)
    return db_interview

# Response operations
def create_response(db: Session, response: schemas.ResponseCreate, interview_id: int):
    db_response = models.Response(
        interview_id=interview_id,
        question_id=response.question_id,
        text_response=response.text_response,
        selected_option=response.selected_option,
        video_url=response.video_url,
        video_transcript=response.video_transcript
    )
    db.add(db_response)
    db.flush()
    
    # If AI analysis is enabled, analyze the response
    question = db.query(models.Question).filter(models.Question.id == response.question_id).first()
    if question:
        analysis_result = analyze_response(
            question_type=question.type,
            question_text=question.text,
            response_text=response.text_response or response.video_transcript,
            selected_option=response.selected_option,
            options=question.options
        )
        
        if analysis_result:
            db_analysis = models.ResponseAnalysis(
                response_id=db_response.id,
                score=analysis_result.get("score", 0),
                strengths=analysis_result.get("strengths"),
                weaknesses=analysis_result.get("weaknesses"),
                notes=analysis_result.get("notes"),
                keywords=analysis_result.get("keywords"),
                sentiment=analysis_result.get("sentiment")
            )
            db.add(db_analysis)
    
    db.commit()
    db.refresh(db_response)
    return db_response

def submit_interview_response(db: Session, interview_id: int, response: schemas.InterviewResponseCreate):
    # Get the interview
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview:
        return None
    
    # Check if interview is already completed
    if interview.status == models.InterviewStatus.completed:
        return interview
    
    # Mark as in progress if just starting
    if interview.status == models.InterviewStatus.pending:
        interview.status = models.InterviewStatus.in_progress
        interview.started_at = datetime.datetime.now()
    
    # Save responses
    for resp in response.responses:
        create_response(db, resp, interview_id)
    
    # Check if all required questions are answered
    template = db.query(models.InterviewTemplate).filter(models.InterviewTemplate.id == interview.template_id).first()
    
    if template:
        required_questions = {q.id for q in template.questions if q.required}
        answered_questions = {
            r.question_id for r in db.query(models.Response).filter(models.Response.interview_id == interview_id).all()
        }
        
        # If all required questions are answered, mark as completed
        if required_questions.issubset(answered_questions):
            interview.status = models.InterviewStatus.completed
            interview.completed_at = datetime.datetime.now()
            
            # Analyze the full interview
            analyze_interview(db, interview_id)
    
    db.commit()
    db.refresh(interview)
    return interview

# Analysis operations
def analyze_interview(db: Session, interview_id: int):
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview or interview.status != models.InterviewStatus.completed:
        return None
    
    # Get all responses and their analyses
    responses = db.query(models.Response).filter(models.Response.interview_id == interview_id).all()
    
    # Check if we have all the analyses
    for response in responses:
        if not hasattr(response, 'analysis') or not response.analysis:
            question = db.query(models.Question).filter(models.Question.id == response.question_id).first()
            if question:
                analysis_result = analyze_response(
                    question_type=question.type,
                    question_text=question.text,
                    response_text=response.text_response or response.video_transcript,
                    selected_option=response.selected_option,
                    options=question.options
                )
                
                if analysis_result:
                    db_analysis = models.ResponseAnalysis(
                        response_id=response.id,
                        score=analysis_result.get("score", 0),
                        strengths=analysis_result.get("strengths"),
                        weaknesses=analysis_result.get("weaknesses"),
                        notes=analysis_result.get("notes"),
                        keywords=analysis_result.get("keywords"),
                        sentiment=analysis_result.get("sentiment")
                    )
                    db.add(db_analysis)
                    db.flush()
    
    # Generate a full interview analysis
    template = db.query(models.InterviewTemplate).filter(models.InterviewTemplate.id == interview.template_id).first()
    
    # Prepare data for the analysis
    analysis_data = {
        "interview_title": template.title if template else None,
        "candidate_name": interview.candidate_name,
        "responses": []
    }
    
    for response in responses:
        question = db.query(models.Question).filter(models.Question.id == response.question_id).first()
        if question and hasattr(response, 'analysis') and response.analysis:
            analysis_data["responses"].append({
                "question_text": question.text,
                "question_type": question.type,
                "response_text": response.text_response or response.video_transcript or response.selected_option,
                "score": response.analysis.score,
                "strengths": response.analysis.strengths,
                "weaknesses": response.analysis.weaknesses
            })
    
    # Generate the overall analysis
    overall_analysis = analyze_full_interview(analysis_data)
    
    # Check if an analysis already exists
    existing_analysis = db.query(models.InterviewAnalysis).filter(
        models.InterviewAnalysis.interview_id == interview_id
    ).first()
    
    if existing_analysis:
        # Update existing analysis
        existing_analysis.overall_score = overall_analysis.get("overall_score", 0)
        existing_analysis.recommendation = overall_analysis.get("recommendation")
        existing_analysis.strengths = overall_analysis.get("strengths")
        existing_analysis.weaknesses = overall_analysis.get("weaknesses")
        db_analysis = existing_analysis
    else:
        # Create new analysis
        db_analysis = models.InterviewAnalysis(
            interview_id=interview_id,
            overall_score=overall_analysis.get("overall_score", 0),
            recommendation=overall_analysis.get("recommendation"),
            strengths=overall_analysis.get("strengths"),
            weaknesses=overall_analysis.get("weaknesses")
        )
        db.add(db_analysis)
    
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

# Analytics operations
def get_recruiter_dashboard(db: Session, recruiter_id: int):
    # Calculate analytics data
    total_candidates = db.query(func.count(models.Interview.candidate_email.distinct())).filter(
        models.Interview.recruiter_id == recruiter_id
    ).scalar()
    
    pending_interviews = db.query(func.count(models.Interview.id)).filter(
        models.Interview.recruiter_id == recruiter_id,
        models.Interview.status == models.InterviewStatus.pending
    ).scalar()
    
    completed_interviews = db.query(func.count(models.Interview.id)).filter(
        models.Interview.recruiter_id == recruiter_id,
        models.Interview.status == models.InterviewStatus.completed
    ).scalar()
    
    # Calculate average completion time
    completed_with_times = db.query(models.Interview).filter(
        models.Interview.recruiter_id == recruiter_id,
        models.Interview.status == models.InterviewStatus.completed,
        models.Interview.started_at.isnot(None),
        models.Interview.completed_at.isnot(None)
    ).all()
    
    total_time = 0
    for interview in completed_with_times:
        duration = (interview.completed_at - interview.started_at).total_seconds() / 60  # Convert to minutes
        total_time += duration
    
    avg_completion_time = total_time / len(completed_with_times) if completed_with_times else 0
    
    # Calculate completion rate
    total_interviews = pending_interviews + completed_interviews
    completion_rate = (completed_interviews / total_interviews * 100) if total_interviews > 0 else 0
    
    # Generate chart data
    # 1. Interviews by day (last 7 days)
    today = datetime.datetime.now().date()
    seven_days_ago = today - datetime.timedelta(days=6)
    
    # Generate date labels for the last 7 days
    date_labels = [(seven_days_ago + datetime.timedelta(days=i)).strftime("%a") for i in range(7)]
    
    # Initialize data arrays
    completed_counts = [0] * 7
    scheduled_counts = [0] * 7
    
    # Query interviews from the last 7 days
    recent_interviews = db.query(models.Interview).filter(
        models.Interview.recruiter_id == recruiter_id,
        func.date(models.Interview.created_at) >= seven_days_ago
    ).all()
    
    # Count interviews by day
    for interview in recent_interviews:
        day_index = (interview.created_at.date() - seven_days_ago).days
        if 0 <= day_index < 7:
            if interview.status == models.InterviewStatus.completed:
                completed_counts[day_index] += 1
            else:
                scheduled_counts[day_index] += 1
    
    interviews_by_day = {
        "labels": date_labels,
        "datasets": [
            {
                "label": "Completed",
                "data": completed_counts,
                "backgroundColor": "#0284c7"  # primary-600
            },
            {
                "label": "Scheduled",
                "data": scheduled_counts,
                "backgroundColor": "#8b5cf6"  # secondary-600
            }
        ]
    }
    
    # 2. Scores distribution
    # Get all completed interviews with analysis
    scored_interviews = db.query(models.InterviewAnalysis).join(
        models.Interview, models.Interview.id == models.InterviewAnalysis.interview_id
    ).filter(
        models.Interview.recruiter_id == recruiter_id
    ).all()
    
    # Group scores into ranges
    score_ranges = ["0-1", "1-2", "2-3", "3-4", "4-5"]
    score_counts = [0] * 5
    
    for analysis in scored_interviews:
        score_index = min(int(analysis.overall_score), 4)
        score_counts[score_index] += 1
    
    scores_distribution = {
        "labels": score_ranges,
        "datasets": [
            {
                "label": "Candidates",
                "data": score_counts,
                "backgroundColor": "#0284c7"  # primary-600
            }
        ]
    }
    
    # 3. Candidate sources (demo data since we don't track this yet)
    source_labels = ["LinkedIn", "Job Boards", "Referrals", "Direct"]
    source_counts = [45, 30, 15, 10]  # Placeholder percentages
    
    candidate_sources = {
        "labels": source_labels,
        "datasets": [
            {
                "label": "Sources",
                "data": source_counts,
                "backgroundColor": ["#0284c7", "#8b5cf6", "#059669", "#d97706"]
            }
        ]
    }
    
    # Return the analytics data
    return schemas.RecruiterAnalytics(
        total_candidates=total_candidates,
        pending_interviews=pending_interviews,
        completed_interviews=completed_interviews,
        avg_completion_time=avg_completion_time,
        completion_rate=completion_rate,
        interviews_by_day=interviews_by_day,
        scores_distribution=scores_distribution,
        candidate_sources=candidate_sources
    ) 