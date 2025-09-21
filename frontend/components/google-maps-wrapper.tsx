"use client"

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Declare Google Maps types
declare global {
    interface Window {
        google: any;
    }
}

interface ItineraryItem {
    time: string
    title: string
    description: string
    type: "travel" | "accommodation" | "food" | "activity" | "transport"
    icon: any
    duration?: string
    location?: string
}

interface GoogleMapsWrapperProps {
    activities: ItineraryItem[]
    destination: string
    dayNumber: number
}

let googleMapsLoaded = false
let googleMapsPromise: Promise<void> | null = null

const loadGoogleMaps = async (): Promise<void> => {
    if (googleMapsLoaded && window.google) {
        return Promise.resolve()
    }

    if (googleMapsPromise) {
        return googleMapsPromise
    }

    googleMapsPromise = new Promise(async (resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Window not available'))
            return
        }

        if (window.google) {
            googleMapsLoaded = true
            resolve()
            return
        }

        try {
            // Try to get API key from backend
            let apiKey = '';
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/config/maps-key`);
                if (response.ok) {
                    const data = await response.json();
                    apiKey = data.mapsApiKey;
                    console.log('Got API key from backend:', apiKey.substring(0, 10) + '...');
                }
            } catch (error) {
                console.warn('Could not fetch Maps API key from backend, using fallback');
            }

            // Fallback to environment variable
            if (!apiKey) {
                apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
                console.log('Using API key from environment:', apiKey.substring(0, 10) + '...');
            }

            // Check if we have a valid API key
            if (!apiKey || !apiKey.startsWith('AIza')) {
                console.log('No valid Google Maps API key available, using fallback display')
                reject(new Error('Google Maps API not configured. Add your API key to enable interactive maps.'))
                return
            }

            console.log('Loading Google Maps with API key:', apiKey.substring(0, 10) + '...')

            const script = document.createElement('script')
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`
            script.async = true
            script.defer = true

            script.onload = () => {
                console.log('Google Maps script loaded successfully')
                googleMapsLoaded = true
                resolve()
            }

            script.onerror = (error) => {
                console.error('Failed to load Google Maps script:', error)
                reject(new Error('Failed to load Google Maps - API key may be invalid or expired'))
            }

            console.log('Adding Google Maps script to head')
            document.head.appendChild(script)
        } catch (error) {
            reject(error)
        }
    })

    return googleMapsPromise
}

