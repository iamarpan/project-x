import json
import os
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException, Depends, status
from sqlalchemy.orm import Session

from . import models, crud, schemas, database

# Create a router for Clerk webhooks
router = APIRouter(
    prefix="/webhooks/clerk",
    tags=["webhooks"],
)

# Helper function to verify Clerk webhook signature
async def verify_clerk_webhook(request: Request):
    # Get the Clerk webhook secret from environment
    clerk_secret = os.getenv("CLERK_SECRET_KEY")
    if not clerk_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Clerk webhook secret not configured"
        )
    
    # Get the signature from header
    clerk_signature = request.headers.get("svix-signature")
    if not clerk_signature:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No signature found in request"
        )
    
    # Read the raw body
    body = await request.body()
    
    # Verify the signature
    signature_parts = clerk_signature.split(",")
    timestamp = None
    signature = None
    
    for part in signature_parts:
        key, value = part.split("=", 1)
        if key == "t":
            timestamp = value
        elif key == "v1":
            signature = value
    
    if not timestamp or not signature:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature format"
        )
    
    # Compute the expected signature
    message = f"{timestamp}.{body.decode('utf-8')}"
    expected_signature = hmac.new(
        clerk_secret.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Compare signatures
    if not hmac.compare_digest(expected_signature, signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature"
        )
    
    # Return the body so it can be used downstream
    return json.loads(body)

@router.post("")
async def clerk_webhook(
    data: dict = Depends(verify_clerk_webhook),
    db: Session = Depends(database.get_db)
):
    """
    Process Clerk webhook events to synchronize user data
    """
    event_type = data.get("type")
    
    # Handle user creation
    if event_type == "user.created":
        user_data = data.get("data", {})
        
        email_addresses = user_data.get("email_addresses", [])
        primary_email = next((email.get("email_address") for email in email_addresses if email.get("id") == user_data.get("primary_email_address_id")), None)
        
        if not primary_email:
            return {"status": "error", "message": "No primary email found"}
        
        # Check if user already exists
        db_user = crud.get_user_by_email(db, email=primary_email)
        if db_user:
            return {"status": "success", "message": "User already exists"}
        
        # Get first and last name
        first_name = user_data.get("first_name", "")
        last_name = user_data.get("last_name", "")
        
        # Create new user
        user_create = schemas.UserCreate(
            email=primary_email,
            password="",  # OAuth users don't need a password
            first_name=first_name,
            last_name=last_name,
            user_type="candidate",  # Default type, can be updated later
            oauth_provider="clerk",
            oauth_provider_id=user_data.get("id")
        )
        
        # Create user in our database
        crud.create_oauth_user(
            db=db,
            user=user_create,
            oauth_provider="clerk",
            oauth_provider_id=user_data.get("id")
        )
        
        return {"status": "success", "message": "User created successfully"}
    
    # Handle user update
    elif event_type == "user.updated":
        user_data = data.get("data", {})
        
        email_addresses = user_data.get("email_addresses", [])
        primary_email = next((email.get("email_address") for email in email_addresses if email.get("id") == user_data.get("primary_email_address_id")), None)
        
        if not primary_email:
            return {"status": "error", "message": "No primary email found"}
            
        # Get user by email
        db_user = crud.get_user_by_email(db, email=primary_email)
        if not db_user:
            return {"status": "error", "message": "User not found"}
        
        # Update user data
        db_user.first_name = user_data.get("first_name", db_user.first_name)
        db_user.last_name = user_data.get("last_name", db_user.last_name)
        
        # Check for user type in metadata
        metadata = user_data.get("public_metadata", {})
        user_type = metadata.get("userType")
        if user_type in ["recruiter", "candidate"]:
            db_user.user_type = user_type
        
        # Update image if available
        image_url = user_data.get("image_url")
        if image_url:
            db_user.profile_image = image_url
            
        # Save changes
        db.commit()
        
        return {"status": "success", "message": "User updated successfully"}
    
    # Handle user deletion
    elif event_type == "user.deleted":
        user_data = data.get("data", {})
        
        # Try to find by Clerk ID
        clerk_id = user_data.get("id")
        db_user = db.query(models.User).filter(models.User.oauth_provider == "clerk", models.User.oauth_provider_id == clerk_id).first()
        
        if db_user:
            # For data integrity, we might want to just deactivate rather than delete
            db_user.is_active = False
            db.commit()
            
            return {"status": "success", "message": "User deactivated successfully"}
    
    # Default response for unhandled events
    return {"status": "success", "message": f"Event {event_type} received but not processed"} 