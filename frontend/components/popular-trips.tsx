"use client"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Clock, MapPin, Star, Users } from 'lucide-react'
import { useEffect, useState } from "react"

interface Trip {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
    location: string
  }
  destination: string
  duration: string
  group_size: number
  highlights: string[]
  date: string
  rating: number
  review: string
}

export function PopularTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/destinations/trips/popular`)
        const data = await response.json()
        setTrips(data.trips)
      } catch (error) {
        console.error('Error fetching popular trips:', error)
        // Fallback to mock data if API fails
        setTrips([])
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
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {trips.map((trip) => (
        <Card key={trip.id} className="group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src={trip.user.avatar}
                  alt={trip.destination}
                  className="w-full h-48 md:h-full object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {trip.destination}
                  </h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{trip.rating}</span>
                    <span className="text-gray-500">by {trip.user.name}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{trip.review}</p>

                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {trip.destination}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{trip.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">{trip.group_size} people</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {trip.highlights.map((highlight: string) => (
                    <Badge key={highlight} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full md:w-auto">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}