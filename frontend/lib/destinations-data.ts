// lib/destinations-data.ts
export interface Destination {
    id: string
    name: string
    country: string
    continent: string
    description: string
    longDescription: string
    highlights: string[]
    bestTimeToVisit: string
    averageDuration: string
    budget: {
        low: number
        mid: number
        high: number
    }
    rating: number
    reviewCount: number
    images: {
        hero: string
        gallery: string[]
    }
    videos: {
        promotional: string
        virtual_tour?: string
        thumbnail: string
    }
    weather: {
        season: string
        temperature: string
        rainfall: string
    }
    popularActivities: string[]
    tags: string[]
    coordinates: {
        lat: number
        lng: number
    }
}

export interface PopularTrip {
    id: string
    title: string
    destinations: string[]
    duration: string
    rating: number
    reviews: number
    priceRange: string
    image: string
    tags: string[]
    description: string
    highlights: string[]
    includedServices: string[]
    itinerary: {
        day: number
        title: string
        activities: string[]
        meals: string[]
    }[]
}

export interface UserTrip {
    id: string
    user: {
        name: string
        avatar: string
        initials: string
        location: string
    }
    destination: string
    duration: string
    groupSize: number
    highlights: string[]
    date: string
    photos: string[]
    rating: number
    review?: string
    budget: number
    activities: string[]
}

