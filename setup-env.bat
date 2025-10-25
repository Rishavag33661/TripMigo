@echo off
REM TripMigo Environment Setup Script for Windows
REM Run this script after cloning the repository to set up your environment

echo 🚀 Setting up TripMigo environment...

REM Create backend .env file
echo 📝 Creating backend .env file...
(
echo # Environment variables for backend
echo # Get these API keys from Google Cloud Console
echo GOOGLE_AI_API_KEY="your_google_ai_api_key_here"
echo GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"
echo.
echo # Database ^(optional - for production use^)
echo DATABASE_URL="sqlite:///./trip_planner.db"
echo.
echo # JWT Settings  
echo JWT_SECRET_KEY="your-super-secret-jwt-key-change-in-production"
echo.
echo # Server Configuration
echo PORT=8000
echo ENVIRONMENT=development
echo.
echo # CORS Configuration
echo ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
) > backend\.env

REM Create frontend .env.local file
echo 📝 Creating frontend .env.local file...
(
echo # TripMigo Frontend Environment Variables
echo.
echo # Backend API Configuration
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
echo.
echo # Google Maps API Key ^(will be fetched from backend^)
echo # For testing purposes, you can get a free API key from Google Cloud Console
echo NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
echo.
echo # Additional Google API Keys ^(optional^)
echo GOOGLE_API_KEY=your_google_maps_api_key_here
echo GOOGLE_AI_API_KEY=your_google_ai_api_key_here
echo.
echo # Development Settings
echo NODE_ENV=development
echo NEXT_PUBLIC_APP_NAME=TripMigo
echo NEXT_PUBLIC_APP_VERSION=1.0.0
) > frontend\.env.local

echo ✅ Environment files created!
echo.
echo 🔑 Next steps:
echo 1. Get your Google API keys from: https://console.cloud.google.com/
echo 2. Edit backend\.env and add your GOOGLE_AI_API_KEY and GOOGLE_MAPS_API_KEY
echo 3. Edit frontend\.env.local and add your Google Maps API key
echo 4. Run the application with: npm run dev ^(frontend^) and python main.py ^(backend^)
echo.
echo 📚 For detailed setup instructions, see DEPLOYMENT.md

pause