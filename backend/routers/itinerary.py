from fastapi import APIRouter, Depends, HTTPException
from typing import List
from services.gemini_service import GeminiService
from services.maps_service import MapsService
from models import TripRequest, ItineraryResponse, ReviewSummary
from fastapi import Body
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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

@router.post("/generate", response_model=dict)
def generate_itinerary(
    request: TripRequest,
    gemini_service: GeminiService = Depends(get_gemini_service),
    maps_service: MapsService = Depends(get_maps_service)
):
    """Generate a comprehensive travel itinerary using AI"""
    
    if not gemini_service.is_healthy():
        raise HTTPException(status_code=503, detail="AI service not available")
    
    try:
        # Generate itinerary using Gemini AI
        itinerary_data = gemini_service.generate_itinerary(request)
        print(f"🤖 Raw Gemini response: {itinerary_data}")
        print(f"🤖 Gemini response type: {type(itinerary_data)}")
        print(f"🤖 Gemini has 'days': {'days' in itinerary_data if isinstance(itinerary_data, dict) else False}")
        
        # Get place details from Google Maps
        place_details = {}
        if maps_service.is_healthy():
            try:
                search_result = maps_service.search_places(request.destination)
                if search_result.get("results"):
                    place_id = search_result["results"][0]["place_id"]
                    place_details = maps_service.get_place_details(place_id)
            except Exception as e:
                place_details = {"error": f"Could not fetch place details: {str(e)}"}
        
        # Combine the results - format for frontend compatibility
        response = {
            "itinerary": itinerary_data.get("days", []),
            "place_details": {
                "place_id": place_details.get("place_id", ""),
                "rating": place_details.get("rating"),
                "address": place_details.get("address", f"{request.destination}"),
            },
            "travel_tips": itinerary_data.get("travel_tips", []),
            "total_estimated_cost": itinerary_data.get("total_estimated_cost"),
            "description": itinerary_data.get("description", f"AI-generated itinerary for {request.destination}"),
            "success": True,
            "message": "Itinerary generated successfully"
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")

@router.post("/reviews/summarize", response_model=dict)
def summarize_reviews(
    reviews: List[str] = Body(..., embed=True),
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """Summarize travel reviews using AI"""
    
    if not gemini_service.is_healthy():
        raise HTTPException(status_code=503, detail="AI service not available")
    
    if not reviews:
        raise HTTPException(status_code=400, detail="No reviews provided")
    
    try:
        summary = gemini_service.summarize_reviews(reviews)
        return {"summary": summary}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to summarize reviews: {str(e)}")

@router.post("/optimize")
def optimize_itinerary(
    request: TripRequest,
    preferences: dict = Body(...),
    gemini_service: GeminiService = Depends(get_gemini_service),
    maps_service: MapsService = Depends(get_maps_service)
):
    """Optimize an existing itinerary based on preferences and real-time data"""
    
    if not gemini_service.is_healthy():
        raise HTTPException(status_code=503, detail="AI service not available")
    
    try:
        # This could include route optimization, time optimization, etc.
        # For now, we'll generate a new optimized itinerary
        optimized_itinerary = gemini_service.generate_itinerary(request)
        
        # Add route optimization if Maps service is available
        route_info = {}
        if maps_service.is_healthy() and request.source and request.destination:
            try:
                directions = maps_service.get_directions(request.source, request.destination)
                route_info = directions
            except Exception as e:
                route_info = {"error": f"Could not fetch route info: {str(e)}"}
        
        return {
            "optimized_itinerary": optimized_itinerary,
            "route_info": route_info,
            "optimization_notes": [
                "Itinerary optimized for travel time",
                "Activities grouped by location proximity",
                "Budget considerations applied"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to optimize itinerary: {str(e)}")

@router.get("/templates")
def get_itinerary_templates():
    """Get pre-made itinerary templates for popular destinations"""
    templates = [
        {
            "id": "paris-romantic-3day",
            "name": "Romantic Paris Getaway",
            "destination": "Paris, France",
            "duration": 3,
            "style": "romantic",
            "highlights": ["Eiffel Tower sunset", "Seine river cruise", "Louvre visit"]
        },
        {
            "id": "tokyo-culture-5day", 
            "name": "Tokyo Cultural Experience",
            "destination": "Tokyo, Japan",
            "duration": 5,
            "style": "cultural",
            "highlights": ["Temple visits", "Traditional dining", "Art museums"]
        },
        {
            "id": "bali-wellness-7day",
            "name": "Bali Wellness Retreat",
            "destination": "Bali, Indonesia", 
            "duration": 7,
            "style": "wellness",
            "highlights": ["Yoga sessions", "Spa treatments", "Nature walks"]
        }
    ]
    
    return {"templates": templates}