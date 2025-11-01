from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel
from services.gemini_service import GeminiService
from services.maps_service import MapsService
import json
import logging
import os

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

def get_hotel_images_from_maps(hotel_name: str, destination: str) -> List[str]:
    """Get hotel images from Google Maps Places API - simplified version"""
    try:
        # Check if Google Maps API key is configured
        maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        if not maps_api_key:
            logger.warning(f"GOOGLE_MAPS_API_KEY not configured, using fallback images for {hotel_name}")
            return get_fallback_images()
            
        if not maps_service.is_healthy():
            logger.warning(f"Maps service not healthy for {hotel_name}, using fallback images")
            return get_fallback_images()
        
        # Direct Google Maps API call (no threading/timeout complexity)
        logger.info(f"🔍 Searching Google Maps for {hotel_name} in {destination}")
        
        search_query = f"{hotel_name} {destination}"
        search_result = maps_service.search_places(search_query)
        
        logger.info(f"Search result status: {search_result.get('status')}")
        
        if search_result.get("status") == "OK" and search_result.get("results"):
            # Get the first (most relevant) hotel result
            hotel_place = search_result["results"][0]
            place_id = hotel_place.get("place_id")
            
            if place_id:
                logger.info(f"✅ Found place ID {place_id} for {hotel_name}")
                # Get detailed place information including photos
                place_details = maps_service.get_place_details(place_id)
                photos = place_details.get("photos", [])
                
                if photos and len(photos) > 0:
                    logger.info(f"🎉 SUCCESS: Found {len(photos)} Google Maps photos for {hotel_name}")
                    return photos[:3]  # Return top 3 photos
                else:
                    logger.warning(f"❌ No photos found in place details for {hotel_name}")
            else:
                logger.warning(f"❌ No place ID found for {hotel_name}")
        else:
            logger.warning(f"❌ Google Maps search failed for {hotel_name}: {search_result.get('status', 'Unknown error')}")
        
        logger.warning(f"Using fallback images for {hotel_name}")
        return get_fallback_images()
            
    except Exception as e:
        logger.error(f"❌ Error getting hotel images from Maps API: {e}")
        return get_fallback_images()

def get_fallback_images() -> List[str]:
    """Get fallback hotel images from Unsplash"""
    return [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&auto=format&fit=crop"
    ]

@router.get("/maps-status")
async def get_maps_status():
    """Check Google Maps API configuration status"""
    maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    return {
        "maps_api_configured": bool(maps_api_key),
        "maps_service_healthy": maps_service.is_healthy(),
        "api_key_length": len(maps_api_key) if maps_api_key else 0
    }

