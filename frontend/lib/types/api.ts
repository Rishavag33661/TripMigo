// Core API response types for AI/Backend integration

export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
    error?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        total: number
        page: number
        limit: number
        hasNext: boolean
        hasPrev: boolean
    }
    success: boolean
    message?: string
}

// Location and Geographic Data
export interface Location {
    id: string
    name: string
    country: string
    region?: string
    coordinates?: {
        latitude: number
        longitude: number
    }
    timezone?: string
    currency?: string
    language?: string[]
}

export interface Destination extends Location {
    description: string
    climate: string
    bestTimeToVisit: string[]
    popularAttractions: string[]
    averageBudget: {
        budget: number
        midRange: number
        luxury: number
    }
    images: string[]
    tags: string[]
    rating: number
    reviewCount: number
}

// Hotel and Accommodation Data
export interface Amenity {
    id: string
    name: string
    icon?: string
    category: 'basic' | 'luxury' | 'business' | 'family'
    description?: string
}

export interface Hotel {
    id: string
    name: string
    description: string
    summary: string
    rating: number
    reviewCount: number
    pricePerNight: {
        currency: string
        amount: number
        basePrice: number
        taxes?: number
        fees?: number
    }
    images: string[]
    location: {
        address: string
        city: string
        country: string
        coordinates?: {
            latitude: number
            longitude: number
        }
        distanceFromCenter: {
            value: number
            unit: 'km' | 'miles'
        }
        nearbyAttractions?: string[]
    }
    amenities: Amenity[]
    roomTypes: {
        id: string
        name: string
        capacity: number
        bedType: string
        size: number
        priceModifier: number
    }[]
    policies: {
        checkIn: string
        checkOut: string
        cancellation: string
        petPolicy?: string
        smokingPolicy?: string
    }
    category: 'budget' | 'mid-range' | 'luxury' | 'boutique' | 'business'
    availabilityStatus: 'available' | 'limited' | 'unavailable'
}

// Travel and Transportation
export interface TravelMode {
    id: string
    name: string
    type: 'flight' | 'train' | 'bus' | 'car' | 'ship' | 'walking'
    description: string
    estimatedDuration: {
        min: number
        max: number
        unit: 'minutes' | 'hours' | 'days'
    }
    estimatedCost: {
        currency: string
        min: number
        max: number
    }
    comfort: 'basic' | 'standard' | 'premium' | 'luxury'
    sustainability: {
        carbonFootprint: number
        ecoRating: number
    }
    restrictions?: string[]
    amenities?: string[]
}

// Essential Items and Packing
export interface EssentialItem {
    id: string
    name: string
    category: 'clothing' | 'electronics' | 'documents' | 'health' | 'comfort' | 'activity'
    description: string
    importance: 'essential' | 'recommended' | 'optional'
    climate?: string[]
    activity?: string[]
    weight?: number
    size?: 'small' | 'medium' | 'large'
    estimatedCost?: {
        currency: string
        min: number
        max: number
    }
}

// Itinerary and Activities
export interface Activity {
    id: string
    name: string
    description: string
    type: 'sightseeing' | 'adventure' | 'cultural' | 'relaxation' | 'dining' | 'shopping' | 'entertainment'
    duration: {
        value: number
        unit: 'minutes' | 'hours' | 'days'
    }
    cost: {
        currency: string
        amount: number
        costType: 'free' | 'paid' | 'variable'
    }
    location: {
        name: string
        address?: string
        coordinates?: {
            latitude: number
            longitude: number
        }
    }
    difficulty?: 'easy' | 'moderate' | 'challenging'
    ageRestriction?: {
        min?: number
        max?: number
    }
    groupSize?: {
        min: number
        max: number
    }
    bookingRequired: boolean
    images?: string[]
    tags: string[]
    rating?: number
    reviewCount?: number
}

export interface ItineraryDay {
    day: number
    date: string
    theme?: string
    activities: (Activity & {
        startTime: string
        endTime?: string
        notes?: string
        alternatives?: Activity[]
    })[]
    meals?: {
        breakfast?: Activity
        lunch?: Activity
        dinner?: Activity
    }
    accommodation?: {
        hotelId: string
        checkIn?: boolean
        checkOut?: boolean
    }
    transportation?: {
        mode: TravelMode
        details: string
        cost?: number
    }[]
    totalCost: {
        currency: string
        amount: number
    }
    tips?: string[]
}

