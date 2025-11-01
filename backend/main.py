from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import destinations, itinerary, config, auth, planning
from routers import hotels_simple as hotels
from services.gemini_service import GeminiService
from services.maps_service import MapsService
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="TripMigo AI API",
    description="AI-powered travel planning API with Gemini and Google Maps integration",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "https://trip-migo.vercel.app",
        "https://tripmigo.vercel.app",
        os.getenv("FRONTEND_URL", "https://tripmigo.vercel.app")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
gemini_service = GeminiService()
maps_service = MapsService()

# Include routers
app.include_router(config.router, prefix="/config", tags=["config"])
app.include_router(destinations.router, prefix="/destinations", tags=["destinations"])
app.include_router(itinerary.router, prefix="/itinerary", tags=["itinerary"])
app.include_router(planning.router, prefix="/planning", tags=["planning"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(hotels.router, prefix="/hotels", tags=["hotels"])

@app.get("/")
def root():
    return {
        "message": "TripMigo AI API is running!",
        "version": "2.0.0",
        "mode": "production",
        "features": ["Gemini AI", "Google Maps", "Smart Planning"]
    }

@app.get("/health")
def health_check():
    import os
    return {
        "status": "healthy",
        "services": {
            "gemini": gemini_service.is_healthy(),
            "maps": maps_service.is_healthy()
        },
        "environment": {
            "gemini_api_configured": bool(os.getenv("GOOGLE_AI_API_KEY")),
            "maps_api_configured": bool(os.getenv("GOOGLE_MAPS_API_KEY")),
            "dotenv_file_exists": os.path.exists(".env")
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
