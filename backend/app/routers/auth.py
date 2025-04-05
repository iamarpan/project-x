from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse
import os

from .. import crud, models, schemas, auth, database, utils, oauth

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={401: {"description": "Not authorized"}},
)

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # First, check if this is a demo user
    if form_data.username.endswith("@example.com"):
        # Demo login logic
        demo_user = utils.get_demo_user(form_data.username, db)
        if demo_user:
            access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = auth.create_access_token(
                data={"sub": demo_user.email, "user_type": demo_user.user_type}, 
                expires_delta=access_token_expires
            )
            return {
                "access_token": access_token, 
                "token_type": "bearer",
                "user_type": demo_user.user_type,
                "user_id": demo_user.id,
                "user_name": f"{demo_user.first_name} {demo_user.last_name}"
            }
    
    # Standard authentication logic
    user = auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "user_type": user.user_type}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_type": user.user_type,
        "user_id": user.id,
        "user_name": f"{user.first_name} {user.last_name}"
    }

@router.post("/register", response_model=schemas.User)
async def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(database.get_db)
):
    """
    Register a new user, hashing their password.
    """
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    return crud.create_user(db=db, user=user)

@router.get("/me", response_model=schemas.User)
async def read_users_me(
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Get current user information.
    """
    return current_user

# OAuth routes
@router.get("/login/{provider}")
async def oauth_login(
    provider: str, 
    request: Request,
    user_type: str = "candidate"
):
    """Initiate OAuth login flow with specified provider"""
    # Validate the provider
    if provider not in ["google", "twitter", "linkedin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported provider: {provider}"
        )
    
    # Store user_type in session
    request.session["user_type"] = user_type
    
    # Redirect to provider's authorization page
    redirect_uri = f"{os.getenv('OAUTH_REDIRECT_URL', request.url_for('oauth_callback', provider=provider))}"
    return await oauth.oauth.get(provider).authorize_redirect(request, redirect_uri)

@router.get("/callback/{provider}")
async def oauth_callback(
    provider: str, 
    request: Request,
    db: Session = Depends(database.get_db)
):
    """Handle OAuth callback from provider"""
    try:
        # Get user type from session
        user_type = request.session.get("user_type", "candidate")
        
        # Get user info from the provider
        user_info = await oauth.get_oauth_user_info(provider, request)
        
        # Get or create user
        db_user = await oauth.get_or_create_oauth_user(user_info, db, user_type)
        
        # Create access token
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": db_user.email, "user_type": db_user.user_type}, 
            expires_delta=access_token_expires
        )
        
        # Build the frontend URL with token
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        redirect_url = f"{frontend_url}/auth/callback?token={access_token}&user_id={db_user.id}&user_type={db_user.user_type}&name={db_user.first_name}%20{db_user.last_name}"
        
        # Redirect to frontend with token
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        # Redirect to frontend with error
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        error_redirect = f"{frontend_url}/login?error=oauth_failed&message={str(e)}"
        return RedirectResponse(url=error_redirect) 