"use client"

import { useEffect, useState } from 'react'

export default function DebugDestinations() {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/destinations/')
                const result = await response.json()
                console.log('API Response:', result)
                setData(result)
            } catch (err) {
                console.error('API Error:', err)
                setError(String(err))
            }
        }

        fetchData()
    }, [])

    if (error) return <div className="p-4">Error: {error}</div>
    if (!data) return <div className="p-4">Loading...</div>

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Debug Destinations API</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold">Raw API Response:</h2>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-semibold">Destinations Count: {data.destinations?.length || 0}</h2>
            </div>

            {data.destinations?.map((dest: any, index: number) => (
                <div key={dest.id} className="border p-4 mb-4 rounded">
                    <h3 className="font-bold">{index + 1}. {dest.name}</h3>
                    <p>ID: {dest.id}</p>
                    <p>Has Images: {dest.images ? 'Yes' : 'No'}</p>
                    {dest.images && (
                        <div>
                            <p>Slideshow Images: {dest.images.slideshow?.length || 0}</p>
                            <p>Hero Image: {dest.images.hero ? 'Yes' : 'No'}</p>
                            {dest.images.slideshow && (
                                <div className="mt-2">
                                    <p>Slideshow URLs:</p>
                                    <ul className="list-disc list-inside text-sm">
                                        {dest.images.slideshow.map((url: string, i: number) => (
                                            <li key={i}>{url}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}