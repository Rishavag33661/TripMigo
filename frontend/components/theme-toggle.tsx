"use client"
import * as React from "react"
const Moon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
    />
  </svg>
)

const Sun = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" strokeWidth={2} />
    <line x1="12" y1="1" x2="12" y2="3" strokeWidth={2} />
    <line x1="12" y1="21" x2="12" y2="23" strokeWidth={2} />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth={2} />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth={2} />
    <line x1="1" y1="12" x2="3" y2="12" strokeWidth={2} />
    <line x1="21" y1="12" x2="23" y2="12" strokeWidth={2} />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth={2} />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth={2} />
  </svg>
)

import { useTheme } from "@/components/theme-provider"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const { setTheme, theme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.theme-toggle-container')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <div className="relative theme-toggle-container">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => {
          console.log("Theme button clicked, current theme:", theme)
          setIsOpen(!isOpen)
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999] p-1">
          <button 
            onClick={() => {
              setTheme("light")
              setIsOpen(false)
            }}
            className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
          >
            Light
            {theme === "light" && <span>✓</span>}
          </button>
          <button 
            onClick={() => {
              setTheme("dark")
              setIsOpen(false)
            }}
            className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
          >
            Dark
            {theme === "dark" && <span>✓</span>}
          </button>
          <button 
            onClick={() => {
              setTheme("system")
              setIsOpen(false)
            }}
            className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
          >
            System
            {theme === "system" && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  )
}
