from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas, auth, database

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    responses={401: {"description": "Not authorized"}},
)

@router.get("/recruiter/dashboard", response_model=schemas.RecruiterAnalytics)
async def get_recruiter_dashboard(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get analytics data for the recruiter dashboard.
    Only recruiters can access this endpoint.
    """
    # Check if user is a recruiter
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access this endpoint"
        )
    
    # Get analytics data
    return crud.get_recruiter_dashboard(db, recruiter_id=current_user.id)

@router.get("/interview/{interview_id}", response_model=Dict[str, Any])
async def get_interview_analysis(
    interview_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get analysis results for a specific interview.
    Recruiters can only see analysis for their own interviews.
    """
    # Get interview
    interview = crud.get_interview(db, interview_id=interview_id)
    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    # Check permissions
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access interview analysis"
        )
    
    # Check if interview belongs to the recruiter
    if interview.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access analysis for your own interviews"
        )
    
    # Check if interview is completed
    if interview.status != models.InterviewStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Analysis is only available for completed interviews"
        )
    
    # Get or create analysis
    analysis = crud.analyze_interview(db, interview_id=interview_id)
    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate analysis"
        )
    
    return {
        "interview_id": interview_id,
        "candidate_name": interview.candidate_name,
        "template_title": interview.template.title if interview.template else None,
        "completed_at": interview.completed_at,
        "overall_score": analysis.overall_score,
        "recommendation": analysis.recommendation,
        "strengths": analysis.strengths,
        "weaknesses": analysis.weaknesses,
        "created_at": analysis.created_at
    }

@router.post("/interview/{interview_id}/regenerate", response_model=Dict[str, Any])
async def regenerate_interview_analysis(
    interview_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Regenerate analysis for a specific interview.
    This can be useful if the AI model has been updated or if the analysis was incorrect.
    """
    # Get interview
    interview = crud.get_interview(db, interview_id=interview_id)
    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    # Check permissions
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can regenerate interview analysis"
        )
    
    # Check if interview belongs to the recruiter
    if interview.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only regenerate analysis for your own interviews"
        )
    
    # Check if interview is completed
    if interview.status != models.InterviewStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Analysis is only available for completed interviews"
        )
    
    # Delete existing analysis if it exists
    if hasattr(interview, 'analysis') and interview.analysis:
        db.delete(interview.analysis)
        db.commit()
    
    # Regenerate analysis
    analysis = crud.analyze_interview(db, interview_id=interview_id)
    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to regenerate analysis"
        )
    
    return {
        "interview_id": interview_id,
        "candidate_name": interview.candidate_name,
        "template_title": interview.template.title if interview.template else None,
        "completed_at": interview.completed_at,
        "overall_score": analysis.overall_score,
        "recommendation": analysis.recommendation,
        "strengths": analysis.strengths,
        "weaknesses": analysis.weaknesses,
        "created_at": analysis.created_at
    } 