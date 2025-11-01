"use client"

import { Clock, MapPin, Star, Users } from 'lucide-react'
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

const mockTrips = [
    {
        id: "1",
        user: {
            name: "Sarah Johnson",
            location: "San Francisco, CA"
        },
        destination: "Santorini, Greece",
        duration: "7 days",
        group_size: 2,
        highlights: ["Romantic", "Beach", "Sunset"],
        rating: 5,
        review: "Absolutely magical experience! The sunsets were breathtaking and the local culture was amazing."
    },
    {
        id: "2",
        user: {
            name: "Mike Chen",
            location: "Toronto, CA"
        },
        destination: "Patagonia, Chile",
        duration: "10 days",
        group_size: 4,
        highlights: ["Adventure", "Nature", "Hiking"],
        rating: 4.8,
        review: "Epic hiking adventure with stunning landscapes. Perfect for outdoor enthusiasts!"
    }
]

export function PopularTrips() {
    return (
        <div className="space-y-6">
            {mockTrips.map((trip) => (
                <Card key={trip.id} className="group hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                                <div className={`w-full h-48 md:h-full ${trip.id === "1" ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                                        'bg-gradient-to-br from-green-400 to-green-600'
                                    } rounded-l-lg group-hover:scale-105 transition-transform duration-300`}></div>
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