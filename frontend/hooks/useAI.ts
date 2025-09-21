import { createAITravelManager, createTravelPromptFromTripData, formatAIResponse, getAIConfig, isAIConfigured } from '@/lib/ai'
import type { Activity, Hotel } from '@/lib/types/api'
import { useCallback, useState } from 'react'

interface UseAIResult<T> {
    data: T | null
    loading: boolean
    error: string | null
    aiGenerated: boolean
    confidence?: number
    reasoning?: string
    generateWithAI: (tripData: any, provider?: 'openai' | 'gemini') => Promise<void>
}

// AI Travel Manager instance (singleton pattern)
let aiManager: any = null
const getAIManager = () => {
    if (!aiManager && isAIConfigured()) {
        aiManager = createAITravelManager(getAIConfig())
    }
    return aiManager
}

export const useAIHotels = (): UseAIResult<Hotel[]> => {
    const [data, setData] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [aiGenerated, setAiGenerated] = useState(false)
    const [confidence, setConfidence] = useState<number>()
    const [reasoning, setReasoning] = useState<string>()

    const generateWithAI = useCallback(async (tripData: any, provider?: 'openai' | 'gemini') => {
        const manager = getAIManager()
        if (!manager) {
            setError('AI services not configured. Please set up OpenAI or Gemini API keys.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const promptData = createTravelPromptFromTripData(tripData)
            const response = await manager.suggestHotels(promptData, { provider })

            const formattedHotels = formatAIResponse(response, 'hotels')
            setData(formattedHotels)
            setAiGenerated(true)
            setConfidence(response.confidence)
            setReasoning(response.reasoning)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'AI generation failed')
            console.error('AI Hotel Generation Error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        data,
        loading,
        error,
        aiGenerated,
        confidence,
        reasoning,
        generateWithAI
    }
}

export const useAIActivities = (): UseAIResult<Activity[]> => {
    const [data, setData] = useState<Activity[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [aiGenerated, setAiGenerated] = useState(false)
    const [confidence, setConfidence] = useState<number>()
    const [reasoning, setReasoning] = useState<string>()

    const generateWithAI = useCallback(async (tripData: any, provider?: 'openai' | 'gemini') => {
        const manager = getAIManager()
        if (!manager) {
            setError('AI services not configured. Please set up OpenAI or Gemini API keys.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const promptData = createTravelPromptFromTripData(tripData)
            const response = await manager.suggestActivities(promptData, { provider })

            const formattedActivities = formatAIResponse(response, 'activities')
            setData(formattedActivities)
            setAiGenerated(true)
            setConfidence(response.confidence)
            setReasoning(response.reasoning)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'AI generation failed')
            console.error('AI Activity Generation Error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        data,
        loading,
        error,
        aiGenerated,
        confidence,
        reasoning,
        generateWithAI
    }
}

export const useAIItinerary = (): UseAIResult<any[]> => {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [aiGenerated, setAiGenerated] = useState(false)
    const [confidence, setConfidence] = useState<number>()
    const [reasoning, setReasoning] = useState<string>()

    const generateWithAI = useCallback(async (tripData: any, provider?: 'openai' | 'gemini') => {
        const manager = getAIManager()
        if (!manager) {
            setError('AI services not configured. Please set up OpenAI or Gemini API keys.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const promptData = createTravelPromptFromTripData(tripData)
            const response = await manager.generateItinerary(promptData, { provider })

            const formattedItinerary = formatAIResponse(response, 'itinerary')
            setData(formattedItinerary)
            setAiGenerated(true)
            setConfidence(response.confidence)
            setReasoning(response.reasoning)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'AI generation failed')
            console.error('AI Itinerary Generation Error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        data,
        loading,
        error,
        aiGenerated,
        confidence,
        reasoning,
        generateWithAI
    }
}

// Hook for comparing AI providers
export const useAIComparison = () => {
    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const compare = useCallback(async (
        tripData: any,
        type: 'itinerary' | 'hotels' | 'activities' = 'itinerary'
    ) => {
        const manager = getAIManager()
        if (!manager) {
            setError('AI services not configured. Please set up OpenAI or Gemini API keys.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const promptData = createTravelPromptFromTripData(tripData)
            const comparison = await manager.compareProviders(promptData, type)
            setResults(comparison)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'AI comparison failed')
            console.error('AI Comparison Error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        results,
        loading,
        error,
        compare
    }
}

// Hook to check AI configuration status
export const useAIStatus = () => {
    const [isConfigured, setIsConfigured] = useState(false)
    const [availableProviders, setAvailableProviders] = useState<('openai' | 'gemini')[]>([])

    const checkStatus = useCallback(() => {
        const configured = isAIConfigured()
        setIsConfigured(configured)

        if (configured) {
            const manager = getAIManager()
            if (manager) {
                setAvailableProviders(manager.getAvailableProviders())
            }
        }
    }, [])

    // Check status on mount
    useState(() => {
        checkStatus()
    })

    return {
        isConfigured,
        availableProviders,
        checkStatus
    }
}