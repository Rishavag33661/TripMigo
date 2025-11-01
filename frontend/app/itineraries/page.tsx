"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ItinerariesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Saved Itineraries</h1>
        <p className="text-muted-foreground mb-4">
          Your saved trip plans will appear here.
        </p>
        <button 
          onClick={() => router.push('/planning')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Plan a New Trip
        </button>
      </div>
    </div>
  )
}
