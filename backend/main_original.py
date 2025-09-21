
from gemini_utils import generate_itinerary_with_gemini, summarize_reviews_with_gemini, get_place_details
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import TripRequest
from typing import List
from fastapi import Body
import os
from dotenv import load_dotenv
import googlemaps
import google.generativeai as genai
from fastapi import APIRouter


load_dotenv()

# Initialize Gemini client
gemini_api_key = os.getenv("GOOGLE_AI_API_KEY")
genai.configure(api_key=gemini_api_key)
gemini_client = genai.GenerativeModel('gemini-2.0-flash-lite')

# Initialize Google Maps client
maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

maps_client = googlemaps.Client(key=maps_api_key)

router = APIRouter()
app = FastAPI()
app.include_router(router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/config/maps-key")
def get_maps_key():
    return {"mapsApiKey": maps_api_key}

@app.post("/itinerary/generate")
def generate_itinerary(request: TripRequest):
    itinerary = generate_itinerary_with_gemini(request, gemini_client)
    place_details = get_place_details(request.destination, maps_client, gemini_client)
    return {
        "itinerary": itinerary,
        "place_details": place_details
    }


# New endpoint for summarizing reviews
@app.post("/reviews/summarize")
def summarize_reviews(reviews: List[str] = Body(..., embed=True)):
    summary = summarize_reviews_with_gemini(reviews, gemini_client)
    return {"summary": summary}
