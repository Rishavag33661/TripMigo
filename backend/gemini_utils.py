# Moved from main.py
from models import TripRequest
from typing import List, Any
from googlemaps import Client as GoogleMapsClient
from googlemaps.exceptions import ApiError

def get_place_details(place_name: str, maps_client: GoogleMapsClient, gemini_client: Any = None):
    """
    Uses Google Maps Places API to search for a place and return its place ID, rating, address, and summarized reviews.
    Handles ZeroResultsError. If gemini_client is provided, summarizes reviews using Gemini.
    """
    try:
        result = maps_client.places(query=place_name)
        places = result.get('results', [])
        if not places:
            return {"error": "ZeroResultsError", "message": f"No results found for '{place_name}'"}
        place = places[0]
        place_id = place.get("place_id")
        rating = place.get("rating")
        address = place.get("formatted_address")

        # Fetch reviews for the place
        details = maps_client.place(place_id=place_id, fields=["review"])
        reviews = []
        for review in details.get("result", {}).get("reviews", []):
            reviews.append(review.get("text", ""))

        # Summarize reviews using Gemini if available
        review_summary = None
        if gemini_client and reviews:
            review_summary = summarize_reviews_with_gemini(reviews, gemini_client)

        return {
            "place_id": place_id,
            "rating": rating,
            "address": address,
            "review_summary": review_summary
        }
    except ApiError as e:
        return {"error": "ApiError", "message": str(e)}


def generate_itinerary_with_gemini(trip: TripRequest, gemini_client: Any) -> dict:
    """
    Generates a travel itinerary using Gemini AI client based on the TripRequest.
    """
    prompt = f"""
    You are an expert travel planner. Create a detailed itinerary for the following trip:
    Source: {trip.source}
    Destination: {trip.destination}
    Budget: {trip.budget}
    Duration (days): {trip.duration_days}
    Interests: {', '.join(trip.interests)}
    Constraints: {trip.constraints}
    Travel style: {trip.travel_style}
    Travellers: {trip.travelers}

    Please provide the itinerary in the following JSON format:
    {{
        "days": [
            {{
                "day": 1,
                "activities": ["Activity 1", "Activity 2", ...],
                "food_recommendations": ["Restaurant 1", "Dish 1", ...]
            }},
            ...
        ]
    }}
    """

    # First turn: get initial itinerary
    response = gemini_client.generate_content(prompt)
    itinerary = response.text  # Use .text to get the generated content

    # Optionally, refine the itinerary in a multi-turn conversation
    # For example, ask for more details or adjustments
    # refinement_prompt = "Can you add more local food recommendations for each day?"
    # refined_response = gemini_client.generate_content(refinement_prompt, context=itinerary)
    # itinerary = refined_response.get('content', refined_response)

    return itinerary

def summarize_reviews_with_gemini(reviews: List[str], gemini_client: Any) -> str:
    """
    Summarizes a list of reviews using Gemini AI client and formats output as Pros and Cons bullet points.
    """
    joined_reviews = "\n".join(reviews)
    prompt = (
        "You are an expert review summarizer. Given the following reviews, "
        "provide a concise summary in this format:\n"
        "Pros:\n- bullet point\n- bullet point\nCons:\n- bullet point\n- bullet point\n"
        "Highlight common positive and negative points as bullet points under Pros and Cons.\n"
        f"Reviews:\n{joined_reviews}"
    )
    response = gemini_client.generate_content(prompt)
    summary = response.text  # Use .text to get the generated content
    return summary
