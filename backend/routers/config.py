from fastapi import APIRouter, Depends
from services.maps_service import MapsService
from services.gemini_service import GeminiService
from models import MapsConfig, AppConfig

router = APIRouter()

def get_maps_service() -> MapsService:
    return MapsService()

def get_gemini_service() -> GeminiService:
    return GeminiService()

@router.get("/maps-key", response_model=MapsConfig)
def get_maps_key(maps_service: MapsService = Depends(get_maps_service)):
    """Get Google Maps API key for frontend"""
    return MapsConfig(mapsApiKey=maps_service.get_api_key())

@router.get("/app", response_model=AppConfig)
def get_app_config(
    maps_service: MapsService = Depends(get_maps_service),
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """Get application configuration"""
    features = []
    if maps_service.is_healthy():
        features.append("Google Maps Integration")
    if gemini_service.is_healthy():
        features.append("AI-Powered Planning")
    
    return AppConfig(
        maps=MapsConfig(mapsApiKey=maps_service.get_api_key()),
        features=features,
        version="2.0.0"
    )