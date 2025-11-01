"use client"

import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

export function VideoCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const destinations = [
        {
            id: "paris",
            name: "Paris",
            country: "France",
            description: "The City of Light, famous for its art, fashion, and romance",
            rating: 4.8,
            tags: ["Romantic", "Art", "Culture"]
        },
        {
            id: "tokyo",
            name: "Tokyo",
            country: "Japan",
            description: "A fascinating blend of tradition and modernity",
            rating: 4.7,
            tags: ["Culture", "Technology", "Food"]
        },
        {
            id: "santorini",
            name: "Santorini",
            country: "Greece",
            description: "Stunning sunsets and white-washed buildings",
            rating: 4.9,
            tags: ["Romantic", "Beach", "Sunset"]
        }
    ]

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % destinations.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length)
    }

    const currentDestination = destinations[currentIndex]

    return (
        <div className="relative w-full">
            <Card className="relative overflow-hidden mb-6">
                <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                        <div className={`w-full h-full bg-gradient-to-br ${currentIndex === 0 ? 'from-blue-400 to-blue-600' :
                                currentIndex === 1 ? 'from-green-400 to-green-600' :
                                    'from-purple-400 to-purple-600'
                            }`}></div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm opacity-90">{currentDestination.country}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{currentDestination.name}</h3>
                            <p className="text-sm opacity-90 mb-3 max-w-2xl">{currentDestination.description}</p>

                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{currentDestination.rating}</span>
                                    <span className="text-xs opacity-75">⭐ Highly Rated</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {currentDestination.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                            onClick={prevSlide}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                            onClick={nextSlide}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
                {destinations.map((destination, index) => (
                    <button
                        key={destination.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-500 ${index === currentIndex
                                ? "ring-2 ring-primary ring-offset-2 scale-105 opacity-100 shadow-lg"
                                : "opacity-70 hover:opacity-100"
                            }`}
                    >
                        <div className={`w-full h-full bg-gradient-to-br ${index === 0 ? 'from-blue-400 to-blue-600' :
                                index === 1 ? 'from-green-400 to-green-600' :
                                    'from-purple-400 to-purple-600'
                            }`}></div>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                            <div className="text-white text-xs font-medium truncate">
                                {destination.name}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}