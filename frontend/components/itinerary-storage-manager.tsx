"use client"

import type { ExtendedTripData } from "@/app/planning/page"
import { useEffect, useState } from "react"

export interface SavedItinerary {
  id: string
  name: string
  tripData: ExtendedTripData
  createdAt: string
  updatedAt: string
}

export function useItineraryStorage() {
  const [mounted, setMounted] = useState(false)
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([])

  // Load saved itineraries from localStorage on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("savedItineraries")
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setSavedItineraries(parsed)
        } catch (error) {
          console.error("Error loading saved itineraries:", error)
        }
      }
    }
  }, [])

  // Save itinerary
  const saveItinerary = (tripData: ExtendedTripData, name?: string) => {
    const itineraryName = name || `Trip to ${tripData.destination} - ${new Date().toLocaleDateString()}`
    const newItinerary: SavedItinerary = {
      id: Date.now().toString(),
      name: itineraryName,
      tripData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedItineraries = [...savedItineraries, newItinerary]
    setSavedItineraries(updatedItineraries)

    if (typeof window !== "undefined") {
      localStorage.setItem("savedItineraries", JSON.stringify(updatedItineraries))
    }

    return newItinerary.id
  }

  // Update existing itinerary
  const updateItinerary = (id: string, tripData: ExtendedTripData, name?: string) => {
    const updatedItineraries = savedItineraries.map((itinerary) => {
      if (itinerary.id === id) {
        return {
          ...itinerary,
          name: name || itinerary.name,
          tripData,
          updatedAt: new Date().toISOString(),
        }
      }
      return itinerary
    })

    setSavedItineraries(updatedItineraries)

    if (typeof window !== "undefined") {
      localStorage.setItem("savedItineraries", JSON.stringify(updatedItineraries))
    }
  }

  // Delete itinerary
  const deleteItinerary = (id: string) => {
    const updatedItineraries = savedItineraries.filter((itinerary) => itinerary.id !== id)
    setSavedItineraries(updatedItineraries)

    if (typeof window !== "undefined") {
      localStorage.setItem("savedItineraries", JSON.stringify(updatedItineraries))
    }
  }

  // Get itinerary by ID
  const getItinerary = (id: string) => {
    return savedItineraries.find((itinerary) => itinerary.id === id)
  }

  return {
    savedItineraries,
    saveItinerary,
    updateItinerary,
    deleteItinerary,
    getItinerary,
    mounted,
  }
}
