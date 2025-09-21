from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel
from services.gemini_service import GeminiService
from services.maps_service import MapsService
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize services
gemini_service = GeminiService()
maps_service = MapsService()

class HotelSearchRequest(BaseModel):
    destination: str
    budget: Optional[str] = "medium"  # budget, medium, luxury
    guests: Optional[int] = 2
    duration: Optional[int] = 3
    preferences: Optional[List[str]] = []

class HotelAmenity(BaseModel):
    name: str
    available: bool

class HotelLocation(BaseModel):
    address: str
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Hotel(BaseModel):
    id: str
    name: str
    description: str
    location: HotelLocation
    rating: float
    reviewCount: int
    pricePerNight: dict  # {"amount": 150, "currency": "USD"}
    images: List[str]
    amenities: List[HotelAmenity]
    category: str  # budget, mid-range, luxury

@router.get("/recommendations")
async def get_hotel_recommendations(
    destination: str = Query(..., description="Destination city or location"),
    budget: str = Query("medium", description="Budget level: budget, medium, luxury"),
    guests: int = Query(2, description="Number of guests"),
    duration: int = Query(3, description="Duration of stay in days")
):
    """Get AI-powered hotel recommendations for a destination"""
    try:
        # Create hotel search request
        search_request = HotelSearchRequest(
            destination=destination,
            budget=budget,
            guests=guests,
            duration=duration
        )
        
        # Generate hotel recommendations using AI
        hotels = await generate_hotel_recommendations(search_request)
        
        return {
            "success": True,
            "data": hotels,
            "destination": destination,
            "total_hotels": len(hotels)
        }
        
    except Exception as e:
        logger.error(f"Error getting hotel recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def generate_hotel_recommendations(search_request: HotelSearchRequest) -> List[Hotel]:
    """Generate hotel recommendations using Gemini AI"""
    
    if not gemini_service.is_healthy():
        # Return fallback hotels if AI is not available
        return create_fallback_hotels(search_request.destination, search_request.budget)
    
    # Build comprehensive prompt for hotel recommendations
    prompt = f"""
You are a travel expert specializing in hotel recommendations. Generate a list of 6-8 hotels for the following trip:

**Trip Details:**
- Destination: {search_request.destination}
- Budget Level: {search_request.budget}
- Number of Guests: {search_request.guests}
- Duration: {search_request.duration} days
- Preferences: {', '.join(search_request.preferences) if search_request.preferences else 'None specified'}

**Instructions:**
1. Recommend diverse hotel options across different price ranges within the budget level
2. Include mix of hotel types (business, boutique, resort, etc.)
3. Consider location convenience and local attractions
4. Provide realistic pricing and amenities
5. Include variety in neighborhoods/areas

**Response Format (MUST be valid JSON):**
{{
    "hotels": [
        {{
            "id": "hotel_1",
            "name": "Hotel Name",
            "description": "Brief description highlighting unique features and location benefits",
            "location": {{
                "address": "Full street address",
                "city": "{search_request.destination}",
                "latitude": 0.0,
                "longitude": 0.0
            }},
            "rating": 4.5,
            "reviewCount": 1250,
            "pricePerNight": {{
                "amount": 150,
                "currency": "USD"
            }},
            "images": [
                "https://example.com/hotel1-exterior.jpg",
                "https://example.com/hotel1-room.jpg",
                "https://example.com/hotel1-amenity.jpg"
            ],
            "amenities": [
                {{"name": "Free WiFi", "available": true}},
                {{"name": "Pool", "available": true}},
                {{"name": "Gym", "available": true}},
                {{"name": "Restaurant", "available": true}},
                {{"name": "Spa", "available": false}},
                {{"name": "Parking", "available": true}},
                {{"name": "Bar", "available": true}}
            ],
            "category": "mid-range"
        }}
    ]
}}

Budget Guidelines:
- Budget: $50-100/night, basic amenities, good location
- Medium: $100-250/night, quality amenities, prime location
- Luxury: $250+/night, premium amenities, exceptional service

Make sure the response is ONLY valid JSON without any additional text before or after.
"""

    try:
        response = gemini_service.client.generate_content(prompt)
        hotels_text = response.text
        
        # Parse the JSON response from Gemini
        json_start = hotels_text.find('{')
        json_end = hotels_text.rfind('}') + 1
        
        if json_start != -1 and json_end != 0:
            json_text = hotels_text[json_start:json_end]
            try:
                hotels_data = json.loads(json_text)
                
                # Convert to Hotel objects
                hotels = []
                for hotel_dict in hotels_data.get('hotels', []):
                    try:
                        hotel = Hotel(
                            id=hotel_dict['id'],
                            name=hotel_dict['name'],
                            description=hotel_dict['description'],
                            location=HotelLocation(**hotel_dict['location']),
                            rating=hotel_dict['rating'],
                            reviewCount=hotel_dict['reviewCount'],
                            pricePerNight=hotel_dict['pricePerNight'],
                            images=hotel_dict['images'],
                            amenities=[HotelAmenity(**amenity) for amenity in hotel_dict['amenities']],
                            category=hotel_dict['category']
                        )
                        hotels.append(hotel)
                    except Exception as e:
                        logger.warning(f"Failed to parse hotel: {e}")
                        continue
                
                if hotels:
                    logger.info(f"Generated {len(hotels)} hotel recommendations for {search_request.destination}")
                    return hotels
                        
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {e}")
                
        # Fallback if AI parsing fails
        return create_fallback_hotels(search_request.destination, search_request.budget)
        
    except Exception as e:
        logger.error(f"Error generating hotel recommendations: {e}")
        return create_fallback_hotels(search_request.destination, search_request.budget)

def create_fallback_hotels(destination: str, budget: str) -> List[Hotel]:
    """Create fallback hotel recommendations when AI is unavailable"""
    
    # Determine price range based on budget
    price_ranges = {
        "budget": (60, 100),
        "medium": (120, 200),
        "luxury": (250, 500)
    }
    min_price, max_price = price_ranges.get(budget, (120, 200))
    
    fallback_hotels = [
        {
            "id": f"fallback_hotel_1_{destination.lower().replace(' ', '_')}",
            "name": f"Grand {destination} Hotel",
            "description": f"A centrally located hotel in the heart of {destination} with modern amenities and excellent service.",
            "location": {
                "address": f"123 Main Street, {destination}",
                "city": destination,
                "latitude": 0.0,
                "longitude": 0.0
            },
            "rating": 4.2,
            "reviewCount": 1180,
            "pricePerNight": {"amount": min_price + 40, "currency": "USD"},
            "images": ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
            "amenities": [
                {"name": "Free WiFi", "available": True},
                {"name": "Restaurant", "available": True},
                {"name": "Gym", "available": True},
                {"name": "Parking", "available": True}
            ],
            "category": budget
        },
        {
            "id": f"fallback_hotel_2_{destination.lower().replace(' ', '_')}",
            "name": f"{destination} Plaza",
            "description": f"Modern hotel offering comfort and convenience with easy access to {destination}'s attractions.",
            "location": {
                "address": f"456 Center Ave, {destination}",
                "city": destination,
                "latitude": 0.0,
                "longitude": 0.0
            },
            "rating": 4.5,
            "reviewCount": 950,
            "pricePerNight": {"amount": min_price + 60, "currency": "USD"},
            "images": ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
            "amenities": [
                {"name": "Free WiFi", "available": True},
                {"name": "Pool", "available": True},
                {"name": "Bar", "available": True},
                {"name": "Spa", "available": budget == "luxury"}
            ],
            "category": budget
        },
        {
            "id": f"fallback_hotel_3_{destination.lower().replace(' ', '_')}",
            "name": f"Boutique {destination}",
            "description": f"Charming boutique hotel with personalized service and unique character in {destination}.",
            "location": {
                "address": f"789 Historic District, {destination}",
                "city": destination,
                "latitude": 0.0,
                "longitude": 0.0
            },
            "rating": 4.7,
            "reviewCount": 680,
            "pricePerNight": {"amount": max_price - 20, "currency": "USD"},
            "images": ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
            "amenities": [
                {"name": "Free WiFi", "available": True},
                {"name": "Restaurant", "available": True},
                {"name": "Bar", "available": True},
                {"name": "Parking", "available": False}
            ],
            "category": budget
        }
    ]
    
    # Convert to Hotel objects
    hotels = []
    for hotel_dict in fallback_hotels:
        hotel = Hotel(
            id=hotel_dict['id'],
            name=hotel_dict['name'],
            description=hotel_dict['description'],
            location=HotelLocation(**hotel_dict['location']),
            rating=hotel_dict['rating'],
            reviewCount=hotel_dict['reviewCount'],
            pricePerNight=hotel_dict['pricePerNight'],
            images=hotel_dict['images'],
            amenities=[HotelAmenity(**amenity) for amenity in hotel_dict['amenities']],
            category=hotel_dict['category']
        )
        hotels.append(hotel)
    
    return hotels