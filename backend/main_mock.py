from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import TripRequest
from typing import List
from fastapi import Body
import json
import time

app = FastAPI(title="Trip-Go Mock API", description="Mock API for testing without API keys")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Google Maps API key
MOCK_MAPS_API_KEY = "AIzaSyBFw0Qbyq9zTFTd-tUY6dO5A6QzqAmDcGc"

@app.get("/")
def root():
    return {"message": "Trip-Go Mock API is running!", "version": "1.0.0", "mode": "mock"}

@app.get("/config/maps-key")
def get_maps_key():
    return {"mapsApiKey": MOCK_MAPS_API_KEY}

@app.post("/itinerary/generate")
def generate_itinerary(request: TripRequest):
    # Simulate processing time
    time.sleep(1)
    
    # Generate mock itinerary based on request
    mock_itinerary = generate_mock_itinerary(request)
    mock_place_details = generate_mock_place_details(request.destination)
    
    return {
        "itinerary": mock_itinerary,
        "place_details": mock_place_details
    }

@app.post("/reviews/summarize")
def summarize_reviews(reviews: List[str] = Body(..., embed=True)):
    # Mock review summary
    return {
        "summary": """Pros:
- Great location and accessibility
- Friendly staff and excellent service
- Clean facilities and well-maintained
- Good value for money
- Beautiful scenery and atmosphere

Cons:
- Can get crowded during peak times
- Limited parking availability
- Some areas need maintenance
- Weather dependent activities
- Higher prices during tourist season"""
    }

def generate_mock_itinerary(request: TripRequest) -> str:
    destination = request.destination
    days = request.duration_days
    budget = request.budget
    interests = ", ".join(request.interests) if request.interests else "general sightseeing"
    
    itinerary = f"""
**{days}-Day Trip to {destination}**

**Trip Overview:**
- Destination: {destination}
- Duration: {days} days
- Budget: {budget}
- Interests: {interests}
- Travel Style: {request.travel_style}
- Group: {request.travelers}

"""
    
    for day in range(1, days + 1):
        itinerary += f"""
**Day {day} - Exploring {destination}**

**9:00 AM - Morning Activity**
Visit the main attractions and landmarks in {destination}. Start with the most famous sites to avoid crowds.

**12:00 PM - Lunch**
Try local cuisine at a traditional restaurant in the city center. Recommended dishes based on your preferences.

**2:00 PM - Afternoon Exploration**
Discover cultural sites, museums, or outdoor activities based on your interest in {interests}.

**6:00 PM - Evening Experience**
Enjoy the local nightlife, sunset views, or entertainment options that {destination} is famous for.

**8:00 PM - Dinner**
Dine at a recommended restaurant featuring local specialties and regional cuisine.

"""
    
    itinerary += f"""
**Travel Tips for {destination}:**
- Best time to visit major attractions: Early morning or late afternoon
- Local transportation: Use public transport or ride-sharing apps
- Weather considerations: Check forecast and dress appropriately
- Cultural tips: Respect local customs and traditions
- Budget recommendations: Plan for {budget} range expenses

**Estimated Daily Budget ({budget}):**
- Meals: $30-80 per day
- Transportation: $10-25 per day  
- Activities: $20-60 per day
- Accommodation: $50-200 per night

Have a wonderful trip to {destination}!
"""
    
    return itinerary

def generate_mock_place_details(destination: str):
    return {
        "place_id": f"mock_place_id_for_{destination.lower().replace(' ', '_')}",
        "rating": 4.3,
        "address": f"{destination}, Tourist District",
        "review_summary": f"""Pros:
- {destination} offers amazing cultural experiences
- Great food scene with diverse options
- Friendly locals and welcoming atmosphere
- Good transportation connectivity
- Rich history and beautiful architecture

Cons:
- Can be crowded during peak season
- Some areas are expensive for tourists
- Language barriers in certain locations
- Weather can be unpredictable
- Limited English signage in some areas"""
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