export function GoogleMapsWrapper({ activities, destination, dayNumber }: GoogleMapsWrapperProps) {
    console.log(`🗺️ GoogleMapsWrapper Day ${dayNumber} rendered with:`, {
        activitiesCount: activities.length,
        activities: activities.map(a => ({ title: a.title, location: a.location })),
        destination
    });

    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const markersRef = useRef<any[]>([])
    const directionsRendererRef = useRef<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const isMountedRef = useRef(true)

    // Clean up function
    const cleanup = () => {
        if (markersRef.current) {
            markersRef.current.forEach(item => {
                try {
                    if (item && item.setMap) {
                        item.setMap(null) // This works for both markers and polylines
                    }
                } catch (e) {
                    // Ignore cleanup errors
                }
            })
            markersRef.current = []
        }

        if (directionsRendererRef.current) {
            try {
                directionsRendererRef.current.setMap(null)
            } catch (e) {
                // Ignore cleanup errors
            }
            directionsRendererRef.current = null
        }

        mapInstanceRef.current = null
    }

    useEffect(() => {
        isMountedRef.current = true

        // Create a stable key for this set of activities
        const activitiesKey = activities.map(a => `${a.title}-${a.location}-${a.time}`).join('|')
        console.log(`📍 Day ${dayNumber} GoogleMapsWrapper useEffect triggered with ${activities.length} activities`)
        console.log(`🔑 Activities key: ${activitiesKey.substring(0, 100)}...`)

        const initializeMap = async () => {
            try {
                console.log(`🗺️ Day ${dayNumber}: Initializing Google Maps...`)
                await loadGoogleMaps()
                console.log(`✅ Day ${dayNumber}: Google Maps loaded successfully`)

                if (!isMountedRef.current || !mapContainerRef.current) {
                    console.log(`❌ Day ${dayNumber}: Component unmounted or container missing`)
                    return
                }

                // Clear any existing map content first
                console.log(`🧹 Day ${dayNumber}: Cleaning up existing map content...`)
                cleanup()

                // Create new map instance with unique ID
                const mapInstance = new window.google.maps.Map(mapContainerRef.current, {
                    zoom: 13,
                    center: { lat: 28.6139, lng: 77.2090 },
                    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#1f2937" }] },
                        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#f3f4f6" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#1f2937" }] },
                        { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#4b5563" }] },
                        { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#374151" }] },
                        { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
                        { featureType: "water", elementType: "geometry", stylers: [{ color: "#1e3a8a" }] },
                        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1f2937" }] }
                    ]
                })

                mapInstanceRef.current = mapInstance
                console.log('Map instance created')

                if (!isMountedRef.current) return

                // Center map on destination
                const geocoder = new window.google.maps.Geocoder()
                console.log('Geocoding destination:', destination)
                geocoder.geocode({ address: destination || 'Delhi, India' }, (results: any, status: any) => {
                    console.log('Destination geocoding result:', status, results?.[0]?.formatted_address)
                    if (isMountedRef.current && status === 'OK' && results?.[0]) {
                        mapInstance.setCenter(results[0].geometry.location)
                    }
                })

                // Add markers for activities
                console.log('Adding markers for activities:', activities.filter(a => a.location).length, 'activities with locations')
                await addMarkersToMap(mapInstance)

            } catch (err) {
                console.error('Map initialization error:', err)
                if (isMountedRef.current) {
                    setError(`${err instanceof Error ? err.message : 'Unknown error'}`)
                    setIsLoading(false)
                }
            }
        }

        const addMarkersToMap = async (mapInstance: any) => {
            const activitiesWithLocation = activities.filter(activity => activity.location)

            console.log('=== ADDING MARKERS TO MAP ===')
            console.log('Total activities received:', activities.length)
            console.log('Activities with location:', activitiesWithLocation.length)
            console.log('Activities data:', activities.map(a => ({ title: a.title, location: a.location })))

            if (activitiesWithLocation.length === 0) {
                if (isMountedRef.current) {
                    setIsLoading(false) // No error, just no locations
                }
                return
            }

            const newMarkers: any[] = []
            const bounds = new window.google.maps.LatLngBounds()
            let processed = 0
            let setupCompleted = false // Flag to prevent multiple setup calls

            for (let index = 0; index < activitiesWithLocation.length; index++) {
                const activity = activitiesWithLocation[index]

                await new Promise<void>((resolve) => {
                    const geocoder = new window.google.maps.Geocoder()

                    // Smart location processing - avoid duplicating destination
                    let searchLocation = activity.location || ''

                    // Clean up location string for better geocoding
                    searchLocation = searchLocation
                        .replace(/\s*\([^)]*\)\s*/g, '') // Remove parenthetical content like "(JTR)"
                        .replace(/\s+to\s+.*/i, '') // Remove "to [destination]" part for transfers
                        .replace(/^.*\s+at\s+/i, '') // Extract location after "at"
                        .trim()

                    // If location already contains the destination, use it as-is
                    const destinationName = destination.split(',')[0].trim() // Get main destination name
                    const locationContainsDestination = searchLocation.toLowerCase().includes(destinationName.toLowerCase())

                    const fullAddress = locationContainsDestination
                        ? searchLocation
                        : `${searchLocation}, ${destination}`

                    console.log(`📍 Processing location for "${activity.title}":`)
                    console.log(`   Original: "${activity.location}"`)
                    console.log(`   Cleaned: "${searchLocation}"`)
                    console.log(`   Final search: "${fullAddress}"`)
                    console.log(`Geocoding activity ${index + 1}:`, fullAddress)

                    geocoder.geocode({ address: fullAddress }, (results: any, status: any) => {
                        processed++

                        if (status === 'OK' && results?.[0] && isMountedRef.current) {
                            const location = results[0].geometry.location
                            bounds.extend(location)

                            console.log(`✅ Successfully geocoded activity ${index + 1}: ${activity.title} at ${fullAddress}`)

                            // Create marker with custom icon color based on activity type
                            const getMarkerColor = (type: string) => {
                                const colors = {
                                    travel: '#3B82F6',
                                    accommodation: '#8B5CF6',
                                    food: '#F97316',
                                    activity: '#10B981',
                                    transport: '#6B7280'
                                }
                                return colors[type as keyof typeof colors] || '#EF4444'
                            }

                            const marker = new window.google.maps.Marker({
                                position: location,
                                map: mapInstance,
                                title: `${index + 1}. ${activity.title}`,
                                icon: {
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 12,
                                    fillColor: getMarkerColor(activity.type),
                                    fillOpacity: 1,
                                    strokeColor: '#FFFFFF',
                                    strokeWeight: 3
                                },
                                zIndex: index + 10, // Higher z-index for activity markers
                                label: {
                                    text: `${index + 1}`,
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }
                            })

                            console.log(`🗺️ Created marker ${index + 1} for: ${activity.title}`)

                            // Add info window with activity details
                            const infoWindow = new window.google.maps.InfoWindow({
                                content: `
                                    <div class="p-3 text-sm">
                                        <div class="flex items-center gap-2 mb-2">
                                            <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background-color: ${getMarkerColor(activity.type)}">
                                                ${index + 1}
                                            </div>
                                            <div class="font-semibold text-gray-800">${activity.title}</div>
                                        </div>
                                        <div class="text-gray-600 mb-1">${activity.description}</div>
                                        <div class="text-blue-600 mb-1"><strong>Time:</strong> ${activity.time}</div>
                                        <div class="text-gray-500 mb-1"><strong>Location:</strong> ${activity.location}</div>
                                        ${activity.duration ? `<div class="text-gray-500 text-xs"><strong>Duration:</strong> ${activity.duration}</div>` : ''}
                                    </div>
                                `
                            })

                            marker.addListener('click', () => {
                                infoWindow.open(mapInstance, marker)
                            })

                            newMarkers.push(marker)
                            console.log(`Added marker ${index + 1} for:`, activity.title)
                        } else {
                            console.warn(`❌ Primary geocoding failed for activity ${index + 1}: ${activity.title} at ${fullAddress}. Status: ${status}`)

                            // Try fallback geocoding with just the destination
                            const fallbackAddress = destination
                            console.log(`🔄 Trying fallback geocoding with: ${fallbackAddress}`)

                            geocoder.geocode({ address: fallbackAddress }, (fallbackResults: any, fallbackStatus: any) => {
                                if (fallbackStatus === 'OK' && fallbackResults?.[0] && isMountedRef.current) {
                                    const location = fallbackResults[0].geometry.location
                                    bounds.extend(location)

                                    console.log(`✅ Fallback geocoding successful for activity ${index + 1}`)

                                    const marker = new window.google.maps.Marker({
                                        position: location,
                                        map: mapInstance,
                                        title: `${index + 1}. ${activity.title} (Approximate)`,
                                        icon: {
                                            path: window.google.maps.SymbolPath.CIRCLE,
                                            scale: 10,
                                            fillColor: '#FFA500', // Orange for approximate locations
                                            fillOpacity: 0.7,
                                            strokeColor: '#FFFFFF',
                                            strokeWeight: 2
                                        },
                                        zIndex: index + 5, // Lower z-index for approximate markers
                                        label: {
                                            text: `${index + 1}`,
                                            color: '#FFFFFF',
                                            fontSize: '10px',
                                            fontWeight: 'bold'
                                        }
                                    })

                                    // Add info window for approximate location
                                    const infoWindow = new window.google.maps.InfoWindow({
                                        content: `
                                            <div class="p-3 text-sm">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background-color: #FFA500">
                                                        ${index + 1}
                                                    </div>
                                                    <div class="font-semibold text-gray-800">${activity.title}</div>
                                                </div>
                                                <div class="text-orange-600 text-xs mb-2">⚠️ Approximate location</div>
                                                <div class="text-gray-600 mb-1">${activity.description}</div>
                                                <div class="text-blue-600 mb-1"><strong>Time:</strong> ${activity.time}</div>
                                                <div class="text-gray-500 mb-1"><strong>Location:</strong> ${activity.location}</div>
                                                ${activity.duration ? `<div class="text-gray-500 text-xs"><strong>Duration:</strong> ${activity.duration}</div>` : ''}
                                            </div>
                                        `
                                    })

                                    marker.addListener('click', () => {
                                        infoWindow.open(mapInstance, marker)
                                    })

                                    newMarkers.push(marker)
                                    console.log(`Added approximate marker ${index + 1} for:`, activity.title)
                                } else {
                                    console.warn(`❌ Both primary and fallback geocoding failed for activity ${index + 1}: ${activity.title}`)
                                }
                            })
                        }

                        // Check if we're done processing all activities and haven't set up yet
                        if (processed >= activitiesWithLocation.length && !setupCompleted) {
                            setupCompleted = true
                            console.log(`🎯 All ${processed} activities processed, setting up map with ${newMarkers.length} markers`)
                            finishMapSetup(mapInstance, newMarkers, bounds)
                        }

                        resolve()
                    })
                })
            }
        }

        const finishMapSetup = (mapInstance: any, newMarkers: any[], bounds: any) => {
            if (!isMountedRef.current) return

            markersRef.current = newMarkers

            // Fit map to show all markers
            if (newMarkers.length > 0) {
                if (newMarkers.length === 1) {
                    const firstMarker = newMarkers[0]
                    if (firstMarker && typeof firstMarker.getPosition === 'function') {
                        mapInstance.setCenter(firstMarker.getPosition())
                        mapInstance.setZoom(15)
                    }
                } else {
                    mapInstance.fitBounds(bounds)

                    // Add some padding around the bounds
                    setTimeout(() => {
                        if (isMountedRef.current) {
                            const currentZoom = mapInstance.getZoom()
                            if (currentZoom > 16) {
                                mapInstance.setZoom(16)
                            }
                        }
                    }, 100)
                }

                // Draw route lines with directional arrows between markers if more than one
                if (newMarkers.length > 1) {
                    console.log('Drawing route with directional arrows between', newMarkers.length, 'markers')

                    const directionsService = new window.google.maps.DirectionsService()
                    const directionsRenderer = new window.google.maps.DirectionsRenderer({
                        map: mapInstance,
                        suppressMarkers: true, // We already have custom markers
                        polylineOptions: {
                            strokeColor: '#3B82F6',
                            strokeOpacity: 0.8,
                            strokeWeight: 4
                        }
                    })

                    directionsRendererRef.current = directionsRenderer

                    // Create waypoints for all intermediate markers
                    const waypoints = newMarkers.slice(1, -1).map(marker => {
                        if (marker && typeof marker.getPosition === 'function') {
                            return {
                                location: marker.getPosition(),
                                stopover: true
                            }
                        }
                        return null
                    }).filter(waypoint => waypoint !== null)

                    const firstMarker = newMarkers[0]
                    const lastMarker = newMarkers[newMarkers.length - 1]

                    if (firstMarker && typeof firstMarker.getPosition === 'function' &&
                        lastMarker && typeof lastMarker.getPosition === 'function') {

                        directionsService.route({
                            origin: firstMarker.getPosition(),
                            destination: lastMarker.getPosition(),
                            waypoints: waypoints,
                            travelMode: window.google.maps.TravelMode.WALKING,
                            optimizeWaypoints: false // Keep the order as specified
                        }, (result: any, status: any) => {
                            if (status === 'OK' && isMountedRef.current) {
                                directionsRenderer.setDirections(result)
                                console.log('Route drawn successfully')

                                // Add directional arrows along the route
                                addDirectionalArrows(mapInstance, result)
                            } else {
                                console.warn('Failed to get directions:', status)
                                // Fallback: draw simple polyline with arrows
                                drawSimpleRoute(mapInstance, newMarkers)
                            }
                        })
                    } else {
                        console.warn('Invalid markers for route creation')
                        // Fallback: draw simple polyline with arrows if possible
                        drawSimpleRoute(mapInstance, newMarkers)
                    }
                } else {
                    console.log('Only one marker, no route needed')
                }

                console.log(`Map setup complete with ${newMarkers.length} markers`)
            }

            setIsLoading(false)
        }

        // Function to add directional arrows along the route
        const addDirectionalArrows = (mapInstance: any, directionsResult: any) => {
            const route = directionsResult.routes[0]
            const path = route.overview_path

            // Add arrows at regular intervals along the path
            const arrowSpacing = Math.floor(path.length / 8) // Show ~8 arrows along the route

            for (let i = 0; i < path.length - 1; i += arrowSpacing) {
                if (i + 1 < path.length) {
                    const start = path[i]
                    const end = path[i + 1]

                    // Calculate bearing for arrow direction
                    const bearing = window.google.maps.geometry.spherical.computeHeading(start, end)

                    // Create arrow marker
                    const arrow = new window.google.maps.Marker({
                        position: start,
                        map: mapInstance,
                        icon: {
                            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 3,
                            fillColor: '#3B82F6',
                            fillOpacity: 0.8,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 1,
                            rotation: bearing
                        },
                        zIndex: 1000 // Above other markers
                    })

                    // Store arrow for cleanup
                    markersRef.current.push(arrow)
                }
            }
        }

        // Fallback function to draw simple route with arrows
        const drawSimpleRoute = (mapInstance: any, markers: any[]) => {
            console.log('Drawing simple polyline route with arrows')

            try {
                // Create path from marker positions
                const path = markers.map(marker => {
                    if (marker && typeof marker.getPosition === 'function') {
                        return marker.getPosition()
                    } else {
                        console.warn('Invalid marker object:', marker)
                        return null
                    }
                }).filter(position => position !== null)

                if (path.length < 2) {
                    console.warn('Not enough valid positions to draw route')
                    return
                }

                // Draw polyline
                const polyline = new window.google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: '#3B82F6',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    map: mapInstance
                })

                // Add arrows between each pair of markers
                for (let i = 0; i < path.length - 1; i++) {
                    const start = path[i]
                    const end = path[i + 1]

                    if (start && end && typeof start.lat === 'function' && typeof end.lat === 'function') {
                        // Calculate midpoint
                        const midLat = (start.lat() + end.lat()) / 2
                        const midLng = (start.lng() + end.lng()) / 2
                        const midPoint = new window.google.maps.LatLng(midLat, midLng)

                        // Calculate bearing for arrow direction
                        const bearing = window.google.maps.geometry.spherical.computeHeading(start, end)

                        // Create arrow marker at midpoint
                        const arrow = new window.google.maps.Marker({
                            position: midPoint,
                            map: mapInstance,
                            icon: {
                                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                scale: 4,
                                fillColor: '#3B82F6',
                                fillOpacity: 0.9,
                                strokeColor: '#FFFFFF',
                                strokeWeight: 2,
                                rotation: bearing
                            },
                            zIndex: 1000 // Above other markers
                        })

                        // Store arrow for cleanup
                        markersRef.current.push(arrow)
                    }
                }

                // Store polyline for cleanup
                markersRef.current.push(polyline)
            } catch (error) {
                console.error('Error drawing simple route:', error)
            }
        }

        // Start map initialization
        initializeMap()
    }, [destination, dayNumber, activities.length, activities.map(a => `${a.title}-${a.location}-${a.time}`).join('|')]) // Include all relevant dependencies

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false
            cleanup()
        }
    }, [])

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            {/* Map header */}
            <div className="p-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-200">Activity Map</span>
                    <div className="ml-auto text-xs text-gray-400">
                        {activities.filter(a => a.location).length} locations
                    </div>
                </div>
            </div>

            {/* Google Map */}
            <div className="relative w-full h-96" style={{ minHeight: '384px' }}>
                <div
                    ref={mapContainerRef}
                    className="absolute inset-0 w-full h-full"
                />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-gray-400 text-sm">Loading map...</div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 bg-gray-800 p-4 overflow-y-auto">
                        <div className="text-center mb-4">
                            <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                            <div className="font-medium text-gray-200 mb-1">Interactive Map</div>
                            <div className="text-xs text-gray-500">{error}</div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="text-sm font-medium text-gray-200 mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-400" />
                                Day {dayNumber} Locations
                            </div>
                            <div className="space-y-2">
                                {activities.filter(a => a.location).map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 p-2 bg-gray-600 rounded">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-gray-200 font-medium truncate">{activity.title}</div>
                                            <div className="text-xs text-gray-400">{activity.location}</div>
                                            <div className="text-xs text-blue-400">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                                {activities.filter(a => a.location).length === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        <MapPin className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                        <div className="text-sm">No specific locations available for this day</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Activity legend */}
            <div className="p-3 border-t border-gray-700 space-y-2 max-h-32 overflow-y-auto">
                {activities.filter(a => a.location).slice(0, 4).map((activity, index) => {
                    const getColorClass = (type: string) => {
                        const colors = {
                            travel: 'bg-blue-500',
                            accommodation: 'bg-purple-500',
                            food: 'bg-orange-500',
                            activity: 'bg-green-500',
                            transport: 'bg-gray-500'
                        }
                        return colors[type as keyof typeof colors] || 'bg-red-500'
                    }

                    return (
                        <div key={index} className="flex items-center gap-3 text-xs">
                            <div className={`w-4 h-4 rounded-full ${getColorClass(activity.type)} flex items-center justify-center text-white font-bold text-xs`}>
                                {index + 1}
                            </div>
                            <span className="text-gray-300 flex-1 truncate">{activity.title}</span>
                            <span className="text-gray-500">{activity.time}</span>
                        </div>
                    )
                })}
                {activities.filter(a => a.location).length > 4 && (
                    <div className="text-xs text-gray-500 text-center">
                        +{activities.filter(a => a.location).length - 4} more activities
                    </div>
                )}
            </div>
        </div>
    )
}