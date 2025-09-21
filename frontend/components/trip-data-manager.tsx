"use client"

import type { ExtendedTripData } from "@/app/planning/page"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Create the context
const TripDataContext = createContext<{
  tripData: ExtendedTripData
  updateTripData: (data: Partial<ExtendedTripData>) => void
  clearTripData: () => void
  hasStartedPlanning: () => boolean
  isBasicPlanningComplete: () => boolean
  isPlanningComplete: () => boolean
  mounted: boolean
} | null>(null)

// Context Provider Component
export function TripDataProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [tripData, setTripData] = useState<ExtendedTripData>({
    numberOfPeople: 1,
    numberOfDays: 3,
    foodPreference: "veg",
    budget: 1000,
    sourceLocation: "",
    destination: "",
    travelMode: "",
    selectedHotel: "",
    selectedEssentials: [],
    itinerary: [],
  })

  // Load data from localStorage on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("tripPlanningData")
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setTripData(parsed)
        } catch (error) {
          console.error("Error loading trip data:", error)
        }
      }
    }
  }, [])

  // Save data to localStorage whenever it changes
  // Update function with persistence
  const updateTripData = (newData: Partial<ExtendedTripData>) => {
    console.log('🔄 TripData update:', newData)
    if (newData.destination) {
      console.log('📍 Destination being set to:', newData.destination)
    }
    setTripData((prev) => {
      const updated = { ...prev, ...newData }
      console.log('💾 Updated tripData:', updated)
      return updated
    })
  }

  // Clear all trip data
  const clearTripData = () => {
    const emptyData: ExtendedTripData = {
      numberOfPeople: 1,
      numberOfDays: 3,
      foodPreference: "veg",
      budget: 1000,
      sourceLocation: "",
      destination: "",
      travelMode: "",
      selectedHotel: "",
      selectedEssentials: [],
      itinerary: [],
    }
    setTripData(emptyData)
    if (typeof window !== "undefined") {
      localStorage.removeItem("tripPlanningData")
    }
  }

  // Check if user has started planning (any field modified from defaults)
  const hasStartedPlanning = () => {
    return (
      tripData.numberOfPeople !== 1 ||
      tripData.foodPreference !== "veg" ||
      tripData.budget !== 1000 ||
      tripData.destination !== "" ||
      tripData.travelMode !== "" ||
      tripData.selectedHotel !== "" ||
      tripData.selectedEssentials.length > 0 ||
      tripData.itinerary.length > 0
    )
  }

  // Check if basic planning is complete
  const isBasicPlanningComplete = () => {
    return !!(tripData.destination && tripData.travelMode && tripData.numberOfPeople > 0)
  }

  // Check if full planning is complete
  const isPlanningComplete = () => {
    return !!(isBasicPlanningComplete() && tripData.selectedHotel && tripData.itinerary.length > 0)
  }

  return (
    <TripDataContext.Provider
      value={{
        tripData,
        updateTripData,
        clearTripData,
        hasStartedPlanning,
        isBasicPlanningComplete,
        isPlanningComplete,
        mounted,
      }}
    >
      {children}
    </TripDataContext.Provider>
  )
}

// Hook to use the context
export function useTripData() {
  const context = useContext(TripDataContext)
  if (!context) {
    throw new Error("useTripData must be used within a TripDataProvider")
  }
  return context
}
