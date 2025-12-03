"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import DashboardNew from "@/components/dashboard-new"
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
    console.log('[Dashboard] Starting refreshUser...')
    
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      console.log('[Dashboard] Auth check:', authUser?.id ? 'User found' : 'No user', authError?.message || '')
      
      if (!authUser) {
        console.log('[Dashboard] No auth user, redirecting to login')
        router.replace("/login")
        return
      }

      console.log('[Dashboard] Fetching onboarding data...')
      const { data: onboarding, error: onboardingError } = await supabase
        .from("onboarding")
        .select("*")
        .eq("user_id", authUser.id)
        .maybeSingle()

      console.log('[Dashboard] Onboarding result:', onboarding ? 'Found' : 'Not found', onboardingError?.message || '')

      if (onboardingError) {
        console.error('[Dashboard] Onboarding error:', onboardingError)
      }

      if (!onboarding || onboarding.onboarding_completed !== true) {
        console.log('[Dashboard] Onboarding incomplete, redirecting')
        router.replace("/onboarding?redirect=/dashboard")
        return
      }

      // Fetch streak data
      console.log('[Dashboard] Fetching streak data...')
      const { data: streakData, error: streakError } = await supabase
        .from('streaks')
        .select('current_streak, total_tasks_completed')
        .eq('user_id', authUser.id)
        .maybeSingle()
      
      if (streakError) {
        console.log('[Dashboard] Streak error (non-blocking):', streakError.message)
      }

      // Fetch subscription data (with error handling - table may not exist yet)
      console.log('[Dashboard] Fetching subscription data...')
      let subscription = null
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('status, plan, current_period_end')
        .eq('user_id', authUser.id)
        .maybeSingle()
      
      if (subError) {
        console.log('[Dashboard] Subscription error (non-blocking):', subError.message)
      } else {
        subscription = subData
      }

      console.log('[Dashboard] Building enriched user object...')

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
      targetAudience: onboarding.target_audience ?? onboarding.data?.targetAudience ?? null,
      plan: typeof onboarding.plan === 'string' ? onboarding.plan : (onboarding.plan?.markdown ?? null),
      goals: onboarding.goals ?? null,
      milestones: onboarding.milestones ?? [],
      createdAt: onboarding.created_at ?? null, // User signup date for calculating current day
      streak: streakData?.current_streak ?? 0,
      xp: onboarding.data?.xp ?? 0,
      subscription: subscription || null,
    }

    console.log('[Dashboard] User object built, setting state')
    setUser(enrichedUser)
    } catch (error) {
      console.error('[Dashboard] Error in refreshUser:', error)
    }
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
      <div className="min-h-screen bg-[#020604] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-400"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#020604]">
      <DashboardNew user={user as any} onUserRefresh={refreshUser} />
    </div>
  )
}
