"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OnboardingFlow from "@/components/onboarding-flow"
import DashboardView from "@/components/dashboard-view"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLanding, setShowLanding] = useState(false)
  const router = useRouter()

  const resetOnboarding = () => {
    localStorage.removeItem("marketing-buddy-user")
    localStorage.removeItem("marketing-buddy-visited")
    setUser(null)
  }

  useEffect(() => {
    // Check if user exists in localStorage
    const userData = localStorage.getItem("marketing-buddy-user")
    const hasVisited = localStorage.getItem("marketing-buddy-visited")

    if (userData) {
      setUser(JSON.parse(userData))
    } else if (!hasVisited) {
      // First time visitor - redirect to landing page
      router.push("/landing")
      return
    }

    setLoading(false)
  }, [router])

  if (loading) {
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

  if (!user) {
    return <OnboardingFlow onComplete={setUser} />
  }

  return <DashboardView user={user} />
}
