from authlib.integrations.starlette_client import OAuth
from fastapi import Request, HTTPException, status
from starlette.config import Config
import os
import json
from typing import Dict, Any, Optional

from .database import get_db
from . import models, crud, schemas, auth
from sqlalchemy.orm import Session

# Load configuration
config = Config(".env")
oauth = OAuth(config)

# Register OAuth providers
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID", ""),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET", ""),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

oauth.register(
    name="twitter",  # X/Twitter
    client_id=os.getenv("TWITTER_CLIENT_ID", ""),
    client_secret=os.getenv("TWITTER_CLIENT_SECRET", ""),
    client_kwargs={"scope": "tweet.read users.read"},
    api_base_url="https://api.twitter.com/2/",
    access_token_url="https://api.twitter.com/2/oauth2/token",
    authorize_url="https://twitter.com/i/oauth2/authorize",
)

oauth.register(
    name="linkedin",
    client_id=os.getenv("LINKEDIN_CLIENT_ID", ""),
    client_secret=os.getenv("LINKEDIN_CLIENT_SECRET", ""),
    api_base_url="https://api.linkedin.com/v2/",
    access_token_url="https://www.linkedin.com/oauth/v2/accessToken",
    authorize_url="https://www.linkedin.com/oauth/v2/authorization",
    client_kwargs={"scope": "r_liteprofile r_emailaddress"},
)

async def get_oauth_user_info(provider: str, request: Request) -> Dict[str, Any]:
    """Get user info from OAuth provider after successful authentication"""
    token = await oauth.get(provider).authorize_access_token(request)
    
    if provider == "google":
        user_info = token.get('userinfo')
        if not user_info:
            # If userinfo not included in token, make a separate request
            user_info = await oauth.google.parse_id_token(request, token)
        return {
            "email": user_info["email"],
            "first_name": user_info.get("given_name", ""),
            "last_name": user_info.get("family_name", ""),
            "profile_image": user_info.get("picture", None),
            "provider_id": user_info["sub"],
            "provider": "google"
        }
    
    elif provider == "twitter":
        # Get user data from Twitter
        resp = await oauth.twitter.get("users/me", token=token)
        user_data = resp.json().get("data", {})
        
        # Use username for now, Twitter OAuth2 doesn't return email by default
        return {
            "email": f"{user_data.get('username', '')}@twitter.placeholder",
            "first_name": user_data.get("name", "").split(" ")[0],
            "last_name": " ".join(user_data.get("name", "").split(" ")[1:]),
            "profile_image": user_data.get("profile_image_url", None),
            "provider_id": user_data.get("id"),
            "provider": "twitter"
        }
    
    elif provider == "linkedin":
        # Get profile data
        resp = await oauth.linkedin.get("me", token=token)
        profile_data = resp.json()
        
        # Get email in a separate request
        email_resp = await oauth.linkedin.get("emailAddress?q=members&projection=(elements*(handle~))", token=token)
        email_data = email_resp.json()
        
        email = email_data.get("elements", [{}])[0].get("handle~", {}).get("emailAddress", "")
        
        return {
            "email": email,
            "first_name": profile_data.get("localizedFirstName", ""),
            "last_name": profile_data.get("localizedLastName", ""),
            "profile_image": None,  # LinkedIn API requires a separate call for this
            "provider_id": profile_data.get("id"),
            "provider": "linkedin"
        }
    
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported provider: {provider}"
        )

async def get_or_create_oauth_user(
    user_info: Dict[str, Any], 
    db: Session,
    user_type: str = "candidate"
) -> models.User:
    """Get existing user or create a new one from OAuth user info"""
    # Check if user exists by email
    db_user = crud.get_user_by_email(db, email=user_info["email"])
    
    if db_user:
        # Update OAuth provider info if not already set
        if not db_user.oauth_provider:
            db_user.oauth_provider = user_info["provider"]
            db_user.oauth_provider_id = user_info["provider_id"]
            db.commit()
            db.refresh(db_user)
        return db_user
    
    # Create new user from OAuth info
    user_create = schemas.UserCreate(
        email=user_info["email"],
        password="", # No password for OAuth users
        first_name=user_info["first_name"],
        last_name=user_info["last_name"],
        profile_image=user_info.get("profile_image"),
        user_type=user_type,
    )
    
    # Create user with OAuth provider info
    db_user = crud.create_oauth_user(
        db=db, 
        user=user_create, 
        oauth_provider=user_info["provider"],
        oauth_provider_id=user_info["provider_id"]
    )
    
    return db_user 