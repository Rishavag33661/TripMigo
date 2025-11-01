"use client"

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react"
import { useEffect, useState } from "react"

interface Destination {
  id: string
  name: string
  country: string
  continent: string
  description: string
  rating: number
  reviewCount: number
  videos: {
    promotional: string
    thumbnail: string
  }
  images: {
    slideshow?: string[]
    hero: string
  }
  tags: string[]
}

export function VideoCarousel() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/destinations/popular?limit=5&t=${Date.now()}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Fetched destinations data:', data)

        // Handle different response structures
        let destinationsArray = []
        if (data.success && data.data) {
          destinationsArray = data.data
        } else if (data.destinations) {
          destinationsArray = data.destinations
        } else if (Array.isArray(data)) {
          destinationsArray = data
        }

        console.log('Processed destinations:', destinationsArray.length)
        setDestinations(destinationsArray)

      } catch (error) {
        console.error("Error fetching destinations:", error)
        setError("Failed to load destinations from API. Using fallback data.")

        // Create fallback destinations
        const fallbackDestinations: Destination[] = [
          {
            id: "paris-france",
            name: "Paris",
            country: "France",
            continent: "Europe",
            description: "The City of Light, famous for its art, fashion, and romance",
            rating: 4.8,
            reviewCount: 2456,
            videos: {
              promotional: "/placeholder.mp4",
              thumbnail: "/european-cities-collage.jpg"
            },
            images: {
              slideshow: [
                "/european-cities-collage.jpg",
                "/placeholder.jpg"
              ],
              hero: "/european-cities-collage.jpg"
            },
            tags: ["Romantic", "Art", "Culture"]
          },
          {
            id: "tokyo-japan",
            name: "Tokyo",
            country: "Japan",
            continent: "Asia",
            description: "A fascinating blend of tradition and modernity",
            rating: 4.7,
            reviewCount: 1834,
            videos: {
              promotional: "/placeholder.mp4",
              thumbnail: "/japan-cherry-blossoms-temples.jpg"
            },
            images: {
              slideshow: [
                "/japan-cherry-blossoms-temples.jpg",
                "/kyoto-japan-temples-cherry-blossoms.jpg"
              ],
              hero: "/japan-cherry-blossoms-temples.jpg"
            },
            tags: ["Culture", "Technology", "Food"]
          },
          {
            id: "santorini-greece",
            name: "Santorini",
            country: "Greece",
            continent: "Europe",
            description: "Stunning sunsets and white-washed buildings",
            rating: 4.9,
            reviewCount: 1567,
            videos: {
              promotional: "/placeholder.mp4",
              thumbnail: "/santorini-greece-sunset-white-buildings.jpg"
            },
            images: {
              slideshow: [
                "/santorini-greece-sunset-white-buildings.jpg",
                "/placeholder.jpg"
              ],
              hero: "/santorini-greece-sunset-white-buildings.jpg"
            },
            tags: ["Romantic", "Beach", "Sunset"]
          }
        ]
        setDestinations(fallbackDestinations)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  // Auto-slideshow for images
  useEffect(() => {
    if (destinations.length === 0) return

    const currentImages = getDestinationImages(destinations[currentIndex])
    console.log('Setting up slideshow for', destinations[currentIndex]?.name, 'with', currentImages.length, 'images')

    if (currentImages.length <= 1) {
      console.log('Only one image, skipping slideshow')
      return
    }

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndex = (prev + 1) % currentImages.length
        console.log('Advancing to image', newIndex + 1, 'of', currentImages.length)
        return newIndex
      })
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [destinations, currentIndex])

  // Auto-advance destinations every 12 seconds with smooth transition
  useEffect(() => {
    if (destinations.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % destinations.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300) // Longer stabilization period
      }, 400) // Longer fade out period
    }, 12000) // Change destination every 12 seconds

    return () => clearInterval(interval)
  }, [destinations.length])

  // Reset image index when destination changes with smooth transition
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [currentIndex])

  const nextSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 400)
  }

  const prevSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 400)
  }

  const goToSlide = (index: number) => {
    if (index === currentIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 400)
  }

  if (loading) {
    return (
      <div className="relative w-full h-96 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading destinations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative w-full h-96 bg-red-100 rounded-lg flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  if (destinations.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">No destinations available</div>
      </div>
    )
  }

  const currentDestination = destinations[currentIndex]

  // Get multiple destination-specific UHD images from API data
  const getDestinationImages = (destination: any) => {
    console.log('Getting images for destination:', destination?.name, destination?.images)

    // First try to use slideshow images from API
    if (destination?.images?.slideshow && destination.images.slideshow.length > 0) {
      console.log('Using slideshow images:', destination.images.slideshow)
      // The backend already has UHD images, so just return them
      return destination.images.slideshow
    }

    // Fallback to hero image if slideshow not available
    if (destination?.images?.hero) {
      console.log('Using hero image:', destination.images.hero)
      return [destination.images.hero]
    }

    console.log('Using fallback image for:', destination?.name)
    // Final fallback
    return ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=3840&h=2160&fit=crop&auto=format&q=95']
  }

  // Debug logging
  console.log('Current destination:', currentDestination?.name)
  console.log('Current destination images:', currentDestination?.images)
  console.log('Slideshow images:', currentDestination?.images?.slideshow)

  return (
    <div className="relative w-full">
      <Card className="relative overflow-hidden mb-6">
        <CardContent className="p-0">
          <div className={`relative aspect-video overflow-hidden transition-all duration-1000 ease-in-out ${isTransitioning ? 'opacity-60 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
            }`}>
            {/* Destination-specific UHD slideshow */}
            <div className="relative w-full h-full">
              {getDestinationImages(currentDestination).map((image: string, index: number) => (
                <img
                  key={`${currentDestination.id}-${index}`}
                  src={image}
                  alt={`${currentDestination?.name || 'Destination'} - view ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1200 ease-in-out ${index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  onError={(e) => {
                    console.log(`Image failed to load: ${image}`)
                    // Set a fallback image if the current image fails
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=3840&h=2160&fit=crop&auto=format&q=95'
                  }}
                  loading="lazy"
                />
              ))}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Image Progress Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {getDestinationImages(currentDestination).map((_: string, index: number) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-80 translate-y-2' : 'opacity-100 translate-y-0'
            }`}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm opacity-90">{currentDestination.country}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{currentDestination.name}</h3>
            <p className="text-sm opacity-90 mb-3 max-w-2xl">{currentDestination.description}</p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{currentDestination.rating}</span>
                <span className="text-xs opacity-75">⭐ Highly Rated</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentDestination.tags && currentDestination.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {destinations.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 ease-in-out hover:scale-110"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 ease-in-out hover:scale-110"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {destinations.length > 1 && (
        <div className="flex gap-3 justify-center overflow-x-auto pb-2">
          {destinations.map((destination, index) => (
            <button
              key={destination.id}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${index === currentIndex
                ? "ring-2 ring-primary ring-offset-2 scale-105 opacity-100 shadow-lg"
                : "opacity-70 hover:opacity-100 hover:scale-102 hover:shadow-md"
                }`}
            >
              <img
                src={destination.videos.thumbnail}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                <div className="text-white text-xs font-medium truncate">
                  {destination.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}