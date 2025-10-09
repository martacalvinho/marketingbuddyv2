import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { Milestone } from "@/hooks/use-milestones"
import { ChevronLeft, ChevronRight, Target, MapPin, Star } from "lucide-react"

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

  const getUserGoal = useCallback(() => {
    const current = parseInt(user?.currentUsers || "0", 10) || 0
    return current === 0 ? 10 : current * 10
  }, [user?.currentUsers])

  const getRevenueGoal = useCallback(() => {
    const current = parseFloat(user?.currentMrr || "0") || 0
    return current === 0 ? 10 : Math.max(10, Math.round(current * 10))
  }, [user?.currentMrr])

  const [userGoal, setUserGoal] = useState(getUserGoal)
  const [revenueGoal, setRevenueGoal] = useState(getRevenueGoal)
  const [currentUsers, setCurrentUsers] = useState(() => {
    const value = parseInt(user?.currentUsers || "0", 10)
    return Number.isFinite(value) ? value : 0
  })
  const [currentRevenue, setCurrentRevenue] = useState(() => {
    const value = parseFloat(user?.currentMrr || "0")
    return Number.isFinite(value) ? value : 0
  })

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

  const handleAddMilestone = useCallback(async () => {
    if (!newMilestone.title.trim() || !user?.id) {
      setShowAddMilestone(false)
      return
    }
    const current = parseFloat(String(newMilestone.current || ""))
    const target = parseFloat(String(newMilestone.target || ""))
    const progressUnlocked = Number.isFinite(current) && Number.isFinite(target) ? current >= target : false
    const unlocked = newMilestone.isCompleted === true ? true : progressUnlocked
    try {
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
        date: (newMilestone.date || new Date().toISOString()).slice(0, 10),
      }
      const { data, error } = await supabase.from("milestones").insert(payload).select("*").single()
      if (!error && data) {
        applyMilestonesChange((prev) => [...prev, data as unknown as Milestone])
        if (onRefreshMilestones) {
          await onRefreshMilestones()
        }
      }
    } catch {
      // ignore insertion error
    } finally {
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
      applyMilestonesChange((prev) =>
        prev.map((milestone) =>
          milestone.id === id
            ? { ...milestone, unlocked: true, date: new Date().toISOString() }
            : milestone,
        ),
      )
      try {
        await supabase
          .from("milestones")
          .update({ unlocked: true, date: new Date().toISOString().slice(0, 10) })
          .eq("id", id)
      } catch {
        // ignore update failure
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsJourneyCollapsed((prev) => !prev)}
                className="rounded p-1 transition-colors hover:bg-gray-100"
              >
                {isJourneyCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronLeft className="h-4 w-4 rotate-90 text-gray-500" />
                )}
              </button>
              <CardTitle className="text-xl text-gray-900">🚀 Your Marketing Journey</CardTitle>
            </div>
            <Badge variant="outline">Day {currentDay}</Badge>
          </div>
        </CardHeader>

        {!isJourneyCollapsed && (
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-blue-200 bg-white/80 p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
                  <div className="text-sm text-gray-600">Tasks Today</div>
                </div>
                <div className="rounded-xl border border-green-200 bg-white/80 p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{streak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="rounded-xl border border-purple-200 bg-white/80 p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{currentDay}</div>
                  <div className="text-sm text-gray-600">Days Active</div>
                </div>
                <div className="rounded-xl border border-orange-200 bg-white/80 p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">{xp}</div>
                  <div className="text-sm text-gray-600">Total XP</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Journey Map</h3>
                    <p className="text-sm text-gray-600">From 0 to 1000 users – add milestones and track your path</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setShowAddMilestone(true)}>Add Milestone</Button>
                </div>

                {/* Track */}
                <div className="relative mt-2 rounded-lg border bg-white p-6">
                  <div className="absolute left-6 right-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-200 via-blue-200 to-purple-200" />

                  {journeySteps.map((step) => (
                    <div
                      key={step}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${nodePercent(step)}%` }}
                    >
                      <div className="h-5 w-5 rounded-full border-2 border-indigo-300 bg-white" />
                      <div className="mt-2 -ml-4 w-12 text-center text-xs text-gray-600">{step}</div>
                    </div>
                  ))}

                  {/* YOU ARE HERE marker */}
                  <div
                    className="absolute -translate-x-1/2"
                    style={{ left: `${markerPercent}%`, top: "-0.25rem" }}
                  >
                    <div className="flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white shadow">
                      <MapPin className="h-3 w-3" /> YOU ARE HERE
                    </div>
                  </div>

                  {/* Custom milestone stars (positioned near marker) */}
                  <div className="relative">
                    {(milestones || []).slice(0, 6).map((m, i) => (
                      <div
                        key={m.id || m.title}
                        className="absolute -translate-x-1/2"
                        style={{ left: `${Math.max(0, Math.min(100, markerPercent + (i - 2) * 8))}%`, top: "2.25rem" }}
                        title={m.title}
                      >
                        <div className={`flex items-center gap-1 ${m.unlocked ? "text-yellow-500" : "text-gray-400"}`}>
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-[11px] text-gray-700 bg-white/80 px-1.5 py-0.5 rounded border" >{m.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-gray-600">Targets: 0 → 10 → 100 → 500 → 1000 users</div>
                  <Button
                    size="sm"
                    className="text-xs bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={() => {
                      setShareTemplate("journey")
                      setShowShareModal(true)
                    }}
                  >
                    📷 Generate Share Card
                  </Button>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">🏆 Milestones</h3>
                    <p className="text-sm text-gray-600">Unlock achievements as you grow</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowAddMilestone(true)}>
                    Add Milestone
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleAchievementPresets.map((milestone) => {
                    const isCelebrating = celebratingId === milestone.id
                    return (
                      <div
                        key={milestone.id}
                        className={`rounded-xl border p-4 shadow-sm transition-all duration-700 ${
                          milestone.unlocked
                            ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
                            : "border-gray-200 bg-gray-50"
                        } ${isCelebrating ? "scale-[1.02] rotate-180 ring-4 ring-amber-300" : ""}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="text-2xl" aria-hidden>
                            {milestone.icon}
                          </div>
                          <Badge variant="outline" className={milestone.unlocked ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                            {milestone.unlocked ? "Unlocked" : "Locked"}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <div className="font-semibold text-gray-900">{milestone.title}</div>
                          <div className="text-xs text-gray-600">
                            {milestone.unlocked ? `Unlocked ${new Date().toLocaleDateString()}` : `Progress: ${milestone.progress}`}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">"{milestone.blurb}"</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-medium text-gray-800">Your Milestones</h4>
                  {milestones.length === 0 ? (
                    <div className="text-xs text-gray-500">You haven't added any custom milestones yet.</div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {milestones.map((milestone: Milestone) => {
                        const isCelebrating = celebratingId === milestone.id
                        const unlocked = !!milestone.unlocked
                        return (
                          <div
                            key={milestone.id || milestone.title}
                            className={`relative cursor-pointer rounded-xl border p-4 shadow-sm transition-all duration-700 ${
                              unlocked
                                ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                                : "border-gray-200 bg-gray-50"
                            } ${isCelebrating ? "scale-[1.02] rotate-180 ring-4 ring-green-300" : ""}`}
                            onClick={() => {
                              if (!unlocked && milestone.id) {
                                void markCustomMilestoneCompleted(milestone.id)
                              }
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="text-2xl" aria-hidden>
                                {milestone.emoji || "🏅"}
                              </div>
                              <Badge variant="outline" className={unlocked ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                                {unlocked ? "Completed" : "Locked"}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              <div className="truncate font-semibold text-gray-900" title={milestone.title}>
                                {milestone.title}
                              </div>
                              {milestone.description && (
                                <div className="mt-1 truncate text-xs text-gray-600" title={milestone.description}>
                                  {milestone.description}
                                </div>
                              )}
                              {milestone.progressTarget != null && (
                                <div className="mt-1 text-xs text-gray-600">
                                  Progress: {Math.max(0, Math.round(milestone.progressCurrent || 0))}
                                  {milestone.unit ? milestone.unit : ""}/
                                  {Math.max(0, Math.round(milestone.progressTarget))}
                                  {milestone.unit ? milestone.unit : ""}
                                </div>
                              )}
                              <div className="mt-1 text-[11px] text-gray-500">
                                {milestone.date ? new Date(milestone.date).toLocaleDateString() : ""}
                              </div>
                            </div>
                            {!unlocked && milestone.id && (
                              <div className="mt-3">
                                <Button
                                  size="sm"
                                  className="text-xs"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    void markCustomMilestoneCompleted(milestone.id as string)
                                  }}
                                >
                                  Mark as Done
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-blue-200 bg-white/80 p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-blue-900">🎯 This Week's Wins</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShareTemplate("weekly")
                      setShowShareModal(true)
                    }}
                  >
                    Share My Wins
                  </Button>
                </div>
                <div className="text-sm text-blue-800">
                  <div className="mb-2">
                    Tasks completed: {weekDone}/{weekTotal} {weekTotal > 0 && "⭐"}
                  </div>
                  <ul className="ml-5 list-disc space-y-1">
                    {(winsGoals.length > 0 ? winsGoals : currentWeekGoals).map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
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
        )}
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
      />
    </>
  )
}

export default JourneyPanel
