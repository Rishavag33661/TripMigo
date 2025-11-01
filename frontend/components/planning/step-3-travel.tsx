"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Plane, Train, Bus, Car, Ship, Clock, DollarSign } from "lucide-react"
import type { TripData } from '../../app/planning/page'

interface PlanningStep3Props {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onNext: () => void
  onPrev: () => void
}

const travelOptions = [
  {
    id: "flight",
    name: "Flight",
    icon: Plane,
    duration: "2-8 hours",
    priceRange: "$200-800",
    pros: ["Fastest", "Long distances", "Comfortable"],
    cons: ["Weather dependent", "Airport time"],
    description: "Best for long distances and international travel",
  },
  {
    id: "train",
    name: "Train",
    icon: Train,
    duration: "4-12 hours",
    priceRange: "$50-300",
    pros: ["Scenic views", "City center to center", "Eco-friendly"],
    cons: ["Limited routes", "Slower than flights"],
    description: "Perfect for scenic routes and regional travel",
  },
  {
    id: "bus",
    name: "Bus",
    icon: Bus,
    duration: "6-15 hours",
    priceRange: "$20-100",
    pros: ["Budget-friendly", "Frequent departures", "Door-to-door"],
    cons: ["Longer travel time", "Less comfortable"],
    description: "Most economical option for budget travelers",
  },
  {
    id: "car",
    name: "Car Rental",
    icon: Car,
    duration: "Flexible",
    priceRange: "$30-150/day",
    pros: ["Complete freedom", "Flexible schedule", "Luggage space"],
    cons: ["Driving responsibility", "Parking costs"],
    description: "Ultimate flexibility for exploring at your own pace",
  },
  {
    id: "cruise",
    name: "Cruise",
    icon: Ship,
    duration: "1-14 days",
    priceRange: "$100-500/day",
    pros: ["All-inclusive", "Multiple destinations", "Entertainment"],
    cons: ["Fixed schedule", "Weather dependent"],
    description: "Luxury travel with accommodation and entertainment included",
  },
]

export function PlanningStep3({ tripData, updateTripData, onNext, onPrev }: PlanningStep3Props) {
  const handleTravelModeSelect = (travelMode: string) => {
    updateTripData({ travelMode })
  }

  const handleSubmit = () => {
    if (tripData.travelMode) {
      onNext()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Travel Mode</CardTitle>
        <CardDescription>
          Select how you'd like to travel to {tripData.destination || "your destination"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Travel Options Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {travelOptions.map((option) => {
              const Icon = option.icon
              const isSelected = tripData.travelMode === option.id

              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleTravelModeSelect(option.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">{option.description}</p>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{option.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span>{option.priceRange}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-green-600">Pros:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {option.pros.map((pro, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                              {pro}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-orange-600">Cons:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {option.cons.map((con, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                              {con}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Selected Travel Mode Display */}
          {tripData.travelMode && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Selected Travel Mode:</span>
                <span className="text-primary">
                  {travelOptions.find((option) => option.id === tripData.travelMode)?.name}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onPrev} className="flex-1 bg-transparent">
              Previous
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={!tripData.travelMode}>
              Continue to Hotels
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
