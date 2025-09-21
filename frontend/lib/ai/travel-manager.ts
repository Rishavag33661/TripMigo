import { GeminiTravelAgent } from './gemini-agent'
import { OpenAITravelAgent } from './openai-agent'
import { AIGenerationOptions, AITravelResponse, TravelPromptData } from './types'

export class AITravelManager {
    private openaiAgent?: OpenAITravelAgent
    private geminiAgent?: GeminiTravelAgent
    private defaultProvider: 'openai' | 'gemini' = 'gemini'

    constructor(config: {
        openai?: { apiKey: string; model?: string }
        gemini?: { apiKey: string; model?: string }
        defaultProvider?: 'openai' | 'gemini'
    }) {
        if (config.openai) {
            this.openaiAgent = new OpenAITravelAgent(
                config.openai.apiKey,
                config.openai.model
            )
        }

        if (config.gemini) {
            this.geminiAgent = new GeminiTravelAgent(
                config.gemini.apiKey,
                config.gemini.model
            )
        }

        if (config.defaultProvider) {
            this.defaultProvider = config.defaultProvider
        }
    }

    async generateItinerary(
        promptData: TravelPromptData,
        options: AIGenerationOptions & { provider?: 'openai' | 'gemini' } = {}
    ): Promise<AITravelResponse> {
        const provider = options.provider || this.defaultProvider
        const agent = this.getAgent(provider)

        if (!agent) {
            throw new Error(`${provider} agent not configured`)
        }

        try {
            return await agent.generateItinerary(promptData, options)
        } catch (error) {
            // Fallback to other provider if available
            const fallbackProvider = provider === 'openai' ? 'gemini' : 'openai'
            const fallbackAgent = this.getAgent(fallbackProvider)

            if (fallbackAgent) {
                console.warn(`${provider} failed, falling back to ${fallbackProvider}`)
                return await fallbackAgent.generateItinerary(promptData, options)
            }

            throw error
        }
    }

    async suggestHotels(
        promptData: TravelPromptData,
        options: AIGenerationOptions & { provider?: 'openai' | 'gemini' } = {}
    ): Promise<AITravelResponse> {
        const provider = options.provider || this.defaultProvider
        const agent = this.getAgent(provider)

        if (!agent) {
            throw new Error(`${provider} agent not configured`)
        }

        try {
            return await agent.suggestHotels(promptData, options)
        } catch (error) {
            const fallbackProvider = provider === 'openai' ? 'gemini' : 'openai'
            const fallbackAgent = this.getAgent(fallbackProvider)

            if (fallbackAgent) {
                console.warn(`${provider} failed, falling back to ${fallbackProvider}`)
                return await fallbackAgent.suggestHotels(promptData, options)
            }

            throw error
        }
    }

    async suggestActivities(
        promptData: TravelPromptData,
        options: AIGenerationOptions & { provider?: 'openai' | 'gemini' } = {}
    ): Promise<AITravelResponse> {
        const provider = options.provider || this.defaultProvider
        const agent = this.getAgent(provider)

        if (!agent) {
            throw new Error(`${provider} agent not configured`)
        }

        try {
            return await agent.suggestActivities(promptData, options)
        } catch (error) {
            const fallbackProvider = provider === 'openai' ? 'gemini' : 'openai'
            const fallbackAgent = this.getAgent(fallbackProvider)

            if (fallbackAgent) {
                console.warn(`${provider} failed, falling back to ${fallbackProvider}`)
                return await fallbackAgent.suggestActivities(promptData, options)
            }

            throw error
        }
    }

    async generateMultiModalContent(
        promptData: TravelPromptData,
        includeImages: boolean = false
    ): Promise<AITravelResponse> {
        // Prefer Gemini for multimodal content
        if (this.geminiAgent) {
            try {
                return await this.geminiAgent.generateMultiModalContent(promptData, includeImages)
            } catch (error) {
                console.warn('Gemini multimodal failed, falling back to text-only')
            }
        }

        // Fallback to regular itinerary generation
        return await this.generateItinerary(promptData, {
            temperature: 0.8,
            includeImages
        })
    }

