"use client"

import React from "react"

import type { TripData } from "@/app/planning/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

// Custom SVG components
const Users = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const Calendar = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
  </svg>
)

const MapPin = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

const Utensils = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L17 17l-4-4m-6 6l6-6m2 5l4-4m-6-6l6.5 6.5M12 12L8 8"
    />
  </svg>
)

const DollarSign = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
)

interface PlanningStep1Props {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onNext: () => void
}

export function PlanningStep1({ tripData, updateTripData, onNext }: PlanningStep1Props) {
  const [numberOfPeopleInput, setNumberOfPeopleInput] = React.useState(tripData.numberOfPeople.toString())
  const [numberOfPeopleError, setNumberOfPeopleError] = React.useState<string>("")
  const [numberOfDaysInput, setNumberOfDaysInput] = React.useState((tripData.numberOfDays || 3).toString())
  const [numberOfDaysError, setNumberOfDaysError] = React.useState<string>("")
  const [sourceLocationInput, setSourceLocationInput] = React.useState(tripData.sourceLocation || "")
  const [isDetectingLocation, setIsDetectingLocation] = React.useState(false)
  const [locationError, setLocationError] = React.useState<string>("")

  // Update local input state when tripData changes
  React.useEffect(() => {
    setNumberOfPeopleInput(tripData.numberOfPeople.toString())
    setNumberOfPeopleError("")
  }, [tripData.numberOfPeople])

  React.useEffect(() => {
    setNumberOfDaysInput((tripData.numberOfDays || 3).toString())
    setNumberOfDaysError("")
  }, [tripData.numberOfDays])

  React.useEffect(() => {
    setSourceLocationInput(tripData.sourceLocation || "")
    setLocationError("")
  }, [tripData.sourceLocation])

  // Initialize new fields with default values if they don't exist
  React.useEffect(() => {
    if (tripData.numberOfDays === undefined) {
      updateTripData({ numberOfDays: 3 })
    }
    if (tripData.sourceLocation === undefined) {
      updateTripData({ sourceLocation: "" })
    }
  }, []) // Run only once on mount

  const handleNumberOfPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNumberOfPeopleInput(value)
    setNumberOfPeopleError("") // Clear error when user starts typing

    if (value === '') {
      // Don't update tripData while input is empty
      return
    }

    const numValue = Number(value)
    if (!isNaN(numValue)) {
      // Check if it's not an integer
      if (!Number.isInteger(numValue)) {
        setNumberOfPeopleError("Number of people must be a whole number")
      } else if (numValue < 1) {
        setNumberOfPeopleError("Number of people must be at least 1")
      } else if (numValue > 99) {
        setNumberOfPeopleError("Number of people cannot exceed 99")
      } else {
        updateTripData({ numberOfPeople: numValue })
      }
    }
  }

  const handleNumberOfPeopleBlur = () => {
    // On blur, ensure we have a valid value
    const numValue = Number(numberOfPeopleInput)
    if (isNaN(numValue) || numValue < 1 || !Number.isInteger(numValue)) {
      setNumberOfPeopleInput('1')
      updateTripData({ numberOfPeople: 1 })
      setNumberOfPeopleError("")
    } else if (numValue > 99) {
      setNumberOfPeopleInput('99')
      updateTripData({ numberOfPeople: 99 })
      setNumberOfPeopleError("")
    } else {
      setNumberOfPeopleError("")
    }
  }

  const handleNumberOfDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNumberOfDaysInput(value)
    setNumberOfDaysError("") // Clear error when user starts typing

    if (value === '') {
      // Don't update tripData while input is empty
      return
    }

    const numValue = Number(value)
    if (!isNaN(numValue)) {
      // Check if it's not an integer
      if (!Number.isInteger(numValue)) {
        setNumberOfDaysError("Number of days must be a whole number")
      } else if (numValue < 1) {
        setNumberOfDaysError("Number of days must be at least 1")
      } else if (numValue > 30) {
        setNumberOfDaysError("Number of days cannot exceed 30")
      } else {
        updateTripData({ numberOfDays: numValue })
      }
    }
  }

  const handleNumberOfDaysBlur = () => {
    // On blur, ensure we have a valid value
    const numValue = Number(numberOfDaysInput)
    if (isNaN(numValue) || numValue < 1 || !Number.isInteger(numValue)) {
      setNumberOfDaysInput('3')
      updateTripData({ numberOfDays: 3 })
      setNumberOfDaysError("")
    } else if (numValue > 30) {
      setNumberOfDaysInput('30')
      updateTripData({ numberOfDays: 30 })
      setNumberOfDaysError("")
    } else {
      setNumberOfDaysError("")
    }
  }

  const handleSourceLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSourceLocationInput(value)
    updateTripData({ sourceLocation: value })
    setLocationError("")
  }

  const detectCurrentLocation = () => {
    setIsDetectingLocation(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      setIsDetectingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Use a free geocoding service (Nominatim by OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )

          if (response.ok) {
            const data = await response.json()
            if (data && data.display_name) {
              // Extract city and country for a cleaner display
              const address = data.address || {}
              const city = address.city || address.town || address.village || address.county
              const country = address.country

              let location = data.display_name
              if (city && country) {
                location = `${city}, ${country}`
              }

              setSourceLocationInput(location)
              updateTripData({ sourceLocation: location })
            } else {
              // Fallback to coordinates if no address found
              const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              setSourceLocationInput(locationString)
              updateTripData({ sourceLocation: locationString })
            }
          } else {
            // Fallback to coordinates if API fails
            const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setSourceLocationInput(locationString)
            updateTripData({ sourceLocation: locationString })
          }
        } catch (error) {
          // Fallback to coordinates if everything fails
          const { latitude, longitude } = position.coords
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          setSourceLocationInput(locationString)
          updateTripData({ sourceLocation: locationString })
        } finally {
          setIsDetectingLocation(false)
        }
      },
      (error) => {
        let errorMessage = "Unable to detect location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setLocationError(errorMessage)
        setIsDetectingLocation(false)
      },
      {
        timeout: 10000,
        enableHighAccuracy: true
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Basic Trip Details</CardTitle>
        <CardDescription>Let's start with some basic information about your trip</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Number of People */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Users />
              Number of People
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center group">
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={numberOfPeopleInput}
                    onChange={handleNumberOfPeopleChange}
                    onBlur={handleNumberOfPeopleBlur}
                    className={`w-24 pr-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 ${numberOfPeopleError ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    style={{
                      MozAppearance: 'textfield' // Firefox
                    }}
                  />
                  <div className="absolute right-1 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        const currentValue = parseInt(numberOfPeopleInput) || 1
                        const newValue = Math.min(99, currentValue + 1)
                        setNumberOfPeopleInput(newValue.toString())
                        updateTripData({ numberOfPeople: newValue })
                      }}
                      className="h-4 w-6 flex items-center justify-center hover:bg-muted/50 dark:hover:bg-muted/80 rounded-sm text-xs leading-none transition-colors"
                      aria-label="Increase number of people"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentValue = parseInt(numberOfPeopleInput) || 1
                        const newValue = Math.max(1, currentValue - 1)
                        setNumberOfPeopleInput(newValue.toString())
                        updateTripData({ numberOfPeople: newValue })
                      }}
                      className="h-4 w-6 flex items-center justify-center hover:bg-muted/50 dark:hover:bg-muted/80 rounded-sm text-xs leading-none transition-colors"
                      aria-label="Decrease number of people"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {tripData.numberOfPeople === 1 ? "Solo traveler" : `${tripData.numberOfPeople} travelers`}
                </span>
              </div>
              {numberOfPeopleError && (
                <p className="text-sm text-destructive">{numberOfPeopleError}</p>
              )}
            </div>
          </div>

          {/* Number of Days */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Calendar />
              Number of Days
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center group">
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={numberOfDaysInput}
                    onChange={handleNumberOfDaysChange}
                    onBlur={handleNumberOfDaysBlur}
                    className={`w-24 pr-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 ${numberOfDaysError ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    style={{
                      MozAppearance: 'textfield' // Firefox
                    }}
                  />
                  <div className="absolute right-1 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        const currentValue = parseInt(numberOfDaysInput) || 3
                        const newValue = Math.min(30, currentValue + 1)
                        setNumberOfDaysInput(newValue.toString())
                        updateTripData({ numberOfDays: newValue })
                      }}
                      className="h-4 w-6 flex items-center justify-center hover:bg-muted/50 dark:hover:bg-muted/80 rounded-sm text-xs leading-none transition-colors"
                      aria-label="Increase number of days"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentValue = parseInt(numberOfDaysInput) || 3
                        const newValue = Math.max(1, currentValue - 1)
                        setNumberOfDaysInput(newValue.toString())
                        updateTripData({ numberOfDays: newValue })
                      }}
                      className="h-4 w-6 flex items-center justify-center hover:bg-muted/50 dark:hover:bg-muted/80 rounded-sm text-xs leading-none transition-colors"
                      aria-label="Decrease number of days"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {(tripData.numberOfDays || 3) === 1 ? "1 day trip" : `${tripData.numberOfDays || 3} days trip`}
                </span>
              </div>
              {numberOfDaysError && (
                <p className="text-sm text-destructive">{numberOfDaysError}</p>
              )}
            </div>
          </div>

          {/* Source Location */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <MapPin />
              Departure Location
            </Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter your departure city or location"
                  value={sourceLocationInput}
                  onChange={handleSourceLocationChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={detectCurrentLocation}
                  disabled={isDetectingLocation}
                  className="px-3 whitespace-nowrap"
                >
                  {isDetectingLocation ? "Detecting..." : "Auto-detect"}
                </Button>
              </div>
              {locationError && (
                <p className="text-sm text-destructive">{locationError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                This helps us suggest the best travel options and routes
              </p>
            </div>
          </div>

          {/* Food Preference */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Utensils />
              Food Preference
            </Label>
            <RadioGroup
              value={tripData.foodPreference}
              onValueChange={(value: "veg" | "non-veg") => updateTripData({ foodPreference: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="veg" id="veg" />
                <Label htmlFor="veg" className="cursor-pointer">
                  Vegetarian
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-veg" id="non-veg" />
                <Label htmlFor="non-veg" className="cursor-pointer">
                  Non-Vegetarian
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <DollarSign />
              Overall Budget
            </Label>
            <div className="space-y-4">
              <Slider
                value={[tripData.budget]}
                onValueChange={(value) => updateTripData({ budget: value[0] })}
                max={10000}
                min={500}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$500</span>
                <span className="font-semibold text-foreground">${tripData.budget.toLocaleString()}</span>
                <span>$10,000+</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                This includes flights, accommodation, food, and activities
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Continue to Destination
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
