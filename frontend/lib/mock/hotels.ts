import { Hotel } from '@/lib/types/api'

export const mockHotels: Hotel[] = [
    {
        id: "luxury-resort",
        name: "Grand Paradise Resort",
        description: "Experience ultimate luxury at our 5-star resort featuring private beaches, multiple pools, and award-winning restaurants.",
        summary: "Luxury beachfront resort with world-class amenities and stunning ocean views.",
        rating: 4.8,
        reviewCount: 1247,
        pricePerNight: {
            currency: "USD",
            amount: 280,
            basePrice: 250,
            taxes: 20,
            fees: 10
        },
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&auto=format&fit=crop"
        ],
        location: {
            address: "123 Beach Resort Blvd",
            city: "Paradise Bay",
            country: "Tropical Islands",
            coordinates: {
                latitude: 25.2048,
                longitude: 55.2708
            },
            distanceFromCenter: {
                value: 2.5,
                unit: "km"
            },
            nearbyAttractions: ["Paradise Beach", "Coral Reef Diving", "Sunset Point"]
        },
        amenities: [
            {
                id: "wifi",
                name: "Free WiFi",
                category: "basic",
                description: "High-speed internet throughout the property"
            },
            {
                id: "pool",
                name: "Pool",
                category: "luxury",
                description: "Multiple pools including infinity pool"
            },
            {
                id: "spa",
                name: "Spa",
                category: "luxury",
                description: "Full-service spa with massage and wellness treatments"
            },
            {
                id: "restaurant",
                name: "Restaurant",
                category: "basic",
                description: "Multiple dining options with international cuisine"
            }
        ],
        roomTypes: [
            {
                id: "standard",
                name: "Standard Ocean View",
                capacity: 2,
                bedType: "King",
                size: 35,
                priceModifier: 1.0
            },
            {
                id: "suite",
                name: "Presidential Suite",
                capacity: 4,
                bedType: "King + Sofa Bed",
                size: 75,
                priceModifier: 2.5
            }
        ],
        policies: {
            checkIn: "15:00",
            checkOut: "11:00",
            cancellation: "Free cancellation up to 24 hours before check-in",
            petPolicy: "Pets allowed with additional fee",
            smokingPolicy: "Non-smoking property"
        },
        category: "luxury",
        availabilityStatus: "available"
    },
    {
        id: "boutique-hotel",
        name: "Heritage Boutique Hotel",
        description: "A beautifully restored historic building offering intimate luxury with modern comforts and local charm.",
        summary: "Charming boutique hotel in the heart of the historic district with personalized service.",
        rating: 4.6,
        reviewCount: 892,
        pricePerNight: {
            currency: "USD",
            amount: 180,
            basePrice: 165,
            taxes: 12,
            fees: 3
        },
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&auto=format&fit=crop"
        ],
        location: {
            address: "456 Historic Quarter St",
            city: "Old Town",
            country: "Heritage Land",
            distanceFromCenter: {
                value: 0.8,
                unit: "km"
            },
            nearbyAttractions: ["Historic Museum", "Cathedral Square", "Artisan Market"]
        },
        amenities: [
            {
                id: "wifi",
                name: "Free WiFi",
                category: "basic"
            },
            {
                id: "restaurant",
                name: "Restaurant",
                category: "basic"
            },
            {
                id: "concierge",
                name: "Concierge",
                category: "luxury"
            }
        ],
        roomTypes: [
            {
                id: "heritage",
                name: "Heritage Room",
                capacity: 2,
                bedType: "Queen",
                size: 25,
                priceModifier: 1.0
            }
        ],
        policies: {
            checkIn: "14:00",
            checkOut: "12:00",
            cancellation: "Free cancellation up to 48 hours before check-in"
        },
        category: "boutique",
        availabilityStatus: "available"
    },
    {
        id: "business-hotel",
        name: "Metropolitan Business Hotel",
        description: "Perfect for business travelers with state-of-the-art facilities, meeting rooms, and prime location.",
        summary: "Modern business hotel with excellent connectivity and professional amenities.",
        rating: 4.4,
        reviewCount: 2156,
        pricePerNight: {
            currency: "USD",
            amount: 120,
            basePrice: 110,
            taxes: 8,
            fees: 2
        },
        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&auto=format&fit=crop"
        ],
        location: {
            address: "789 Business District Ave",
            city: "Metro City",
            country: "Business Hub",
            distanceFromCenter: {
                value: 1.2,
                unit: "km"
            },
            nearbyAttractions: ["Convention Center", "Financial District", "Shopping Mall"]
        },
        amenities: [
            {
                id: "wifi",
                name: "Free WiFi",
                category: "basic"
            },
            {
                id: "business-center",
                name: "Business Center",
                category: "business"
            },
            {
                id: "gym",
                name: "Gym",
                category: "basic"
            }
        ],
        roomTypes: [
            {
                id: "business",
                name: "Business Room",
                capacity: 2,
                bedType: "King",
                size: 30,
                priceModifier: 1.0
            }
        ],
        policies: {
            checkIn: "15:00",
            checkOut: "12:00",
            cancellation: "Free cancellation up to 6 hours before check-in"
        },
        category: "business",
        availabilityStatus: "available"
    },
    {
        id: "budget-inn",
        name: "Cozy Traveler Inn",
        description: "Great value accommodation offering comfort and convenience without breaking the bank.",
        summary: "Clean, comfortable, and budget-friendly accommodation with essential amenities.",
        rating: 4.2,
        reviewCount: 756,
        pricePerNight: {
            currency: "USD",
            amount: 65,
            basePrice: 60,
            taxes: 4,
            fees: 1
        },
        images: [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&auto=format&fit=crop"
        ],
        location: {
            address: "321 Budget Street",
            city: "Value Town",
            country: "Affordable Land",
            distanceFromCenter: {
                value: 1.5,
                unit: "km"
            }
        },
        amenities: [
            {
                id: "wifi",
                name: "Free WiFi",
                category: "basic"
            },
            {
                id: "breakfast",
                name: "Breakfast",
                category: "basic"
            }
        ],
        roomTypes: [
            {
                id: "standard",
                name: "Standard Room",
                capacity: 2,
                bedType: "Double",
                size: 20,
                priceModifier: 1.0
            }
        ],
        policies: {
            checkIn: "14:00",
            checkOut: "11:00",
            cancellation: "Free cancellation up to 24 hours before check-in"
        },
        category: "budget",
        availabilityStatus: "available"
    }
]