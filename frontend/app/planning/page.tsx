"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PlanningPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Plan Your Trip</h1>

        {/* Simple step indicator */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step < currentStep
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Step {currentStep} of 6
          </div>
        </div>

        {/* Simple step content */}
        <div className="bg-card p-6 rounded-lg border">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
              <p className="text-muted-foreground mb-4">Tell us about your trip preferences.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Destination</label>
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Days</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    defaultValue="7"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Choose Destination</h2>
              <p className="text-muted-foreground">Select or confirm your destination details.</p>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Travel Preferences</h2>
              <p className="text-muted-foreground">How do you prefer to travel?</p>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Accommodation</h2>
              <p className="text-muted-foreground">Where would you like to stay?</p>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Travel Essentials</h2>
              <p className="text-muted-foreground">What do you need for your trip?</p>
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>
              <p className="text-muted-foreground">Here's your personalized travel plan!</p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === 6}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 6 ? 'Complete' : 'Next'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
