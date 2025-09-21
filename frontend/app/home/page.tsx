import { VideoCarousel } from "@/components/video-carousel"
import { PopularTrips } from "@/components/popular-trips"
import { RecentTrips } from "@/components/recent-trips"
import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentPage="home" />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-balance mb-4">
            Discover Your Next
            <span className="text-primary block">Adventure</span>
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
            Explore trending destinations and get inspired by popular travel experiences from around the world.
          </p>
        </div>

        {/* Video Carousel Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
          <VideoCarousel />
        </section>

        {/* Call to Action */}
        <section className="text-center mb-12">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Trip?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Start your journey with our step-by-step planning tool and create the perfect itinerary.
            </p>
            <Link href="/planning">
              <Button size="lg" className="text-lg px-8 py-6">
                Let's Start Planning
              </Button>
            </Link>
          </div>
        </section>

        {/* Recent Trips and Popular Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Recent Trips by Other Users</h2>
            <RecentTrips />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Popular Trip Recommendations</h2>
            <PopularTrips />
          </section>
        </div>
      </main>
    </div>
  )
}
