import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">TripMigo</h1>
            <nav className="flex items-center space-x-4">
              <Link href="/home" className="text-sm font-medium">Home</Link>
              <Link href="/planning" className="text-sm font-medium">Planning</Link>
              <Link href="/itineraries" className="text-sm font-medium">Itineraries</Link>
            </nav>
          </div>
        </div>
      </header>

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

        {/* Popular Destinations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg overflow-hidden border">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Paris, France</h3>
                <p className="text-sm text-muted-foreground">The City of Light awaits</p>
              </div>
            </div>
            <div className="bg-card rounded-lg overflow-hidden border">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Tokyo, Japan</h3>
                <p className="text-sm text-muted-foreground">Modern meets traditional</p>
              </div>
            </div>
            <div className="bg-card rounded-lg overflow-hidden border">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Santorini, Greece</h3>
                <p className="text-sm text-muted-foreground">Stunning island paradise</p>
              </div>
            </div>
          </div>
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

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Recent Trips by Other Users</h2>
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">SJ</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Sarah's Tokyo Adventure</h3>
                    <p className="text-sm text-muted-foreground">Amazing cultural experience in Japan!</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">MK</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Mike's European Tour</h3>
                    <p className="text-sm text-muted-foreground">3 weeks across 5 countries</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Popular Trip Recommendations</h2>
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Romantic Getaway to Santorini</h3>
                <p className="text-sm text-muted-foreground mb-2">Perfect for couples seeking romance</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Romantic</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Beach</span>
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Adventure in Patagonia</h3>
                <p className="text-sm text-muted-foreground mb-2">Hiking and outdoor adventures</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Adventure</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Nature</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