export interface Itinerary {
    id: string
    name: string
    description: string
    destination: Destination
    duration: {
        days: number
        nights: number
    }
    startDate: string
    endDate: string
    days: ItineraryDay[]
    totalCost: {
        currency: string
        accommodation: number
        transportation: number
        activities: number
        meals: number
        total: number
    }
    participants: {
        adults: number
        children: number
        infants: number
    }
    preferences: {
        budget: 'budget' | 'mid-range' | 'luxury'
        pace: 'relaxed' | 'moderate' | 'active'
        interests: string[]
        dietary?: string[]
        accessibility?: string[]
    }
    weather?: {
        forecast: {
            date: string
            temperature: {
                min: number
                max: number
                unit: 'celsius' | 'fahrenheit'
            }
            conditions: string
            precipitation?: number
        }[]
    }
    createdBy: 'user' | 'ai'
    aiModel?: 'openai' | 'gemini-flash-2.5'
    generatedAt: string
    lastModified: string
}

// Trip Planning Data (Main Trip Object)
export interface Trip {
    id: string
    name: string
    status: 'planning' | 'booked' | 'in-progress' | 'completed' | 'cancelled'
    participants: {
        adults: number
        children: number
        infants: number
        foodPreference: 'veg' | 'non-veg' | 'vegan' | 'any'
    }
    budget: {
        currency: string
        total: number
        breakdown: {
            accommodation: number
            transportation: number
            activities: number
            meals: number
            shopping: number
            emergency: number
        }
    }
    destination: Destination
    dates: {
        startDate: string
        endDate: string
        flexibility?: {
            days: number
            direction: 'before' | 'after' | 'both'
        }
    }
    selectedOptions: {
        hotel?: Hotel
        travelMode?: TravelMode
        essentials?: EssentialItem[]
        itinerary?: Itinerary
    }
    preferences: {
        travelStyle: 'budget' | 'mid-range' | 'luxury'
        pace: 'relaxed' | 'moderate' | 'active'
        interests: string[]
        accessibility?: string[]
    }
    aiGenerated: {
        suggestions: {
            hotels: Hotel[]
            activities: Activity[]
            restaurants: Activity[]
            essentials: EssentialItem[]
        }
        recommendations: {
            bestTimeToVisit: string
            weatherForecast: string
            localTips: string[]
            culturalNotes: string[]
            safetyAdvice: string[]
        }
        model: 'openai' | 'gemini-flash-2.5'
        generatedAt: string
    }
    createdAt: string
    lastModified: string
    userId?: string
}

// API Endpoints for different operations
export interface ApiEndpoints {
    destinations: {
        search: (query: string, filters?: any) => Promise<ApiResponse<Destination[]>>
        getById: (id: string) => Promise<ApiResponse<Destination>>
        getPopular: () => Promise<ApiResponse<Destination[]>>
    }
    hotels: {
        search: (destinationId: string, filters?: any) => Promise<ApiResponse<Hotel[]>>
        getById: (id: string) => Promise<ApiResponse<Hotel>>
        checkAvailability: (hotelId: string, dates: { start: string, end: string }) => Promise<ApiResponse<boolean>>
    }
    transportation: {
        getModes: (from: string, to: string) => Promise<ApiResponse<TravelMode[]>>
        getById: (id: string) => Promise<ApiResponse<TravelMode>>
    }
    essentials: {
        getRecommended: (destination: string, climate: string, activities: string[]) => Promise<ApiResponse<EssentialItem[]>>
        getByCategory: (category: string) => Promise<ApiResponse<EssentialItem[]>>
    }
    itinerary: {
        generate: (tripData: Partial<Trip>) => Promise<ApiResponse<Itinerary>>
        optimize: (itinerary: Itinerary, preferences: any) => Promise<ApiResponse<Itinerary>>
        getActivities: (destinationId: string, filters?: any) => Promise<ApiResponse<Activity[]>>
    }
    trips: {
        create: (trip: Omit<Trip, 'id' | 'createdAt' | 'lastModified'>) => Promise<ApiResponse<Trip>>
        update: (id: string, updates: Partial<Trip>) => Promise<ApiResponse<Trip>>
        getById: (id: string) => Promise<ApiResponse<Trip>>
        getUserTrips: (userId: string) => Promise<ApiResponse<Trip[]>>
        delete: (id: string) => Promise<ApiResponse<boolean>>
    }
    ai: {
        generateSuggestions: (tripData: Partial<Trip>) => Promise<ApiResponse<any>>
        optimizeItinerary: (itinerary: Itinerary) => Promise<ApiResponse<Itinerary>>
        getChatResponse: (message: string, context: Trip) => Promise<ApiResponse<string>>
    }
}