@router.get("/recommendations")
async def get_hotel_recommendations(
    destination: str = Query(..., description="Destination city or location"),
    budget: str = Query("medium", description="Budget level: budget, medium, luxury"),
    guests: int = Query(2, description="Number of guests"),
    duration: int = Query(3, description="Duration of stay in days")
):
    """Get AI-powered hotel recommendations for a destination"""
    import time
    request_start = time.time()
    logger.info(f"Hotel recommendation request: {destination}, budget: {budget}, guests: {guests}, duration: {duration}")
    
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
        
        # Convert backend hotel format to frontend-compatible format
        compatible_hotels = []
        for hotel in hotels:
            compatible_hotel = {
                "id": hotel.id,
                "name": hotel.name,
                "description": hotel.description,
                "summary": hotel.description[:100] + "..." if len(hotel.description) > 100 else hotel.description,
                "rating": hotel.rating,
                "reviewCount": hotel.reviewCount,
                "pricePerNight": {
                    "currency": hotel.pricePerNight.get("currency", "USD"),
                    "amount": hotel.pricePerNight.get("amount", 150),
                    "basePrice": hotel.pricePerNight.get("amount", 150),
                    "taxes": 0,
                    "fees": 0
                },
                "images": hotel.images,
                "location": {
                    "address": hotel.location.address,
                    "city": hotel.location.city,
                    "country": destination,
                    "coordinates": {
                        "latitude": hotel.location.latitude or 0,
                        "longitude": hotel.location.longitude or 0
                    },
                    "distanceFromCenter": {
                        "value": 2.0,
                        "unit": "km"
                    },
                    "nearbyAttractions": ["City Center", "Main Attractions"]
                },
                "amenities": [
                    {
                        "id": amenity.name.lower().replace(" ", "-"),
                        "name": amenity.name,
                        "category": "basic",
                        "description": amenity.name
                    } for amenity in hotel.amenities
                ],
                "roomTypes": [
                    {
                        "id": "standard",
                        "name": "Standard Room",
                        "capacity": 2,
                        "bedType": "King",
                        "size": 30,
                        "priceModifier": 1.0
                    }
                ],
                "policies": {
                    "checkIn": "15:00",
                    "checkOut": "11:00",
                    "cancellation": "Free cancellation up to 24 hours before check-in"
                },
                "category": hotel.category,
                "availabilityStatus": "available"
            }
            compatible_hotels.append(compatible_hotel)
        
        request_time = time.time() - request_start
        logger.info(f"Hotel recommendation request completed in {request_time:.2f} seconds, returning {len(compatible_hotels)} hotels")
        
        return {
            "success": True,
            "data": compatible_hotels,
            "destination": destination,
            "total_hotels": len(compatible_hotels)
        }
        
    except Exception as e:
        logger.error(f"Error getting hotel recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def generate_hotel_recommendations(search_request: HotelSearchRequest) -> List[Hotel]:
    """Generate hotel recommendations using Gemini AI"""
    import time
    start_time = time.time()
    logger.info(f"Starting hotel generation for {search_request.destination}")
    
    if not gemini_service.is_healthy():
        # Return fallback hotels if AI is not available
        logger.warning("Gemini AI not available, using fallback hotels")
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
1. Research and recommend REAL, EXISTING hotels in {search_request.destination}
2. Include mix of hotel types (business, boutique, resort, chain hotels, etc.)
3. Consider location convenience and local attractions
4. Provide realistic pricing based on actual market rates
5. Include variety in neighborhoods/areas within the destination
6. Use actual hotel names that exist in the destination
7. Provide realistic coordinates and addresses

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
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&auto=format&fit=crop"
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
        logger.info("Calling Gemini AI for hotel recommendations...")
        ai_start = time.time()
        response = gemini_service.client.generate_content(prompt)
        ai_time = time.time() - ai_start
        logger.info(f"Gemini AI response received in {ai_time:.2f} seconds")
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
                        # Get real hotel images from Google Maps Places API
                        hotel_name = hotel_dict.get('name', '')
                        images = get_hotel_images_from_maps(hotel_name, destination)
                        
                        hotel = Hotel(
                            id=hotel_dict['id'],
                            name=hotel_dict['name'],
                            description=hotel_dict['description'],
                            location=HotelLocation(**hotel_dict['location']),
                            rating=float(hotel_dict['rating']),
                            reviewCount=int(hotel_dict['reviewCount']),
                            pricePerNight=hotel_dict['pricePerNight'],
                            images=images,
                            amenities=[HotelAmenity(**amenity) for amenity in hotel_dict['amenities']],
                            category=hotel_dict['category']
                        )
                        hotels.append(hotel)
                    except Exception as e:
                        logger.warning(f"Failed to parse hotel: {e}")
                        continue
                
                if hotels:
                    total_time = time.time() - start_time
                    logger.info(f"Generated {len(hotels)} hotel recommendations for {search_request.destination} in {total_time:.2f} seconds")
                    return hotels
                        
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {e}")
                
        # Fallback if AI parsing fails
        return create_fallback_hotels(search_request.destination, search_request.budget)
        
    except Exception as e:
        logger.error(f"Error generating hotel recommendations: {e}")
        return create_fallback_hotels(search_request.destination, search_request.budget)

def get_ai_fallback_hotels(destination: str, budget: str) -> List[Hotel]:
    """Generate realistic hotel recommendations using Gemini AI as fallback"""
    
    prompt = f"""
You are a travel expert with access to real hotel data. Generate a list of 4-5 REAL, EXISTING hotels in {destination} for {budget} budget travelers.

**Requirements:**
- Use ACTUAL hotel names that exist in {destination}
- Provide REAL addresses and approximate coordinates
- Include realistic pricing, ratings, and amenities
- Provide actual hotel image URLs (use placeholder format with Unsplash)
- Include variety of hotel types and locations within the city

**Budget Guidelines:**
- budget: $50-120/night
- medium: $100-250/night  
- luxury: $250+/night

**Response Format (MUST be valid JSON):**
{{
    "hotels": [
        {{
            "id": "real_hotel_1_{destination.lower().replace(' ', '_')}",
            "name": "Actual Hotel Name",
            "description": "Real description highlighting actual features and location",
            "location": {{
                "address": "Real street address in {destination}",
                "city": "{destination}",
                "latitude": actual_latitude,
                "longitude": actual_longitude
            }},
            "rating": realistic_rating,
            "reviewCount": realistic_count,
            "pricePerNight": {{
                "amount": realistic_price,
                "currency": "USD"
            }},
            "images": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300",
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300",
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300"
            ],
            "amenities": [
                {{"name": "Free WiFi", "available": true}},
                {{"name": "Pool", "available": true_or_false}},
                {{"name": "Gym", "available": true_or_false}},
                {{"name": "Restaurant", "available": true_or_false}},
                {{"name": "Spa", "available": true_or_false}},
                {{"name": "Parking", "available": true_or_false}},
                {{"name": "Bar", "available": true_or_false}}
            ],
            "category": "{budget}"
        }}
    ]
}}

Focus on providing REAL hotel names and accurate information for {destination}. Return ONLY valid JSON.
"""

    try:
        response = gemini_service.client.generate_content(prompt)
        hotels_text = response.text.strip()
        
        # Parse JSON response
        json_start = hotels_text.find('{')
        json_end = hotels_text.rfind('}') + 1
        
        if json_start != -1 and json_end != 0:
            json_text = hotels_text[json_start:json_end]
            hotels_data = json.loads(json_text)
            
            # Convert to Hotel objects
            hotels = []
            for hotel_dict in hotels_data.get('hotels', []):
                try:
                    # Get real hotel images from Google Maps Places API
                    hotel_name = hotel_dict.get('name', '')
                    images = get_hotel_images_from_maps(hotel_name, destination)
                    
                    hotel = Hotel(
                        id=hotel_dict['id'],
                        name=hotel_dict['name'],
                        description=hotel_dict['description'],
                        location=HotelLocation(**hotel_dict['location']),
                        rating=float(hotel_dict['rating']),
                        reviewCount=int(hotel_dict['reviewCount']),
                        pricePerNight=hotel_dict['pricePerNight'],
                        images=images,
                        amenities=[HotelAmenity(**amenity) for amenity in hotel_dict['amenities']],
                        category=hotel_dict['category']
                    )
                    hotels.append(hotel)
                except Exception as e:
                    logger.warning(f"Failed to parse AI hotel: {e}")
                    continue
            
            if hotels:
                logger.info(f"Generated {len(hotels)} AI fallback hotels for {destination}")
                return hotels
                
    except Exception as e:
        logger.error(f"Error generating AI fallback hotels: {e}")
        raise e

def create_fallback_hotels(destination: str, budget: str) -> List[Hotel]:
    """Create AI-generated hotel recommendations as fallback"""
    
    # Try to use Gemini AI even in fallback mode for realistic hotel data
    if gemini_service.is_healthy():
        try:
            return get_ai_fallback_hotels(destination, budget)
        except Exception as e:
            logger.warning(f"AI fallback failed, using static data: {e}")
    
    # Determine price range based on budget
    price_ranges = {
        "budget": (60, 100),
        "medium": (120, 200),
        "luxury": (250, 500)
    }
    min_price, max_price = price_ranges.get(budget, (120, 200))
    
    # Static fallback as last resort
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
            "images": get_fallback_images(),
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
            "images": get_fallback_images(),
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
            "images": get_fallback_images(),
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

@router.get("/hotels/simple-maps-test")
async def simple_maps_test():
    """Simple test of Google Maps integration"""
    try:
        maps_service = MapsService()
        
        # Test search
        search_result = maps_service.search_places("Park Hyatt Tokyo")
        
        if search_result.get("status") == "OK" and search_result.get("results"):
            place = search_result["results"][0]
            place_id = place.get("place_id")
            
            # Test place details with photos
            if place_id:
                details = maps_service.get_place_details(place_id)
                photos = details.get("photos", [])
                
                # Generate photo URLs if photos exist
                photo_urls = []
                if photos:
                    for photo in photos[:2]:  # First 2 photos
                        photo_url = maps_service.get_photo_url(photo["photo_reference"], max_width=400)
                        photo_urls.append(photo_url)
                
                return {
                    "status": "success",
                    "search_status": search_result.get("status"),
                    "place_found": place.get("name"),
                    "place_id": place_id,
                    "photos_count": len(photos),
                    "sample_photo_urls": photo_urls
                }
        
        return {
            "status": "no_results",
            "search_status": search_result.get("status"),
            "error": "No places found"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "api_key_configured": bool(os.getenv("GOOGLE_MAPS_API_KEY"))
        }