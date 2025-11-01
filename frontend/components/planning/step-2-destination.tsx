"use client"

import type React from "react"

import type { TripData } from '../../app/planning/page'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { convertFormDataToTripRequest, tripPlannerApi } from '../../lib/api'
import { useState } from "react"

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const Plane = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

interface PlanningStep2Props {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onNext: () => void
  onPrev: () => void
}

const popularDestinations = [
  { name: "Paris, France", rating: 4.8, highlights: ["Eiffel Tower", "Louvre", "Seine River"] },
  { name: "Tokyo, Japan", rating: 4.9, highlights: ["Shibuya", "Mount Fuji", "Temples"] },
  { name: "Bali, Indonesia", rating: 4.7, highlights: ["Rice Terraces", "Beaches", "Temples"] },
  { name: "New York, USA", rating: 4.6, highlights: ["Times Square", "Central Park", "Museums"] },
  { name: "Rome, Italy", rating: 4.8, highlights: ["Colosseum", "Vatican", "Trevi Fountain"] },
  { name: "Barcelona, Spain", rating: 4.7, highlights: ["Sagrada Familia", "Park Güell", "Gothic Quarter"] },
  { name: "Santorini, Greece", rating: 4.9, highlights: ["Sunsets", "White Buildings", "Beaches"] },
  { name: "Dubai, UAE", rating: 4.5, highlights: ["Burj Khalifa", "Desert Safari", "Shopping"] },
]

export function PlanningStep2({ tripData, updateTripData, onNext, onPrev }: PlanningStep2Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [previewItinerary, setPreviewItinerary] = useState<any>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const filteredDestinations = popularDestinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDestinationSelect = (destination: string) => {
    updateTripData({ destination })
    setIsDialogOpen(false)
    // Clear previous preview when destination changes
    setPreviewItinerary(null)
    setPreviewError(null)
  }

  const generatePreviewItinerary = async () => {
    if (!tripData.destination) return

    setIsGeneratingPreview(true)
    setPreviewError(null)

    try {
      // Create a minimal trip request for preview
      const previewRequest = convertFormDataToTripRequest({
        ...tripData,
        // Use defaults if not filled yet
        numberOfPeople: tripData.numberOfPeople || 2,
        numberOfDays: tripData.numberOfDays || 3,
        budget: tripData.budget || "medium",
        sourceLocation: tripData.sourceLocation || "Current Location",
        interests: tripData.interests?.length ? tripData.interests : ["sightseeing"],
        travelStyle: tripData.travelStyle || "moderate"
      })

      console.log('Sending request:', previewRequest)
      const response = await tripPlannerApi.generateItinerary(previewRequest)
      console.log('Received response:', response)

      // Handle different possible response structures
      let itineraryData = response
      if (response.itinerary) {
        itineraryData = response.itinerary
      }
      if (response.days) {
        itineraryData = { days: response.days }
      }

      console.log('Processed itinerary data:', itineraryData)
      setPreviewItinerary(itineraryData)
    } catch (error) {
      console.error('Error generating preview:', error)
      setPreviewError('Unable to generate preview. Please try again.')
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tripData.destination) {
      onNext()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Destination</CardTitle>
        <CardDescription>
          Where would you like to go? Select from popular destinations or search for your own.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selected Destination Display */}
          {tripData.destination && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Selected Destination:</span>
                  <span className="text-primary">{tripData.destination}</span>
                </div>
              </div>

              {/* AI Preview Section */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-blue-900">Preview AI Itinerary</h3>
                  <Button
                    onClick={generatePreviewItinerary}
                    disabled={isGeneratingPreview}
                    variant="outline"
                    size="sm"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300"
                  >
                    {isGeneratingPreview ? "Generating..." : "Generate Preview"}
                  </Button>
                </div>

                {previewError && (
                  <Alert className="mb-3 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{previewError}</AlertDescription>
                  </Alert>
                )}

                {previewItinerary ? (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700 mb-2">
                      ✨ Here's a preview of what AI can generate for {tripData.destination}:
                    </p>

                    {/* Debug info - remove in production */}
                    <details className="mb-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-20">
                        {JSON.stringify(previewItinerary, null, 2)}
                      </pre>
                    </details>

                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {/* Try different possible data structures */}
                      {(previewItinerary.days || previewItinerary.itinerary?.days || (Array.isArray(previewItinerary) ? previewItinerary : []))
                        ?.slice(0, 2).map((day: any, index: number) => (
                          <div key={index} className="bg-white p-3 rounded border border-blue-100">
                            <h4 className="font-medium text-blue-900 text-sm">
                              {day.title || day.date || `Day ${day.day || index + 1}`}
                            </h4>
                            <p className="text-xs text-blue-600 mt-1">
                              {day.items?.slice(0, 2).map((item: any) =>
                                item.title || item.name || item.activity || 'Activity'
                              ).join(" • ")}
                              {day.items?.length > 2 && ` • +${day.items.length - 2} more...`}
                              {!day.items?.length && "Sample activities for this day"}
                            </p>
                          </div>
                        ))}

                      {/* Fallback if no days found */}
                      {!(previewItinerary.days || previewItinerary.itinerary?.days || Array.isArray(previewItinerary)) && (
                        <div className="bg-white p-3 rounded border border-blue-100">
                          <p className="text-xs text-blue-600">
                            AI generated an itinerary for {tripData.destination} - data structure received successfully!
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 italic mt-2">
                      Complete detailed itinerary will be generated in Step 6 with all your preferences!
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-blue-600">
                    Click "Generate Preview" to see what our AI can create for your {tripData.destination} trip!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Destination Selector */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Destination</Label>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left h-12 bg-transparent" type="button">
                  <Search className="h-4 w-4 mr-2" />
                  {tripData.destination || "Search and select destination..."}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Your Destination</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Popular Destinations */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {searchQuery ? "Search Results" : "Popular Destinations"}
                    </h3>
                    <div className="grid gap-2">
                      {filteredDestinations.map((destination) => (
                        <Button
                          key={destination.name}
                          variant="ghost"
                          className="justify-start h-auto p-4 text-left"
                          onClick={() => handleDestinationSelect(destination.name)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <Plane className="h-5 w-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{destination.name}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                                  <span className="text-xs">{destination.rating}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {destination.highlights.map((highlight, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onPrev} className="flex-1 bg-transparent">
              Previous
            </Button>
            <Button type="submit" className="flex-1" disabled={!tripData.destination}>
              Continue to Travel Options
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
