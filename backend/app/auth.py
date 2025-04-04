from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import os

from . import models, schemas
from .database import get_db

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days (for demo purposes)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(email: str, password: str, db: Session = None):
    """
    Authenticate a user by email and password
    
    For demo purposes, allow certain email patterns to automatically authenticate
    as specific user types without checking the database
    """
    # Demo authentication mode
    if email.endswith("@example.com"):
        # For demo purposes, create a fake user 
        if "recruiter" in email:
            return schemas.User(
                id=1,
                email=email,
                first_name="Demo",
                last_name="Recruiter",
                user_type="recruiter",
                is_active=True
            )
        elif "candidate" in email:
            return schemas.User(
                id=2,
                email=email,
                first_name="Demo",
                last_name="Candidate",
                user_type="candidate",
                is_active=True
            )
    
    # Real authentication with database
    if db:
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        return user
    
    return None

def authenticate_oauth_user(email: str, oauth_provider: str, oauth_provider_id: str, db: Session):
    """Authenticate a user based on OAuth provider information"""
    # Check if user exists with this OAuth provider ID
    user = db.query(models.User).filter(
        models.User.oauth_provider == oauth_provider,
        models.User.oauth_provider_id == oauth_provider_id
    ).first()
    
    # If not found, try by email as fallback
    if not user:
        user = db.query(models.User).filter(models.User.email == email).first()
    
    # Ensure the user is active
    if user and not user.is_active:
        return None
        
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_type: str = payload.get("user_type")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email, user_type=user_type)
    except JWTError:
        raise credentials_exception
    
    # For demo mode
    if email.endswith("@example.com"):
        if "recruiter" in email:
            user = schemas.User(
                id=1,
                email=email,
                first_name="Demo",
                last_name="Recruiter",
                user_type="recruiter",
                is_active=True
            )
        elif "candidate" in email:
            user = schemas.User(
                id=2,
                email=email,
                first_name="Demo",
                last_name="Candidate",
                user_type="candidate",
                is_active=True
            )
        else:
            raise credentials_exception
    else:
        # Real authentication with database
        user = db.query(models.User).filter(models.User.email == token_data.email).first()
        if user is None:
            raise credentials_exception
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")
    
    return user 