"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import DashboardView from "@/components/dashboard-view"
import { supabase } from "@/lib/supabase"

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic'

type UserLike = {
  id: string
  email?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserLike | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Rebuild enriched user object from Supabase
  const refreshUser = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.replace("/login")
      return
    }
    const { data: onboarding, error } = await supabase
      .from("onboarding")
      .select("*")
      .eq("user_id", authUser.id)
      .maybeSingle()

    if (error || !onboarding || onboarding.onboarding_completed !== true) {
      router.replace("/onboarding?redirect=/dashboard")
      return
    }

    const enrichedUser: any = {
      id: authUser.id,
      email: authUser.email ?? undefined,
      productName: onboarding.product_name ?? "",
      website: onboarding.website ?? "",
      valueProp: onboarding.value_prop ?? "",
      northStarGoal: onboarding.north_star_goal ?? "",
      customGoal: onboarding.custom_goal ?? "",
      goalType: onboarding.goal_type ?? "",
      goalAmount: onboarding.goal_amount ?? "",
      goalTimeline: String(onboarding.goal_timeline ?? "6"),
      marketingStrategy: onboarding.marketing_strategy ?? "6-month",
      strategyMode: onboarding.strategy_mode ?? "foundation_content_community",
      currentUsers: onboarding.current_users != null ? String(onboarding.current_users) : "",
      currentMrr: onboarding.current_mrr != null ? String(onboarding.current_mrr) : "",
      launchDate: onboarding.launch_date ?? "",
      currentPlatforms: onboarding.current_platforms ?? [],
      experienceLevel: onboarding.experience_level ?? "",
      preferredPlatforms: onboarding.preferred_platforms ?? onboarding.data?.preferredPlatforms ?? [],
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
  }, [router])

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      await refreshUser()
      if (isMounted) setLoading(false)
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        router.replace("/login")
      } else {
        await refreshUser()
      }
    })

    return () => {
      isMounted = false
      sub.subscription.unsubscribe()
    }
  }, [router, refreshUser])

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
      <DashboardView user={user as any} onUserRefresh={refreshUser} />
    </div>
  )
}
