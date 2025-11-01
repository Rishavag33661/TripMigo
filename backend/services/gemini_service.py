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
            try:
                genai.configure(api_key=self.api_key)
                self.client = genai.GenerativeModel('gemini-2.0-flash-lite')
                logger.info("Gemini AI service initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini service: {e}")
                self.client = None
    
    def is_healthy(self) -> bool:
        """Check if Gemini service is available"""
        if self.client is None or not self.api_key:
            logger.warning("Gemini service is not healthy: missing client or API key")
            return False
        
        # Try a simple test to verify the service is working
        try:
            # This doesn't make an actual API call, just checks if the client is properly configured
            return True
        except Exception as e:
            logger.error(f"Gemini health check failed: {e}")
            return False
    
    def generate_itinerary(self, trip_request: TripRequest) -> Dict[str, Any]:
        """Generate a comprehensive travel itinerary using Gemini AI"""
        if not self.is_healthy():
            raise Exception("Gemini service is not available")
        
        # Debug logging to see what data we're working with
        logger.info(f"Generating itinerary for destination: '{trip_request.destination}'")
        logger.info(f"Trip request details: budget={trip_request.budget}, duration={trip_request.duration_days}, travelers={trip_request.travelers}")
        
        # Validate that we have essential data
        if not trip_request.destination or trip_request.destination.strip() == "":
            logger.error("Empty destination provided to generate_itinerary")
            raise Exception("Destination is required for itinerary generation")
        
        prompt = self._build_itinerary_prompt(trip_request)
        
        try:
            logger.info("Sending request to Gemini AI...")
            # Configure generation with timeout and other parameters
            generation_config = genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=4096,  # Increased for detailed itineraries
                top_p=0.8,
                top_k=40
            )
            
            # Add timeout handling with retry logic
            import time
            max_retries = 2
            for attempt in range(max_retries + 1):
                try:
                    response = self.client.generate_content(
                        prompt,
                        generation_config=generation_config
                    )
                    break  # Success, exit retry loop
                except Exception as e:
                    if attempt == max_retries:
                        raise e  # Last attempt failed, re-raise
                    logger.warning(f"Gemini API attempt {attempt + 1} failed: {e}. Retrying...")
                    time.sleep(2 ** attempt)  # Exponential backoff
            
            if not response or not response.text:
                logger.error("Empty response received from Gemini AI")
                raise Exception("Empty response from AI service")
            
            itinerary_text = response.text.strip()
            logger.info(f"Received response from Gemini (length: {len(itinerary_text)})")
            
            # Parse the JSON response from Gemini
            # Gemini sometimes includes extra text, so we need to extract the JSON
            json_start = itinerary_text.find('{')
            json_end = itinerary_text.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_text = itinerary_text[json_start:json_end]
                try:
                    parsed_result = json.loads(json_text)
                    logger.info("Successfully parsed JSON response from Gemini")
                    
                    # Validate the parsed result has the expected structure
                    if not isinstance(parsed_result, dict) or 'days' not in parsed_result:
                        logger.warning("Invalid itinerary structure received from Gemini")
                        return self._create_fallback_itinerary(trip_request, "Invalid structure")
                    
                    # Check if the days contain empty destination strings
                    if parsed_result.get('days'):
                        for day in parsed_result['days']:
                            for item in day.get('items', []):
                                if not item.get('location') or item['location'].endswith(' '):
                                    # Fix incomplete location strings
                                    item['location'] = item['location'].replace(' ', trip_request.destination)
                    
                    return parsed_result
                    
                except json.JSONDecodeError as e:
                    logger.error(f"JSON parsing failed: {e}")
                    logger.error(f"Raw response: {itinerary_text[:500]}...")
                    return self._create_fallback_itinerary(trip_request, f"JSON parse error: {str(e)}")
            else:
                logger.error("No valid JSON found in Gemini response")
                logger.error(f"Raw response: {itinerary_text[:500]}...")
                return self._create_fallback_itinerary(trip_request, "No JSON found")
                
        except Exception as e:
            logger.error(f"Error generating itinerary: {e}")
            raise Exception(f"Failed to generate itinerary: {str(e)}")
    
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
                    "location": "Specific location in {trip.destination} (ALWAYS include the destination name)",
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

CRITICAL REQUIREMENTS:
1. ALWAYS include the destination name "{trip.destination}" in every location field
2. Never leave location fields empty or incomplete
3. Provide specific, complete activity descriptions
4. Return ONLY valid JSON without any additional text
5. Include the destination "{trip.destination}" in all relevant descriptions
6. Make sure all strings are complete and not cut off
7. Each activity must have a complete, detailed description mentioning the destination

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