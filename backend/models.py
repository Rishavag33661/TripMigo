from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


# Base Response Models
class ResponseBase(BaseModel):
    success: bool = True
    message: str = "Operation successful"


# User and Auth Models
class UserProfile(BaseModel):
    name: str
    avatar: Optional[str] = None
    initials: str
    location: Optional[str] = None


class User(BaseModel):
    id: str
    profile: UserProfile


# Destination Models
class DestinationImages(BaseModel):
    hero: str
    slideshow: List[str]
    thumbnail: str


class DestinationVideos(BaseModel):
    hero: str
    thumbnail: str


class Destination(BaseModel):
    id: str
    name: str
    country: str
    description: str
    images: DestinationImages
    videos: DestinationVideos
    rating: float
    tags: List[str]
    highlights: List[str]
    best_time_to_visit: str
    estimated_cost: Dict[str, Any]  # {"budget": "$$", "range": "1000-2000"}


# Trip and Itinerary Models
class TripRequest(BaseModel):
    source: str = Field(default="")
    destination: str
    budget: str = Field(..., description="Budget level: budget, mid-range, luxury")
    duration_days: int = Field(..., gt=0, le=30)
    interests: List[str] = Field(..., description="List of interests like sightseeing, food, adventure")
    constraints: Optional[str] = Field(None, description="Any constraints or preferences")
    travel_style: str = Field(..., description="Travel style: relaxed, moderate, packed")
    travelers: str = Field(..., description="Type of travelers: solo, couple, family, group")
    start_date: Optional[str] = None
    accommodation_type: Optional[str] = "hotel"
    
    # Extended fields for comprehensive planning
    numberOfDays: Optional[int] = None
    numberOfPeople: Optional[int] = None
    foodPreference: Optional[str] = None
    selectedHotel: Optional[str] = None
    travelMode: Optional[str] = None
    selectedEssentials: Optional[List[str]] = []
    sourceLocation: Optional[str] = None
    travelStyle: Optional[str] = None
    
    # Legacy compatibility
    source_location: Optional[str] = None
    
    def __init__(self, **data):
        # Handle legacy field mappings
        if 'numberOfDays' in data and 'duration_days' not in data:
            data['duration_days'] = data['numberOfDays']
        if 'sourceLocation' in data and 'source' not in data:
            data['source'] = data['sourceLocation']
        if 'source_location' in data and 'source' not in data:
            data['source'] = data['source_location']
        if 'travelStyle' in data and 'travel_style' not in data:
            data['travel_style'] = data['travelStyle']
        if 'numberOfPeople' in data and 'travelers' not in data:
            people = data['numberOfPeople']
            if people == 1:
                data['travelers'] = 'solo'
            elif people == 2:
                data['travelers'] = 'couple'
            elif people > 2:
                data['travelers'] = 'group'
        if 'budget' in data and isinstance(data['budget'], (int, float)):
            # Convert numeric budget to category
            budget_num = data['budget']
            if budget_num < 500:
                data['budget'] = 'budget'
            elif budget_num < 1500:
                data['budget'] = 'mid-range'
            else:
                data['budget'] = 'luxury'
        
        super().__init__(**data)


class ActivityItem(BaseModel):
    time: str
    title: str
    description: str
    type: str  # activity, food, transport, accommodation
    icon: str
    duration: str
    location: str
    estimated_cost: Optional[str] = None
    booking_required: bool = False


class ItineraryDay(BaseModel):
    day: int
    date: str
    title: str
    items: List[ActivityItem]
    total_estimated_cost: Optional[str] = None


class PlaceDetails(BaseModel):
    place_id: str
    rating: Optional[float] = None
    address: str
    review_summary: Optional[str] = None
    photos: Optional[List[str]] = None


class ItineraryResponse(BaseModel):
    itinerary: List[ItineraryDay]
    place_details: PlaceDetails
    total_estimated_cost: Optional[str] = None
    travel_tips: Optional[List[str]] = None


# Trip Storage Models
class SavedTrip(BaseModel):
    id: str
    user: User
    destination: str
    duration: str
    group_size: int
    highlights: List[str]
    date: str
    rating: int
    review: str
    itinerary: Optional[List[ItineraryDay]] = None


# Planning Models
class PlanningStep(BaseModel):
    step: int
    title: str
    completed: bool = False
    data: Optional[Dict[str, Any]] = None


class PlanningSession(BaseModel):
    id: str
    user_id: Optional[str] = None
    steps: List[PlanningStep]
    current_step: int = 1
    trip_request: Optional[TripRequest] = None
    created_at: datetime
    updated_at: datetime


# Review Models
class ReviewSummary(BaseModel):
    pros: List[str]
    cons: List[str]
    overall_sentiment: str
    rating_breakdown: Optional[Dict[str, float]] = None


# Configuration Models
class MapsConfig(BaseModel):
    mapsApiKey: str


class AppConfig(BaseModel):
    maps: MapsConfig
    features: List[str]
    version: str