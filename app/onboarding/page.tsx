"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Onboarding from "@/components/onboarding"
import { supabase } from "@/lib/supabase"

function OnboardingContent() {
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
      const toDecimal = (v: any) => {
        const n = parseFloat(String(v ?? '').trim())
        return Number.isFinite(n) ? n : null
      }
      // 1) Minimal, schema-safe upsert (avoid columns that may not exist yet)
      const minimalPayload: any = {
        user_id: user.id,
        data: userData,
        product_name: userData.productName ?? null,
        website: userData.website ?? null,
        value_prop: userData.valueProp ?? null,
        north_star_goal: userData.northStarGoal ?? null,
        goal_type: userData.goalType ?? null,
        goal_amount: userData.goalAmount ?? null,
        marketing_strategy: userData.marketingStrategy ?? null,
        current_users: toInt(userData.currentUsers),
        website_analysis: userData.websiteAnalysis ?? null,
        preferred_platforms: userData.preferredPlatforms ?? null,
        plan: userData.plan ? { markdown: userData.plan } : null,
        goals: userData.goals ?? null,
        milestones: userData.milestones ?? null,
        onboarding_completed: true,
      }
      const { error: minimalErr } = await supabase.from('onboarding').upsert(minimalPayload)
      if (minimalErr) {
        console.error('Supabase minimal upsert error:', minimalErr)
        throw minimalErr
      }

      // 2) Best-effort extended update (ignore if columns missing)
      try {
        const extended: any = {
          user_id: user.id,
          custom_goal: userData.customGoal ?? null,
          goal_timeline: toInt(userData.goalTimeline),
          current_mrr: toDecimal(userData.currentMrr),
          launch_date: userData.launchDate || null,
          current_platforms: userData.currentPlatforms ?? null,
          experience_level: userData.experienceLevel ?? null,
          preferred_platforms: userData.preferredPlatforms ?? null,
          challenges: userData.challenges ?? null,
          focus_area: userData.focusArea ?? null,
          daily_task_count: toInt(userData.dailyTaskCount),
        }
        await supabase.from('onboarding').upsert(extended)
      } catch (extendedErr) {
        // eslint-disable-next-line no-console
        console.warn('Supabase extended upsert skipped due to schema mismatch:', extendedErr)
      }
      // Seed Week 1 tasks into Supabase so the dashboard loads from DB
      try {
        // Skip if week 1 tasks already exist
        const { data: existingWeek1, error: checkErr } = await supabase
          .from('tasks')
          .select('id')
          .eq('user_id', user.id)
          .contains('metadata', { week: 1 })
          .limit(1)
        if (!checkErr && (!existingWeek1 || existingWeek1.length === 0)) {
          for (let day = 1; day <= 7; day++) {
            try {
              const resp = await fetch('/api/generate-enhanced-daily-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user: userData,
                  day,
                  month: 1,
                  weekInMonth: 1,
                  monthStrategy: userData.marketingStrategy || '',
                  focusArea: userData.focusArea || 'growth',
                  dailyTaskCount: userData.dailyTaskCount || '3',
                  websiteAnalysis: userData.websiteAnalysis,
                })
              })
              const json = await resp.json()
              let tasks = Array.isArray(json.tasks) ? json.tasks : []
              if (tasks.length > 0) {
                const rows = tasks.map((t: any) => ({
                  user_id: user.id,
                  title: t.title,
                  description: t.description || null,
                  category: t.category || null,
                  platform: t.platform || null,
                  status: 'pending',
                  metadata: { day, week: 1, month: 1, source: 'onboarding_seed' }
                }))
                await supabase.from('tasks').insert(rows)
              }
            } catch (seedErr) {
              // eslint-disable-next-line no-console
              console.warn('Failed seeding tasks for day', day, seedErr)
            }
          }
        }
      } catch (seedWeekErr) {
        // eslint-disable-next-line no-console
        console.warn('Failed to seed week 1 tasks:', seedWeekErr)
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

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}
