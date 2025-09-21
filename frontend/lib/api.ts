// API service for TripMigo AI backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

// Type definitions based on backend models
export interface TripRequest {
    source: string
    destination: string
    budget: string // 'budget', 'mid-range', 'luxury'
    duration_days: number
    interests: string[]
    constraints?: string
    travel_style: string // 'relaxed', 'moderate', 'packed'
    travelers: string // 'solo', 'couple', 'family', 'group'
    start_date?: string
    accommodation_type?: string
}

export interface ActivityItem {
    time: string
    title: string
    description: string
    type: string
    icon: string
    duration: string
    location: string
    estimated_cost?: string
    booking_required: boolean
}

export interface ItineraryDay {
    day: number
    date: string
    title: string
    items: ActivityItem[]
    total_estimated_cost?: string
}

export interface PlaceDetails {
    place_id: string
    rating?: number
    address: string
    review_summary?: string
    photos?: string[]
}

export interface ItineraryResponse {
    itinerary: ItineraryDay[]
    place_details: PlaceDetails
    travel_tips?: string[]
    total_estimated_cost?: string
}

export interface Destination {
    id: string
    name: string
    country: string
    description: string
    images: {
        hero: string
        slideshow: string[]
        thumbnail: string
    }
    videos: {
        hero: string
        thumbnail: string
    }
    rating: number
    tags: string[]
    highlights: string[]
    best_time_to_visit: string
    estimated_cost: { budget: string; range: string }
}

export interface SavedTrip {
    id: string
    user: {
        name: string
        avatar?: string
        initials: string
        location?: string
    }
    destination: string
    duration: string
    group_size: number
    highlights: string[]
    date: string
    rating: number
    review: string
}

export interface ReviewSummaryRequest {
    reviews: string[]
}

export interface ReviewSummaryResponse {
    summary: {
        pros: string[]
        cons: string[]
        overall_sentiment: string
        rating_breakdown?: Record<string, number>
    }
}

export interface MapsKeyResponse {
    mapsApiKey: string
}

export interface PlanningSession {
    session_id: string
    current_step: number
    steps: Array<{
        step: number
        title: string
        completed: boolean
        data?: any
    }>
    trip_request?: TripRequest
}

// API Error handling
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public response?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    }

    try {
        const response = await fetch(url, config)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new ApiError(
                errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                errorData
            )
        }

        return await response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }

        // Network or other errors
        throw new ApiError(
            error instanceof Error ? error.message : 'Network error occurred',
            undefined,
            error
        )
    }
}

