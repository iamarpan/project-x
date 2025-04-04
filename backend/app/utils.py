import os
import uuid
import datetime
import secrets
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from . import models, schemas

def validate_template(template: schemas.InterviewTemplateCreate) -> None:
    """Validate interview template data"""
    # Check for minimum number of questions
    if not template.questions or len(template.questions) < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview template must have at least one question"
        )
    
    # Check that MCQ questions have options
    for i, question in enumerate(template.questions):
        if question.type == models.QuestionType.mcq and (not question.options or len(question.options) < 2):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Multiple choice question at position {i+1} must have at least 2 options"
            )
        
        # Ensure all questions have text
        if not question.text or len(question.text.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question at position {i+1} must have text"
            )
        
        # Validate time limits for video questions
        if question.type == models.QuestionType.video and (question.time_limit is None or question.time_limit < 30):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Video question at position {i+1} must have a time limit of at least 30 seconds"
            )

def get_demo_user(email: str, db: Session) -> Optional[models.User]:
    """
    Get a demo user without querying the database.
    For demonstration accounts (example.com emails), return a mock user object.
    """
    if not email.endswith("@example.com"):
        return None
    
    user_type = models.UserType.recruiter if "recruiter" in email else models.UserType.candidate
    
    # Check if user already exists in db
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user:
        return db_user
    
    # Create a demo user
    first_name = "Demo"
    last_name = "Recruiter" if user_type == models.UserType.recruiter else "Candidate"
    
    # For demo purposes, create this user in the database
    db_user = models.User(
        email=email,
        hashed_password="$2b$12$demo_password_hash_for_development_only",  # Not a real hash
        first_name=first_name,
        last_name=last_name,
        user_type=user_type,
        is_demo=True,
        company="Demo Company" if user_type == models.UserType.recruiter else None,
        position="HR Manager" if user_type == models.UserType.recruiter else "Software Engineer",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def generate_upload_url(file_type: str = "video") -> Dict[str, Any]:
    """
    Generate a pre-signed URL for uploading a file.
    In a production environment, this would integrate with S3 or similar.
    For now, we just return a mock URL and file path.
    """
    # In a production environment, we would use AWS S3 or similar:
    # Example implementation (commented out):
    # import boto3
    # from botocore.config import Config
    # 
    # s3_client = boto3.client(
    #     's3',
    #     config=Config(signature_version='s3v4'),
    #     region_name=os.environ.get('AWS_REGION', 'us-east-1')
    # )
    # 
    # bucket_name = os.environ.get('S3_BUCKET_NAME')
    # file_key = f"{file_type}/{uuid.uuid4()}.{file_type}"
    # 
    # presigned_url = s3_client.generate_presigned_url(
    #     'put_object',
    #     Params={
    #         'Bucket': bucket_name,
    #         'Key': file_key,
    #         'ContentType': f"{file_type}/{file_type}"
    #     },
    #     ExpiresIn=3600  # URL expires in 1 hour
    # )
    # 
    # return {
    #     "upload_url": presigned_url,
    #     "file_path": f"s3://{bucket_name}/{file_key}",
    #     "public_url": f"https://{bucket_name}.s3.amazonaws.com/{file_key}",
    #     "expires_in": 3600
    # }
    
    # For development, return a mock URL
    mock_file_id = str(uuid.uuid4())
    mock_file_path = f"/uploads/{file_type}/{mock_file_id}.{file_type}"
    mock_upload_url = f"http://localhost:8000/mock-upload?path={mock_file_path}"
    
    return {
        "upload_url": mock_upload_url,
        "file_path": mock_file_path,
        "public_url": f"http://localhost:8000/static{mock_file_path}",
        "expires_in": 3600
    }

def format_interview_for_candidate(interview: models.Interview) -> Dict[str, Any]:
    """
    Format interview data for candidate view, excluding sensitive information.
    """
    template = interview.template
    
    # Format questions
    questions = []
    for q in sorted(template.questions, key=lambda x: x.order):
        question_data = {
            "id": q.id,
            "text": q.text,
            "type": q.type,
            "time_limit": q.time_limit,
            "required": q.required
        }
        
        # Only include options for MCQ questions
        if q.type == models.QuestionType.mcq:
            question_data["options"] = q.options
        
        questions.append(question_data)
    
    # Format responses if the interview has been started
    responses = {}
    if interview.status != models.InterviewStatus.pending:
        for response in interview.responses:
            response_data = {
                "id": response.id,
                "question_id": response.question_id,
                "text_response": response.text_response,
                "selected_option": response.selected_option,
                "video_url": response.video_url if interview.status == models.InterviewStatus.completed else None
            }
            responses[response.question_id] = response_data
    
    return {
        "id": interview.id,
        "title": template.title,
        "description": template.description,
        "status": interview.status,
        "due_date": interview.due_date,
        "started_at": interview.started_at,
        "completed_at": interview.completed_at,
        "questions": questions,
        "responses": responses
    }

def format_interview_for_recruiter(interview: models.Interview) -> Dict[str, Any]:
    """
    Format interview data for recruiter view, including analysis if available.
    """
    # Start with the candidate view
    data = format_interview_for_candidate(interview)
    
    # Add recruiter-specific information
    data["candidate_name"] = interview.candidate_name
    data["candidate_email"] = interview.candidate_email
    
    # Add analysis information if available and interview is completed
    if interview.status == models.InterviewStatus.completed and hasattr(interview, 'analysis') and interview.analysis:
        data["analysis"] = {
            "overall_score": interview.analysis.overall_score,
            "recommendation": interview.analysis.recommendation,
            "strengths": interview.analysis.strengths,
            "weaknesses": interview.analysis.weaknesses,
            "created_at": interview.analysis.created_at
        }
        
        # Add individual response analyses
        for question_id, response in data["responses"].items():
            db_response = next((r for r in interview.responses if r.question_id == question_id), None)
            if db_response and hasattr(db_response, 'analysis') and db_response.analysis:
                response["analysis"] = {
                    "score": db_response.analysis.score,
                    "strengths": db_response.analysis.strengths,
                    "weaknesses": db_response.analysis.weaknesses,
                    "notes": db_response.analysis.notes,
                    "keywords": db_response.analysis.keywords,
                    "sentiment": db_response.analysis.sentiment
                }
    
    return data

def send_interview_invitation(interview: models.Interview) -> Dict[str, Any]:
    """
    Send an interview invitation email to the candidate.
    In a production environment, this would integrate with an email service.
    For now, we just return mock data.
    """
    # In a production environment, we would use an email service like SendGrid:
    # Example implementation (commented out):
    # import sendgrid
    # from sendgrid.helpers.mail import Mail, Email, To, Content
    # 
    # sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
    # 
    # from_email = Email(os.environ.get('FROM_EMAIL', 'interviews@example.com'))
    # to_email = To(interview.candidate_email)
    # subject = f"Interview Invitation: {interview.template.title}"
    # 
    # interview_link = f"{os.environ.get('FRONTEND_URL')}/interview/{interview.id}"
    # 
    # html_content = f'''
    # <p>Hello {interview.candidate_name},</p>
    # <p>You have been invited to complete an interview for {interview.template.title}.</p>
    # <p>Please complete the interview by {interview.due_date.strftime('%B %d, %Y')}.</p>
    # <p><a href="{interview_link}">Click here to start the interview</a></p>
    # <p>Thank you,<br>
    # The AI Interview Assistant Team</p>
    # '''
    # 
    # mail = Mail(from_email, to_email, subject, html_content=html_content)
    # 
    # response = sg.client.mail.send.post(request_body=mail.get())
    # 
    # return {
    #     "success": response.status_code == 202,
    #     "message": "Email sent successfully" if response.status_code == 202 else "Failed to send email"
    # }
    
    # For development, return a mock response
    interview_link = f"http://localhost:3000/interview/{interview.id}"
    
    return {
        "success": True,
        "message": "Email would be sent in production",
        "details": {
            "to": interview.candidate_email,
            "subject": f"Interview Invitation: {interview.template.title}",
            "interview_link": interview_link,
            "due_date": interview.due_date
        }
    } 