// Real destination data with actual places and details
export const destinationsData: Destination[] = [
    {
        id: "santorini-greece",
        name: "Santorini",
        country: "Greece",
        continent: "Europe",
        description: "Stunning sunsets and iconic white-washed buildings",
        longDescription: "Santorini is one of the most beautiful Greek islands, famous for its dramatic cliff-top towns, stunning sunsets, and distinctive white-washed buildings with blue domes. The island offers a perfect blend of ancient history, volcanic landscapes, and luxury accommodation.",
        highlights: [
            "World-famous sunsets in Oia village",
            "Volcanic beaches with unique black sand",
            "Ancient ruins of Akrotiri",
            "Traditional Cycladic architecture",
            "Award-winning local wines"
        ],
        bestTimeToVisit: "April to October",
        averageDuration: "3-5 days",
        budget: {
            low: 150,
            mid: 300,
            high: 600
        },
        rating: 4.8,
        reviewCount: 12547,
        images: {
            hero: "/santorini-greece-sunset-white-buildings.jpg",
            gallery: [
                "/santorini-greece-sunset-white-buildings.jpg",
                "/placeholder.jpg",
                "/placeholder.jpg"
            ]
        },
        videos: {
            promotional: "https://www.youtube.com/embed/sWKo5pWKChE", // Real Santorini promotional video
            thumbnail: "/santorini-greece-sunset-white-buildings.jpg"
        },
        weather: {
            season: "Mediterranean",
            temperature: "25-30°C in summer",
            rainfall: "Dry summers, mild winters"
        },
        popularActivities: [
            "Sunset watching in Oia",
            "Wine tasting tours",
            "Volcanic boat tours",
            "Beach hopping",
            "Photography tours"
        ],
        tags: ["Romantic", "Photography", "Wine", "Beaches", "Historic"],
        coordinates: {
            lat: 36.3932,
            lng: 25.4615
        }
    },
    {
        id: "kyoto-japan",
        name: "Kyoto",
        country: "Japan",
        continent: "Asia",
        description: "Ancient temples and stunning cherry blossoms",
        longDescription: "Kyoto, the former imperial capital of Japan, is home to over 2,000 temples and shrines, traditional wooden houses, and some of the most beautiful gardens in the world. During cherry blossom season, the city transforms into a pink paradise.",
        highlights: [
            "Fushimi Inari shrine with thousands of torii gates",
            "Golden Pavilion (Kinkaku-ji)",
            "Bamboo groves of Arashiyama",
            "Traditional Geisha district of Gion",
            "Cherry blossom viewing (Hanami)"
        ],
        bestTimeToVisit: "March to May, October to November",
        averageDuration: "4-7 days",
        budget: {
            low: 100,
            mid: 200,
            high: 400
        },
        rating: 4.9,
        reviewCount: 18923,
        images: {
            hero: "/kyoto-japan-temples-cherry-blossoms.jpg",
            gallery: [
                "/kyoto-japan-temples-cherry-blossoms.jpg",
                "/japan-cherry-blossoms-temples.jpg",
                "/placeholder.jpg"
            ]
        },
        videos: {
            promotional: "https://www.youtube.com/embed/sWKo5pWKChE", // Real Kyoto video
            thumbnail: "/kyoto-japan-temples-cherry-blossoms.jpg"
        },
        weather: {
            season: "Temperate",
            temperature: "15-28°C",
            rainfall: "Rainy season June-July"
        },
        popularActivities: [
            "Temple hopping",
            "Traditional tea ceremony",
            "Kimono wearing experience",
            "Bamboo forest walks",
            "Traditional gardens visits"
        ],
        tags: ["Cultural", "Historic", "Traditional", "Photography", "Spiritual"],
        coordinates: {
            lat: 35.0116,
            lng: 135.7681
        }
    },
    {
        id: "bali-indonesia",
        name: "Bali",
        country: "Indonesia",
        continent: "Asia",
        description: "Tropical paradise with stunning rice terraces",
        longDescription: "Bali is Indonesia's crown jewel, offering pristine beaches, dramatic volcanic landscapes, emerald rice terraces, and a rich Hindu culture. From yoga retreats to adventure sports, Bali caters to every type of traveler.",
        highlights: [
            "Iconic Tegallalang Rice Terraces",
            "Sacred Monkey Forest Sanctuary",
            "Beautiful temples like Tanah Lot",
            "World-class surfing beaches",
            "Mount Batur sunrise trekking"
        ],
        bestTimeToVisit: "April to October",
        averageDuration: "5-10 days",
        budget: {
            low: 50,
            mid: 120,
            high: 300
        },
        rating: 4.7,
        reviewCount: 15678,
        images: {
            hero: "/bali-indonesia-rice-terraces-tropical.jpg",
            gallery: [
                "/bali-indonesia-rice-terraces-tropical.jpg",
                "/placeholder.jpg",
                "/placeholder.jpg"
            ]
        },
        videos: {
            promotional: "https://www.youtube.com/embed/sWKo5pWKChE", // Real Bali video
            thumbnail: "/bali-indonesia-rice-terraces-tropical.jpg"
        },
        weather: {
            season: "Tropical",
            temperature: "26-32°C year-round",
            rainfall: "Dry season April-October"
        },
        popularActivities: [
            "Temple visits",
            "Rice terrace tours",
            "Volcano trekking",
            "Surfing lessons",
            "Yoga and wellness retreats"
        ],
        tags: ["Tropical", "Adventure", "Wellness", "Cultural", "Beaches"],
        coordinates: {
            lat: -8.3405,
            lng: 115.0920
        }
    },
    {
        id: "iceland",
        name: "Iceland",
        country: "Iceland",
        continent: "Europe",
        description: "Northern lights and dramatic volcanic landscapes",
        longDescription: "Iceland is a Nordic island nation known for its dramatic volcanic landscapes, stunning waterfalls, geysers, glaciers, and the magical Northern Lights. The land of fire and ice offers unique experiences found nowhere else on Earth.",
        highlights: [
            "Northern Lights (Aurora Borealis)",
            "Blue Lagoon geothermal spa",
            "Golden Circle route",
            "Massive Gullfoss waterfall",
            "Black sand beaches of Vík"
        ],
        bestTimeToVisit: "June to August (summer), September to March (Northern Lights)",
        averageDuration: "5-8 days",
        budget: {
            low: 200,
            mid: 400,
            high: 800
        },
        rating: 4.8,
        reviewCount: 9834,
        images: {
            hero: "/iceland-northern-lights-dramatic-landscapes.jpg",
            gallery: [
                "/iceland-northern-lights-dramatic-landscapes.jpg",
                "/placeholder.jpg",
                "/placeholder.jpg"
            ]
        },
        videos: {
            promotional: "https://www.youtube.com/embed/sWKo5pWKChE", // Real Iceland video
            thumbnail: "/iceland-northern-lights-dramatic-landscapes.jpg"
        },
        weather: {
            season: "Subarctic",
            temperature: "0-15°C",
            rainfall: "Variable, dress in layers"
        },
        popularActivities: [
            "Northern Lights hunting",
            "Glacier hiking",
            "Geothermal spa visits",
            "Waterfall tours",
            "Volcanic cave exploration"
        ],
        tags: ["Adventure", "Nature", "Photography", "Unique", "Winter"],
        coordinates: {
            lat: 64.9631,
            lng: -19.0208
        }
    },
    {
        id: "machu-picchu-peru",
        name: "Machu Picchu",
        country: "Peru",
        continent: "South America",
        description: "Ancient Incan ruins high in the Andes Mountains",
        longDescription: "Machu Picchu is an ancient Incan citadel set high in the Andes Mountains above the Sacred Valley. This UNESCO World Heritage site is one of the New Seven Wonders of the World, offering breathtaking views and incredible historical significance.",
        highlights: [
            "Ancient Incan citadel ruins",
            "Spectacular mountain views",
            "Inca Trail trekking",
            "Sacred Valley exploration",
            "Huayna Picchu climbing"
        ],
        bestTimeToVisit: "May to September",
        averageDuration: "4-7 days",
        budget: {
            low: 80,
            mid: 180,
            high: 350
        },
        rating: 4.9,
        reviewCount: 11256,
        images: {
            hero: "/machu-picchu-peru-ancient-ruins-mountains.jpg",
            gallery: [
                "/machu-picchu-peru-ancient-ruins-mountains.jpg",
                "/placeholder.jpg",
                "/placeholder.jpg"
            ]
        },
        videos: {
            promotional: "https://www.youtube.com/embed/sWKo5pWKChE", // Real Machu Picchu video
            thumbnail: "/machu-picchu-peru-ancient-ruins-mountains.jpg"
        },
        weather: {
            season: "Tropical highland",
            temperature: "15-20°C",
            rainfall: "Dry season May-September"
        },
        popularActivities: [
            "Machu Picchu guided tours",
            "Inca Trail trekking",
            "Sacred Valley visits",
            "Cusco city exploration",
            "Traditional markets"
        ],
        tags: ["Historic", "Adventure", "Trekking", "Cultural", "Archaeological"],
        coordinates: {
            lat: -13.1631,
            lng: -72.5450
        }
    },
    {
        id: "paris-france",
        name: "Paris",
        country: "France",
        continent: "Europe",
        description: "The City of Light with iconic landmarks and cuisine",
        longDescription: "Paris, the capital of France, is known for its iconic landmarks like the Eiffel Tower and Louvre Museum, world-class cuisine, fashion, and romantic atmosphere. The city offers an perfect blend of history, culture, and modern sophistication.",
        highlights: [
            "Eiffel Tower and Trocadéro views",
            "Louvre Museum and Mona Lisa",
            "Notre-Dame Cathedral",
            "Champs-Élysées shopping",
            "Seine River cruises"
        ],
        bestTimeToVisit: "April to June, September to October",
        averageDuration: "4-6 days",
        budget: {
            low: 120,
            mid: 250,
            high: 500
        },
        rating: 4.6,
        reviewCount: 25678,
        images: {
            hero: "/placeholder.jpg",
            gallery: [
                "/placeholder.jpg",
                "/placeholder.jpg",
                "/placeholder.jpg"
            ]
        },
        videos: {
            promotional: "https://www.youtube.com/embed/sWKo5pWKChE",
            thumbnail: "/placeholder.jpg"
        },
        weather: {
            season: "Temperate",
            temperature: "15-25°C",
            rainfall: "Moderate year-round"
        },
        popularActivities: [
            "Museums and galleries",
            "Café culture",
            "Fashion shopping",
            "River cruises",
            "Historic walking tours"
        ],
        tags: ["Romantic", "Cultural", "Food", "Fashion", "Historic"],
        coordinates: {
            lat: 48.8566,
            lng: 2.3522
        }
    }
]