// API Service functions
export const tripPlannerApi = {
    // Configuration endpoints
    async getMapsKey(): Promise<MapsKeyResponse> {
        return apiRequest<MapsKeyResponse>('/config/maps-key')
    },

    async getAppConfig(): Promise<any> {
        return apiRequest('/config/app')
    },

    // Destinations endpoints
    async getDestinations(limit?: number, search?: string): Promise<{ destinations: Destination[], total: number }> {
        const params = new URLSearchParams()
        if (limit) params.append('limit', limit.toString())
        if (search) params.append('search', search)
        const query = params.toString() ? `?${params.toString()}` : ''
        return apiRequest<{ destinations: Destination[], total: number }>(`/destinations${query}`)
    },

    async getDestinationDetails(destinationId: string): Promise<any> {
        return apiRequest(`/destinations/${destinationId}`)
    },

    async getPopularTrips(): Promise<{ trips: SavedTrip[] }> {
        return apiRequest<{ trips: SavedTrip[] }>('/destinations/trips/popular')
    },

    async getRecentTrips(): Promise<{ trips: SavedTrip[] }> {
        return apiRequest<{ trips: SavedTrip[] }>('/destinations/trips/recent')
    },

    async searchNearbyAttractions(location: string, radius?: number, placeType?: string): Promise<any> {
        const params = new URLSearchParams({ location })
        if (radius) params.append('radius', radius.toString())
        if (placeType) params.append('place_type', placeType)
        return apiRequest(`/destinations/search/nearby?${params.toString()}`)
    },

    // Itinerary endpoints
    async generateItinerary(tripRequest: TripRequest): Promise<ItineraryResponse> {
        return apiRequest<ItineraryResponse>('/itinerary/generate', {
            method: 'POST',
            body: JSON.stringify(tripRequest),
        })
    },

    async optimizeItinerary(tripRequest: TripRequest, preferences: any): Promise<any> {
        return apiRequest('/itinerary/optimize', {
            method: 'POST',
            body: JSON.stringify({ ...tripRequest, preferences }),
        })
    },

    async getItineraryTemplates(): Promise<any> {
        return apiRequest('/itinerary/templates')
    },

    async summarizeReviews(reviews: string[]): Promise<ReviewSummaryResponse> {
        return apiRequest<ReviewSummaryResponse>('/itinerary/reviews/summarize', {
            method: 'POST',
            body: JSON.stringify({ reviews }),
        })
    },

    // Planning endpoints
    async startPlanningSession(userId?: string): Promise<PlanningSession> {
        return apiRequest<PlanningSession>('/planning/session/start', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId }),
        })
    },

    async getPlanningSession(sessionId: string): Promise<PlanningSession> {
        return apiRequest<PlanningSession>(`/planning/session/${sessionId}`)
    },

    async updatePlanningStep(sessionId: string, stepNumber: number, stepData: any): Promise<any> {
        return apiRequest(`/planning/session/${sessionId}/step/${stepNumber}`, {
            method: 'PUT',
            body: JSON.stringify(stepData),
        })
    },

    async generateFromSession(sessionId: string): Promise<ItineraryResponse> {
        return apiRequest<ItineraryResponse>(`/planning/session/${sessionId}/generate`, {
            method: 'POST',
        })
    },

    async getDestinationSuggestions(interests: string, budget: string, duration: number): Promise<any> {
        const params = new URLSearchParams({ interests, budget, duration: duration.toString() })
        return apiRequest(`/planning/destinations/suggestions?${params.toString()}`)
    },

    // Auth endpoints
    async registerUser(name: string, email: string, location?: string): Promise<any> {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, location }),
        })
    },

    async loginUser(email: string): Promise<any> {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
    },

    async getUserProfile(userId: string): Promise<any> {
        return apiRequest(`/auth/profile/${userId}`)
    },

    async updateUserProfile(userId: string, name?: string, location?: string): Promise<any> {
        return apiRequest(`/auth/profile/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ name, location }),
        })
    },

    async logoutUser(sessionId: string): Promise<any> {
        return apiRequest('/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ session_id: sessionId }),
        })
    },

    async verifyToken(token: string): Promise<any> {
        const params = new URLSearchParams({ token })
        return apiRequest(`/auth/verify-token?${params.toString()}`)
    },
}

// Helper function to convert our form data to TripRequest format
export function convertFormDataToTripRequest(formData: any): TripRequest {
    return {
        source: formData.sourceLocation || formData.startLocation || 'Current Location',
        destination: formData.destination || '',
        budget: mapBudgetToBackend(formData.budget),
        duration_days: formData.numberOfDays || parseInt(formData.duration) || 3,
        interests: formData.interests || [],
        constraints: formData.accessibility || 'No specific constraints',
        travel_style: mapTravelStyleToBackend(formData.travelStyle),
        travelers: mapTravelersToBackend(formData.numberOfPeople || formData.travelers),
    }
}

// Map our form values to backend expected values
function mapBudgetToBackend(budget: string): string {
    const budgetMap: Record<string, string> = {
        'budget': 'low',
        'mid-range': 'mid-range',
        'luxury': 'luxury',
    }
    return budgetMap[budget] || 'mid-range'
}

function mapTravelStyleToBackend(style: string): string {
    const styleMap: Record<string, string> = {
        'relaxed': 'relaxed',
        'adventure': 'adventure',
        'cultural': 'cultural',
        'luxury': 'luxury',
    }
    return styleMap[style] || 'relaxed'
}

function mapTravelersToBackend(travelers: any): string {
    if (typeof travelers === 'string') return travelers
    if (typeof travelers === 'number') {
        // Handle numberOfPeople field
        if (travelers === 1) return 'solo'
        if (travelers === 2) return 'couple'
        return `group of ${travelers}`
    }

    // If travelers is an object with adults/children counts
    if (travelers?.adults !== undefined) {
        const adults = travelers.adults || 0
        const children = travelers.children || 0
        const total = adults + children

        if (total === 1) return 'solo'
        if (total === 2 && children === 0) return 'couple'
        if (children > 0) return `family of ${total}`
        return `group of ${total}`
    }

    return 'solo'
}

// Parse AI-generated itinerary text into structured format
export function parseItineraryText(itineraryText: string, maxDays?: number): any {
    try {
        console.log('Parsing itinerary text:', itineraryText);

        // Try to parse as JSON first (if the AI returns structured JSON)
        try {
            const parsed = JSON.parse(itineraryText);
            console.log('Successfully parsed as JSON:', parsed);

            // If it's already an array of days, return it (possibly limited)
            if (Array.isArray(parsed)) {
                const limited = maxDays ? parsed.slice(0, maxDays) : parsed;
                console.log('Returning JSON array, limited to', limited.length, 'days');
                return limited;
            }

            // If it's an object, try to extract days array
            if (parsed && typeof parsed === 'object') {
                return parsed;
            }
        } catch (jsonError) {
            console.log('Not valid JSON, trying text parsing');
        }

        // If not JSON, parse the text format
        const days: any[] = []
        const lines = itineraryText.split('\n').filter(line => line.trim())

        let currentDay: any = null
        let dayCounter = 1

        for (const line of lines) {
            const trimmedLine = line.trim()

            // Stop processing if we've reached the maximum number of days
            if (maxDays && dayCounter > maxDays) {
                break;
            }

            // Detect day headers (## Day X or Day X)
            if (trimmedLine.toLowerCase().includes('day') && (trimmedLine.startsWith('##') || trimmedLine.match(/^day\s+\d+/i))) {
                if (currentDay) {
                    days.push(currentDay)
                }

                // Stop if we've already added the maximum number of days
                if (maxDays && days.length >= maxDays) {
                    break;
                }

                const dayMatch = trimmedLine.match(/day\s+(\d+)/i);
                const dayNum = dayMatch ? parseInt(dayMatch[1]) : dayCounter;

                currentDay = {
                    day: dayNum,
                    date: new Date(Date.now() + (dayNum - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    title: trimmedLine.replace(/^#+\s*/, ''), // Remove markdown headers
                    items: []
                }
                dayCounter = dayNum + 1;
            } else if (currentDay && trimmedLine && !trimmedLine.startsWith('#')) {
                // Parse activities - look for time patterns and activity descriptions
                let time = '9:00 AM';
                let activityText = trimmedLine;

                // Check for **Morning**, **Afternoon**, **Evening** patterns
                if (trimmedLine.includes('Morning')) {
                    time = '9:00 AM';
                    activityText = trimmedLine.replace(/\*\*Morning.*?\*\*:?\s*/i, '');
                } else if (trimmedLine.includes('Afternoon')) {
                    time = '2:00 PM';
                    activityText = trimmedLine.replace(/\*\*Afternoon.*?\*\*:?\s*/i, '');
                } else if (trimmedLine.includes('Evening')) {
                    time = '7:00 PM';
                    activityText = trimmedLine.replace(/\*\*Evening.*?\*\*:?\s*/i, '');
                } else {
                    // Look for specific time patterns
                    const timeMatch = trimmedLine.match(/\*\*.*?(\d{1,2}:\d{2}\s*(?:AM|PM)?)\*\*:?\s*/i);
                    if (timeMatch) {
                        time = timeMatch[1];
                        activityText = trimmedLine.replace(/\*\*.*?\*\*:?\s*/, '');
                    } else {
                        // Look for general time pattern
                        const generalTimeMatch = trimmedLine.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
                        if (generalTimeMatch) {
                            time = generalTimeMatch[1];
                            activityText = trimmedLine.replace(/^\d{1,2}:\d{2}\s*(?:AM|PM)?\s*[:-]?\s*/i, '');
                        }
                    }
                }

                // Clean up the activity text
                activityText = activityText.replace(/^\*\*|\*\*$/g, '').trim();

                if (activityText && activityText.length > 3) {
                    currentDay.items.push({
                        time,
                        title: activityText,
                        description: activityText,
                        type: detectActivityType(activityText),
                        icon: detectActivityType(activityText),
                        duration: '2 hours',
                        location: extractLocation(activityText)
                    })
                }
            }
        }

        if (currentDay) {
            days.push(currentDay)
        }

        // Ensure we don't exceed the maximum number of days
        const finalDays = maxDays ? days.slice(0, maxDays) : days;

        return finalDays.length > 0 ? finalDays : null
    } catch (error) {
        console.error('Error parsing itinerary text:', error)
        return null
    }
}

function detectActivityType(text: string): string {
    const lowerText = text.toLowerCase()

    if (lowerText.includes('restaurant') || lowerText.includes('food') || lowerText.includes('lunch') || lowerText.includes('dinner') || lowerText.includes('breakfast')) {
        return 'food'
    }
    if (lowerText.includes('hotel') || lowerText.includes('check')) {
        return 'accommodation'
    }
    if (lowerText.includes('transport') || lowerText.includes('travel') || lowerText.includes('flight') || lowerText.includes('train')) {
        return 'transport'
    }
    if (lowerText.includes('museum') || lowerText.includes('temple') || lowerText.includes('palace') || lowerText.includes('monument')) {
        return 'activity'
    }

    return 'activity'
}

function extractLocation(text: string): string {
    // Simple location extraction - can be improved
    const locationKeywords = ['at ', 'in ', 'near ', 'to ']

    for (const keyword of locationKeywords) {
        const index = text.toLowerCase().indexOf(keyword)
        if (index !== -1) {
            const afterKeyword = text.substring(index + keyword.length)
            const words = afterKeyword.split(' ').slice(0, 3)
            return words.join(' ')
        }
    }

    return text.split(' ').slice(0, 3).join(' ')
}