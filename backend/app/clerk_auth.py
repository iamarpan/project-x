import os
import time
import jwt
from jwt.exceptions import InvalidTokenError
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .database import get_db
from . import models, crud

# Clerk's JWKS endpoint (for verifying JWTs)
CLERK_JWKS_URL = "https://api.clerk.dev/v1/jwks"

# In-memory cache for JWT verification keys
jwks_client = None

class ClerkUserData(BaseModel):
    """Basic data structure for Clerk user info"""
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

async def get_clerk_user(request: Request, db: Session = Depends(get_db)) -> Optional[models.User]:
    """
    Get the current user from Clerk JWT
    
    This is a simplified version - in a production app, you'd want to:
    1. Use a proper JWKS client to validate and decode the JWT
    2. Cache the JWKS keys to avoid repeated network requests
    3. Handle key rotation properly
    """
    try:
        # Extract the token from the Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
            
        token = auth_header.replace("Bearer ", "")
        
        # Simple decode of the JWT to get user info
        # WARNING: In production, validate signature properly with JWKS
        # This is simplified for demo purposes
        decoded = jwt.decode(
            token, 
            options={"verify_signature": False},
            algorithms=["RS256"]
        )
        
        # Extract user data
        user_id = decoded.get("sub")
        if not user_id:
            return None
            
        # Look up user in our database by Clerk ID
        db_user = db.query(models.User).filter(
            models.User.oauth_provider == "clerk", 
            models.User.oauth_provider_id == user_id
        ).first()
        
        # If not found but we have an email, try by email
        if not db_user and decoded.get("email"):
            db_user = crud.get_user_by_email(db, email=decoded.get("email"))
            
            # If found by email but not linked to Clerk, update the link
            if db_user and not db_user.oauth_provider_id:
                db_user.oauth_provider = "clerk"
                db_user.oauth_provider_id = user_id
                db.commit()
        
        return db_user
    
    except Exception as e:
        # Log the error in a real app
        print(f"Error authenticating with Clerk: {e}")
        return None

# Dependency to require a logged-in user
def require_user(user: Optional[models.User] = Depends(get_clerk_user)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# Dependency to require a specific user type
def require_user_type(user_type: str):
    def check_user_type(user: models.User = Depends(require_user)):
        if user.user_type != user_type:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access restricted to {user_type} users"
            )
        return user
    return check_user_type

# Convenience dependencies for specific user types
require_recruiter = require_user_type("recruiter")
require_candidate = require_user_type("candidate") 