    async compareProviders(
        promptData: TravelPromptData,
        type: 'itinerary' | 'hotels' | 'activities' = 'itinerary'
    ): Promise<{
        openai?: AITravelResponse
        gemini?: AITravelResponse
        comparison: {
            preferredProvider: 'openai' | 'gemini' | 'tie'
            reasons: string[]
        }
    }> {
        const results: any = {}

        // Run both providers in parallel if available
        const promises: Promise<any>[] = []

        if (this.openaiAgent) {
            let openaiPromise: Promise<AITravelResponse>

            switch (type) {
                case 'itinerary':
                    openaiPromise = this.openaiAgent.generateItinerary(promptData)
                    break
                case 'hotels':
                    openaiPromise = this.openaiAgent.suggestHotels(promptData)
                    break
                case 'activities':
                    openaiPromise = this.openaiAgent.suggestActivities(promptData)
                    break
                default:
                    openaiPromise = this.openaiAgent.generateItinerary(promptData)
            }

            promises.push(
                openaiPromise
                    .then((result: AITravelResponse) => ({ provider: 'openai', result }))
                    .catch((error: any) => ({ provider: 'openai', error }))
            )
        }

        if (this.geminiAgent) {
            const method = type === 'itinerary' ? 'generateItinerary' :
                type === 'hotels' ? 'suggestHotels' : 'suggestActivities'

            promises.push(
                this.geminiAgent[method](promptData)
                    .then(result => ({ provider: 'gemini', result }))
                    .catch(error => ({ provider: 'gemini', error }))
            )
        }

        const responses = await Promise.allSettled(promises)

        responses.forEach(response => {
            if (response.status === 'fulfilled' && response.value.result) {
                results[response.value.provider] = response.value.result
            }
        })

        // Simple comparison logic
        const comparison = this.compareResponses(results.openai, results.gemini)

        return {
            ...results,
            comparison
        }
    }

    private getAgent(provider: 'openai' | 'gemini'): OpenAITravelAgent | GeminiTravelAgent | null {
        switch (provider) {
            case 'openai':
                return this.openaiAgent || null
            case 'gemini':
                return this.geminiAgent || null
            default:
                return null
        }
    }

    private compareResponses(
        openaiResponse?: AITravelResponse,
        geminiResponse?: AITravelResponse
    ): { preferredProvider: 'openai' | 'gemini' | 'tie'; reasons: string[] } {
        const reasons: string[] = []

        if (!openaiResponse && !geminiResponse) {
            return { preferredProvider: 'tie', reasons: ['No responses available'] }
        }

        if (!openaiResponse) {
            reasons.push('Only Gemini response available')
            return { preferredProvider: 'gemini', reasons }
        }

        if (!geminiResponse) {
            reasons.push('Only OpenAI response available')
            return { preferredProvider: 'openai', reasons }
        }

        let openaiScore = 0
        let geminiScore = 0

        // Compare confidence levels
        if (openaiResponse.confidence && geminiResponse.confidence) {
            if (openaiResponse.confidence > geminiResponse.confidence) {
                openaiScore++
                reasons.push('OpenAI has higher confidence score')
            } else if (geminiResponse.confidence > openaiResponse.confidence) {
                geminiScore++
                reasons.push('Gemini has higher confidence score')
            }
        }

        // Compare content richness
        const openaiContentCount = this.countContent(openaiResponse.suggestions)
        const geminiContentCount = this.countContent(geminiResponse.suggestions)

        if (openaiContentCount > geminiContentCount) {
            openaiScore++
            reasons.push('OpenAI provided more detailed content')
        } else if (geminiContentCount > openaiContentCount) {
            geminiScore++
            reasons.push('Gemini provided more detailed content')
        }

        // Check for alternatives and reasoning
        if (openaiResponse.alternatives?.length && !geminiResponse.alternatives?.length) {
            openaiScore++
            reasons.push('OpenAI provided alternative options')
        } else if (geminiResponse.alternatives?.length && !openaiResponse.alternatives?.length) {
            geminiScore++
            reasons.push('Gemini provided alternative options')
        }

        if (openaiScore > geminiScore) {
            return { preferredProvider: 'openai', reasons }
        } else if (geminiScore > openaiScore) {
            return { preferredProvider: 'gemini', reasons }
        } else {
            reasons.push('Both providers performed equally well')
            return { preferredProvider: 'tie', reasons }
        }
    }

    private countContent(suggestions: any): number {
        let count = 0
        Object.values(suggestions).forEach(value => {
            if (Array.isArray(value)) count += value.length
            else if (value) count++
        })
        return count
    }

    // Utility methods for configuration management
    isConfigured(provider: 'openai' | 'gemini'): boolean {
        return this.getAgent(provider) !== null
    }

    getAvailableProviders(): ('openai' | 'gemini')[] {
        const providers: ('openai' | 'gemini')[] = []
        if (this.openaiAgent) providers.push('openai')
        if (this.geminiAgent) providers.push('gemini')
        return providers
    }

    setDefaultProvider(provider: 'openai' | 'gemini'): void {
        if (this.isConfigured(provider)) {
            this.defaultProvider = provider
        } else {
            throw new Error(`${provider} is not configured`)
        }
    }
}

// Export a singleton instance factory for easy use
export const createAITravelManager = (config: {
    openai?: { apiKey: string; model?: string }
    gemini?: { apiKey: string; model?: string }
    defaultProvider?: 'openai' | 'gemini'
}) => {
    return new AITravelManager(config)
}