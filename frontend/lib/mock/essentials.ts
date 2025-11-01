import { EssentialItem } from '../types/api'

export const mockEssentials: EssentialItem[] = [
    // Clothing
    {
        id: "passport",
        name: "Passport",
        category: "documents",
        description: "Valid passport required for international travel",
        importance: "essential",
        weight: 0.1,
        size: "small"
    },
    {
        id: "travel-insurance",
        name: "Travel Insurance",
        category: "documents",
        description: "Comprehensive travel insurance coverage",
        importance: "essential"
    },
    {
        id: "lightweight-jacket",
        name: "Lightweight Jacket",
        category: "clothing",
        description: "Packable jacket for changing weather conditions",
        importance: "recommended",
        climate: ["temperate", "cold"],
        weight: 0.5,
        size: "medium",
        estimatedCost: {
            currency: "USD",
            min: 30,
            max: 150
        }
    },
    {
        id: "swimwear",
        name: "Swimwear",
        category: "clothing",
        description: "Essential for beach and pool activities",
        importance: "essential",
        climate: ["tropical", "warm"],
        activity: ["beach", "swimming", "water-sports"],
        weight: 0.2,
        size: "small",
        estimatedCost: {
            currency: "USD",
            min: 20,
            max: 80
        }
    },
    {
        id: "hiking-boots",
        name: "Hiking Boots",
        category: "clothing",
        description: "Sturdy boots for hiking and outdoor activities",
        importance: "essential",
        activity: ["hiking", "trekking", "adventure"],
        weight: 1.2,
        size: "large",
        estimatedCost: {
            currency: "USD",
            min: 80,
            max: 300
        }
    },
    {
        id: "sunscreen",
        name: "Sunscreen SPF 50+",
        category: "health",
        description: "High protection sunscreen for outdoor activities",
        importance: "essential",
        climate: ["tropical", "warm", "sunny"],
        weight: 0.3,
        size: "small",
        estimatedCost: {
            currency: "USD",
            min: 10,
            max: 25
        }
    },
    {
        id: "first-aid-kit",
        name: "Travel First Aid Kit",
        category: "health",
        description: "Basic medical supplies for minor injuries",
        importance: "recommended",
        weight: 0.5,
        size: "medium",
        estimatedCost: {
            currency: "USD",
            min: 15,
            max: 40
        }
    },
    {
        id: "power-bank",
        name: "Portable Power Bank",
        category: "electronics",
        description: "Backup power for mobile devices",
        importance: "recommended",
        weight: 0.4,
        size: "small",
        estimatedCost: {
            currency: "USD",
            min: 20,
            max: 60
        }
    },
    {
        id: "universal-adapter",
        name: "Universal Travel Adapter",
        category: "electronics",
        description: "Plug adapter for international electrical outlets",
        importance: "essential",
        weight: 0.3,
        size: "small",
        estimatedCost: {
            currency: "USD",
            min: 15,
            max: 40
        }
    },
    {
        id: "camera",
        name: "Travel Camera",
        category: "electronics",
        description: "Compact camera for capturing memories",
        importance: "optional",
        weight: 0.6,
        size: "medium",
        estimatedCost: {
            currency: "USD",
            min: 100,
            max: 1000
        }
    },
    {
        id: "travel-pillow",
        name: "Travel Pillow",
        category: "comfort",
        description: "Inflatable or memory foam pillow for comfortable travel",
        importance: "optional",
        weight: 0.3,
        size: "medium",
        estimatedCost: {
            currency: "USD",
            min: 15,
            max: 50
        }
    },
    {
        id: "water-bottle",
        name: "Reusable Water Bottle",
        category: "comfort",
        description: "Eco-friendly water bottle to stay hydrated",
        importance: "recommended",
        weight: 0.4,
        size: "medium",
        estimatedCost: {
            currency: "USD",
            min: 10,
            max: 30
        }
    },
    {
        id: "backpack",
        name: "Travel Backpack",
        category: "comfort",
        description: "Durable backpack for day trips and excursions",
        importance: "recommended",
        activity: ["hiking", "sightseeing", "adventure"],
        weight: 1.0,
        size: "large",
        estimatedCost: {
            currency: "USD",
            min: 50,
            max: 200
        }
    },
    {
        id: "snorkel-gear",
        name: "Snorkel Set",
        category: "activity",
        description: "Mask, snorkel, and fins for underwater exploration",
        importance: "optional",
        activity: ["snorkeling", "diving", "water-sports"],
        climate: ["tropical", "warm"],
        weight: 1.5,
        size: "large",
        estimatedCost: {
            currency: "USD",
            min: 30,
            max: 100
        }
    },
    {
        id: "guidebook",
        name: "Travel Guidebook",
        category: "comfort",
        description: "Comprehensive guidebook for destination information",
        importance: "optional",
        weight: 0.5,
        size: "medium",
        estimatedCost: {
            currency: "USD",
            min: 15,
            max: 30
        }
    }
]