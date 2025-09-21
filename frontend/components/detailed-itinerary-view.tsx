"use client"

import { GoogleMapsWrapper } from "@/components/google-maps-wrapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, Download, MapPin, Share } from "lucide-react"
import { useState } from "react"

interface ItineraryItem {
    time: string
    title: string
    description: string
    type: "travel" | "accommodation" | "food" | "activity" | "transport"
    icon: string
    duration?: string
    location?: string
}

interface DayItinerary {
    day: number
    date: string
    title: string
    items: ItineraryItem[]
}

interface DetailedItineraryViewProps {
    tripData: any
    itinerary: DayItinerary[]
    onBack: () => void
    onEdit?: () => void
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case "food":
            return "🍽️"
        case "activity":
            return "🎯"
        case "travel":
            return "✈️"
        case "accommodation":
            return "🏨"
        case "transport":
            return "🚗"
        default:
            return "📍"
    }
}

const getTypeColor = (type: string) => {
    switch (type) {
        case "food":
            return "bg-orange-100 text-orange-800 border-orange-200"
        case "activity":
            return "bg-blue-100 text-blue-800 border-blue-200"
        case "travel":
            return "bg-purple-100 text-purple-800 border-purple-200"
        case "accommodation":
            return "bg-green-100 text-green-800 border-green-200"
        case "transport":
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

export function DetailedItineraryView({ tripData, itinerary, onBack, onEdit }: DetailedItineraryViewProps) {
    const [activeDay, setActiveDay] = useState(0)

    const formatDuration = (numberOfDays: number) => {
        return numberOfDays === 1 ? "1 Day" : `${numberOfDays} Days`
    }

    const currentDay = itinerary[activeDay]

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to List
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{tripData.destination}</h1>
                        <p className="text-muted-foreground">
                            {formatDuration(tripData.numberOfDays)} • {tripData.numberOfPeople} People
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {onEdit && (
                        <Button size="sm" onClick={onEdit}>
                            <span className="mr-2">✏️</span>
                            Edit Trip
                        </Button>
                    )}
                    <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Trip Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Trip Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{tripData.numberOfDays}</div>
                            <div className="text-sm text-muted-foreground">Days</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{tripData.numberOfPeople}</div>
                            <div className="text-sm text-muted-foreground">Travelers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">${tripData.budget}</div>
                            <div className="text-sm text-muted-foreground">Budget</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{tripData.travelMode}</div>
                            <div className="text-sm text-muted-foreground">Transport</div>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="secondary">{tripData.foodPreference}</Badge>
                        {tripData.selectedHotel && (
                            <Badge variant="outline">Hotel: {tripData.selectedHotel}</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Main Content - Tabs for different views */}
            <Tabs defaultValue="timeline" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
                    <TabsTrigger value="map">Map View</TabsTrigger>
                </TabsList>

                {/* Timeline View */}
                <TabsContent value="timeline" className="space-y-4">
                    {/* Day Selector */}
                    <div className="flex gap-2 flex-wrap">
                        {itinerary.map((day, index) => (
                            <Button
                                key={day.day}
                                variant={activeDay === index ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveDay(index)}
                            >
                                Day {day.day}
                            </Button>
                        ))}
                    </div>

                    {/* Current Day Timeline */}
                    {currentDay && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    {currentDay.title}
                                </CardTitle>
                                <CardDescription>
                                    {currentDay.date} • {currentDay.items.length} activities planned
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {currentDay.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 border rounded-lg">
                                            {/* Timeline dot */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-lg">{getActivityIcon(item.type)}</span>
                                                </div>
                                                {index < currentDay.items.length - 1 && (
                                                    <div className="w-px h-8 bg-border mt-2" />
                                                )}
                                            </div>

                                            {/* Activity Details */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold text-sm text-muted-foreground">
                                                        {item.time}
                                                    </span>
                                                    <Badge className={getTypeColor(item.type)} variant="outline">
                                                        {item.type}
                                                    </Badge>
                                                    {item.duration && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {item.duration}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-lg">{item.title}</h4>
                                                <p className="text-muted-foreground">{item.description}</p>
                                                {item.location && (
                                                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {item.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Map View */}
                <TabsContent value="map" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Interactive Map - Day {activeDay + 1}
                            </CardTitle>
                            <CardDescription>
                                Explore your activities on the map for {currentDay?.title}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[500px] rounded-lg overflow-hidden border">
                                {currentDay && (
                                    <GoogleMapsWrapper
                                        activities={currentDay.items}
                                        destination={tripData.destination}
                                        dayNumber={currentDay.day}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Day Selector for Map */}
                    <div className="flex gap-2 flex-wrap">
                        {itinerary.map((day, index) => (
                            <Button
                                key={day.day}
                                variant={activeDay === index ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveDay(index)}
                            >
                                Day {day.day} ({day.items.length} activities)
                            </Button>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}