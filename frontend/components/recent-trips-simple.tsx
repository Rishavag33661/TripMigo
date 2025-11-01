"use client"

import { Calendar, MapPin, Star, Users } from "lucide-react"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

const mockTrips = [
    {
        id: "1",
        user: {
            name: "Sarah Johnson",
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
    },
    {
        id: "2",
        user: {
            name: "Mike Chen",
            initials: "MC",
            location: "Toronto, CA"
        },
        destination: "Paris, France",
        duration: "5 days",
        groupSize: 3,
        rating: 4.8,
        date: "February 2024",
        highlights: ["Art Museums", "Fine Dining", "Architecture"],
        review: "Paris exceeded all expectations! The Louvre was incredible and the food scene was outstanding."
    }
]

export function RecentTrips() {
    return (
        <div className="space-y-6">
            {mockTrips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium">{trip.user.initials}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{trip.user.name}</h3>
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