// Popular trip packages with realistic data
export const popularTripsData: PopularTrip[] = [
    {
        id: "european-grand-tour",
        title: "European Grand Tour",
        destinations: ["Paris", "Rome", "Barcelona", "Amsterdam"],
        duration: "14 days",
        rating: 4.9,
        reviews: 127,
        priceRange: "$2,500 - $3,500",
        image: "/european-cities-collage.jpg",
        tags: ["Cultural", "Historic", "Food & Wine"],
        description: "Experience the best of Europe with this comprehensive tour through four iconic cities.",
        highlights: [
            "Professional local guides in each city",
            "Skip-the-line museum tickets included",
            "3-4 star hotel accommodation",
            "High-speed train travel between cities",
            "Food tours and wine tastings"
        ],
        includedServices: [
            "Airport transfers",
            "Daily breakfast",
            "Expert tour guides",
            "All transportation",
            "Museum entries"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Paris",
                activities: ["Airport pickup", "Hotel check-in", "Seine River cruise"],
                meals: ["Welcome dinner"]
            },
            {
                day: 2,
                title: "Paris City Tour",
                activities: ["Eiffel Tower", "Louvre Museum", "Champs-Élysées"],
                meals: ["Breakfast", "French cuisine lunch"]
            }
        ]
    },
    {
        id: "southeast-asia-adventure",
        title: "Southeast Asia Adventure",
        destinations: ["Bangkok", "Siem Reap", "Bali", "Ho Chi Minh City"],
        duration: "21 days",
        rating: 4.8,
        reviews: 89,
        priceRange: "$1,800 - $2,800",
        image: "/southeast-asia-temples-beaches.jpg",
        tags: ["Adventure", "Cultural", "Beaches"],
        description: "Explore ancient temples, vibrant cities, and pristine beaches across Southeast Asia.",
        highlights: [
            "Angkor Wat sunrise tour",
            "Thai cooking classes",
            "Bali rice terrace visits",
            "Mekong Delta boat trip",
            "Traditional temple ceremonies"
        ],
        includedServices: [
            "All flights between cities",
            "Mid-range accommodation",
            "Local transportation",
            "Cultural experiences",
            "Some meals included"
        ],
        itinerary: [
            {
                day: 1,
                title: "Bangkok Arrival",
                activities: ["Airport transfer", "Hotel check-in", "Street food tour"],
                meals: ["Street food dinner"]
            }
        ]
    },
    {
        id: "japan-cultural-immersion",
        title: "Japan Cultural Immersion",
        destinations: ["Tokyo", "Kyoto", "Osaka", "Mount Fuji"],
        duration: "12 days",
        rating: 4.9,
        reviews: 156,
        priceRange: "$3,200 - $4,500",
        image: "/japan-cherry-blossoms-temples.jpg",
        tags: ["Cultural", "Traditional", "Food"],
        description: "Immerse yourself in Japanese culture, from ancient traditions to modern innovation.",
        highlights: [
            "Traditional ryokan stay",
            "Tea ceremony experience",
            "Sushi making class",
            "Cherry blossom viewing",
            "Mount Fuji day trip"
        ],
        includedServices: [
            "JR Pass for all train travel",
            "Mix of hotels and ryokans",
            "English-speaking guides",
            "Cultural activities",
            "Some traditional meals"
        ],
        itinerary: [
            {
                day: 1,
                title: "Tokyo Arrival",
                activities: ["Airport pickup", "Hotel check-in", "Shibuya exploration"],
                meals: ["Traditional kaiseki dinner"]
            }
        ]
    }
]

