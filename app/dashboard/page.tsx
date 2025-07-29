"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardView from "@/components/dashboard-view"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user exists in localStorage
    const userData = localStorage.getItem("user")
    
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // No user data - redirect to onboarding
      router.push("/onboarding")
      return
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to onboarding
  }

  return <DashboardView user={user} />
}
