from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Optional
from services.maps_service import MapsService
from services.gemini_service import GeminiService
from models import Destination, SavedTrip, User, UserProfile

router = APIRouter()

def get_maps_service() -> MapsService:
    return MapsService()

def get_gemini_service() -> GeminiService:
    return GeminiService()

# Sample destination data with UHD images for the frontend
DESTINATIONS_DATA = [
    {
        "id": "paris-france",
        "name": "Paris, France",
        "country": "France",
        "description": "The City of Light, known for its art, fashion, gastronomy, and culture.",
        "images": {
            "hero": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=3840&h=2160&fit=crop&auto=format&q=95",
            "slideshow": [
                "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1539650116574-75c0c6d41b12?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&auto=format&q=95"
        },
        "videos": {
            "hero": "https://sample-videos.com/zip/10/mp4/720/mp4/SampleVideo_720x480_1mb.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&auto=format&q=95"
        },
        "rating": 4.8,
        "tags": ["Culture", "Art", "Romance", "History"],
        "highlights": ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Seine River"],
        "best_time_to_visit": "April to June, September to October",
        "estimated_cost": {"budget": "$$", "range": "1500-2500"}
    },
    {
        "id": "tokyo-japan",
        "name": "Tokyo, Japan",
        "country": "Japan",
        "description": "A vibrant metropolis blending traditional culture with cutting-edge technology.",
        "images": {
            "hero": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=3840&h=2160&fit=crop&auto=format&q=95",
            "slideshow": [
                "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&auto=format&q=95"
        },
        "videos": {
            "hero": "https://sample-videos.com/zip/10/mp4/720/mp4/SampleVideo_720x480_1mb.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&auto=format&q=95"
        },
        "rating": 4.7,
        "tags": ["Technology", "Culture", "Food", "Modern"],
        "highlights": ["Shibuya Crossing", "Tokyo Tower", "Sensoji Temple", "Tsukiji Market"],
        "best_time_to_visit": "March to May, September to November",
        "estimated_cost": {"budget": "$$$", "range": "2000-3500"}
    },
    {
        "id": "santorini-greece",
        "name": "Santorini, Greece",
        "country": "Greece",
        "description": "A stunning island known for its white-washed buildings and breathtaking sunsets.",
        "images": {
            "hero": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=3840&h=2160&fit=crop&auto=format&q=95",
            "slideshow": [
                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop&auto=format&q=95"
        },
        "videos": {
            "hero": "https://sample-videos.com/zip/10/mp4/720/mp4/SampleVideo_720x480_1mb.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop&auto=format&q=95"
        },
        "rating": 4.9,
        "tags": ["Romance", "Sunset", "Architecture", "Island"],
        "highlights": ["Oia Village", "Red Beach", "Blue Dome Churches", "Wine Tasting"],
        "best_time_to_visit": "April to early November",
        "estimated_cost": {"budget": "$$", "range": "1800-3000"}
    },
    {
        "id": "bali-indonesia",
        "name": "Bali, Indonesia",
        "country": "Indonesia",
        "description": "A tropical paradise known for its rice terraces, temples, and vibrant culture.",
        "images": {
            "hero": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=3840&h=2160&fit=crop&auto=format&q=95",
            "slideshow": [
                "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1558007385-37f5ac7c7fca?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop&auto=format&q=95"
        },
        "videos": {
            "hero": "https://sample-videos.com/zip/10/mp4/720/mp4/SampleVideo_720x480_1mb.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&auto=format&q=95"
        },
        "rating": 4.6,
        "tags": ["Tropical", "Culture", "Wellness", "Adventure"],
        "highlights": ["Tegallalang Rice Terraces", "Uluwatu Temple", "Mount Batur", "Ubud"],
        "best_time_to_visit": "April to October",
        "estimated_cost": {"budget": "$", "range": "800-1500"}
    },
    {
        "id": "new-york-usa",
        "name": "New York City, USA",
        "country": "United States",
        "description": "The city that never sleeps, filled with iconic landmarks and endless possibilities.",
        "images": {
            "hero": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=3840&h=2160&fit=crop&auto=format&q=95",
            "slideshow": [
                "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&auto=format&q=95"
        },
        "videos": {
            "hero": "https://sample-videos.com/zip/10/mp4/720/mp4/SampleVideo_720x480_1mb.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop&auto=format&q=95"
        },
        "rating": 4.5,
        "tags": ["Urban", "Entertainment", "Shopping", "Museums"],
        "highlights": ["Statue of Liberty", "Central Park", "Times Square", "Brooklyn Bridge"],
        "best_time_to_visit": "April to June, September to November",
        "estimated_cost": {"budget": "$$$", "range": "2500-4000"}
    }
]

# Sample popular trips data
POPULAR_TRIPS_DATA = [
    {
        "id": "sarah-iceland-adventure",
        "user": {
            "name": "Sarah Johnson",
            "avatar": "/man-profile.png",
            "initials": "SJ",
            "location": "San Francisco, CA"
        },
        "destination": "Iceland",
        "duration": "8 days",
        "group_size": 4,
        "highlights": ["Northern Lights", "Blue Lagoon", "Golden Circle tour"],
        "date": "1 week ago",
        "rating": 5,
        "review": "Breathtaking landscapes and the Northern Lights were absolutely stunning!"
    },
    {
        "id": "emma-bali-retreat",
        "user": {
            "name": "Emma Rodriguez",
            "avatar": "/woman-profile-photo-2.png",
            "initials": "ER",
            "location": "Austin, TX"
        },
        "destination": "Bali, Indonesia",
        "duration": "10 days",
        "group_size": 1,
        "highlights": ["Yoga retreats", "Rice terrace tours", "Beach relaxation"],
        "date": "3 weeks ago",
        "rating": 4,
        "review": "Perfect for a wellness retreat. The rice terraces were absolutely beautiful!"
    }
]

@router.get("/", response_model=dict)
def get_destinations(
    limit: int = Query(default=10, ge=1, le=50),
    search: Optional[str] = Query(default=None),
    maps_service: MapsService = Depends(get_maps_service)
):
    """Get popular destinations with optional search and limit"""
    destinations = DESTINATIONS_DATA.copy()
    
    # Apply search filter if provided
    if search:
        search_lower = search.lower()
        destinations = [
            dest for dest in destinations 
            if search_lower in dest["name"].lower() or 
               search_lower in dest["country"].lower() or
               any(search_lower in tag.lower() for tag in dest["tags"])
        ]
    
    # Apply limit
    destinations = destinations[:limit]
    
    return {
        "destinations": destinations,
        "total": len(destinations),
        "search": search,
        "limit": limit
    }

@router.get("/popular", response_model=dict)
def get_popular_destinations(
    limit: int = Query(default=5, ge=1, le=20),
    maps_service: MapsService = Depends(get_maps_service)
):
    """Get most popular destinations for video carousel"""
    # Sort by rating and return top destinations
    popular_destinations = sorted(DESTINATIONS_DATA, key=lambda x: x["rating"], reverse=True)[:limit]
    
    return {
        "success": True,
        "data": popular_destinations,
        "total": len(popular_destinations),
        "limit": limit
    }

@router.get("/{destination_id}", response_model=dict)
def get_destination_details(
    destination_id: str,
    gemini_service: GeminiService = Depends(get_gemini_service),
    maps_service: MapsService = Depends(get_maps_service)
):
    """Get detailed information about a specific destination"""
    # Find destination in our data
    destination = next((dest for dest in DESTINATIONS_DATA if dest["id"] == destination_id), None)
    
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    # Get AI-powered insights if Gemini is available
    ai_insights = {}
    if gemini_service.is_healthy():
        try:
            ai_insights = gemini_service.get_destination_insights(destination["name"])
        except Exception as e:
            ai_insights = {"error": f"Could not fetch AI insights: {str(e)}"}
    
    # Get place details from Google Maps if available
    place_details = {}
    if maps_service.is_healthy():
        try:
            search_result = maps_service.search_places(destination["name"])
            if search_result.get("results"):
                place_id = search_result["results"][0]["place_id"]
                place_details = maps_service.get_place_details(place_id)
        except Exception as e:
            place_details = {"error": f"Could not fetch place details: {str(e)}"}
    
    return {
        "destination": destination,
        "ai_insights": ai_insights,
        "place_details": place_details
    }

@router.get("/search/nearby")
def search_nearby_attractions(
    location: str = Query(..., description="Location to search around"),
    radius: int = Query(default=5000, ge=100, le=50000),
    place_type: str = Query(default="tourist_attraction"),
    maps_service: MapsService = Depends(get_maps_service)
):
    """Search for nearby attractions around a location"""
    if not maps_service.is_healthy():
        raise HTTPException(status_code=503, detail="Google Maps service not available")
    
    try:
        results = maps_service.nearby_search(location, radius, place_type)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/trips/popular")
def get_popular_trips():
    """Get popular trips shared by other users"""
    return {"trips": POPULAR_TRIPS_DATA}

@router.get("/trips/recent")
def get_recent_trips():
    """Get recent trips from users"""
    return {"trips": POPULAR_TRIPS_DATA}