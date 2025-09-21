from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
import uuid
from datetime import datetime, timedelta
import jwt
from models import User, UserProfile

router = APIRouter()

# Mock user storage (in production, use a proper database)
users_db = {}
sessions_db = {}

# JWT settings (in production, use proper secrets)
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@router.post("/register")
def register_user(name: str, email: str, location: Optional[str] = None):
    """Register a new user"""
    user_id = str(uuid.uuid4())
    
    # Check if user already exists (by email)
    for uid, user_data in users_db.items():
        if user_data.get("email") == email:
            raise HTTPException(status_code=400, detail="User already exists")
    
    # Create user profile
    initials = "".join([word[0].upper() for word in name.split()[:2]])
    profile = UserProfile(
        name=name,
        initials=initials,
        location=location
    )
    
    user = User(id=user_id, profile=profile)
    
    # Store user data
    users_db[user_id] = {
        "id": user_id,
        "email": email,
        "profile": profile.dict(),
        "created_at": datetime.now(),
        "last_login": None
    }
    
    return {
        "user": user,
        "message": "User registered successfully"
    }

@router.post("/login")
def login_user(email: str):
    """Simple login by email (in production, add proper authentication)"""
    # Find user by email
    user_data = None
    user_id = None
    
    for uid, data in users_db.items():
        if data.get("email") == email:
            user_data = data
            user_id = uid
            break
    
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update last login
    user_data["last_login"] = datetime.now()
    
    # Create access token
    access_token_expires = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": user_id, "exp": access_token_expires},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    # Store session
    session_id = str(uuid.uuid4())
    sessions_db[session_id] = {
        "user_id": user_id,
        "access_token": access_token,
        "expires_at": access_token_expires
    }
    
    # Create user object
    profile = UserProfile(**user_data["profile"])
    user = User(id=user_id, profile=profile)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
        "session_id": session_id
    }

@router.get("/profile/{user_id}")
def get_user_profile(user_id: str):
    """Get user profile information"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = users_db[user_id]
    profile = UserProfile(**user_data["profile"])
    user = User(id=user_id, profile=profile)
    
    return {
        "user": user,
        "created_at": user_data["created_at"],
        "last_login": user_data["last_login"]
    }

@router.put("/profile/{user_id}")
def update_user_profile(user_id: str, name: Optional[str] = None, location: Optional[str] = None):
    """Update user profile"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = users_db[user_id]
    profile_data = user_data["profile"]
    
    # Update fields if provided
    if name:
        profile_data["name"] = name
        profile_data["initials"] = "".join([word[0].upper() for word in name.split()[:2]])
    
    if location:
        profile_data["location"] = location
    
    # Save updated data
    users_db[user_id]["profile"] = profile_data
    
    # Return updated user
    profile = UserProfile(**profile_data)
    user = User(id=user_id, profile=profile)
    
    return {
        "user": user,
        "message": "Profile updated successfully"
    }

@router.post("/logout")
def logout_user(session_id: str):
    """Logout user and invalidate session"""
    if session_id in sessions_db:
        del sessions_db[session_id]
    
    return {"message": "Logged out successfully"}

@router.get("/verify-token")
def verify_token(token: str):
    """Verify if an access token is valid"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        
        if user_id and user_id in users_db:
            user_data = users_db[user_id]
            profile = UserProfile(**user_data["profile"])
            user = User(id=user_id, profile=profile)
            
            return {
                "valid": True,
                "user": user
            }
        else:
            return {"valid": False}
            
    except jwt.ExpiredSignatureError:
        return {"valid": False, "error": "Token expired"}
    except jwt.JWTError:
        return {"valid": False, "error": "Invalid token"}

# Dependency for authenticated routes
def get_current_user(token: str):
    """Get current user from token (for use as dependency)"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        
        if user_id and user_id in users_db:
            user_data = users_db[user_id]
            profile = UserProfile(**user_data["profile"])
            return User(id=user_id, profile=profile)
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")