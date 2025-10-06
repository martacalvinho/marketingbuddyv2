"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Onboarding from "@/components/onboarding"
import { supabase } from "@/lib/supabase"

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialData, setInitialData] = useState<any>(null)
  const [flow, setFlow] = useState<'post-analysis' | 'from-landing'>('from-landing')
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Ensure user is authenticated
    const ensureAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login?redirect=/onboarding')
        return
      }
      setCheckingAuth(false)
    }
    ensureAuth()

    // Check if this is coming from website analysis
    const analysisData = searchParams.get('analysis')
    const website = searchParams.get('website')
    const flowType = searchParams.get('flow')

    if (flowType === 'post-analysis' && analysisData) {
      setFlow('post-analysis')
      try {
        const parsedAnalysis = JSON.parse(decodeURIComponent(analysisData))
        setInitialData({
          website: website || '',
          productName: parsedAnalysis.productName || '',
          valueProp: parsedAnalysis.valueProp || '',
          websiteAnalysis: parsedAnalysis.websiteAnalysis || parsedAnalysis
        })
      } catch (error) {
        console.error('Failed to parse analysis data:', error)
        setFlow('from-landing')
      }
    } else {
      setFlow('from-landing')
    }
  }, [searchParams])

  const handleOnboardingComplete = async (userData: any) => {
    // Persist onboarding to Supabase (table: onboarding)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login?redirect=/onboarding')
      return
    }
    try {
      const toInt = (v: any) => {
        const n = parseInt(String(v ?? '').trim(), 10)
        return Number.isFinite(n) ? n : null
      }
      const { data: saveData, error: saveError } = await supabase.from('onboarding').upsert({
        user_id: user.id,
        data: userData, // Store full data in jsonb column
        product_name: userData.productName ?? null,
        website: userData.website ?? null,
        value_prop: userData.valueProp ?? null,
        north_star_goal: userData.northStarGoal ?? null,
        custom_goal: userData.customGoal ?? null,
        goal_type: userData.goalType ?? null,
        goal_amount: userData.goalAmount ?? null,
        goal_timeline: toInt(userData.goalTimeline),
        marketing_strategy: userData.marketingStrategy ?? null,
        current_users: toInt(userData.currentUsers),
        current_platforms: userData.currentPlatforms ?? null,
        experience_level: userData.experienceLevel ?? null,
        preferred_platforms: userData.preferredPlatforms ?? null,
        challenges: userData.challenges ?? null,
        focus_area: userData.focusArea ?? null,
        daily_task_count: toInt(userData.dailyTaskCount),
        website_analysis: userData.websiteAnalysis ?? null,
        plan: userData.plan ?? null,
        goals: userData.goals ?? null,
        milestones: userData.milestones ?? null,
        onboarding_completed: true,
      })
      
      if (saveError) {
        console.error('Supabase save error:', saveError)
        throw saveError
      }
    } catch (e) {
      // non-fatal; proceed to dashboard
      // eslint-disable-next-line no-console
      console.warn('Failed to save onboarding to Supabase:', e)
    }
    const redirect = searchParams.get('redirect') || '/dashboard'
    router.push(redirect)
  }

  const handleSkip = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      try {
        await supabase.from('onboarding').upsert({
          user_id: user.id,
          data: {}, // Required jsonb field
          onboarding_completed: false,
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to record skip in Supabase:', e)
      }
    }
    const redirect = searchParams.get('redirect') || '/dashboard'
    router.push(redirect)
  }

  if (checkingAuth) return null
  return (
    <Onboarding
      flow={flow}
      initialData={initialData}
      onComplete={handleOnboardingComplete}
      onSkip={handleSkip}
    />
  )
}
