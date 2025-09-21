from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

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
    """Get hotel recommendations for a destination"""
    try:
        # For now, return mock hotels until we can test the basic setup
        hotels = create_mock_hotels(destination, budget)
        
        return {
            "success": True,
            "data": hotels,
            "destination": destination,
            "total_hotels": len(hotels)
        }
        
    except Exception as e:
        logger.error(f"Error getting hotel recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def create_mock_hotels(destination: str, budget: str) -> List[Hotel]:
    """Create mock hotel recommendations for testing"""
    
    # Determine price range based on budget
    price_ranges = {
        "budget": (60, 100),
        "medium": (120, 200),
        "luxury": (250, 500)
    }
    min_price, max_price = price_ranges.get(budget, (120, 200))
    
    mock_hotels = [
        {
            "id": f"hotel_1_{destination.lower().replace(' ', '_')}",
            "name": f"Grand {destination} Hotel",
            "description": f"A centrally located hotel in the heart of {destination} with modern amenities and excellent service.",
            "location": {
                "address": f"123 Main Street, {destination}",
                "city": destination,
                "latitude": 48.8566,
                "longitude": 2.3522
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
            "id": f"hotel_2_{destination.lower().replace(' ', '_')}",
            "name": f"{destination} Plaza",
            "description": f"Modern hotel offering comfort and convenience with easy access to {destination}'s attractions.",
            "location": {
                "address": f"456 Center Ave, {destination}",
                "city": destination,
                "latitude": 48.8606,
                "longitude": 2.3376
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
            "id": f"hotel_3_{destination.lower().replace(' ', '_')}",
            "name": f"Boutique {destination}",
            "description": f"Charming boutique hotel with personalized service and unique character in {destination}.",
            "location": {
                "address": f"789 Historic District, {destination}",
                "city": destination,
                "latitude": 48.8534,
                "longitude": 2.3488
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
        },
        {
            "id": f"hotel_4_{destination.lower().replace(' ', '_')}",
            "name": f"{destination} Business Hotel",
            "description": f"Perfect for business travelers with modern facilities and excellent connectivity in {destination}.",
            "location": {
                "address": f"321 Business District, {destination}",
                "city": destination,
                "latitude": 48.8656,
                "longitude": 2.3212
            },
            "rating": 4.3,
            "reviewCount": 890,
            "pricePerNight": {"amount": min_price + 80, "currency": "USD"},
            "images": ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
            "amenities": [
                {"name": "Free WiFi", "available": True},
                {"name": "Business Center", "available": True},
                {"name": "Gym", "available": True},
                {"name": "Restaurant", "available": True}
            ],
            "category": budget
        }
    ]
    
    # Convert to Hotel objects
    hotels = []
    for hotel_dict in mock_hotels:
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