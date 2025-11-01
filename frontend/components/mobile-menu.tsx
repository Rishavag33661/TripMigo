"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import * as React from "react"
const Menu = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const Home = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
  </svg>
)

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="3,6 5,6 21,6" strokeWidth={2} />
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" strokeWidth={2} />
    <line x1="10" y1="11" x2="10" y2="17" strokeWidth={2} />
    <line x1="14" y1="11" x2="14" y2="17" strokeWidth={2} />
  </svg>
)

const Plane = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const BookOpen = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

import Link from "next/link"
import { useTripData } from "./trip-data-manager"

interface MobileMenuProps {
  currentPage?: "home" | "planning" | "advanced" | "landing" | "itineraries"
}

export function MobileMenu({ currentPage = "home" }: MobileMenuProps) {
  const [mounted, setMounted] = React.useState(false)
  const { tripData, clearTripData, hasStartedPlanning, isBasicPlanningComplete, isPlanningComplete } = useTripData()
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const handleClearTrip = () => {
    if (confirm("Are you sure you want to clear all trip data? This will reset your planning form.")) {
      clearTripData()
      setOpen(false)
      router.push("/planning")
    }
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="md:hidden bg-transparent">
        <Menu className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </Button>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden bg-transparent"
          onClick={() => {
            console.log("Menu button clicked, current state:", open)
            setOpen(!open)
          }}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-lg z-[9999]">
        <DropdownMenuItem asChild>
          <Link href="/home" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Home className="h-4 w-4" />
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/planning" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <MapPin className="h-4 w-4" />
            Start Planning
            {isBasicPlanningComplete() && <Badge variant="secondary" className="ml-auto">In Progress</Badge>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/itineraries" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <BookOpen className="h-4 w-4" />
            Saved Itineraries
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/login" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <User className="h-4 w-4" />
            Login
          </Link>
        </DropdownMenuItem>
        {(currentPage === "planning" || currentPage === "advanced") && hasStartedPlanning() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                onClick={handleClearTrip}
                className="flex items-center gap-2 w-full text-left text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Clear Trip Data
              </button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
