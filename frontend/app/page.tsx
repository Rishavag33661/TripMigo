import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Plane, Users } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <NavigationHeader currentPage="landing" />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-balance mb-6">
            Plan Your Perfect Trip
            <span className="text-primary block">End-to-End</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
            From destination selection to day-wise itineraries, we guide you through every step of planning your dream
            vacation.
          </p>
          <Link href="/home">
            <Button size="lg" className="text-lg px-8 py-6">
              Continue Planning Trip
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Destination Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Explore trending destinations with curated video content and local insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Group Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plan for any group size with personalized recommendations and budget tracking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Smart Itineraries</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get day-wise plans with optimal routes, timings, and local recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Plane className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Complete Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Book flights, hotels, and activities all in one place with price comparisons.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Planning?</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Join thousands of travelers who trust TripMigo for their perfect trips.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="secondary" size="lg">
                  Create Account
                </Button>
              </Link>
              <Link href="/home">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Start Without Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2025 TripMigo. Making travel planning effortless.</p>
        </div>
      </footer>
    </div>
  )
}
