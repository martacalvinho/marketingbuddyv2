"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardView from "@/components/dashboard-view"
import { supabase } from "@/lib/supabase"

type UserLike = {
  id: string
  email?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserLike | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!isMounted) return
      if (!user) {
        router.replace("/login")
        return
      }
      // Check onboarding completion before allowing dashboard access
      const { data: onboarding, error } = await supabase
        .from("onboarding")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (error || !onboarding || onboarding.onboarding_completed !== true) {
        router.replace("/onboarding?redirect=/dashboard")
        return
      }

      // Enrich user object for DashboardView
      const enrichedUser: any = {
        id: user.id,
        email: user.email ?? undefined,
        productName: onboarding.product_name ?? "",
        website: onboarding.website ?? "",
        valueProp: onboarding.value_prop ?? "",
        northStarGoal: onboarding.north_star_goal ?? "",
        customGoal: onboarding.custom_goal ?? "",
        goalType: onboarding.goal_type ?? "",
        goalAmount: onboarding.goal_amount ?? "",
        goalTimeline: String(onboarding.goal_timeline ?? "6"),
        marketingStrategy: onboarding.marketing_strategy ?? "6-month",
        currentUsers: onboarding.current_users != null ? String(onboarding.current_users) : "",
        currentMrr: onboarding.current_mrr != null ? String(onboarding.current_mrr) : "",
        launchDate: onboarding.launch_date ?? "",
        currentPlatforms: onboarding.current_platforms ?? [],
        experienceLevel: onboarding.experience_level ?? "",
        preferredPlatforms: onboarding.preferred_platforms ?? [],
        challenges: onboarding.challenges ?? "",
        focusArea: onboarding.focus_area ?? "both",
        dailyTaskCount: String(onboarding.daily_task_count ?? "3"),
        websiteAnalysis: onboarding.website_analysis ?? onboarding.data?.websiteAnalysis ?? null,
        targetAudience: onboarding.data?.targetAudience ?? "",
        plan: typeof onboarding.plan === 'string' ? onboarding.plan : (onboarding.plan?.markdown ?? null),
        goals: onboarding.goals ?? null,
        milestones: onboarding.milestones ?? [],
      }

      setUser(enrichedUser)
      setLoading(false)
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        router.replace("/login")
      } else {
        const { data: onboarding, error } = await supabase
          .from("onboarding")
          .select("onboarding_completed")
          .eq("user_id", session.user.id)
          .maybeSingle()
        if (error || !onboarding || onboarding.onboarding_completed !== true) {
          router.replace("/onboarding?redirect=/dashboard")
        } else {
          setUser({ id: session.user.id, email: session.user.email ?? undefined })
        }
      }
    })

    return () => {
      isMounted = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen">
      <div className="p-4 flex justify-end">
        <button
          className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/login")
          }}
        >
          Sign out
        </button>
      </div>
      <DashboardView user={user as any} />
    </div>
  )
}
