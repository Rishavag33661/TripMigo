import os
import google.generativeai as genai
from typing import List, Dict, Any, Optional
from models import TripRequest, ReviewSummary
import json
import logging

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_AI_API_KEY")
        if not self.api_key:
            logger.warning("GOOGLE_AI_API_KEY not found in environment variables")
            self.client = None
        else:
            genai.configure(api_key=self.api_key)
            self.client = genai.GenerativeModel('gemini-2.0-flash-lite')
    
    def is_healthy(self) -> bool:
        """Check if Gemini service is available"""
        return self.client is not None and self.api_key is not None
    
    def generate_itinerary(self, trip_request: TripRequest) -> Dict[str, Any]:
        """Generate a comprehensive travel itinerary using Gemini AI"""
        if not self.is_healthy():
            raise Exception("Gemini service is not available")
        
        prompt = self._build_itinerary_prompt(trip_request)
        
        try:
            response = self.client.generate_content(prompt)
            itinerary_text = response.text
            
            # Parse the JSON response from Gemini
            # Gemini sometimes includes extra text, so we need to extract the JSON
            json_start = itinerary_text.find('{')
            json_end = itinerary_text.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_text = itinerary_text[json_start:json_end]
                try:
                    return json.loads(json_text)
                except json.JSONDecodeError:
                    # If JSON parsing fails, create a structured response
                    return self._create_fallback_itinerary(trip_request, itinerary_text)
            else:
                return self._create_fallback_itinerary(trip_request, itinerary_text)
                
        except Exception as e:
            logger.error(f"Error generating itinerary: {e}")
            return self._create_fallback_itinerary(trip_request, str(e))
    
    def _build_itinerary_prompt(self, trip: TripRequest) -> str:
        """Build a comprehensive prompt for itinerary generation"""
        
        # Extract comprehensive trip details
        hotel_preference = trip.selectedHotel or "Mid-range hotel"
        travel_mode = trip.travelMode or "Mixed transportation"
        food_preference = trip.foodPreference or "Any"
        essentials = ', '.join(trip.selectedEssentials) if trip.selectedEssentials else "Standard travel items"
        
        return f"""
You are an expert travel planner with deep knowledge of destinations worldwide. Create a detailed, practical itinerary for the following trip with comprehensive planning details:

**Trip Details:**
- Source: {trip.source or trip.sourceLocation or "Not specified"}
- Destination: {trip.destination}
- Budget Level: {trip.budget}
- Duration: {trip.duration_days} days
- Number of People: {trip.numberOfPeople or "Based on traveler type"}
- Interests: {', '.join(trip.interests) if trip.interests else 'General sightseeing'}
- Travel Style: {trip.travel_style}
- Travelers: {trip.travelers}
- Start Date: {trip.start_date or 'Flexible'}

**Selected Preferences:**
- Accommodation: {hotel_preference}
- Transportation: {travel_mode}
- Food Preference: {food_preference}
- Essential Items: {essentials}
- Constraints: {trip.constraints or 'None specified'}

**Instructions:**
1. Create a day-by-day itinerary with specific times that considers ALL the selected preferences
2. Include activities that match the interests and accommodation level
3. Incorporate the selected travel mode for transportation recommendations
4. Respect the food preference when suggesting restaurants and meals
5. Consider the essential items when planning activities (e.g., hiking gear = outdoor activities)
6. Include mix of activities based on budget level and travel style
7. Add practical details like duration, location, and costs
8. Suggest booking requirements where needed
9. Make the itinerary personalized based on the comprehensive trip data

**Response Format (MUST be valid JSON):**
{{
    "days": [
        {{
            "day": 1,
            "date": "Day 1",
            "title": "Day 1 - Arrival and {trip.destination} Introduction",
            "items": [
                {{
                    "time": "9:00 AM",
                    "title": "Activity Name",
                    "description": "Detailed description considering preferences: {hotel_preference}, {travel_mode}, {food_preference}",
                    "type": "activity",
                    "icon": "map-pin",
                    "duration": "2-3 hours",
                    "location": "Specific location in {trip.destination}",
                    "estimated_cost": "$20-40",
                    "booking_required": false
                }}
            ]
        }}
    ],
    "travel_tips": [
        "Practical tip considering {food_preference} diet",
        "Transportation tip for {travel_mode}",
        "Budget tip for {trip.budget} level"
    ],
    "total_estimated_cost": "Budget estimate considering all selected preferences",
    "description": "AI-generated personalized itinerary for {trip.destination} with {hotel_preference}, {travel_mode}, and {food_preference} preferences"
}}

Make sure the response is ONLY valid JSON without any additional text before or after. Personalize the itinerary based on ALL the provided trip details and preferences.
"""
    
    def _create_fallback_itinerary(self, trip: TripRequest, error_info: str) -> Dict[str, Any]:
        """Create a basic itinerary structure as fallback"""
        days = []
        for day in range(1, trip.duration_days + 1):
            days.append({
                "day": day,
                "date": f"Day {day}",
                "title": f"Day {day} - Exploring {trip.destination}",
                "items": [
                    {
                        "time": "9:00 AM",
                        "title": f"Morning exploration of {trip.destination}",
                        "description": f"Discover the highlights of {trip.destination}",
                        "type": "activity",
                        "icon": "map-pin",
                        "duration": "3 hours",
                        "location": f"{trip.destination} city center",
                        "estimated_cost": "$30-50",
                        "booking_required": False
                    },
                    {
                        "time": "2:00 PM",
                        "title": "Local cuisine experience",
                        "description": f"Try traditional dishes from {trip.destination}",
                        "type": "food",
                        "icon": "utensils",
                        "duration": "1.5 hours",
                        "location": f"Popular restaurant in {trip.destination}",
                        "estimated_cost": "$25-45",
                        "booking_required": False
                    }
                ]
            })
        
        return {
            "days": days,
            "travel_tips": [
                f"Book accommodations in advance for {trip.destination}",
                "Check local weather conditions before traveling",
                "Learn basic local phrases for better experience"
            ],
            "total_estimated_cost": f"${500 * trip.duration_days}-{800 * trip.duration_days}"
        }
    
    def summarize_reviews(self, reviews: List[str]) -> ReviewSummary:
        """Summarize reviews using Gemini AI"""
        if not self.is_healthy():
            raise Exception("Gemini service is not available")
        
        if not reviews:
            return ReviewSummary(
                pros=["No reviews available"],
                cons=["Insufficient data"],
                overall_sentiment="neutral"
            )
        
        joined_reviews = "\n".join(reviews)
        prompt = f"""
Analyze the following reviews and provide a comprehensive summary:

Reviews:
{joined_reviews}

Provide your analysis in this EXACT JSON format:
{{
    "pros": ["positive point 1", "positive point 2", ...],
    "cons": ["negative point 1", "negative point 2", ...],
    "overall_sentiment": "positive/negative/neutral",
    "rating_breakdown": {{
        "service": 4.2,
        "value": 3.8,
        "location": 4.5
    }}
}}

Focus on common themes and provide actionable insights.
"""
        
        try:
            response = self.client.generate_content(prompt)
            result_text = response.text
            
            # Extract JSON from response
            json_start = result_text.find('{')
            json_end = result_text.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_text = result_text[json_start:json_end]
                data = json.loads(json_text)
                return ReviewSummary(**data)
            else:
                return self._create_fallback_review_summary()
                
        except Exception as e:
            logger.error(f"Error summarizing reviews: {e}")
            return self._create_fallback_review_summary()
    
    def _create_fallback_review_summary(self) -> ReviewSummary:
        """Create a fallback review summary"""
        return ReviewSummary(
            pros=["Generally positive feedback", "Good service quality"],
            cons=["Some minor issues reported", "Limited feedback available"],
            overall_sentiment="positive"
        )
    
    def get_destination_insights(self, destination: str) -> Dict[str, Any]:
        """Get AI-powered insights about a destination"""
        if not self.is_healthy():
            return {"error": "Gemini service not available"}
        
        prompt = f"""
Provide comprehensive insights about {destination} as a travel destination.

Include the following in JSON format:
{{
    "best_time_to_visit": "Specific months and reasons",
    "highlights": ["top attraction 1", "top attraction 2", ...],
    "local_cuisine": ["dish 1", "dish 2", ...],
    "cultural_tips": ["tip 1", "tip 2", ...],
    "budget_estimates": {{
        "budget": "$50-80/day",
        "mid-range": "$100-150/day", 
        "luxury": "$200+/day"
    }},
    "transportation": ["option 1", "option 2", ...],
    "safety_tips": ["tip 1", "tip 2", ...]
}}
"""
        
        try:
            response = self.client.generate_content(prompt)
            result_text = response.text
            
            json_start = result_text.find('{')
            json_end = result_text.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_text = result_text[json_start:json_end]
                return json.loads(json_text)
            else:
                return {"error": "Could not parse destination insights"}
                
        except Exception as e:
            logger.error(f"Error getting destination insights: {e}")
            return {"error": f"Failed to get insights: {str(e)}"}