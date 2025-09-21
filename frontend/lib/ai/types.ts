// AI Integration Types and Interfaces
export interface AIProvider {
    name: 'openai' | 'gemini'
    apiKey: string
    model: string
    baseURL?: string
}

export interface TravelPromptData {
    destination?: string
    dates?: {
        start: string
        end: string
    }
    budget?: {
        amount: number
        currency: string
    }
    travelers?: {
        adults: number
        children: number
    }
    interests?: string[]
    travelStyle?: 'budget' | 'mid-range' | 'luxury'
    preferences?: {
        accommodation?: string[]
        activities?: string[]
        dietary?: string[]
    }
}

export interface AIGenerationOptions {
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
    includeImages?: boolean
    outputFormat?: 'json' | 'text' | 'structured'
}

export interface AITravelResponse {
    suggestions: {
        hotels?: any[]
        restaurants?: any[]
        activities?: any[]
        itinerary?: any[]
        visual_guide?: {
            mood_descriptions?: string[]
            photo_spots?: string[]
        }
        cultural_insights?: string[]
    }
    reasoning?: string
    confidence?: number
    alternatives?: any[]
}

export interface AIError {
    code: string
    message: string
    details?: any
    provider: string
}