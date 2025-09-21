import { Destination } from '@/lib/types/api'

export const mockDestinations: Destination[] = [
    {
        id: "bali-indonesia",
        name: "Bali",
        country: "Indonesia",
        region: "Southeast Asia",
        coordinates: {
            latitude: -8.3405,
            longitude: 115.0920
        },
        timezone: "Asia/Makassar",
        currency: "IDR",
        language: ["Indonesian", "Balinese"],
        description: "Bali is a province of Indonesia and the westernmost of the Lesser Sunda Islands. Known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
        climate: "Tropical",
        bestTimeToVisit: ["April", "May", "June", "September", "October"],
        popularAttractions: [
            "Tanah Lot Temple",
            "Ubud Monkey Forest",
            "Mount Batur",
            "Tegallalang Rice Terraces",
            "Seminyak Beach"
        ],
        averageBudget: {
            budget: 50,
            midRange: 100,
            luxury: 300
        },
        images: [
            "/bali-indonesia-rice-terraces-tropical.jpg",
            "/southeast-asia-temples-beaches.jpg"
        ],
        tags: ["beaches", "temples", "rice-terraces", "culture", "tropical"],
        rating: 4.8,
        reviewCount: 15420
    },
    {
        id: "santorini-greece",
        name: "Santorini",
        country: "Greece",
        region: "Mediterranean",
        coordinates: {
            latitude: 36.3932,
            longitude: 25.4615
        },
        timezone: "Europe/Athens",
        currency: "EUR",
        language: ["Greek", "English"],
        description: "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape.",
        climate: "Mediterranean",
        bestTimeToVisit: ["April", "May", "September", "October"],
        popularAttractions: [
            "Oia Village",
            "Red Beach",
            "Ancient Akrotiri",
            "Fira Town",
            "Santorini Caldera"
        ],
        averageBudget: {
            budget: 80,
            midRange: 150,
            luxury: 400
        },
        images: [
            "/santorini-greece-sunset-white-buildings.jpg",
            "/european-cities-collage.jpg"
        ],
        tags: ["islands", "sunsets", "whitewashed-buildings", "mediterranean", "romantic"],
        rating: 4.9,
        reviewCount: 12800
    },
    {
        id: "kyoto-japan",
        name: "Kyoto",
        country: "Japan",
        region: "East Asia",
        coordinates: {
            latitude: 35.0116,
            longitude: 135.7681
        },
        timezone: "Asia/Tokyo",
        currency: "JPY",
        language: ["Japanese"],
        description: "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
        climate: "Humid subtropical",
        bestTimeToVisit: ["March", "April", "May", "September", "October", "November"],
        popularAttractions: [
            "Fushimi Inari Shrine",
            "Kinkaku-ji Temple",
            "Arashiyama Bamboo Grove",
            "Gion District",
            "Philosopher's Path"
        ],
        averageBudget: {
            budget: 70,
            midRange: 120,
            luxury: 350
        },
        images: [
            "/kyoto-japan-temples-cherry-blossoms.jpg",
            "/japan-cherry-blossoms-temples.jpg"
        ],
        tags: ["temples", "cherry-blossoms", "traditional-culture", "gardens", "history"],
        rating: 4.7,
        reviewCount: 9650
    },
    {
        id: "iceland",
        name: "Iceland",
        country: "Iceland",
        region: "Nordic",
        coordinates: {
            latitude: 64.9631,
            longitude: -19.0208
        },
        timezone: "Atlantic/Reykjavik",
        currency: "ISK",
        language: ["Icelandic", "English"],
        description: "Iceland is a Nordic island country in the North Atlantic Ocean. It's known for its dramatic landscape with volcanoes, geysers, hot springs and lava fields.",
        climate: "Subarctic",
        bestTimeToVisit: ["June", "July", "August", "September"],
        popularAttractions: [
            "Blue Lagoon",
            "Golden Circle",
            "Northern Lights",
            "Jökulsárlón Glacier Lagoon",
            "Hallgrímskirkja Church"
        ],
        averageBudget: {
            budget: 100,
            midRange: 200,
            luxury: 500
        },
        images: [
            "/iceland-northern-lights-dramatic-landscapes.jpg",
            "/placeholder.jpg"
        ],
        tags: ["northern-lights", "glaciers", "geysers", "dramatic-landscapes", "adventure"],
        rating: 4.6,
        reviewCount: 7890
    }
]