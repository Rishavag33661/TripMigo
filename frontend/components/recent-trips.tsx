"use client"

import { Calendar, MapPin, Star, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

interface UserTrip {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
    location: string
  }
  destination: string
  duration: string
  groupSize: number
  rating: number
  date: string
  highlights: string[]
  review: string
}

export function RecentTrips() {
  const [trips, setTrips] = useState<UserTrip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/destinations/trips/recent`)
        const data = await response.json()
        setTrips(data.trips)
      } catch (error) {
        console.error("Error fetching recent trips:", error)
        // Fallback data if API fails
        setTrips([
          {
            id: "sarah-tokyo-trip",
            user: {
              name: "Sarah Johnson",
              avatar: "/woman-profile.png",
              initials: "SJ",
              location: "San Francisco, CA"
            },
            destination: "Tokyo, Japan",
            duration: "7 days",
            groupSize: 2,
            rating: 5,
            date: "March 2024",
            highlights: ["Cherry Blossoms", "Traditional Food", "Cultural Sites"],
            review: "Absolutely magical experience! The cherry blossoms were in full bloom and the cultural immersion was incredible."
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {trips.map((trip) => (
        <Card key={trip.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={trip.user.avatar} alt={trip.user.name} />
                <AvatarFallback>{trip.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{trip.user.name}</h3>
                  <span className="text-sm text-muted-foreground"></span>
                  <span className="text-sm text-muted-foreground">{trip.user.location}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{trip.groupSize} {trip.groupSize === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < trip.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium">{trip.rating}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {trip.review}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {trip.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}