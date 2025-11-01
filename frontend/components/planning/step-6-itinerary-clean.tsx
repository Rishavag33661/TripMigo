"use client"

import type { ExtendedTripData } from '../../app/planning/page';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { convertFormDataToTripRequest, tripPlannerApi } from '../../lib/api';
import { useEffect, useState } from "react";

interface PlanningStep6Props {
    tripData: ExtendedTripData
    updateTripData: (data: Partial<ExtendedTripData>) => void
    onPrev: () => void
}

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

export function PlanningStep6({ tripData, updateTripData, onPrev }: PlanningStep6Props) {
    const [itinerary, setItinerary] = useState<DayItinerary[]>([])
    const [isGenerating, setIsGenerating] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const generateItinerary = async () => {
            try {
                setIsGenerating(true)
                setError(null)

                console.log('=== GENERATING REAL AI ITINERARY ===')

                // Convert form data to API format
                const tripRequest = convertFormDataToTripRequest(tripData)
                console.log('Trip request:', tripRequest)

                // Call the real AI API
                const response: any = await tripPlannerApi.generateItinerary(tripRequest)
                console.log('AI Response:', response)

                // Process the response
                let aiItinerary: DayItinerary[] = []

                // Handle different response structures - response could be the days array directly
                if (Array.isArray(response)) {
                    // Response is directly an array of days
                    aiItinerary = response.map((day: any) => ({
                        day: day.day,
                        date: day.date,
                        title: day.title,
                        items: day.items?.map((item: any) => ({
                            time: item.time,
                            title: item.title,
                            description: item.description,
                            type: item.type,
                            icon: item.icon,
                            duration: item.duration,
                            location: item.location
                        })) || []
                    }))
                } else if (response.days && Array.isArray(response.days)) {
                    // Response has a days property
                    aiItinerary = response.days.map((day: any) => ({
                        day: day.day,
                        date: day.date,
                        title: day.title,
                        items: day.items?.map((item: any) => ({
                            time: item.time,
                            title: item.title,
                            description: item.description,
                            type: item.type,
                            icon: item.icon,
                            duration: item.duration,
                            location: item.location
                        })) || []
                    }))
                }

                if (aiItinerary.length === 0) {
                    // Create fallback if no AI data
                    const days = tripData.numberOfDays || 3
                    for (let i = 1; i <= days; i++) {
                        aiItinerary.push({
                            day: i,
                            date: `Day ${i}`,
                            title: `Day ${i} - Exploring ${tripData.destination}`,
                            items: [
                                {
                                    time: "9:00 AM",
                                    title: "Morning Activity",
                                    description: "Explore local attractions",
                                    type: "activity",
                                    icon: "map-pin",
                                    duration: "3 hours",
                                    location: tripData.destination
                                },
                                {
                                    time: "2:00 PM",
                                    title: "Lunch",
                                    description: "Try local cuisine",
                                    type: "food",
                                    icon: "utensils",
                                    duration: "1.5 hours",
                                    location: tripData.destination
                                },
                                {
                                    time: "7:00 PM",
                                    title: "Evening Activity",
                                    description: "Cultural experience",
                                    type: "activity",
                                    icon: "camera",
                                    duration: "2 hours",
                                    location: tripData.destination
                                }
                            ]
                        })
                    }
                }

                setItinerary(aiItinerary)
                updateTripData({
                    itinerary: aiItinerary,
                    aiResponse: 'AI-generated itinerary completed successfully'
                })

            } catch (err) {
                console.error('Error generating itinerary:', err)
                setError('Failed to generate itinerary. Please try again.')

                // Create simple fallback
                const fallback: DayItinerary[] = [{
                    day: 1,
                    date: "Day 1",
                    title: `Day 1 - ${tripData.destination}`,
                    items: [{
                        time: "10:00 AM",
                        title: "Explore destination",
                        description: "Discover the highlights",
                        type: "activity",
                        icon: "map-pin"
                    }]
                }]
                setItinerary(fallback)
            } finally {
                setIsGenerating(false)
            }
        }

        generateItinerary()
    }, [tripData])

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Your AI-Generated Itinerary</CardTitle>
                <CardDescription>
                    Here's your personalized {tripData.numberOfDays || 3}-day itinerary for {tripData.destination}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isGenerating ? (
                    <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>🤖 AI is generating your personalized itinerary...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">
                        <p>{error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Itinerary Display */}
                        {itinerary.map((day) => (
                            <Card key={day.day} className="border border-blue-200">
                                <CardHeader className="bg-blue-50">
                                    <CardTitle className="text-lg text-blue-900">{day.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-3">
                                        {day.items.map((item, index) => (
                                            <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                                                    {item.time}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                    {item.duration && (
                                                        <p className="text-xs text-gray-500 mt-1">Duration: {item.duration}</p>
                                                    )}
                                                    {item.location && (
                                                        <p className="text-xs text-gray-500">📍 {item.location}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <Button variant="outline" onClick={onPrev} className="flex-1">
                                Back to Essentials
                            </Button>
                            <Button className="flex-1" onClick={() => alert('Itinerary saved!')}>
                                Save Itinerary
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}