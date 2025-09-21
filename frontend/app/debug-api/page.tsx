"use client"

import { useEffect, useState } from "react"

export default function DebugAPI() {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching from API...')
                const response = await fetch(`http://localhost:8000/destinations/?debug=${Date.now()}`)
                console.log('Response status:', response.status)
                const result = await response.json()
                console.log('API Response:', result)
                setData(result)
            } catch (err: any) {
                console.error('API Error:', err)
                setError(err.message)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">API Debug Test</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {data && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Destinations Count: {data.destinations?.length || 0}</h2>

                    {data.destinations?.map((dest, index) => (
                        <div key={dest.id} className="border p-4 rounded">
                            <h3 className="font-bold">{dest.name}</h3>
                            <p>Hero: {dest.images?.hero}</p>
                            <p>Slideshow: {dest.images?.slideshow?.length || 0} images</p>
                            {dest.images?.slideshow && (
                                <div className="mt-2">
                                    <p>First slideshow image:</p>
                                    <img
                                        src={dest.images.slideshow[0]}
                                        alt={dest.name}
                                        className="w-64 h-32 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {!data && !error && <p>Loading...</p>}
        </div>
    )
}