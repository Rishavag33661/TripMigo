"use client"

import { DetailedItineraryView } from "@/components/detailed-itinerary-view"
import { useItineraryStorage } from "@/components/itinerary-storage-manager"
import { NavigationHeader } from "@/components/navigation-header"
import { SavedItinerariesPage } from "@/components/saved-itineraries-page"
import { useTripData } from "@/components/trip-data-manager"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ItinerariesPage() {
  const { updateTripData } = useTripData()
  const { getItinerary } = useItineraryStorage()
  const router = useRouter()
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null)

  const handleLoadItinerary = (itineraryId: string) => {
    const itinerary = getItinerary(itineraryId)
    if (itinerary) {
      // Load the itinerary data into current trip data
      updateTripData(itinerary.tripData)
      // Set the selected itinerary for detailed view
      setSelectedItinerary(itinerary)
    }
  }

  const handleBackToList = () => {
    setSelectedItinerary(null)
  }

  const handleEditItinerary = () => {
    // Navigate to the itinerary step using Next.js router
    router.push("/planning?step=6")
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentPage="itineraries" />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {selectedItinerary ? (
          <DetailedItineraryView
            tripData={selectedItinerary.tripData}
            itinerary={selectedItinerary.tripData.itinerary || []}
            onBack={handleBackToList}
            onEdit={handleEditItinerary}
          />
        ) : (
          <SavedItinerariesPage onLoadItinerary={handleLoadItinerary} />
        )}
      </main>
    </div>
  )
}
