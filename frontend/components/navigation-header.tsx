"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { MobileMenu } from "./mobile-menu"
import { ThemeToggle } from "./theme-toggle"
import { useTripData } from "./trip-data-manager"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

// Custom SVG components
const Plane = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const Menu = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const Home = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
  </svg>
)

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="3,6 5,6 21,6" strokeWidth={2} />
    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" strokeWidth={2} />
    <line x1="10" y1="11" x2="10" y2="17" strokeWidth={2} />
    <line x1="14" y1="11" x2="14" y2="17" strokeWidth={2} />
  </svg>
)

const BookOpen = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

interface NavigationHeaderProps {
  currentPage?: "home" | "planning" | "advanced" | "landing" | "itineraries"
}

export function NavigationHeader({ currentPage = "home" }: NavigationHeaderProps) {
  const { tripData, clearTripData, hasStartedPlanning, isBasicPlanningComplete, isPlanningComplete } = useTripData()
  const [desktopMenuOpen, setDesktopMenuOpen] = React.useState(false)
  const [currentLocation, setCurrentLocation] = React.useState<string>("")
  const [locationError, setLocationError] = React.useState<string>("")
  const router = useRouter()

  // Get user's current location
  React.useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            try {
              // Use a free geocoding service (no API key needed)
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              )
              const data = await response.json()

              if (data.city && data.countryName) {
                setCurrentLocation(`${data.city}, ${data.countryName}`)
              } else if (data.locality && data.countryName) {
                setCurrentLocation(`${data.locality}, ${data.countryName}`)
              } else if (data.countryName) {
                setCurrentLocation(data.countryName)
              } else {
                // Fallback: just show coordinates
                setCurrentLocation(`${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`)
              }
            } catch (error) {
              console.error("Error getting location name:", error)
              // Fallback: just show coordinates
              setCurrentLocation(`${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`)
            }
          },
          (error) => {
            console.error("Error getting location:", error)
            setLocationError("Location access denied")
            setCurrentLocation("Location unavailable")
          },
          {
            enableHighAccuracy: false, // Use less battery
            timeout: 10000,
            maximumAge: 600000 // Cache for 10 minutes
          }
        )
      } else {
        setLocationError("Geolocation not supported")
        setCurrentLocation("Location not supported")
      }
    }

    getCurrentLocation()
  }, [])

  const handleClearTrip = () => {
    if (confirm("Are you sure you want to clear all trip data? This will reset your planning form.")) {
      clearTripData()
      setDesktopMenuOpen(false)
      // Use window.location.replace to force URL change and step reset
      window.location.replace("/planning?step=1")
    }
  }

  // Close desktop menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopMenuOpen && !(event.target as Element).closest('.desktop-menu-container')) {
        setDesktopMenuOpen(false)
      }
    }

    if (desktopMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [desktopMenuOpen])

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">TripMigo</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Current Location Indicator */}
            {currentLocation && (
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {currentLocation}
                </Badge>
                {tripData.itinerary && tripData.itinerary.length > 0 && (
                  <Badge className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Ready
                  </Badge>
                )}
              </div>
            )}

            <ThemeToggle />

            {/* Mobile Menu */}
            <MobileMenu currentPage={currentPage} />

            {/* Desktop Menu - Custom Dropdown */}
            <div className="relative hidden md:block desktop-menu-container">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() => {
                  console.log("Desktop menu button clicked")
                  setDesktopMenuOpen(!desktopMenuOpen)
                }}
              >
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </Button>

              {desktopMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999] p-1 smooth-transition">
                  <Link
                    href="/home"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm nav-smooth"
                    onClick={() => setDesktopMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    href="/planning"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm nav-smooth"
                    onClick={() => setDesktopMenuOpen(false)}
                  >
                    <MapPin className="h-4 w-4" />
                    Start Planning
                    {isBasicPlanningComplete() && <Badge variant="secondary" className="ml-auto">In Progress</Badge>}
                  </Link>
                  <Link
                    href="/itineraries"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm nav-smooth"
                    onClick={() => setDesktopMenuOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    Saved Itineraries
                  </Link>
                  <div className="border-t my-1"></div>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm nav-smooth"
                    onClick={() => setDesktopMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Login
                  </Link>
                  {(currentPage === "planning" || currentPage === "advanced") && hasStartedPlanning() && (
                    <>
                      <div className="border-t my-1"></div>
                      <button
                        type="button"
                        onClick={handleClearTrip}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-sm text-destructive w-full text-left nav-smooth"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear Trip Data
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
