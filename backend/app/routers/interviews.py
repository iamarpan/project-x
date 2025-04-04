from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas, auth, database, utils

router = APIRouter(
    prefix="/interviews",
    tags=["interviews"],
    responses={401: {"description": "Not authorized"}},
)

@router.post("/", response_model=Dict[str, Any])
async def create_interview(
    interview: schemas.InterviewCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Create a new interview and send invitation to candidate.
    Only recruiters can create interviews.
    """
    # Check if user is a recruiter
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can create interviews"
        )
    
    # Verify that the template exists
    template = crud.get_interview_template(db, template_id=interview.template_id)
    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    # Verify that the template belongs to the recruiter
    if template.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only use your own templates"
        )
    
    # Create the interview
    db_interview = crud.create_interview(db, interview=interview, recruiter_id=current_user.id)
    
    # Send invitation email
    email_result = utils.send_interview_invitation(db_interview)
    
    # Format response
    interview_data = utils.format_interview_for_recruiter(db_interview)
    interview_data["email_sent"] = email_result
    
    return interview_data

@router.get("/recruiter", response_model=List[Dict[str, Any]])
async def get_recruiter_interviews(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get all interviews created by the current recruiter.
    """
    # Check if user is a recruiter
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access this endpoint"
        )
    
    # Get interviews
    interviews = crud.get_recruiter_interviews(db, recruiter_id=current_user.id, skip=skip, limit=limit)
    
    # Format response
    return [utils.format_interview_for_recruiter(interview) for interview in interviews]

@router.get("/candidate", response_model=List[Dict[str, Any]])
async def get_candidate_interviews(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get all interviews for the current candidate.
    """
    # Check if user is a candidate
    if current_user.user_type != models.UserType.candidate:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )
    
    # Get interviews by email
    interviews = crud.get_interviews_by_email(db, email=current_user.email, skip=skip, limit=limit)
    
    # Format response
    return [utils.format_interview_for_candidate(interview) for interview in interviews]

@router.get("/{interview_id}", response_model=Dict[str, Any])
async def get_interview(
    interview_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get a specific interview.
    Recruiters can only see their own interviews.
    Candidates can only see interviews assigned to them.
    """
    # Get interview
    interview = crud.get_interview(db, interview_id=interview_id)
    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    # Check permissions based on user type
    if current_user.user_type == models.UserType.recruiter:
        # Recruiter can only see their own interviews
        if interview.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only access your own interviews"
            )
        
        return utils.format_interview_for_recruiter(interview)
    
    elif current_user.user_type == models.UserType.candidate:
        # Candidate can only see interviews assigned to them
        if interview.candidate_email != current_user.email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only access interviews assigned to you"
            )
        
        return utils.format_interview_for_candidate(interview)
    
    # Should never reach here if authentication middleware is working correctly
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorized access"
    )

@router.post("/{interview_id}/start", response_model=Dict[str, Any])
async def start_interview(
    interview_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Start an interview (change status from pending to in_progress).
    Only the assigned candidate can start the interview.
    """
    # Get interview
    interview = crud.get_interview(db, interview_id=interview_id)
    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    # Check if this is the assigned candidate
    if current_user.user_type != models.UserType.candidate or interview.candidate_email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned candidate can start this interview"
        )
    
    # Check if interview is pending
    if interview.status != models.InterviewStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Interview cannot be started (current status: {interview.status})"
        )
    
    # Update status
    updated_interview = crud.update_interview_status(db, interview_id=interview_id, status=models.InterviewStatus.in_progress)
    
    return utils.format_interview_for_candidate(updated_interview)

@router.post("/{interview_id}/submit", response_model=Dict[str, Any])
async def submit_interview_response(
    interview_id: int,
    response: schemas.InterviewResponseCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Submit responses for an interview.
    Only the assigned candidate can submit responses.
    """
    # Get interview
    interview = crud.get_interview(db, interview_id=interview_id)
    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    # Check if this is the assigned candidate
    if current_user.user_type != models.UserType.candidate or interview.candidate_email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned candidate can submit responses"
        )
    
    # Check if interview status allows submissions
    if interview.status == models.InterviewStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This interview has already been completed"
        )
    
    # Submit responses
    updated_interview = crud.submit_interview_response(db, interview_id=interview_id, response=response)
    if updated_interview is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit responses"
        )
    
    return utils.format_interview_for_candidate(updated_interview)

@router.post("/{interview_id}/video-upload-url", response_model=Dict[str, Any])
async def get_video_upload_url(
    interview_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get a pre-signed URL for uploading a video response.
    Only the assigned candidate can get an upload URL.
    """
    # Get interview
    interview = crud.get_interview(db, interview_id=interview_id)
    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    # Check if this is the assigned candidate
    if current_user.user_type != models.UserType.candidate or interview.candidate_email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned candidate can upload videos for this interview"
        )
    
    # Check if interview status allows uploads
    if interview.status == models.InterviewStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This interview has already been completed"
        )
    
    # Generate upload URL
    upload_info = utils.generate_upload_url(file_type="video")
    
    return upload_info 