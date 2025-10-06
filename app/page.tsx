"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: onboarding, error } = await supabase
          .from("onboarding")
          .select("onboarding_completed")
          .eq("user_id", user.id)
          .maybeSingle()

        if (error || !onboarding || onboarding.onboarding_completed !== true) {
          router.push("/onboarding")
        } else {
          router.push("/dashboard")
        }
      } else {
        router.push("/landing")
      }
    }
    
    checkAuth()
  }, [router])

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  )
}
