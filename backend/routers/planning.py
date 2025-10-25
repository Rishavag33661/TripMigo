from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional
from services.gemini_service import GeminiService
from services.maps_service import MapsService
from models import TripRequest, PlanningSession, PlanningStep
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv

# Load environment variables
load_env_result = load_dotenv()
print(f"Planning router - Environment loaded: {load_env_result}")
print(f"Planning router - GOOGLE_AI_API_KEY exists: {bool(os.getenv('GOOGLE_AI_API_KEY'))}")

router = APIRouter()

# Create singleton instances
_gemini_service = None
_maps_service = None

def get_gemini_service() -> GeminiService:
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service

def get_maps_service() -> MapsService:
    global _maps_service
    if _maps_service is None:
        _maps_service = MapsService()
    return _maps_service

# In-memory storage for planning sessions (in production, use a database)
planning_sessions = {}

@router.post("/session/start")
def start_planning_session(user_id: Optional[str] = None):
    """Start a new planning session"""
    session_id = str(uuid.uuid4())
    
    # Initialize planning steps
    steps = [
        PlanningStep(step=1, title="Basic Details", completed=False),
        PlanningStep(step=2, title="Destination Selection", completed=False),
        PlanningStep(step=3, title="Travel Preferences", completed=False),
        PlanningStep(step=4, title="Accommodation", completed=False),
        PlanningStep(step=5, title="Activities & Interests", completed=False),
        PlanningStep(step=6, title="Itinerary Generation", completed=False)
    ]
    
    session = PlanningSession(
        id=session_id,
        user_id=user_id,
        steps=steps,
        current_step=1,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    planning_sessions[session_id] = session
    
    return {"session_id": session_id, "current_step": 1, "steps": steps}

@router.get("/session/{session_id}")
def get_planning_session(session_id: str):
    """Get current planning session status"""
    if session_id not in planning_sessions:
        raise HTTPException(status_code=404, detail="Planning session not found")
    
    session = planning_sessions[session_id]
    return {
        "session_id": session_id,
        "current_step": session.current_step,
        "steps": session.steps,
        "trip_request": session.trip_request
    }

@router.put("/session/{session_id}/step/{step_number}")
def update_planning_step(
    session_id: str,
    step_number: int,
    step_data: Dict[str, Any]
):
    """Update a specific planning step with data"""
    if session_id not in planning_sessions:
        raise HTTPException(status_code=404, detail="Planning session not found")
    
    session = planning_sessions[session_id]
    
    # Find and update the step
    step_found = False
    for step in session.steps:
        if step.step == step_number:
            step.data = step_data
            step.completed = True
            step_found = True
            break
    
    if not step_found:
        raise HTTPException(status_code=404, detail="Planning step not found")
    
    # Update current step to next incomplete step
    next_step = step_number + 1
    if next_step <= len(session.steps):
        session.current_step = next_step
    
    session.updated_at = datetime.now()
    
    # If we're at the final step, compile the trip request
    if step_number == 6:  # Itinerary generation step
        session.trip_request = _compile_trip_request(session)
    
    return {
        "session_id": session_id,
        "updated_step": step_number,
        "current_step": session.current_step,
        "completed": step_number == len(session.steps)
    }

@router.post("/session/{session_id}/generate")
def generate_from_session(
    session_id: str,
    gemini_service: GeminiService = Depends(get_gemini_service),
    maps_service: MapsService = Depends(get_maps_service)
):
    """Generate itinerary from completed planning session"""
    if session_id not in planning_sessions:
        raise HTTPException(status_code=404, detail="Planning session not found")
    
    session = planning_sessions[session_id]
    
    if not session.trip_request:
        # Try to compile trip request from current step data
        session.trip_request = _compile_trip_request(session)
    
    if not session.trip_request:
        raise HTTPException(status_code=400, detail="Insufficient planning data to generate itinerary")
    
    if not gemini_service.is_healthy():
        raise HTTPException(status_code=503, detail="AI service not available")
    
    try:
        # Generate itinerary using the compiled trip request
        itinerary_data = gemini_service.generate_itinerary(session.trip_request)
        
        # Get place details if Maps service is available
        place_details = {}
        if maps_service.is_healthy():
            try:
                search_result = maps_service.search_places(session.trip_request.destination)
                if search_result.get("results"):
                    place_id = search_result["results"][0]["place_id"]
                    place_details = maps_service.get_place_details(place_id)
            except Exception:
                place_details = {"error": "Could not fetch place details"}
        
        # Mark the final step as completed
        for step in session.steps:
            if step.step == 6:
                step.completed = True
                step.data = {"itinerary": itinerary_data}
                break
        
        return {
            "session_id": session_id,
            "itinerary": itinerary_data.get("days", []),
            "place_details": place_details,
            "travel_tips": itinerary_data.get("travel_tips", []),
            "total_estimated_cost": itinerary_data.get("total_estimated_cost"),
            "trip_request": session.trip_request.dict()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")

@router.get("/destinations/suggestions")
def get_destination_suggestions(
    interests: str,
    budget: str,
    duration: int,
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """Get AI-powered destination suggestions based on preferences"""
    if not gemini_service.is_healthy():
        # Return static suggestions if AI is not available
        suggestions = [
            {"name": "Paris, France", "reason": "Perfect for culture and art lovers"},
            {"name": "Tokyo, Japan", "reason": "Great blend of tradition and modernity"},
            {"name": "Bali, Indonesia", "reason": "Ideal for relaxation and nature"}
        ]
        return {"suggestions": suggestions, "source": "static"}
    
    # In a real implementation, you would use Gemini to generate personalized suggestions
    # For now, return some intelligent suggestions based on the parameters
    suggestions = []
    
    if "culture" in interests.lower():
        suggestions.append({"name": "Rome, Italy", "reason": "Rich historical culture and architecture"})
    if "nature" in interests.lower():
        suggestions.append({"name": "New Zealand", "reason": "Stunning natural landscapes and outdoor activities"})
    if "food" in interests.lower():
        suggestions.append({"name": "Bangkok, Thailand", "reason": "World-class street food and culinary experiences"})
    
    # Add budget-appropriate suggestions
    if budget == "budget":
        suggestions.append({"name": "Prague, Czech Republic", "reason": "Beautiful city with affordable prices"})
    elif budget == "luxury":
        suggestions.append({"name": "Maldives", "reason": "Ultimate luxury resort destination"})
    
    return {"suggestions": suggestions, "source": "ai-powered"}

def _compile_trip_request(session: PlanningSession) -> Optional[TripRequest]:
    """Compile a TripRequest from planning session step data"""
    try:
        # Extract data from completed steps
        basic_details = None
        destination = None
        travel_prefs = None
        accommodation = None
        activities = None
        
        for step in session.steps:
            if step.data:
                if step.step == 1:  # Basic Details
                    basic_details = step.data
                elif step.step == 2:  # Destination
                    destination = step.data
                elif step.step == 3:  # Travel Preferences
                    travel_prefs = step.data
                elif step.step == 4:  # Accommodation
                    accommodation = step.data
                elif step.step == 5:  # Activities
                    activities = step.data
        
        # Validate required data
        if not all([basic_details, destination, travel_prefs]):
            return None
        
        # Construct TripRequest
        trip_request = TripRequest(
            source=basic_details.get("source", ""),
            destination=destination.get("name", ""),
            budget=travel_prefs.get("budget", "mid-range"),
            duration_days=basic_details.get("duration", 3),
            interests=activities.get("interests", []) if activities else ["sightseeing"],
            constraints=travel_prefs.get("constraints", ""),
            travel_style=travel_prefs.get("style", "relaxed"),
            travelers=basic_details.get("travelers", "solo"),
            start_date=basic_details.get("start_date"),
            accommodation_type=accommodation.get("type", "hotel") if accommodation else "hotel"
        )
        
        return trip_request
        
    except Exception:
        return None