from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas, auth, database, utils

router = APIRouter(
    prefix="/templates",
    tags=["templates"],
    responses={401: {"description": "Not authorized"}},
)

@router.get("/", response_model=List[schemas.InterviewTemplate])
async def get_interview_templates(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[int] = None,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get all interview templates, optionally filtered by creator.
    Only recruiters can see templates.
    """
    # Check if user is a recruiter
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access templates"
        )
    
    # If user_id is provided, check if it matches the current user
    # (Users can only see their own templates)
    if user_id is not None and user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own templates"
        )
    
    # Get templates
    templates = crud.get_interview_templates(db, skip=skip, limit=limit, user_id=current_user.id)
    return templates

@router.post("/", response_model=schemas.InterviewTemplate)
async def create_interview_template(
    template: schemas.InterviewTemplateCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Create a new interview template.
    Only recruiters can create templates.
    """
    # Check if user is a recruiter
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can create templates"
        )
    
    # Validate template data
    utils.validate_template(template)
    
    # Create template
    return crud.create_interview_template(db=db, template=template, user_id=current_user.id)

@router.get("/{template_id}", response_model=schemas.InterviewTemplate)
async def get_interview_template(
    template_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get a specific interview template.
    """
    # Get template
    template = crud.get_interview_template(db, template_id=template_id)
    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    # Check permissions
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access templates"
        )
    
    # If recruiter, check if they own the template
    if template.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own templates"
        )
    
    return template

@router.put("/{template_id}", response_model=schemas.InterviewTemplate)
async def update_interview_template(
    template_id: int,
    template: schemas.InterviewTemplateCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Update an existing interview template.
    """
    # Get existing template
    db_template = crud.get_interview_template(db, template_id=template_id)
    if db_template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    # Check permissions
    if current_user.user_type != models.UserType.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can update templates"
        )
    
    # Check if user owns the template
    if db_template.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own templates"
        )
    
    # Validate template data
    utils.validate_template(template)
    
    # Update template
    updated_template = crud.update_interview_template(db, template_id=template_id, template=template)
    if updated_template is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update template"
        )
    
    return updated_template 