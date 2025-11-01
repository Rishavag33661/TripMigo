"use client"

import { NavigationHeader } from "@/components/navigation-header"
import { PlanningProgress } from "@/components/planning/planning-progress"
import { PlanningStep1 } from "@/components/planning/step-1-basic-details"
import { PlanningStep2 } from "@/components/planning/step-2-destination"
import { PlanningStep3 } from "@/components/planning/step-3-travel"
import { PlanningStep4 } from "@/components/planning/step-4-hotels"
import { PlanningStep5 } from "@/components/planning/step-5-essentials"
import { PlanningStep6 } from "@/components/planning/step-6-itinerary"
import { useTripData } from "@/components/trip-data-manager"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Custom SVG for Trash icon
const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="3,6 5,6 21,6" strokeWidth={2} />
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" strokeWidth={2} />
    <line x1="10" y1="11" x2="10" y2="17" strokeWidth={2} />
    <line x1="14" y1="11" x2="14" y2="17" strokeWidth={2} />
  </svg>
)

export interface TripData {
  numberOfPeople: number
  numberOfDays: number
  foodPreference: "veg" | "non-veg"
  budget: number
  sourceLocation: string
  destination: string
  travelMode: string
  selectedHotel: string
  selectedEssentials: string[]
  itinerary: any[]
  // Additional fields for backend integration
  duration?: string | number
  interests?: string[]
  travelStyle?: string
  accessibility?: string
  startLocation?: string
  travelers?: any
  // Backend response fields
  aiResponse?: string
  placeDetails?: any
}

// Alias for compatibility with existing components
export type ExtendedTripData = TripData

export default function PlanningPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { tripData, updateTripData, clearTripData, hasStartedPlanning } = useTripData()
  const router = useRouter()

  const handleClearTrip = () => {
    if (confirm("Are you sure you want to clear all trip data? This will reset your planning form and take you back to step 1.")) {
      clearTripData()
      setCurrentStep(1)
      router.push("/planning")
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const stepParam = urlParams.get("step")

    if (stepParam) {
      const step = Number.parseInt(stepParam)
      if (step >= 1 && step <= 6) {
        setCurrentStep(step)
        return
      }
    }

    // Determine current step based on completed data only on initial load
    if (tripData.itinerary && tripData.itinerary.length > 0) {
      setCurrentStep(6)
    } else if (tripData.selectedEssentials && tripData.selectedEssentials.length > 0) {
      setCurrentStep(5)
    } else if (tripData.selectedHotel) {
      setCurrentStep(4)
    } else if (tripData.travelMode) {
      setCurrentStep(3)
    } else if (tripData.destination) {
      setCurrentStep(2)
    } else {
      setCurrentStep(1)
    }
  }, [tripData])

  // Separate effect to handle URL parameter changes
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const stepParam = urlParams.get("step")

      if (stepParam) {
        const step = Number.parseInt(stepParam)
        if (step >= 1 && step <= 6) {
          setCurrentStep(step)
        }
      }
    }

    // Listen for URL changes
    window.addEventListener('popstate', handleUrlChange)

    // Check URL on mount
    handleUrlChange()

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  const nextStep = () => {
    if (currentStep < 6) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      window.history.replaceState({}, "", `/planning?step=${newStep}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      window.history.replaceState({}, "", `/planning?step=${newStep}`)
    }
  }

  // Validation functions for each step
  const isStep1Valid = () => {
    return tripData.numberOfPeople > 0 && tripData.budget > 0
  }

  const isStep2Valid = () => {
    return isStep1Valid() && tripData.destination.trim() !== ""
  }

  const isStep3Valid = () => {
    return isStep2Valid() && tripData.travelMode.trim() !== ""
  }

  const isStep4Valid = () => {
    return isStep3Valid() && tripData.selectedHotel.trim() !== ""
  }

  const isStep5Valid = () => {
    return isStep4Valid() && tripData.selectedEssentials.length > 0
  }

  const isStep6Valid = () => {
    return isStep5Valid()
  }

  // Get the maximum step the user can navigate to
  const getMaxAllowedStep = () => {
    if (isStep5Valid()) return 6
    if (isStep4Valid()) return 5
    if (isStep3Valid()) return 4
    if (isStep2Valid()) return 3
    if (isStep1Valid()) return 2
    return 1
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 6) {
      const maxAllowed = getMaxAllowedStep()

      // Allow navigation backwards or to current/next allowed step
      if (step <= maxAllowed) {
        setCurrentStep(step)
        window.history.replaceState({}, "", `/planning?step=${step}`)
      } else {
        // Show a helpful message about required fields
        let missingFields = []
        if (!tripData.destination.trim()) missingFields.push("destination")
        if (!tripData.travelMode.trim()) missingFields.push("travel mode")
        if (!tripData.selectedHotel.trim()) missingFields.push("hotel selection")
        if (tripData.selectedEssentials.length === 0) missingFields.push("essentials")

        alert(`Please complete the following required fields first: ${missingFields.join(", ")}`)
      }
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PlanningStep1 tripData={tripData} updateTripData={updateTripData} onNext={nextStep} />
      case 2:
        return <PlanningStep2 tripData={tripData} updateTripData={updateTripData} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <PlanningStep3 tripData={tripData} updateTripData={updateTripData} onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <PlanningStep4 tripData={tripData} updateTripData={updateTripData} onNext={nextStep} onPrev={prevStep} />
      case 5:
        return <PlanningStep5 tripData={tripData} updateTripData={updateTripData} onNext={nextStep} onPrev={prevStep} />
      case 6:
        return <PlanningStep6 tripData={tripData} updateTripData={updateTripData} onPrev={prevStep} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentPage="planning" />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Indicator */}
        <PlanningProgress
          currentStep={currentStep}
          totalSteps={6}
          maxAllowedStep={getMaxAllowedStep()}
          onStepClick={goToStep}
        />

        {/* Step Content */}
        <div className="mt-8 smooth-transition">{renderCurrentStep()}</div>
      </main>
    </div>
  )
}
