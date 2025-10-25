#!/bin/bash

# TripMigo Environment Setup Script
# Run this script after cloning the repository to set up your environment

echo "🚀 Setting up TripMigo environment..."

# Create backend .env file
echo "📝 Creating backend .env file..."
cat > backend/.env << EOF
# Environment variables for backend
# Get these API keys from Google Cloud Console
GOOGLE_AI_API_KEY="your_google_ai_api_key_here"
GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"

# Database (optional - for production use)
DATABASE_URL="sqlite:///./trip_planner.db"

# JWT Settings  
JWT_SECRET_KEY="your-super-secret-jwt-key-change-in-production"

# Server Configuration
PORT=8000
ENVIRONMENT=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF

# Create frontend .env.local file
echo "📝 Creating frontend .env.local file..."
cat > frontend/.env.local << EOF
# TripMigo Frontend Environment Variables

# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Google Maps API Key (will be fetched from backend)
# For testing purposes, you can get a free API key from Google Cloud Console
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Additional Google API Keys (optional)
GOOGLE_API_KEY=your_google_maps_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=TripMigo
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

echo "✅ Environment files created!"
echo ""
echo "🔑 Next steps:"
echo "1. Get your Google API keys from: https://console.cloud.google.com/"
echo "2. Edit backend/.env and add your GOOGLE_AI_API_KEY and GOOGLE_MAPS_API_KEY"
echo "3. Edit frontend/.env.local and add your Google Maps API key"
echo "4. Run the application with: npm run dev (frontend) and python main.py (backend)"
echo ""
echo "📚 For detailed setup instructions, see DEPLOYMENT.md"