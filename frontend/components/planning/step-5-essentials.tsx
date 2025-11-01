"use client"

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { CreditCard } from "lucide-react"
const Utensils = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
    />
  </svg>
)

const Cross = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)



const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

const Coffee = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2" />
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
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

import type { ExtendedTripData } from '../../app/planning/page'

interface PlanningStep5Props {
  tripData: ExtendedTripData
  updateTripData: (data: Partial<ExtendedTripData>) => void
  onNext: () => void
  onPrev: () => void
}

const foodJoints = [
  {
    id: "local-bistro",
    name: "Authentic Local Bistro",
    type: "Traditional Cuisine",
    rating: 4.7,
    priceRange: "$$",
    distance: "0.3 km",
    summary: "Family-owned restaurant serving authentic local dishes with fresh ingredients.",
    specialties: ["Local Fish", "Traditional Stew", "Homemade Bread"],
    hours: "11:00 AM - 10:00 PM",
  },
  {
    id: "street-food",
    name: "Central Street Food Market",
    type: "Street Food",
    rating: 4.5,
    priceRange: "$",
    distance: "0.5 km",
    summary: "Vibrant food market with diverse local street food vendors.",
    specialties: ["Grilled Seafood", "Local Snacks", "Fresh Juices"],
    hours: "6:00 AM - 11:00 PM",
  },
  {
    id: "fine-dining",
    name: "Sunset Fine Dining",
    type: "Fine Dining",
    rating: 4.9,
    priceRange: "$$$$",
    distance: "1.2 km",
    summary: "Award-winning restaurant with panoramic views and innovative cuisine.",
    specialties: ["Tasting Menu", "Wine Pairing", "Seasonal Dishes"],
    hours: "6:00 PM - 11:00 PM",
  },
]

const essentialSpots = [
  {
    id: "pharmacy",
    name: "24/7 Central Pharmacy",
    type: "Healthcare",
    icon: Cross,
    distance: "0.2 km",
    summary: "Round-the-clock pharmacy with prescription and over-the-counter medications.",
    services: ["Prescriptions", "First Aid", "Health Consultation"],
    hours: "24 Hours",
  },
  {
    id: "atm",
    name: "International ATM Network",
    type: "Banking",
    icon: CreditCard,
    distance: "0.1 km",
    summary: "Multiple ATMs accepting international cards with competitive exchange rates.",
    services: ["Cash Withdrawal", "Balance Inquiry", "Currency Exchange"],
    hours: "24 Hours",
  },
  {
    id: "supermarket",
    name: "Fresh Market Supermarket",
    type: "Shopping",
    icon: ShoppingCart,
    distance: "0.4 km",
    summary: "Well-stocked supermarket with local and international products.",
    services: ["Groceries", "Toiletries", "Local Products"],
    hours: "7:00 AM - 10:00 PM",
  },
  {
    id: "cafe",
    name: "Morning Brew Coffee House",
    type: "Cafe",
    icon: Coffee,
    distance: "0.3 km",
    summary: "Cozy coffee shop with excellent WiFi and local pastries.",
    services: ["Coffee & Tea", "Light Meals", "Free WiFi"],
    hours: "6:00 AM - 8:00 PM",
  },
]

export function PlanningStep5({ tripData, updateTripData, onNext, onPrev }: PlanningStep5Props) {
  const handleEssentialToggle = (essentialId: string, checked: boolean) => {
    const currentEssentials = tripData.selectedEssentials || []
    const newEssentials = checked
      ? [...currentEssentials, essentialId]
      : currentEssentials.filter((id) => id !== essentialId)

    updateTripData({ selectedEssentials: newEssentials })
  }

  const handleSubmit = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Nearby Essentials</CardTitle>
          <CardDescription>Discover local food spots and essential services near your accommodation</CardDescription>
        </CardHeader>
      </Card>

      {/* Popular Food Joints */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          Popular Local Food Joints
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foodJoints.map((restaurant) => (
            <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base leading-tight">{restaurant.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span className="font-semibold">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {restaurant.type}
                  </Badge>
                  <span>{restaurant.priceRange}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">{restaurant.summary}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{restaurant.distance} away</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{restaurant.hours}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-semibold text-muted-foreground">Specialties:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {restaurant.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Essential Services */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Essential Services & Spots</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {essentialSpots.map((spot) => {
            const Icon = spot.icon
            const isSelected = tripData.selectedEssentials?.includes(spot.id) || false

            return (
              <Card key={spot.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={spot.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleEssentialToggle(spot.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{spot.name}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {spot.type}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">{spot.summary}</p>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{spot.distance} away</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{spot.hours}</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {spot.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Selected Essentials Summary */}
      {tripData.selectedEssentials && tripData.selectedEssentials.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Selected Essential Services:</span>
              <Badge variant="secondary">{tripData.selectedEssentials.length} selected</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {tripData.selectedEssentials.map((essentialId) => {
                const essential = essentialSpots.find((spot) => spot.id === essentialId)
                return essential ? (
                  <Badge key={essentialId} variant="outline" className="text-xs">
                    {essential.name}
                  </Badge>
                ) : null
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 max-w-2xl mx-auto">
        <Button type="button" variant="outline" onClick={onPrev} className="flex-1 bg-transparent">
          Previous
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          Generate Itinerary
        </Button>
      </div>
    </div>
  )
}