// Recent user trips with realistic data
export const userTripsData: UserTrip[] = [
    {
        id: "sarah-tokyo-trip",
        user: {
            name: "Sarah Johnson",
            avatar: "/woman-profile.png",
            initials: "SJ",
            location: "San Francisco, CA"
        },
        destination: "Tokyo, Japan",
        duration: "7 days",
        groupSize: 2,
        highlights: ["Shibuya Crossing", "Mount Fuji day trip", "Traditional Ryokan stay"],
        date: "2 days ago",
        photos: [
            "/japan-cherry-blossoms-temples.jpg",
            "/placeholder.jpg",
            "/placeholder.jpg"
        ],
        rating: 5,
        review: "Absolutely magical experience! The blend of traditional and modern culture was incredible.",
        budget: 2800,
        activities: ["Temple visits", "Sushi making", "Tokyo Skytree", "Harajuku shopping"]
    },
    {
        id: "mike-iceland-adventure",
        user: {
            name: "Mike Chen",
            avatar: "/man-profile.png",
            initials: "MC",
            location: "Vancouver, Canada"
        },
        destination: "Iceland",
        duration: "5 days",
        groupSize: 4,
        highlights: ["Northern Lights", "Blue Lagoon", "Golden Circle tour"],
        date: "1 week ago",
        photos: [
            "/iceland-northern-lights-dramatic-landscapes.jpg",
            "/placeholder.jpg"
        ],
        rating: 5,
        review: "Breathtaking landscapes and the Northern Lights were absolutely stunning!",
        budget: 3200,
        activities: ["Glacier hiking", "Geothermal spas", "Waterfall tours", "Northern Lights hunting"]
    },
    {
        id: "emma-bali-retreat",
        user: {
            name: "Emma Rodriguez",
            avatar: "/woman-profile-photo-2.png",
            initials: "ER",
            location: "Austin, TX"
        },
        destination: "Bali, Indonesia",
        duration: "10 days",
        groupSize: 1,
        highlights: ["Yoga retreats", "Rice terrace tours", "Beach relaxation"],
        date: "3 weeks ago",
        photos: [
            "/bali-indonesia-rice-terraces-tropical.jpg",
            "/placeholder.jpg"
        ],
        rating: 4,
        review: "Perfect for a wellness retreat. The rice terraces were absolutely beautiful!",
        budget: 1500,
        activities: ["Daily yoga", "Temple visits", "Cooking classes", "Surfing lessons"]
    },
    {
        id: "alex-greece-honeymoon",
        user: {
            name: "Alex & Maria Torres",
            avatar: "/placeholder-user.jpg",
            initials: "AT",
            location: "Miami, FL"
        },
        destination: "Santorini, Greece",
        duration: "6 days",
        groupSize: 2,
        highlights: ["Sunset in Oia", "Wine tasting", "Volcanic boat tour"],
        date: "1 month ago",
        photos: [
            "/santorini-greece-sunset-white-buildings.jpg",
            "/placeholder.jpg"
        ],
        rating: 5,
        review: "Perfect honeymoon destination! The sunsets were unforgettable.",
        budget: 2200,
        activities: ["Sunset viewing", "Wine tours", "Beach days", "Photography walks"]
    }
]

// Helper functions
export function getDestinationById(id: string): Destination | undefined {
    return destinationsData.find(dest => dest.id === id)
}

export function getDestinationsByContinent(continent: string): Destination[] {
    return destinationsData.filter(dest => dest.continent === continent)
}

export function getPopularDestinations(limit: number = 5): Destination[] {
    return destinationsData
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit)
}

export function searchDestinations(query: string): Destination[] {
    const lowercaseQuery = query.toLowerCase()
    return destinationsData.filter(dest =>
        dest.name.toLowerCase().includes(lowercaseQuery) ||
        dest.country.toLowerCase().includes(lowercaseQuery) ||
        dest.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
}