<<<<<<< HEAD
# TripMigo
=======
# 🌍 TripMigo - AI-Powered Travel Planning Platform

A modern, full-stack travel planning application that uses AI to create personalized itineraries with Google Maps integration.

![TripMigo Banner](public/placeholder-logo.svg)

## ✨ Features

- 🤖 **AI-Powered Itinerary Generation** - Create personalized travel plans using Google's Gemini AI
- 🗺️ **Interactive Maps** - Google Maps integration for location search and visualization
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🎨 **Modern UI** - Beautiful interface built with Next.js and Tailwind CSS
- 🔄 **Real-time Updates** - Dynamic itinerary generation and modification
- 🎯 **Smart Recommendations** - AI suggests attractions, restaurants, and activities
- 📊 **Trip Management** - Save, edit, and manage multiple trip plans

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library
- **Google Maps API** - Interactive maps and location services

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini AI** - Advanced language model for itinerary generation
- **Google Maps Services** - Places API, Geocoding, Directions
- **Pydantic** - Data validation and serialization
- **CORS Middleware** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- Google Cloud Console account (for API keys)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/tripmigo.git
cd tripmigo
```

### 2. Set Up Environment Variables
Run the setup script for your platform:

**Windows:**
```cmd
setup-env.bat
```

**macOS/Linux:**
```bash
chmod +x setup-env.sh
./setup-env.sh
```

### 3. Get API Keys
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Generative Language API (Gemini)
4. Create API credentials and add them to your environment files

### 4. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 5. Run the Application

**Backend (Terminal 1):**
```bash
cd backend
python main.py
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🚀 Deployment

TripMigo is ready for free deployment on modern platforms:

- **Frontend**: Vercel (free tier)
- **Backend**: Railway (free $5 monthly credit)
- **Total Cost**: $0/month

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

## 📁 Project Structure

```
tripmigo/
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities and configurations
│   └── public/              # Static assets
├── backend/                 # FastAPI Python application
│   ├── routers/            # API route handlers
│   ├── services/           # Business logic services
│   └── main.py             # Application entry point
├── DEPLOYMENT.md           # Deployment guide
└── setup-env.*            # Environment setup scripts
```

## 🔐 Security Notes

- ⚠️ **Never commit API keys** to version control
- 🔒 Environment files (`.env`, `.env.local`) are gitignored
- 🛡️ Use the provided setup scripts to create environment files
- 🔑 Rotate API keys regularly in production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps Platform for location services
- Google Gemini AI for intelligent itinerary generation
- Vercel and Railway for free hosting platforms
- The open-source community for amazing tools and libraries

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/tripmigo/issues) page
2. Review the [DEPLOYMENT.md](DEPLOYMENT.md) guide
3. Create a new issue with detailed information

---

**Built with ❤️ for travelers who love technology**
>>>>>>> d0ab958 (Removed hardcoded API keys)
