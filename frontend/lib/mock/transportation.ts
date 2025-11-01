import { TravelMode } from '@/lib/types/api'

export const mockTravelModes: TravelMode[] = [
    {
        id: "flight-economy",
        name: "Economy Flight",
        type: "flight",
        description: "Standard airline economy class with basic amenities and comfortable seating.",
        estimatedDuration: {
            min: 120,
            max: 480,
            unit: "minutes"
        },
        estimatedCost: {
            currency: "USD",
            min: 200,
            max: 800
        },
        comfort: "standard",
        sustainability: {
            carbonFootprint: 250,
            ecoRating: 3
        },
        restrictions: ["Baggage weight limits", "Seat selection fees"],
        amenities: ["In-flight entertainment", "Meal service", "Overhead storage"]
    },
    {
        id: "flight-business",
        name: "Business Class Flight",
        type: "flight",
        description: "Premium airline business class with enhanced comfort and exclusive services.",
        estimatedDuration: {
            min: 120,
            max: 480,
            unit: "minutes"
        },
        estimatedCost: {
            currency: "USD",
            min: 800,
            max: 3000
        },
        comfort: "luxury",
        sustainability: {
            carbonFootprint: 500,
            ecoRating: 2
        },
        amenities: ["Lie-flat seats", "Premium dining", "Priority boarding", "Lounge access"]
    },
    {
        id: "train-high-speed",
        name: "High-Speed Train",
        type: "train",
        description: "Modern high-speed rail service with comfortable seating and scenic views.",
        estimatedDuration: {
            min: 180,
            max: 600,
            unit: "minutes"
        },
        estimatedCost: {
            currency: "USD",
            min: 50,
            max: 200
        },
        comfort: "standard",
        sustainability: {
            carbonFootprint: 80,
            ecoRating: 8
        },
        amenities: ["WiFi", "Food cart", "Power outlets", "Large windows"]
    },
    {
        id: "bus-luxury",
        name: "Luxury Bus",
        type: "bus",
        description: "Premium bus service with reclining seats and onboard amenities.",
        estimatedDuration: {
            min: 300,
            max: 720,
            unit: "minutes"
        },
        estimatedCost: {
            currency: "USD",
            min: 30,
            max: 100
        },
        comfort: "standard",
        sustainability: {
            carbonFootprint: 60,
            ecoRating: 7
        },
        amenities: ["WiFi", "Air conditioning", "Restroom", "Entertainment system"]
    },
    {
        id: "car-rental",
        name: "Car Rental",
        type: "car",
        description: "Self-drive car rental for maximum flexibility and independence.",
        estimatedDuration: {
            min: 240,
            max: 600,
            unit: "minutes"
        },
        estimatedCost: {
            currency: "USD",
            min: 40,
            max: 150
        },
        comfort: "premium",
        sustainability: {
            carbonFootprint: 120,
            ecoRating: 5
        },
        restrictions: ["Valid driving license required", "Age restrictions"],
        amenities: ["GPS navigation", "Air conditioning", "Bluetooth connectivity"]
    },
    {
        id: "cruise-ship",
        name: "Cruise Ship",
        type: "ship",
        description: "Ocean cruise with multiple destinations and onboard entertainment.",
        estimatedDuration: {
            min: 2,
            max: 14,
            unit: "days"
        },
        estimatedCost: {
            currency: "USD",
            min: 500,
            max: 5000
        },
        comfort: "luxury",
        sustainability: {
            carbonFootprint: 800,
            ecoRating: 2
        },
        amenities: ["Multiple restaurants", "Entertainment venues", "Spa services", "Pool deck"]
    }
]