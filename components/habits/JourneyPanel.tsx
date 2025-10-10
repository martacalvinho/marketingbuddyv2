import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { Milestone } from "@/hooks/use-milestones"
import { ChevronLeft, ChevronRight, Target, MapPin, Star, GripVertical } from "lucide-react"

import AddMilestoneModal from "./AddMilestoneModal"
// ProgressRing removed in favor of journey map
import ShareJourneyDialog from "./ShareJourneyDialog"
import type { MilestoneDraft } from "./types"

interface JourneyPanelProps {
  streak: number
  xp: number
  currentDay: number
  user?: any
  weekStats: { total: number; done: number; goals: string[] }[]
  milestones: Milestone[]
  applyMilestonesChange: (updater: (prev: Milestone[]) => Milestone[]) => void
  onRefreshMilestones?: () => Promise<void>
  completedTasks: number
  totalTasks: number
}

const defaultMilestoneDraft: MilestoneDraft = {
  title: "",
  emoji: "🏅",
  description: "",
  date: "",
  current: "",
  target: "",
  unit: "",
}

const JourneyPanel = ({
  streak,
  xp,
  currentDay,
  user,
  weekStats,
  milestones,
  applyMilestonesChange,
  onRefreshMilestones,
  completedTasks,
  totalTasks,
}: JourneyPanelProps) => {
  const [isJourneyCollapsed, setIsJourneyCollapsed] = useState(false)
  const [showEditGoal, setShowEditGoal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareTemplate, setShareTemplate] = useState<"journey" | "milestone" | "weekly">("journey")
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [newMilestone, setNewMilestone] = useState<MilestoneDraft>(defaultMilestoneDraft)
  const [celebratingId, setCelebratingId] = useState<string | null>(null)
  const [draggedMilestone, setDraggedMilestone] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [editUsersOpen, setEditUsersOpen] = useState(false)
  const [editMrrOpen, setEditMrrOpen] = useState(false)
  const [usersDraftCurrent, setUsersDraftCurrent] = useState<string>("")
  const [usersDraftTarget, setUsersDraftTarget] = useState<string>("")
  const [mrrDraftCurrent, setMrrDraftCurrent] = useState<string>("")
  const [mrrDraftTarget, setMrrDraftTarget] = useState<string>("")

  // Small helper to avoid indefinite hangs
  function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), ms)
      promise
        .then((v) => { clearTimeout(timer); resolve(v) })
        .catch((e) => { clearTimeout(timer); reject(e) })
    })
  }

  const [currentUsers, setCurrentUsers] = useState(() => {
    const value = parseInt(user?.currentUsers || "0", 10)
    return Number.isFinite(value) ? value : 0
  })
  const [currentRevenue, setCurrentRevenue] = useState(() => {
    const value = parseFloat(user?.currentMrr || "0")
    return Number.isFinite(value) ? value : 0
  })
  const getUserGoal = useCallback(() => {
    // Prefer an explicit pending milestone target if one exists; else suggest 100/500/1000
    const current = Number.isFinite(currentUsers) ? currentUsers : parseInt(user?.currentUsers || "0", 10) || 0
    const pending = (milestones || []).find(m => m.type === 'user_added' && (m as any).goal_type === 'users' && !m.unlocked && !((m as any).completed === true))
    if (pending) {
      const t = (pending as any).progressTarget ?? (pending as any).progress_target
      if (t != null) return Number(t)
    }
    if (current < 50) return 50
    if (current < 100) return 100
    if (current < 500) return 500
    if (current < 1000) return 1000
    return Math.max(10, current * 2)
  }, [currentUsers, milestones, user?.currentUsers])

  const getRevenueGoal = useCallback(() => {
    const current = Number.isFinite(currentRevenue) ? currentRevenue : parseFloat(user?.currentMrr || "0") || 0
    const pending = (milestones || []).find(m => m.type === 'user_added' && ((m as any).goal_type === 'revenue' || (m as any).goal_type === 'mrr') && !m.unlocked && !((m as any).completed === true))
    if (pending) {
      const t = (pending as any).progressTarget ?? (pending as any).progress_target
      if (t != null) return Number(t)
    }
    if (current < 100) return 100
    if (current < 500) return 500
    if (current < 1000) return 1000
    return Math.max(10, Math.round(current * 2))
  }, [currentRevenue, milestones, user?.currentMrr])

  const [userGoal, setUserGoal] = useState(getUserGoal)
  const [revenueGoal, setRevenueGoal] = useState(getRevenueGoal)

  useEffect(() => {
    setUserGoal(getUserGoal())
    setRevenueGoal(getRevenueGoal())
    const users = parseInt(user?.currentUsers || "0", 10)
    setCurrentUsers(Number.isFinite(users) ? users : 0)
    const revenue = parseFloat(user?.currentMrr || "0")
    setCurrentRevenue(Number.isFinite(revenue) ? revenue : 0)
  }, [getRevenueGoal, getUserGoal, user?.currentUsers, user?.currentMrr])

  const shareCardRef = useRef<HTMLDivElement>(null)

  const weekDone = useMemo(
    () => (weekStats || []).reduce((acc, item) => acc + (item?.done || 0), 0),
    [weekStats],
  )
  const weekTotal = useMemo(
    () => (weekStats || []).reduce((acc, item) => acc + (item?.total || 0), 0),
    [weekStats],
  )
  const winsGoals = useMemo(() => {
    const goals = (weekStats || []).flatMap((item) => item?.goals || [])
    return Array.from(new Set(goals)).slice(0, 4)
  }, [weekStats])

  const currentWeek = Math.ceil(currentDay / 7)
  const currentWeekGoals = weekStats[currentWeek - 1]?.goals || []
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Journey map helpers
  const journeySteps = useMemo(() => [0, 10, 100, 500, 1000], [])
  const percentForUsers = useCallback((u: number) => {
    if (!Number.isFinite(u) || u <= 0) return 0
    if (u <= 10) return (u / 10) * 25
    if (u <= 100) return 25 + ((u - 10) / 90) * 25
    if (u <= 500) return 50 + ((u - 100) / 400) * 25
    if (u <= 1000) return 75 + ((u - 500) / 500) * 25
    return 100
  }, [])
  const nodePercent = useCallback((step: number) => {
    const idx = journeySteps.indexOf(step)
    return idx <= 0 ? 0 : (idx / (journeySteps.length - 1)) * 100
  }, [journeySteps])

  const markerPercent = useMemo(() => percentForUsers(currentUsers), [currentUsers, percentForUsers])

  const suggestNextTargets = useCallback((current: number) => {
    if (current < 100) return 100
    if (current < 500) return 500
    if (current < 1000) return 1000
    return 0 // use custom
  }, [])

  const ensurePendingMilestone = useCallback(async (kind: 'users' | 'revenue', currentVal: number, targetVal: number) => {
    try {
      // If already achieved at creation time, mark unlocked immediately
      const unlocked = currentVal >= targetVal
      const title = kind === 'users' ? `Reach ${targetVal} users` : `Reach $${targetVal} MRR`
      const unit = kind === 'users' ? 'users' : 'mrr'

      // Try to find an existing pending of this kind
      const existing = (milestones || []).find(m => m.type === 'user_added' && ((m as any).goal_type === kind || (kind === 'revenue' && (m as any).goal_type === 'mrr')) && !m.unlocked && !((m as any).completed === true))

      if (existing?.id && !unlocked) {
        await supabase.from('milestones').update({
          title,
          goal_type: kind,
          progress_current: currentVal,
          progress_target: targetVal,
          unit,
          unlocked: false,
          date: null,
        }).eq('id', existing.id)
      } else {
        const payload: any = {
          user_id: user?.id,
          title,
          description: null,
          emoji: kind === 'users' ? '👥' : '💰',
          type: 'user_added',
          goal_type: kind,
          progress_current: currentVal,
          progress_target: targetVal,
          unit,
          unlocked,
          date: unlocked ? new Date().toISOString().slice(0,10) : null,
          sort_order: 0,
        }
        await supabase.from('milestones').insert([payload])
      }

      if (onRefreshMilestones) await onRefreshMilestones()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('ensurePendingMilestone error', e)
    }
  }, [milestones, onRefreshMilestones, supabase, user?.id])

  const saveUsersEdit = useCallback(async () => {
    const curr = parseInt(usersDraftCurrent || '0', 10) || 0
    const tgt = parseInt(usersDraftTarget || String(suggestNextTargets(curr) || 0), 10) || 0
    try {
      if (user?.id) {
        await supabase.from('onboarding').update({ current_users: curr }).eq('user_id', user.id)
      }
      setCurrentUsers(curr)
      setUserGoal(tgt > 0 ? tgt : getUserGoal())
      if (tgt > 0) await ensurePendingMilestone('users', curr, tgt)
    } finally {
      setEditUsersOpen(false)
      setUsersDraftCurrent('')
      setUsersDraftTarget('')
    }
  }, [ensurePendingMilestone, getUserGoal, setUserGoal, supabase, user?.id, usersDraftCurrent, usersDraftTarget])

  const saveMrrEdit = useCallback(async () => {
    const curr = Math.max(0, Math.round(parseFloat(mrrDraftCurrent || '0'))) || 0
    const tgt = Math.max(0, Math.round(parseFloat(mrrDraftTarget || String(suggestNextTargets(curr) || 0)))) || 0
    try {
      if (user?.id) {
        await supabase.from('onboarding').update({ current_mrr: curr }).eq('user_id', user.id)
      }
      setCurrentRevenue(curr)
      setRevenueGoal(tgt > 0 ? tgt : getRevenueGoal())
      if (tgt > 0) await ensurePendingMilestone('revenue', curr, tgt)
    } finally {
      setEditMrrOpen(false)
      setMrrDraftCurrent('')
      setMrrDraftTarget('')
    }
  }, [ensurePendingMilestone, getRevenueGoal, setRevenueGoal, supabase, user?.id, mrrDraftCurrent, mrrDraftTarget])

  const achievementPresets = useMemo(
    () => [
      {
        id: "users-10",
        title: "First 10 Users",
        unlocked: currentUsers >= 10,
        progress: `${Math.min(currentUsers, 10)}/10`,
        icon: "👥",
        blurb: "Every journey starts somewhere",
      },
      {
        id: "streak-7",
        title: "7-Day Streak",
        unlocked: streak >= 7,
        progress: `${Math.min(streak, 7)}/7 days`,
        icon: "🔥",
        blurb: "Consistency is key",
      },
      {
        id: "mrr-1",
        title: "First Dollar",
        unlocked: currentRevenue >= 1,
        progress: `$${Math.min(currentRevenue, 1).toLocaleString()}/$1 MRR`,
        icon: "💰",
        blurb: "The first dollar is the hardest",
      },
      {
        id: "users-100",
        title: "100 Users",
        unlocked: currentUsers >= 100,
        progress: `${Math.min(currentUsers, 100)}/100`,
        icon: "🚩",
        blurb: "Real traction begins",
      },
      {
        id: "streak-30",
        title: "30-Day Streak",
        unlocked: streak >= 30,
        progress: `${Math.min(streak, 30)}/30 days`,
        icon: "⚡️",
        blurb: "Unstoppable momentum",
      },
      {
        id: "mrr-100",
        title: "$100 MRR",
        unlocked: currentRevenue >= 100,
        progress: `$${Math.min(currentRevenue, 100).toLocaleString()}/$100 MRR`,
        icon: "💎",
        blurb: "Proof people pay",
      },
      {
        id: "completion-75",
        title: "75% Completion",
        unlocked: completionRate >= 75,
        progress: `${completionRate.toFixed(0)}%`,
        icon: "🎯",
        blurb: "You are executing consistently",
      },
    ],
    [completionRate, currentRevenue, currentUsers, streak],
  )

  // Show only milestones for the user's current stage
  const stage = useMemo(() => {
    if ((currentUsers ?? 0) < 10 && (currentRevenue ?? 0) < 1) return 0
    if ((currentUsers ?? 0) < 100 && (currentRevenue ?? 0) < 100) return 1
    if ((currentUsers ?? 0) < 500) return 2
    return 3
  }, [currentRevenue, currentUsers])

  const visibleAchievementPresets = useMemo(() => {
    const byId = (ids: string[]) => achievementPresets.filter((p) => ids.includes(p.id))
    switch (stage) {
      case 0:
        return byId(["users-10", "streak-7", "mrr-1"]) // First 10 users, 7-day streak, First Dollar
      case 1:
        return byId(["users-100", "streak-30", "mrr-100"]) // 100 users, 30-day streak, $100 MRR
      case 2:
        return byId(["users-100", "streak-30"]) // keep meaningful next steps
      default:
        return achievementPresets
    }
  }, [achievementPresets, stage])

  const prevAchievementsRef = useRef<Record<string, boolean>>({})
  useEffect(() => {
    const currentState = achievementPresets.reduce<Record<string, boolean>>((acc, preset) => {
      acc[preset.id] = !!preset.unlocked
      return acc
    }, {})

    const previous = prevAchievementsRef.current
    const newlyUnlocked = Object.keys(currentState).find(
      (id) => currentState[id] && previous[id] === false,
    )

    if (newlyUnlocked) {
      setCelebratingId(newlyUnlocked)
      void launchConfetti()
      setTimeout(() => setCelebratingId(null), 1200)
    }

    prevAchievementsRef.current = { ...previous, ...currentState }
  }, [achievementPresets])

  const handleDownloadShareCard = useCallback(async () => {
    if (!shareCardRef.current) return
    try {
      const win = window as typeof window & { htmlToImage?: any }
      if (!win.htmlToImage) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js"
          script.async = true
          script.onload = () => resolve()
          script.onerror = () => reject(new Error("Failed to load html-to-image"))
          document.body.appendChild(script)
        })
      }

      const dataUrl = await win.htmlToImage.toPng(shareCardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      })
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `marketing-share-${shareTemplate}.png`
      link.click()
    } catch {
      const shareText = `🚀 My Marketing Journey - Day ${currentDay}\n\n👥 Users: ${currentUsers.toLocaleString()} / ${userGoal.toLocaleString()}\n💰 Revenue: $${currentRevenue.toLocaleString()} / $${revenueGoal.toLocaleString()} MRR\n🔥 ${streak} day streak\n\nBuilding: ${user?.productName || "My Product"} - ${window.location.origin}/landing`
      if (navigator.share) {
        try {
          await navigator.share({ text: shareText })
        } catch {
          // user dismissed share dialog
        }
      } else {
        await navigator.clipboard.writeText(shareText)
        alert("Share card copied to clipboard")
      }
    }
  }, [
    currentDay,
    currentRevenue,
    currentUsers,
    revenueGoal,
    shareTemplate,
    streak,
    user?.productName,
    userGoal,
  ])

  useEffect(() => {
    const persistIfNeeded = async () => {
      if (!user?.id) return

      try {
        const toInsert: any[] = []
        if (currentUsers >= userGoal) {
          const title = `Reached ${userGoal.toLocaleString()} users`
          const exists = milestones.some(
            (milestone) =>
              milestone.type === "goal_achieved" &&
              (milestone.goalType === "users" || milestone.goal_type === "users") &&
              milestone.title === title,
          )
          if (!exists) {
            toInsert.push({ title, type: "goal_achieved", goal_type: "users" })
          }
        }
        if (currentRevenue >= revenueGoal) {
          const title = `Reached $${revenueGoal.toLocaleString()} MRR`
          const exists = milestones.some(
            (milestone) =>
              milestone.type === "goal_achieved" &&
              (milestone.goalType === "revenue" || milestone.goal_type === "revenue") &&
              milestone.title === title,
          )
          if (!exists) {
            toInsert.push({ title, type: "goal_achieved", goal_type: "revenue" })
          }
        }

        if (toInsert.length > 0) {
          const rows = toInsert.map((row) => ({
            user_id: user.id,
            title: row.title,
            type: row.type,
            goal_type: row.goal_type,
            unlocked: true,
            date: new Date().toISOString().slice(0, 10),
          }))
          const { data } = await supabase.from("milestones").insert(rows).select("*")
          if (data) {
            applyMilestonesChange((prev) => [...(data as unknown as Milestone[]), ...prev])
            if (onRefreshMilestones) {
              await onRefreshMilestones()
            }
          }
        }
      } catch {
        // ignore persistence errors
      }
    }

    void persistIfNeeded()
  }, [
    applyMilestonesChange,
    currentRevenue,
    currentUsers,
    milestones,
    onRefreshMilestones,
    revenueGoal,
    user?.id,
    userGoal,
  ])

  // Auto-complete user-defined pending milestones when current value reaches target
  useEffect(() => {
    const maybeComplete = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10)
        const toComplete = (milestones || []).filter((m: any) => {
          if (m.type !== 'user_added') return false
          if (m.unlocked === true || m.completed === true) return false
          const target = Number(m.progressTarget ?? m.progress_target)
          if (!Number.isFinite(target) || target <= 0) return false
          const goalKind = m.goal_type || m.goalType
          if (goalKind === 'users') return currentUsers >= target
          if (goalKind === 'revenue' || goalKind === 'mrr') return currentRevenue >= target
          return false
        })

        for (const m of toComplete) {
          applyMilestonesChange((prev) => prev.map((row: any) => row.id === m.id ? { ...row, unlocked: true, completed: true, date: today } : row))
          await supabase.from('milestones').update({ unlocked: true, completed: true, date: today }).eq('id', m.id)
        }
        if (toComplete.length > 0 && onRefreshMilestones) await onRefreshMilestones()
      } catch {
        // ignore
      }
    }
    void maybeComplete()
  }, [currentUsers, currentRevenue, milestones, applyMilestonesChange, onRefreshMilestones])

  const handleAddMilestone = useCallback(async () => {
    console.log('handleAddMilestone called', { newMilestone, userId: user?.id })
    
    if (!newMilestone.title.trim()) {
      console.log('No title, closing modal')
      setShowAddMilestone(false)
      return
    }
    
    if (!user?.id) {
      console.error('No user ID!')
      setShowAddMilestone(false)
      return
    }
    
    const current = parseFloat(String(newMilestone.current || ""))
    const target = parseFloat(String(newMilestone.target || ""))
    const progressUnlocked = Number.isFinite(current) && Number.isFinite(target) ? current >= target : false
    const unlocked = newMilestone.isCompleted === true ? true : progressUnlocked
    
    // Set date: if completed, use provided date or today; if pending, use null
    const dateValue = unlocked 
      ? (newMilestone.date || new Date().toISOString()).slice(0, 10)
      : null
    
    const payload: any = {
      user_id: user.id,
      title: newMilestone.title,
      description: newMilestone.description || null,
      emoji: newMilestone.emoji || "🏅",
      type: "user_added",
      goal_type: null,
      progress_current: Number.isFinite(current) ? current : null,
      progress_target: Number.isFinite(target) ? target : null,
      unit: newMilestone.unit || null,
      unlocked,
      date: dateValue,
    }
    
    console.log('Inserting milestone payload:', payload)
    
    try {
      const { data, error } = await supabase
        .from("milestones")
        .insert([payload])
        .select("*")
        .maybeSingle()
      console.log('Supabase response:', { data, error })
      
      if (error) {
        console.error('Error adding milestone:', error)
      } else {
        if (data) {
          console.log('Successfully added milestone, updating state (data present)')
          applyMilestonesChange((prev) => [...prev, data as unknown as Milestone])
        } else {
          console.log('Insert succeeded without returning data; refreshing list')
        }
        if (onRefreshMilestones) {
          await onRefreshMilestones()
        }
      }
    } catch (err) {
      console.error('Exception adding milestone:', err)
    } finally {
      console.log('Resetting form and closing modal')
      setNewMilestone(defaultMilestoneDraft)
      setShowAddMilestone(false)
    }
  }, [applyMilestonesChange, newMilestone, onRefreshMilestones, user?.id])

  const launchConfetti = useCallback(async () => {
    try {
      const win = window as typeof window & { confetti?: any }
      if (!win.confetti) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"
          script.async = true
          script.onload = () => resolve()
          script.onerror = () => reject(new Error("Failed to load confetti"))
          document.body.appendChild(script)
        })
      }
      win.confetti({ particleCount: 140, spread: 70, origin: { y: 0.6 } })
      setTimeout(() => win.confetti?.({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 150)
      setTimeout(() => win.confetti?.({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 300)
    } catch {
      // confetti is non-critical
    }
  }, [])

  const markCustomMilestoneCompleted = useCallback(
    async (id: string) => {
      const todayIso = new Date().toISOString().slice(0, 10)
      applyMilestonesChange((prev) =>
        prev.map((milestone) =>
          milestone.id === id
            ? { ...milestone, unlocked: true, completed: true as any, date: todayIso }
            : milestone,
        ),
      )
      try {
        const { error } = await supabase
          .from("milestones")
          .update({ unlocked: true, completed: true, date: todayIso })
          .eq("id", id)
        if (error) console.error('Error marking milestone completed:', error)
      } catch (e) {
        console.error('Exception marking milestone completed:', e)
      }
      setCelebratingId(id)
      await launchConfetti()
      setTimeout(() => setCelebratingId(null), 1200)
    },
    [applyMilestonesChange, launchConfetti],
  )

  return (
    <>
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-end gap-3">
            <Badge variant="outline">Day {currentDay}</Badge>
            <Button
              size="sm"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => {
                setShareTemplate("journey")
                setShowShareModal(true)
              }}
            >
              📷 Share My Journey
            </Button>
          </div>
        </CardHeader>

        <CardContent>
            <div className="space-y-6">
              {/* Progress Circles for Users and MRR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Users Circle */}
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-blue-100"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(currentUsers / userGoal, 1))}`}
                          className="text-blue-500 transition-all duration-500"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-blue-600">{currentUsers.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">of {userGoal.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <button
                        className="text-sm font-semibold text-gray-900 underline-offset-2 hover:underline"
                        onClick={() => {
                          setEditUsersOpen((v) => !v)
                          setUsersDraftCurrent(String(currentUsers))
                          const suggested = suggestNextTargets(currentUsers)
                          setUsersDraftTarget(String(suggested || userGoal))
                        }}
                      >👥 Users</button>
                      <div className="text-xs text-gray-600">{Math.round((currentUsers / userGoal) * 100)}% to goal</div>
                    </div>
                    {editUsersOpen && (
                      <div className="mt-3 w-full max-w-xs text-left">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <label className="text-gray-600">Current</label>
                          <input value={usersDraftCurrent} onChange={(e)=>setUsersDraftCurrent(e.target.value)} type="number" className="border rounded px-2 py-1" />
                          <label className="text-gray-600">Target</label>
                          <div className="flex items-center gap-2">
                            <input value={usersDraftTarget} onChange={(e)=>setUsersDraftTarget(e.target.value)} type="number" className="border rounded px-2 py-1 w-24" />
                            {[100,500,1000].map(v => (
                              <button key={v} className={`px-2 py-1 rounded border ${Number(usersDraftTarget)===v? 'bg-blue-100 border-blue-300':'border-gray-200'}`} onClick={()=>setUsersDraftTarget(String(v))}>{v}</button>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button className="px-3 py-1 text-sm rounded bg-blue-600 text-white" onClick={saveUsersEdit}>Save</button>
                          <button className="px-3 py-1 text-sm rounded bg-gray-100" onClick={()=>setEditUsersOpen(false)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* MRR Circle */}
                <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-green-100"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(currentRevenue / revenueGoal, 1))}`}
                          className="text-green-500 transition-all duration-500"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-green-600">${currentRevenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">of ${revenueGoal.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <button
                        className="text-sm font-semibold text-gray-900 underline-offset-2 hover:underline"
                        onClick={() => {
                          setEditMrrOpen((v) => !v)
                          setMrrDraftCurrent(String(currentRevenue))
                          const suggested = suggestNextTargets(currentRevenue)
                          setMrrDraftTarget(String(suggested || revenueGoal))
                        }}
                      >💰 MRR</button>
                      <div className="text-xs text-gray-600">{Math.round((currentRevenue / revenueGoal) * 100)}% to goal</div>
                    </div>
                    {editMrrOpen && (
                      <div className="mt-3 w-full max-w-xs text-left">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <label className="text-gray-600">Current</label>
                          <input value={mrrDraftCurrent} onChange={(e)=>setMrrDraftCurrent(e.target.value)} type="number" className="border rounded px-2 py-1" />
                          <label className="text-gray-600">Target</label>
                          <div className="flex items-center gap-2">
                            <input value={mrrDraftTarget} onChange={(e)=>setMrrDraftTarget(e.target.value)} type="number" className="border rounded px-2 py-1 w-24" />
                            {[100,500,1000].map(v => (
                              <button key={v} className={`px-2 py-1 rounded border ${Number(mrrDraftTarget)===v? 'bg-green-100 border-green-300':'border-gray-200'}`} onClick={()=>setMrrDraftTarget(String(v))}>${v}</button>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button className="px-3 py-1 text-sm rounded bg-green-600 text-white" onClick={saveMrrEdit}>Save</button>
                          <button className="px-3 py-1 text-sm rounded bg-gray-100" onClick={()=>setEditMrrOpen(false)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Journey Map - Narrative Style */}
              <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your story of building {user?.productName || "your product"}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setShowAddMilestone(true)}>Add Milestone</Button>
                </div>

                {/* Journey Timeline - Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Launch Day - Always first */}
                  {user?.launchDate && (
                    <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-white p-4 shadow-sm">
                      <div className="flex items-start gap-2">
                        <div className="text-2xl">🚀</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">
                            Launched {user?.productName || "my product"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(user.launchDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completed Milestones - Sorted by date */}
                  {(() => {
                    const presets = [
                      { id: 'first-user', emoji: '👤', title: 'Got my first user', target: 1, current: currentUsers, type: 'users' },
                      { id: 'first-10', emoji: '👥', title: 'Reached 10 users', target: 10, current: currentUsers, type: 'users' },
                      { id: 'first-dollar', emoji: '💵', title: 'Made my first dollar', target: 1, current: currentRevenue, type: 'mrr' },
                      { id: 'first-100-users', emoji: '🎯', title: 'Hit 100 users', target: 100, current: currentUsers, type: 'users' },
                      { id: 'first-100-mrr', emoji: '💰', title: 'Reached $100 MRR', target: 100, current: currentRevenue, type: 'mrr' },
                      { id: 'first-500-users', emoji: '🚀', title: 'Reached 500 users', target: 500, current: currentUsers, type: 'users' },
                      { id: 'first-1k-mrr', emoji: '💎', title: 'Hit $1k MRR', target: 1000, current: currentRevenue, type: 'mrr' },
                    ]

                    // Collect all completed milestones with dates
                    const completedMilestones: any[] = []
                    
                    // Add completed preset milestones
                    presets.forEach(preset => {
                      const achieved = preset.current >= preset.target
                      const existingMilestone = milestones.find(m => 
                        m.title.toLowerCase().includes(preset.title.toLowerCase()) || 
                        (m.type === 'goal_achieved' && m.goal_type === preset.type && preset.current >= preset.target)
                      )
                      if (existingMilestone?.unlocked && existingMilestone.date) {
                        completedMilestones.push({
                          ...preset,
                          date: existingMilestone.date,
                          isPreset: true,
                          milestoneData: existingMilestone
                        })
                      }
                    })

                    // Add completed custom milestones (completed OR unlocked)
                    milestones
                      .filter(m => m.type === 'user_added' && ((m as any).completed === true || m.unlocked) && m.date)
                      .forEach(m => {
                        completedMilestones.push({
                          id: m.id,
                          emoji: m.emoji || '🏅',
                          title: m.title,
                          description: m.description,
                          date: m.date,
                          progressCurrent: m.progressCurrent,
                          progressTarget: m.progressTarget,
                          unit: m.unit,
                          isPreset: false,
                          milestoneData: m
                        })
                      })

                    // Sort by date
                    completedMilestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

                    return completedMilestones.map((milestone) => (
                      <div key={milestone.id} className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
                        <div className="flex items-start gap-2">
                          <div className="text-2xl">{milestone.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm">{milestone.title}</div>
                            {milestone.description && (
                              <div className="text-xs text-gray-600 mt-1">{milestone.description}</div>
                            )}
                            {milestone.isPreset && milestone.type === 'mrr' && (
                              <div className="text-xs text-gray-600 mt-1">
                                <span className="font-semibold text-green-600">${milestone.current.toLocaleString()}/mo</span>
                              </div>
                            )}
                            {milestone.isPreset && milestone.type === 'users' && (
                              <div className="text-xs text-gray-600 mt-1">
                                <span className="font-semibold text-blue-600">{milestone.current.toLocaleString()} users</span>
                              </div>
                            )}
                            {!milestone.isPreset && milestone.progressTarget != null && (
                              <div className="text-xs text-gray-600 mt-1">
                                <span className="font-semibold text-indigo-600">
                                  {Math.round(milestone.progressCurrent || 0)}{milestone.unit || ''}/{Math.round(milestone.progressTarget)}{milestone.unit || ''}
                                </span>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  })()}

                  {/* Pending Milestones - Grey, draggable */}
                  {(() => {
                    const presets = [
                      { id: 'first-user', emoji: '👤', title: 'Got my first user', target: 1, current: currentUsers, type: 'users' },
                      { id: 'first-10', emoji: '👥', title: 'Reached 10 users', target: 10, current: currentUsers, type: 'users' },
                      { id: 'first-dollar', emoji: '💵', title: 'Made my first dollar', target: 1, current: currentRevenue, type: 'mrr' },
                      { id: 'first-100-users', emoji: '🎯', title: 'Hit 100 users', target: 100, current: currentUsers, type: 'users' },
                      { id: 'first-100-mrr', emoji: '💰', title: 'Reached $100 MRR', target: 100, current: currentRevenue, type: 'mrr' },
                      { id: 'first-500-users', emoji: '🚀', title: 'Reached 500 users', target: 500, current: currentUsers, type: 'users' },
                      { id: 'first-1k-mrr', emoji: '💎', title: 'Hit $1k MRR', target: 1000, current: currentRevenue, type: 'mrr' },
                    ]

                    const pendingMilestones: any[] = []
                    
                    // Add pending preset milestones
                    presets.forEach(preset => {
                      const achieved = preset.current >= preset.target
                      const existingMilestone = milestones.find(m => 
                        m.title.toLowerCase().includes(preset.title.toLowerCase()) || 
                        (m.type === 'goal_achieved' && m.goal_type === preset.type)
                      )
                      if (!achieved && !existingMilestone?.unlocked) {
                        pendingMilestones.push({
                          ...preset,
                          isPreset: true,
                          sortOrder: existingMilestone?.sortOrder ?? 999
                        })
                      }
                    })

                    // Add pending custom milestones (not yet completed and not unlocked)
                    milestones
                      .filter(m => m.type === 'user_added' && !((m as any).completed === true) && !m.unlocked)
                      .forEach(m => {
                        pendingMilestones.push({
                          id: m.id,
                          emoji: m.emoji || '🏅',
                          title: m.title,
                          description: m.description,
                          progressCurrent: m.progressCurrent,
                          progressTarget: m.progressTarget,
                          unit: m.unit,
                          isPreset: false,
                          sortOrder: (m as any).sortOrder ?? m.sort_order ?? 999,
                          milestoneData: m
                        })
                      })

                    // Sort by sortOrder
                    pendingMilestones.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))

                    return pendingMilestones.map((milestone, index) => (
                      <div
                        key={milestone.id}
                        draggable
                        onDragStart={() => setDraggedMilestone(milestone.id)}
                        onDragEnd={() => {
                          setDraggedMilestone(null)
                          setDragOverIndex(null)
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDragOverIndex(index)
                        }}
                        onDrop={async (e) => {
                          e.preventDefault()
                          if (!draggedMilestone || draggedMilestone === milestone.id) return
                          
                          const draggedIndex = pendingMilestones.findIndex(m => m.id === draggedMilestone)
                          if (draggedIndex === -1) return

                          // Reorder in database
                          const reordered = [...pendingMilestones]
                          const [removed] = reordered.splice(draggedIndex, 1)
                          reordered.splice(index, 0, removed)

                          // Update sort orders
                          for (let i = 0; i < reordered.length; i++) {
                            const m = reordered[i]
                            if (!m.isPreset && m.milestoneData?.id) {
                              await supabase
                                .from('milestones')
                                .update({ sort_order: i })
                                .eq('id', m.milestoneData.id)
                            }
                          }
                          setDraggedMilestone(null)
                          setDragOverIndex(null)
                          if (onRefreshMilestones) await onRefreshMilestones()
                        }}
                        onClick={() => {
                          if (!milestone.isPreset && milestone.id) {
                            const idStr = String(milestone.id)
                            if (idStr.startsWith('temp-')) {
                              // Avoid completing before the row is saved server-side
                              console.warn('Please wait, saving milestone before completing...')
                              return
                            }
                            markCustomMilestoneCompleted(milestone.id)
                          }
                        }}
                        className={`rounded-lg border border-gray-200 bg-gray-50 p-4 opacity-60 transition-all ${
                          dragOverIndex === index ? 'ring-2 ring-indigo-400' : ''
                        } ${
                          draggedMilestone === milestone.id ? 'opacity-30' : ''
                        } ${
                          !milestone.isPreset ? 'cursor-pointer hover:opacity-80' : 'cursor-move'
                        }`}
                        title={!milestone.isPreset ? 'Click to mark as completed' : 'Drag to reorder'}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="text-2xl grayscale flex-shrink-0">{milestone.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-500 text-sm">{milestone.title}</div>
                            {milestone.description && (
                              <div className="text-xs text-gray-400 mt-1">{milestone.description}</div>
                            )}
                            {milestone.isPreset && (
                              <div className="text-xs text-gray-400 mt-1">
                                {milestone.type === 'mrr' 
                                  ? `$${milestone.current?.toLocaleString() || 0}/$${milestone.target?.toLocaleString()} MRR` 
                                  : `${milestone.current?.toLocaleString() || 0}/${milestone.target?.toLocaleString()} users`}
                              </div>
                            )}
                            {!milestone.isPreset && milestone.progressTarget != null && (
                              <div className="text-xs text-gray-400 mt-1">
                                {Math.round(milestone.progressCurrent || 0)}{milestone.unit || ''}/{Math.round(milestone.progressTarget)}{milestone.unit || ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  })()}

                  {/* Empty state */}
                  {milestones.filter(m => m.unlocked).length === 0 && !user?.launchDate && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🌱</div>
                      <div className="text-sm">Your journey starts here. Add your first milestone!</div>
                    </div>
                  )}
                </div>
              </div>

              {streak >= 7 && (
                <div className="mt-4 rounded-lg border border-green-200 bg-gradient-to-r from-green-100 to-blue-100 p-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">🎉 Consistency Milestone!</span>
                  </div>
                  <p className="mt-1 text-xs text-green-700">
                    {streak >= 30
                      ? "Master level! You're building unstoppable momentum."
                      : streak >= 14
                        ? "Great consistency! You're developing strong marketing habits."
                        : "You're building momentum! Keep this streak going."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
      </Card>

      <AddMilestoneModal
        open={showAddMilestone}
        value={newMilestone}
        onChange={setNewMilestone}
        onSubmit={() => void handleAddMilestone()}
        onClose={() => setShowAddMilestone(false)}
      />

      <ShareJourneyDialog
        open={showShareModal}
        template={shareTemplate}
        onTemplateChange={setShareTemplate}
        onOpenChange={setShowShareModal}
        onDownload={() => void handleDownloadShareCard()}
        shareCardRef={shareCardRef}
        currentDay={currentDay}
        currentUsers={currentUsers}
        userGoal={userGoal}
        currentRevenue={currentRevenue}
        revenueGoal={revenueGoal}
        streak={streak}
        winsGoals={winsGoals}
        currentWeekGoals={currentWeekGoals}
        currentWeek={currentWeek}
        weekDone={weekDone}
        weekTotal={weekTotal}
        userProductName={user?.productName}
        achievementPresets={achievementPresets}
        milestones={milestones}
        launchDate={user?.launchDate}
      />
    </>
  )
}

export default JourneyPanel
