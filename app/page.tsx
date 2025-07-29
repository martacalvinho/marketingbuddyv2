"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const resetOnboarding = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("marketing-buddy-visited")
    router.push("/onboarding")
  }

  useEffect(() => {
    // Check if user exists in localStorage
    const userData = localStorage.getItem("user")
    const hasVisited = localStorage.getItem("marketing-buddy-visited")

    if (userData) {
      // User exists - redirect to dashboard
      router.push("/dashboard")
      return
    } else if (!hasVisited) {
      // First time visitor - redirect to landing page
      router.push("/landing")
      return
    } else {
      // Visited before but no user data - redirect to onboarding
      router.push("/onboarding")
      return
    }
  }, [router])

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      {process.env.NODE_ENV === "development" && (
        <Button onClick={resetOnboarding} className="fixed bottom-4 right-4 z-50 bg-transparent" variant="outline">
          Reset Onboarding
        </Button>
      )}
    </div>
  )
}
