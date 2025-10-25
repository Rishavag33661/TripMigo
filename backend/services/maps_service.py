import os
import googlemaps
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)


class MapsService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        if not self.api_key:
            logger.warning("GOOGLE_MAPS_API_KEY not found in environment variables")
            self.client = None
        else:
            self.client = googlemaps.Client(key=self.api_key)
    
    def is_healthy(self) -> bool:
        """Check if Google Maps service is available"""
        return self.client is not None and self.api_key is not None
    
    def get_api_key(self) -> str:
        """Get the Google Maps API key for frontend"""
        if not self.api_key:
            return "demo_key_not_configured"
        return self.api_key
    
    def search_places(self, query: str, location: Optional[str] = None) -> Dict[str, Any]:
        """Search for places using Google Places API"""
        if not self.is_healthy():
            return {"error": "Google Maps service not available", "results": []}
        
        try:
            # Validate the query first
            if not query or not query.strip():
                return {"error": "Empty query provided", "results": []}
            
            # Clean the query
            query = query.strip()
            logger.info(f"Searching for places with query: '{query}'")
            
            # Try different approaches based on query type
            
            # Method 1: Try text search (most flexible)
            try:
                # Use the newer places API with text search
                import requests
                
                url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
                params = {
                    'query': query,
                    'key': self.api_key
                }
                
                response = requests.get(url, params=params)
                result = response.json()
                
                if result.get('status') == 'OK':
                    places = result.get('results', [])
                    logger.info(f"Found {len(places)} places via text search for query: '{query}'")
                    
                    formatted_places = []
                    for place in places[:10]:
                        formatted_place = {
                            "place_id": place.get("place_id"),
                            "name": place.get("name"),
                            "address": place.get("formatted_address"),
                            "rating": place.get("rating"),
                            "user_ratings_total": place.get("user_ratings_total"),
                            "types": place.get("types", []),
                            "geometry": place.get("geometry", {}),
                            "photos": self._format_photos(place.get("photos", []))
                        }
                        formatted_places.append(formatted_place)
                    
                    return {"results": formatted_places, "status": "OK"}
                else:
                    logger.warning(f"Text search failed with status: {result.get('status')}")
            
            except Exception as text_search_error:
                logger.warning(f"Text search failed: {text_search_error}")
            
            # Method 2: Fallback to find_place
            try:
                result = self.client.find_place(
                    input=query,
                    input_type="textquery",
                    fields=[
                        "place_id", "name", "formatted_address", "geometry",
                        "rating", "user_ratings_total", "types"
                    ]
                )
                
                places = result.get('candidates', [])
                logger.info(f"Found {len(places)} places via find_place for query: '{query}'")
                
                formatted_places = []
                for place in places[:10]:
                    formatted_place = {
                        "place_id": place.get("place_id"),
                        "name": place.get("name"),
                        "address": place.get("formatted_address"),
                        "rating": place.get("rating"),
                        "user_ratings_total": place.get("user_ratings_total"),
                        "types": place.get("types", []),
                        "geometry": place.get("geometry", {}),
                        "photos": []  # Skip photos for now to avoid issues
                    }
                    formatted_places.append(formatted_place)
                
                return {"results": formatted_places, "status": "OK"}
                
            except Exception as find_place_error:
                logger.warning(f"Find place failed: {find_place_error}")
            
            # Method 3: Last resort - geocoding
            try:
                geocode_result = self.client.geocode(query)
                if geocode_result:
                    place = geocode_result[0]
                    formatted_place = {
                        "place_id": place.get("place_id"),
                        "name": place.get("formatted_address"),
                        "address": place.get("formatted_address"),
                        "rating": None,
                        "user_ratings_total": None,
                        "types": place.get("types", []),
                        "geometry": place.get("geometry", {}),
                        "photos": []
                    }
                    return {"results": [formatted_place], "status": "OK"}
            except Exception as geocode_error:
                logger.warning(f"Geocoding failed: {geocode_error}")
            
            return {"error": "All search methods failed", "results": []}
            
        except Exception as e:
            logger.error(f"Error searching places for query '{query}': {e}")
            return {"error": str(e), "results": []}
    
    def get_place_details(self, place_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific place"""
        if not self.is_healthy():
            return {"error": "Google Maps service not available"}
        
        try:
            # Request comprehensive place details - temporarily removing photo and type fields
            fields = [
                "place_id", "name", "formatted_address", "geometry",
                "rating", "user_ratings_total", "reviews",
                "website", "formatted_phone_number", "opening_hours",
                "price_level"
            ]
            
            result = self.client.place(place_id=place_id, fields=fields)
            place_data = result.get("result", {})
            
            # Format the response
            formatted_place = {
                "place_id": place_data.get("place_id"),
                "name": place_data.get("name"),
                "address": place_data.get("formatted_address"),
                "rating": place_data.get("rating"),
                "user_ratings_total": place_data.get("user_ratings_total"),
                "geometry": place_data.get("geometry"),
                "reviews": self._format_reviews(place_data.get("reviews", [])),
                "photos": [],  # Temporarily disabled due to API field issues
                "website": place_data.get("website"),
                "phone": place_data.get("formatted_phone_number"),
                "opening_hours": place_data.get("opening_hours"),
                "price_level": place_data.get("price_level"),
                "types": []  # Temporarily disabled due to API field issues
            }
            
            return formatted_place
            
        except Exception as e:
            logger.error(f"Error getting place details for {place_id}: {e}")
            return {"error": str(e)}
    
    def get_directions(self, origin: str, destination: str, mode: str = "driving") -> Dict[str, Any]:
        """Get directions between two locations"""
        if not self.is_healthy():
            return {"error": "Google Maps service not available"}
        
        try:
            result = self.client.directions(
                origin=origin,
                destination=destination,
                mode=mode,
                departure_time="now",
                alternatives=True
            )
            
            if not result:
                return {"error": "No routes found", "routes": []}
            
            formatted_routes = []
            for route in result:
                formatted_route = {
                    "summary": route.get("summary"),
                    "duration": route["legs"][0]["duration"]["text"],
                    "distance": route["legs"][0]["distance"]["text"],
                    "steps": self._format_route_steps(route["legs"][0]["steps"]),
                    "overview_polyline": route["overview_polyline"]["points"]
                }
                formatted_routes.append(formatted_route)
            
            return {"routes": formatted_routes, "status": "OK"}
            
        except Exception as e:
            logger.error(f"Error getting directions: {e}")
            return {"error": str(e), "routes": []}
    
    def geocode_address(self, address: str) -> Dict[str, Any]:
        """Convert an address to geographic coordinates"""
        if not self.is_healthy():
            return {"error": "Google Maps service not available"}
        
        try:
            result = self.client.geocode(address)
            
            if not result:
                return {"error": "Address not found", "results": []}
            
            formatted_results = []
            for location in result:
                formatted_location = {
                    "address": location["formatted_address"],
                    "geometry": location["geometry"],
                    "place_id": location.get("place_id"),
                    "types": location.get("types", [])
                }
                formatted_results.append(formatted_location)
            
            return {"results": formatted_results, "status": "OK"}
            
        except Exception as e:
            logger.error(f"Error geocoding address: {e}")
            return {"error": str(e), "results": []}
    
    def nearby_search(self, location: str, radius: int = 5000, place_type: str = "tourist_attraction") -> Dict[str, Any]:
        """Search for nearby places of a specific type"""
        if not self.is_healthy():
            return {"error": "Google Maps service not available"}
        
        try:
            # First geocode the location to get coordinates
            geocode_result = self.client.geocode(location)
            if not geocode_result:
                return {"error": "Location not found", "results": []}
            
            location_coords = geocode_result[0]["geometry"]["location"]
            
            # Search for nearby places
            result = self.client.places_nearby(
                location=location_coords,
                radius=radius,
                type=place_type
            )
            
            places = result.get('results', [])
            formatted_places = []
            
            for place in places[:20]:  # Limit to top 20 results
                formatted_place = {
                    "place_id": place.get("place_id"),
                    "name": place.get("name"),
                    "rating": place.get("rating"),
                    "user_ratings_total": place.get("user_ratings_total"),
                    "geometry": place.get("geometry"),
                    "types": place.get("type", []),
                    "vicinity": place.get("vicinity"),
                    "price_level": place.get("price_level"),
                    "photos": self._format_photos(place.get("photo", []))
                }
                formatted_places.append(formatted_place)
            
            return {"results": formatted_places, "status": "OK"}
            
        except Exception as e:
            logger.error(f"Error in nearby search: {e}")
            return {"error": str(e), "results": []}
    
    def _format_reviews(self, reviews: List[Dict]) -> List[Dict]:
        """Format Google Reviews for consistent output"""
        formatted_reviews = []
        for review in reviews[:5]:  # Limit to top 5 reviews
            formatted_review = {
                "author_name": review.get("author_name"),
                "rating": review.get("rating"),
                "text": review.get("text"),
                "time": review.get("time"),
                "relative_time_description": review.get("relative_time_description")
            }
            formatted_reviews.append(formatted_review)
        return formatted_reviews
    
    def _format_photos(self, photos: List[Dict]) -> List[str]:
        """Format photo references into URLs"""
        if not photos:
            return []
        
        photo_urls = []
        for photo in photos[:5]:  # Limit to top 5 photos
            photo_reference = photo.get("photo_reference")
            if photo_reference:
                # Construct photo URL
                photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={photo_reference}&key={self.api_key}"
                photo_urls.append(photo_url)
        
        return photo_urls
    
    def _format_route_steps(self, steps: List[Dict]) -> List[Dict]:
        """Format route steps for better readability"""
        formatted_steps = []
        for step in steps:
            formatted_step = {
                "instruction": step["html_instructions"],
                "distance": step["distance"]["text"],
                "duration": step["duration"]["text"],
                "maneuver": step.get("maneuver"),
                "start_location": step["start_location"],
                "end_location": step["end_location"]
            }
            formatted_steps.append(formatted_step)
        return formatted_steps
    
    def search_places_nearby(self, query: str, location: Optional[str] = None, radius: int = 50000) -> Dict[str, Any]:
        """Alternative search method using nearby search"""
        if not self.is_healthy():
            return {"error": "Google Maps service not available", "results": []}
        
        try:
            # If location is provided, use nearby search
            if location:
                # Geocode the location first
                geocode_result = self.client.geocode(location)
                if geocode_result:
                    lat_lng = geocode_result[0]['geometry']['location']
                    
                    # Perform nearby search
                    result = self.client.places_nearby(
                        location=lat_lng,
                        radius=radius,
                        keyword=query
                    )
                    
                    places = result.get('results', [])
                    
                    formatted_places = []
                    for place in places[:10]:
                        formatted_place = {
                            "place_id": place.get("place_id"),
                            "name": place.get("name"),
                            "address": place.get("vicinity"),
                            "rating": place.get("rating"),
                            "user_ratings_total": place.get("user_ratings_total"),
                            "types": place.get("types", []),
                            "geometry": place.get("geometry", {}),
                            "photos": self._format_photos(place.get("photos", []))
                        }
                        formatted_places.append(formatted_place)
                    
                    return {"results": formatted_places, "status": "OK"}
            
            # Fallback to find_place
            return self.search_places(query, location)
            
        except Exception as e:
            logger.error(f"Error in nearby search: {e}")
            return {"error": str(e), "results": []}