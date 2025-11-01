"use client"

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useEffect, useState } from "react"

export default function TestAPIPage() {
    const [destinations, setDestinations] = useState([])
    const [popularTrips, setPopularTrips] = useState([])
    const [recentTrips, setRecentTrips] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [destRes, popRes, recRes] = await Promise.all([
                    fetch('http://localhost:8000/destinations/'),
                    fetch('http://localhost:8000/popular-trips'),
                    fetch('http://localhost:8000/recent-trips')
                ])

                const destData = await destRes.json()
                const popData = await popRes.json()
                const recData = await recRes.json()

                setDestinations(destData.destinations)
                setPopularTrips(popData.trips)
                setRecentTrips(recData.trips)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="p-8">Loading API data...</div>
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-bold">API Data Test</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Destinations ({destinations.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(destinations, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Popular Trips ({popularTrips.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(popularTrips, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Trips ({recentTrips.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(recentTrips, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}