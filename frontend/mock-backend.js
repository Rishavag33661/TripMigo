const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock destination data - realistic travel destinations
const destinationsData = [
    {
        id: "santorini-greece",
        name: "Santorini",
        country: "Greece",
        continent: "Europe",
        description: "Stunning sunsets and iconic white-washed buildings",
        rating: 4.8,
        reviewCount: 12547,
        videos: {
            promotional: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail: "/santorini-greece-sunset-white-buildings.jpg"
        },
        images: {
            slideshow: [
                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            hero: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=3840&h=2160&fit=crop&auto=format&q=95"
        },
        tags: ["Romantic", "Photography", "Wine", "Beaches", "Historic"]
    },
    {
        id: "kyoto-japan",
        name: "Kyoto",
        country: "Japan",
        continent: "Asia",
        description: "Ancient temples and stunning cherry blossoms",
        rating: 4.9,
        reviewCount: 18923,
        videos: {
            promotional: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail: "/kyoto-japan-temples-cherry-blossoms.jpg"
        },
        images: {
            slideshow: [
                "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            hero: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=3840&h=2160&fit=crop&auto=format&q=95"
        },
        tags: ["Cultural", "Historic", "Traditional", "Photography", "Spiritual"]
    },
    {
        id: "bali-indonesia",
        name: "Bali",
        country: "Indonesia",
        continent: "Asia",
        description: "Tropical paradise with stunning rice terraces",
        rating: 4.7,
        reviewCount: 15678,
        videos: {
            promotional: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail: "/bali-indonesia-rice-terraces-tropical.jpg"
        },
        images: {
            slideshow: [
                "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1518309435316-3078454f9039?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            hero: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=3840&h=2160&fit=crop&auto=format&q=95"
        },
        tags: ["Tropical", "Adventure", "Wellness", "Cultural", "Beaches"]
    },
    {
        id: "iceland",
        name: "Iceland",
        country: "Iceland",
        continent: "Europe",
        description: "Northern lights and dramatic volcanic landscapes",
        rating: 4.8,
        reviewCount: 9834,
        videos: {
            promotional: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail: "/iceland-northern-lights-dramatic-landscapes.jpg"
        },
        images: {
            slideshow: [
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1531168556467-80aace4d3144?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            hero: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&h=2160&fit=crop&auto=format&q=95"
        },
        tags: ["Adventure", "Nature", "Photography", "Unique", "Winter"]
    },
    {
        id: "machu-picchu-peru",
        name: "Machu Picchu",
        country: "Peru",
        continent: "South America",
        description: "Ancient Incan ruins high in the Andes Mountains",
        rating: 4.9,
        reviewCount: 11256,
        videos: {
            promotional: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail: "/machu-picchu-peru-ancient-ruins-mountains.jpg"
        },
        images: {
            slideshow: [
                "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=3840&h=2160&fit=crop&auto=format&q=95",
                "https://images.unsplash.com/photo-1564041977052-2362e7851b0b?w=3840&h=2160&fit=crop&auto=format&q=95"
            ],
            hero: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=3840&h=2160&fit=crop&auto=format&q=95"
        },
        tags: ["Historic", "Adventure", "Trekking", "Cultural", "Archaeological"]
    }
];

// Popular trips data
const popularTripsData = [
    {
        id: "european-grand-tour",
        title: "European Grand Tour",
        destinations: ["Paris", "Rome", "Barcelona", "Amsterdam"],
        duration: "14 days",
        rating: 4.9,
        reviews: 127,
        priceRange: "$2,500 - $3,500",
        image: "/european-cities-collage.jpg",
        tags: ["Cultural", "Historic", "Food & Wine"],
        description: "Experience the best of Europe with this comprehensive tour through four iconic cities."
    },
    {
        id: "southeast-asia-adventure",
        title: "Southeast Asia Adventure",
        destinations: ["Bangkok", "Siem Reap", "Bali", "Ho Chi Minh City"],
        duration: "21 days",
        rating: 4.8,
        reviews: 89,
        priceRange: "$1,800 - $2,800",
        image: "/southeast-asia-temples-beaches.jpg",
        tags: ["Adventure", "Cultural", "Beaches"],
        description: "Explore ancient temples, vibrant cities, and pristine beaches across Southeast Asia."
    },
    {
        id: "japan-cultural-immersion",
        title: "Japan Cultural Immersion",
        destinations: ["Tokyo", "Kyoto", "Osaka", "Mount Fuji"],
        duration: "12 days",
        rating: 4.9,
        reviews: 156,
        priceRange: "$3,200 - $4,500",
        image: "/japan-cherry-blossoms-temples.jpg",
        tags: ["Cultural", "Traditional", "Food"],
        description: "Immerse yourself in Japanese culture, from ancient traditions to modern innovation."
    }
];

// Recent user trips
const userTripsData = [
    {
        id: "sarah-tokyo-trip",
        user: {
            name: "Sarah Johnson",
            avatar: "/woman-profile.png",
            initials: "SJ",
            location: "San Francisco, CA"
        },
        destination: "Tokyo, Japan",
        duration: "7 days",
        groupSize: 2,
        highlights: ["Shibuya Crossing", "Mount Fuji day trip", "Traditional Ryokan stay"],
        date: "2 days ago",
        rating: 5,
        review: "Absolutely magical experience! The blend of traditional and modern culture was incredible."
    },
    {
        id: "mike-iceland-adventure",
        user: {
            name: "Mike Chen",
            avatar: "/man-profile.png",
            initials: "MC",
            location: "Vancouver, Canada"
        },
        destination: "Iceland",
        duration: "5 days",
        groupSize: 4,
        highlights: ["Northern Lights", "Blue Lagoon", "Golden Circle tour"],
        date: "1 week ago",
        rating: 5,
        review: "Breathtaking landscapes and the Northern Lights were absolutely stunning!"
    },
    {
        id: "emma-bali-retreat",
        user: {
            name: "Emma Rodriguez",
            avatar: "/woman-profile-photo-2.png",
            initials: "ER",
            location: "Austin, TX"
        },
        destination: "Bali, Indonesia",
        duration: "10 days",
        groupSize: 1,
        highlights: ["Yoga retreats", "Rice terrace tours", "Beach relaxation"],
        date: "3 weeks ago",
        rating: 4,
        review: "Perfect for a wellness retreat. The rice terraces were absolutely beautiful!"
    },
    {
        id: "alex-greece-honeymoon",
        user: {
            name: "Alex & Maria Torres",
            avatar: "/placeholder-user.jpg",
            initials: "AT",
            location: "Miami, FL"
        },
        destination: "Santorini, Greece",
        duration: "6 days",
        groupSize: 2,
        highlights: ["Sunset in Oia", "Wine tasting", "Volcanic boat tour"],
        date: "1 month ago",
        rating: 5,
        review: "Perfect honeymoon destination! The sunsets were unforgettable."
    }
];

// API Endpoints

// Get popular destinations
app.get('/destinations', (req, res) => {
    console.log('Destinations request received');
    console.log('Total destinations in data:', destinationsData.length);
    console.log('First destination:', destinationsData[0]?.name);
    console.log('Last destination:', destinationsData[destinationsData.length - 1]?.name);

    const { limit = 5 } = req.query;
    const popularDestinations = destinationsData
        .sort((a, b) => b.rating - a.rating)
        .slice(0, parseInt(limit));

    console.log('Returning', popularDestinations.length, 'destinations');
    console.log('Destination names:', popularDestinations.map(d => d.name));

    res.json({
        destinations: popularDestinations,
        total: destinationsData.length
    });
});

// Get popular trips
app.get('/popular-trips', (req, res) => {
    res.json({
        trips: popularTripsData
    });
});

// Get recent user trips
app.get('/recent-trips', (req, res) => {
    res.json({
        trips: userTripsData
    });
});

// Mock itinerary generation endpoint
app.post('/generate-itinerary', (req, res) => {
    const { duration_days, destination, source } = req.body;

    console.log('=== ITINERARY REQUEST RECEIVED ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Duration days:', duration_days);
    console.log('Destination:', destination);
    console.log('Source:', source);

    // Create mock itinerary for the exact number of days requested
    const mockItinerary = generateMockItinerary(duration_days || 3, destination || 'Paris');

    console.log('Generated mock itinerary (first 200 chars):', mockItinerary.substring(0, 200));

    setTimeout(() => {
        const response = {
            itinerary: mockItinerary,
            place_details: {
                place_id: 'mock_place_123',
                rating: 4.5,
                address: `${destination || 'Paris'}, Country`,
                review_summary: 'A beautiful destination with rich culture and history.'
            }
        };

        console.log('Sending response...');
        res.json(response);
    }, 2000); // 2 second delay to simulate API processing
});

// Mock Google Maps API key endpoint  
app.get('/maps-key', (req, res) => {
    res.json({
        // Using the actual Google Maps API key
        mapsApiKey: 'AIzaSyCBN1eADgkhJlUE4tSW-E8ucIeizOvCGYY'
    });
});

function generateMockItinerary(days, destination) {
    const activities = [
        'Visit the main historic center',
        'Explore local museums and galleries',
        'Try traditional cuisine at local restaurant',
        'Take a walking tour of the old town',
        'Visit famous landmarks and monuments',
        'Shop at local markets and boutiques',
        'Relax at a popular café or park',
        'Take photos at scenic viewpoints',
        'Experience local nightlife and entertainment',
        'Visit cultural sites and temples'
    ];

    // Return structured JSON instead of markdown
    const itineraryDays = [];

    for (let day = 1; day <= days; day++) {
        itineraryDays.push({
            day: day,
            date: `Day ${day}`,
            title: `Day ${day} - Exploring ${destination}`,
            items: [
                {
                    time: "9:00 AM",
                    title: activities[(day * 3 - 3) % activities.length],
                    description: `Morning activity: ${activities[(day * 3 - 3) % activities.length]} in ${destination}`,
                    type: "activity",
                    icon: "activity",
                    duration: "3 hours",
                    location: `${destination} City Center`
                },
                {
                    time: "2:00 PM",
                    title: activities[(day * 3 - 2) % activities.length],
                    description: `Afternoon activity: ${activities[(day * 3 - 2) % activities.length]} in ${destination}`,
                    type: "food",
                    icon: "food",
                    duration: "2 hours",
                    location: `Local Restaurant in ${destination}`
                },
                {
                    time: "7:00 PM",
                    title: activities[(day * 3 - 1) % activities.length],
                    description: `Evening activity: ${activities[(day * 3 - 1) % activities.length]} in ${destination}`,
                    type: "activity",
                    icon: "activity",
                    duration: "2-3 hours",
                    location: `${destination} Entertainment District`
                }
            ]
        });
    }

    return JSON.stringify(itineraryDays);
}

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Mock backend running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('- POST /generate-itinerary');
    console.log('- GET /maps-key');
    console.log('- GET /destinations');
    console.log('- GET /popular-trips');
    console.log('- GET /recent-trips');
});