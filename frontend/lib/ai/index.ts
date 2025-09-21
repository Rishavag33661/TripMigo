// Main AI Integration Module
export { GeminiTravelAgent } from './gemini-agent'
export { OpenAITravelAgent } from './openai-agent'
export { AITravelManager, createAITravelManager } from './travel-manager'
export type {
    AIError, AIGenerationOptions, AIProvider, AITravelResponse, TravelPromptData
} from './types'

import type { AITravelResponse, TravelPromptData } from './types'

// Utility functions for common AI integration patterns
export const createTravelPromptFromTripData = (tripData: any): TravelPromptData => {
    return {
        destination: tripData.destination,
        dates: tripData.dates ? {
            start: tripData.dates.start,
            end: tripData.dates.end
        } : undefined,
        budget: tripData.budget ? {
            amount: tripData.budget.amount || 1000,
            currency: tripData.budget.currency || 'USD'
        } : undefined,
        travelers: {
            adults: tripData.travelers?.adults || 2,
            children: tripData.travelers?.children || 0
        },
        interests: tripData.interests || [],
        travelStyle: tripData.travelStyle || 'mid-range',
        preferences: {
            accommodation: tripData.accommodationPreferences || [],
            activities: tripData.activityPreferences || [],
            dietary: tripData.dietaryRestrictions || []
        }
    }
}

export const formatAIResponse = (response: AITravelResponse, type: 'hotels' | 'activities' | 'itinerary') => {
    switch (type) {
        case 'hotels':
            return response.suggestions.hotels?.map((hotel: any) => ({
                ...hotel,
                aiGenerated: true,
                confidence: response.confidence,
                reasoning: response.reasoning
            })) || []

        case 'activities':
            return response.suggestions.activities?.map((activity: any) => ({
                ...activity,
                aiGenerated: true,
                confidence: response.confidence,
                reasoning: response.reasoning
            })) || []

        case 'itinerary':
            return response.suggestions.itinerary?.map((day: any) => ({
                ...day,
                aiGenerated: true,
                confidence: response.confidence,
                reasoning: response.reasoning
            })) || []

        default:
            return []
    }
}

// Environment configuration helpers
export const getAIConfig = () => {
    // This would read from environment variables or config files
    return {
        openai: {
            apiKey: process.env.OPENAI_API_KEY || '',
            model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'
        },
        gemini: {
            apiKey: process.env.GEMINI_API_KEY || '',
            model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite'
        },
        defaultProvider: (process.env.DEFAULT_AI_PROVIDER as 'openai' | 'gemini') || 'gemini'
    }
}

export const isAIConfigured = () => {
    const config = getAIConfig()
    return !!(config.openai.apiKey || config.gemini.apiKey)
}