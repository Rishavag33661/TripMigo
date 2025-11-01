import { Activity } from '@/lib/types/api'

export const mockActivities: Activity[] = [
    {
        id: "temple-tour",
        name: "Ancient Temple Tour",
        description: "Guided tour of historic temples with cultural insights and photography opportunities",
        type: "cultural",
        duration: {
            value: 4,
            unit: "hours"
        },
        cost: {
            currency: "USD",
            amount: 45,
            costType: "paid"
        },
        location: {
            name: "Temple District",
            address: "Historic Quarter, Temple Street",
            coordinates: {
                latitude: 35.0116,
                longitude: 135.7681
            }
        },
        difficulty: "easy",
        ageRestriction: {
            min: 8
        },
        groupSize: {
            min: 1,
            max: 15
        },
        bookingRequired: true,
        images: [
            "/kyoto-japan-temples-cherry-blossoms.jpg",
            "/japan-cherry-blossoms-temples.jpg"
        ],
        tags: ["culture", "history", "temples", "guided-tour"],
        rating: 4.8,
        reviewCount: 1250
    },
    {
        id: "sunset-cruise",
        name: "Sunset Harbor Cruise",
        description: "Relaxing boat cruise around the harbor with stunning sunset views and light refreshments",
        type: "relaxation",
        duration: {
            value: 2,
            unit: "hours"
        },
        cost: {
            currency: "USD",
            amount: 65,
            costType: "paid"
        },
        location: {
            name: "Marina Harbor",
            address: "Waterfront District, Pier 7"
        },
        difficulty: "easy",
        groupSize: {
            min: 2,
            max: 50
        },
        bookingRequired: true,
        images: [
            "/santorini-greece-sunset-white-buildings.jpg"
        ],
        tags: ["sunset", "cruise", "relaxation", "romantic"],
        rating: 4.7,
        reviewCount: 890
    },
    {
        id: "hiking-adventure",
        name: "Mountain Peak Hiking",
        description: "Challenging hike to mountain peak with breathtaking panoramic views",
        type: "adventure",
        duration: {
            value: 8,
            unit: "hours"
        },
        cost: {
            currency: "USD",
            amount: 80,
            costType: "paid"
        },
        location: {
            name: "Mountain Trail Head",
            address: "Alpine District, Trail Access Road"
        },
        difficulty: "challenging",
        ageRestriction: {
            min: 16,
            max: 65
        },
        groupSize: {
            min: 3,
            max: 12
        },
        bookingRequired: true,
        images: [
            "/iceland-northern-lights-dramatic-landscapes.jpg"
        ],
        tags: ["hiking", "adventure", "mountains", "challenging"],
        rating: 4.9,
        reviewCount: 450
    },
    {
        id: "cooking-class",
        name: "Traditional Cooking Class",
        description: "Learn to cook authentic local dishes with a professional chef",
        type: "cultural",
        duration: {
            value: 3,
            unit: "hours"
        },
        cost: {
            currency: "USD",
            amount: 75,
            costType: "paid"
        },
        location: {
            name: "Culinary School",
            address: "Food District, Cooking Lane 12"
        },
        difficulty: "easy",
        ageRestriction: {
            min: 12
        },
        groupSize: {
            min: 4,
            max: 10
        },
        bookingRequired: true,
        tags: ["cooking", "culture", "food", "hands-on"],
        rating: 4.6,
        reviewCount: 320
    },
    {
        id: "beach-day",
        name: "Paradise Beach Day",
        description: "Full day at pristine beach with water sports equipment and beachside dining",
        type: "relaxation",
        duration: {
            value: 8,
            unit: "hours"
        },
        cost: {
            currency: "USD",
            amount: 0,
            costType: "free"
        },
        location: {
            name: "Paradise Beach",
            address: "Coastal Road, Beach Access Point 3"
        },
        difficulty: "easy",
        groupSize: {
            min: 1,
            max: 100
        },
        bookingRequired: false,
        images: [
            "/bali-indonesia-rice-terraces-tropical.jpg"
        ],
        tags: ["beach", "relaxation", "swimming", "free"],
        rating: 4.5,
        reviewCount: 2100
    },
    {
        id: "night-market",
        name: "Night Market Food Tour",
        description: "Explore bustling night market and sample diverse street food specialties",
        type: "dining",
        duration: {
            value: 3,
            unit: "hours"
        },
        cost: {
            currency: "USD",
            amount: 35,
            costType: "paid"
        },
        location: {
            name: "Central Night Market",
            address: "Market District, Food Street"
        },
        difficulty: "easy",
        ageRestriction: {
            min: 10
        },
        groupSize: {
            min: 2,
            max: 20
        },
        bookingRequired: false,
        tags: ["food", "night-market", "street-food", "cultural"],
        rating: 4.4,
        reviewCount: 780
    },
    {
        id: "museum-tour",
        name: "Art & History Museum",
        description: "Self-guided tour of world-class art and historical artifacts",
        type: "cultural",
        duration: {
            value: 2,
            unit: "hours"
        },
        cost: {
            currency: "USD",
            amount: 20,
            costType: "paid"
        },
        location: {
            name: "National Museum",
            address: "Cultural District, Museum Square"
        },
        difficulty: "easy",
        groupSize: {
            min: 1,
            max: 50
        },
        bookingRequired: false,
        tags: ["museum", "art", "history", "culture"],
        rating: 4.3,
        reviewCount: 650
    },
    {
        id: "bike-tour",
        name: "City Bike Tour",
        description: "Guided bike tour through city highlights and hidden gems",
        type: "sightseeing",
        duration: {
            value: 4,
            unit: "hours"
        },
        cost: {
            currency: "USD",
            amount: 55,
            costType: "paid"
        },
        location: {
            name: "City Center Bike Shop",
            address: "Downtown District, Bike Lane 1"
        },
        difficulty: "moderate",
        ageRestriction: {
            min: 14,
            max: 70
        },
        groupSize: {
            min: 3,
            max: 15
        },
        bookingRequired: true,
        tags: ["cycling", "sightseeing", "guided-tour", "active"],
        rating: 4.7,
        reviewCount: 540
    }
]