"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
const Plane = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 16v-2a4 4 0 00-4-4V8a3 3 0 00-6 0v2a4 4 0 00-4 4v2"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18h12" />
  </svg>
)
import Link from "next/link"

interface AuthFormProps {
  type: "login" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement authentication logic
    console.log("Auth form submitted:", { type, email, password, name })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">TourPlanner</span>
          </div>
          <CardTitle className="text-2xl">{type === "login" ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {type === "login" ? "Sign in to continue planning your trips" : "Join us to start planning amazing trips"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {type === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {type === "login" ? "Don't have an account? " : "Already have an account? "}
              <Link href={type === "login" ? "/signup" : "/login"} className="text-primary hover:underline">
                {type === "login" ? "Sign up" : "Sign in"}
              </Link>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Or{" "}
              <Link href="/home" className="text-primary hover:underline">
                continue without an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
