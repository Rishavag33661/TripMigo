import { PageTransition } from '../components/page-transition'
import { ThemeProvider } from '../components/theme-provider'
import { TripDataProvider } from '../components/trip-data-manager'
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "TourPlanner - Plan Your Perfect Trip",
  description: "End-to-end tour planning application with AI-powered recommendations",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider defaultTheme="system" storageKey="tourplanner-theme">
            <TripDataProvider>
              <PageTransition>
                {children}
              </PageTransition>
            </TripDataProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
