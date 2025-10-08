"use client"

import { useState, useEffect, useRef } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Twitter, Linkedin, MessageSquare, Instagram, Video, FileText, Zap, Copy, Check, Loader2, CheckCircle2, Circle, Target, ChevronRight, ChevronLeft, Calendar, Clock, Lightbulb, Trophy, Download } from "lucide-react"
import WeekProgress from "./week-progress"
import { supabase } from "@/lib/supabase"

interface Milestone {
  id?: string
  title: string
  date: string
  type: 'goal_achieved' | 'user_added'
  goalType?: 'users' | 'revenue'
  goal_type?: 'users' | 'revenue'
  emoji?: string
  description?: string
  progressCurrent?: number
  progressTarget?: number
  progress_current?: number
  progress_target?: number
  unit?: string
  unlocked?: boolean
}

interface HabitTrackerProps {
  tasks: any[]
  onCompleteTask: (taskId: string | number) => void
  onDeleteTask?: (taskId: string | number) => void
  onAddTask?: (title: string, description: string) => void
  onUpdateTask?: (taskId: string | number, updates: Partial<any>) => void
  onReorderTasks?: (newOrder: any[]) => void
  onAddTaskNote?: (taskId: string | number, note: string) => void
  onSkipTask?: (taskId: string | number) => void
  onSuggestContent?: (platformId: string, task: any) => void
  streak: number
  xp: number
  currentDay?: number
  onDayChange?: (day: number) => void
  user?: any
  weekStats?: { total: number; done: number; goals: string[] }[]
  onTaskUpdate?: () => void
}

interface Task {
  id: string | number
  title: string
  description: string
  completed: boolean
  estimatedTime?: string
  xp?: number
  category?: 'content' | 'analytics' | 'community' | 'strategy' | 'engagement'
  impact?: string
  tips?: string[]
  note?: string
}

const getWeekFocus = (day: number) => {
  const month = Math.ceil(day / 30)
  const weekInMonth = Math.ceil(((day - 1) % 30 + 1) / 7)
  
  // Month-based focus areas for 6-month plan
  switch (month) {
    case 1:
      switch (weekInMonth) {
        case 1: return "Foundation & Platform Setup"
        case 2: return "Content Pillars & Initial Users"
        case 3: return "User Acquisition Tactics"
        case 4: return "Community Building"
        default: return "Foundation Month"
      }
    case 2:
      switch (weekInMonth) {
        case 1: return "Content Strategy Development"
        case 2: return "Community Engagement"
        case 3: return "Growth Optimization"
        case 4: return "User Feedback Integration"
        default: return "Content & Community"
      }
    case 3:
      return "Growth Acceleration (50-200 users)"
    case 4:
      return "Scale & Systems (200-500 users)"
    case 5:
      return "Revenue Focus (500-1000 users)"
    case 6:
      return "Sustainable Growth (1000+ users)"
    default:
      return "Marketing Growth"
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'content': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'analytics': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'community': return 'bg-green-100 text-green-800 border-green-200'
    case 'strategy': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'engagement': return 'bg-pink-100 text-pink-800 border-pink-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}


// Detect primary platform for a task and map to content generator type id
const detectPlatformId = (task: any): string | null => {
  if (!task) return null
  const explicit = (task.platform || '').toLowerCase().trim()
  const text = `${task.title || ''} ${task.description || ''}`.toLowerCase()
  const has = (s: string) => text.includes(s)

  const platform = explicit ||
    (has('linkedin') ? 'linkedin' :
    has('twitter') || has('tweet') || has('x.com') ? 'twitter' :
    has('reddit') || has('subreddit') ? 'reddit' :
    has('instagram') || has('ig ') || has('insta') ? 'instagram' :
    has('tiktok') || has('tik tok') ? 'tiktok' :
    has('build in public') ? 'build-in-public' :
    has('blog') || has('article') || has('seo') ? 'blog' : '')

  switch (platform) {
    case 'twitter': return 'twitter-thread'
    case 'linkedin': return 'linkedin-post'
    case 'reddit': return 'reddit-post'
    case 'instagram': return 'instagram-post'
    case 'tiktok': return 'tiktok-script'
    case 'build-in-public': return 'build-in-public'
    case 'blog': return 'seo-blog'
    default: return null
  }
}

const getPlatformIcon = (platformId: string): any => {
  switch (platformId) {
    case 'twitter-thread': return Twitter
    case 'linkedin-post': return Linkedin
    case 'reddit-post': return MessageSquare
    case 'instagram-post': return Instagram
    case 'tiktok-script': return Video
    case 'build-in-public': return Zap
    case 'seo-blog': return FileText
    default: return null
  }
}


export default function HabitTracker({ tasks, onCompleteTask, onDeleteTask, onAddTask, onUpdateTask, onReorderTasks, onAddTaskNote, onSkipTask, onSuggestContent, streak, xp, currentDay = 1, onDayChange, user, weekStats = [], onTaskUpdate }: HabitTrackerProps) {
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [isJourneyCollapsed, setIsJourneyCollapsed] = useState(false)
  const [showEditGoal, setShowEditGoal] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  // Compute goals strictly from onboarding baselines (10x rule)
  const getUserGoal = () => {
    const current = parseInt(user?.currentUsers || '0', 10) || 0
    return current === 0 ? 10 : current * 10
  }
  
  const getRevenueGoal = () => {
    const current = parseFloat(user?.currentMrr || '0') || 0
    return current === 0 ? 10 : Math.max(10, Math.round(current * 10))
  }
  
  const [userGoal, setUserGoal] = useState(getUserGoal())
  const [revenueGoal, setRevenueGoal] = useState(getRevenueGoal())
  const [currentUsers, setCurrentUsers] = useState(() => {
    const n = parseInt(user?.currentUsers || '0', 10)
    return Number.isFinite(n) ? n : 0
  })
  const [currentRevenue, setCurrentRevenue] = useState(() => {
    const n = parseFloat(user?.currentMrr || '0')
    return Number.isFinite(n) ? n : 0
  })
  
  // Refresh goals and current baselines if onboarding values change
  useEffect(() => {
    setUserGoal(getUserGoal())
    setRevenueGoal(getRevenueGoal())
    const cu = parseInt(user?.currentUsers || '0', 10)
    setCurrentUsers(Number.isFinite(cu) ? cu : 0)
    const cr = parseFloat(user?.currentMrr || '0')
    setCurrentRevenue(Number.isFinite(cr) ? cr : 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.currentUsers, user?.currentMrr])
  const [editingTaskId, setEditingTaskId] = useState<string | number | null>(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState("")
  const [editingTaskDescription, setEditingTaskDescription] = useState("")
  const [noteEditingTaskId, setNoteEditingTaskId] = useState<string | number | null>(null)
  const [taskNote, setTaskNote] = useState("")
  const [draggedTask, setDraggedTask] = useState<any | null>(null)
  // Milestone state (DB-backed)
  const [milestones, setMilestones] = useState<Milestone[]>(user?.milestones || [])
  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        if (!user?.id) return
        const { data, error } = await supabase
          .from('milestones')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (!ignore && !error && data) setMilestones(data as unknown as Milestone[])
      } catch {}
    }
    load()
    return () => { ignore = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '', emoji: '🏅', description: '', current: '', target: '', unit: '' })
  const [celebratingId, setCelebratingId] = useState<string | null>(null)
  // Share UI state
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareTemplate, setShareTemplate] = useState<'journey' | 'milestone' | 'weekly'>('journey')
  const shareCardRef = useRef<HTMLDivElement>(null)

  // Aggregate weekly stats (for shareable summary)
  const weekDone = (weekStats || []).reduce((acc: number, d: any) => acc + (d?.done || 0), 0)
  const weekTotal = (weekStats || []).reduce((acc: number, d: any) => acc + (d?.total || 0), 0)
  const winsGoals = Array.from(new Set((weekStats || []).flatMap((d: any) => d?.goals || []))).slice(0, 4)

  // Achievement presets (locked/unlocked)
  const achievementPresets = [
    { id: 'users-10', title: 'First 10 Users', unlocked: currentUsers >= 10, progress: `${Math.min(currentUsers, 10)}/10`, icon: '👥', blurb: 'Every journey starts somewhere' },
    { id: 'streak-7', title: '7-Day Streak', unlocked: streak >= 7, progress: `${Math.min(streak, 7)}/7 days`, icon: '🔥', blurb: 'Consistency is key' },
    { id: 'mrr-1', title: 'First Dollar', unlocked: currentRevenue >= 1, progress: `$${Math.min(currentRevenue, 1).toLocaleString()}/$1 MRR`, icon: '💰', blurb: 'The first dollar is the hardest' },
    { id: 'users-100', title: '100 Users', unlocked: currentUsers >= 100, progress: `${Math.min(currentUsers, 100)}/100`, icon: '🚩', blurb: 'Real traction begins' },
    { id: 'streak-30', title: '30-Day Streak', unlocked: streak >= 30, progress: `${Math.min(streak, 30)}/30 days`, icon: '⚡️', blurb: 'Unstoppable momentum' },
    { id: 'mrr-100', title: '$100 MRR', unlocked: currentRevenue >= 100, progress: `$${Math.min(currentRevenue, 100).toLocaleString()}/$100 MRR`, icon: '💎', blurb: 'Proof people pay' },
  ]

  // Track previous achievement unlocked states to trigger celebration once
  const prevAchievementsRef = useRef<Record<string, boolean>>({})
  useEffect(() => {
    const current: Record<string, boolean> = Object.fromEntries(achievementPresets.map(a => [a.id, !!a.unlocked]))
    const prev = prevAchievementsRef.current
    const justUnlocked = Object.keys(current).find(id => current[id] === true && prev[id] === false)
    if (justUnlocked) {
      setCelebratingId(justUnlocked)
      launchConfetti()
      setTimeout(() => setCelebratingId(null), 1200)
    }
    prevAchievementsRef.current = current
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUsers, currentRevenue, streak])

  // SVG progress ring for visual goals
  const ProgressRing = ({ size = 120, stroke = 10, value, max, colorFrom, colorTo, label, sub }: { size?: number, stroke?: number, value: number, max: number, colorFrom: string, colorTo: string, label: string, sub?: string }) => {
    const radius = (size - stroke) / 2
    const circ = 2 * Math.PI * radius
    const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0))
    const dash = pct * circ
    return (
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="rotate-[270deg]">
          <defs>
            <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>
          </defs>
          <circle cx={size/2} cy={size/2} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
          <circle cx={size/2} cy={size/2} r={radius} stroke={`url(#grad-${label})`} strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div className="-mt-24 text-center">
          <div className="text-2xl font-bold text-gray-900">{label}</div>
          <div className="text-sm text-gray-600">{value.toLocaleString()} / {max.toLocaleString()}{sub ? ` ${sub}` : ''}</div>
          <div className="text-xs text-gray-500">{(pct * 100).toFixed(1)}% to goal</div>
        </div>
      </div>
    )
  }

  const handleDownloadShareCard = async () => {
    if (!shareCardRef.current) return
    try {
      const win: any = window as any
      if (!win.htmlToImage) {
        // Load html-to-image from CDN lazily
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js'
          s.async = true
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Failed to load html-to-image'))
          document.body.appendChild(s)
        })
      }
      const dataUrl = await (win.htmlToImage as any).toPng(shareCardRef.current, { pixelRatio: 2, cacheBust: true })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `marketing-share-${shareTemplate}.png`
      link.click()
    } catch (e) {
      const shareText = `🚀 My Marketing Journey - Day ${currentDay}\n\n👥 Users: ${currentUsers.toLocaleString()} / ${userGoal.toLocaleString()}\n💰 Revenue: $${currentRevenue.toLocaleString()} / $${revenueGoal.toLocaleString()} MRR\n🔥 ${streak} day streak\n\nBuilding: ${user?.productName || 'My Product'} — ${window.location.origin}/landing`
      if (navigator.share) {
        try { await navigator.share({ title: 'My Marketing Journey', text: shareText }) } catch {}
      } else {
        await navigator.clipboard.writeText(shareText)
        alert('Image export unavailable. Copied share text to clipboard.')
      }
    }
  }
  
  // Check if goals have been achieved and save as milestones (DB-backed)
  useEffect(() => {
    const persistIfNeeded = async () => {
      try {
        if (!user?.id) return
        const toInsert: any[] = []
        if (currentUsers >= userGoal) {
          const title = `Reached ${userGoal.toLocaleString()} users`
          const exists = milestones.some((m: Milestone) => m.type === 'goal_achieved' && (m.goalType === 'users' || m.goal_type === 'users') && m.title === title)
          if (!exists) toInsert.push({ title, type: 'goal_achieved', goal_type: 'users' })
        }
        if (currentRevenue >= revenueGoal) {
          const title = `Reached $${revenueGoal.toLocaleString()} MRR`
          const exists = milestones.some((m: Milestone) => m.type === 'goal_achieved' && (m.goalType === 'revenue' || m.goal_type === 'revenue') && m.title === title)
          if (!exists) toInsert.push({ title, type: 'goal_achieved', goal_type: 'revenue' })
        }
        if (toInsert.length) {
          const rows = toInsert.map(r => ({
            user_id: user.id,
            title: r.title,
            type: r.type,
            goal_type: r.goal_type,
            unlocked: true,
            date: new Date().toISOString().slice(0,10)
          }))
          const { data } = await supabase.from('milestones').insert(rows).select('*')
          if (data) setMilestones((prev: Milestone[]) => [...(data as unknown as Milestone[]), ...prev])
        }
      } catch {}
    }
    void persistIfNeeded()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUsers, userGoal, currentRevenue, revenueGoal])
  
  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim() || !user?.id) return
    const cur = parseFloat(String((newMilestone as any).current || ''))
    const tgt = parseFloat(String((newMilestone as any).target || ''))
    const unlocked = Number.isFinite(cur) && Number.isFinite(tgt) ? cur >= tgt : false
    try {
      const payload: any = {
        user_id: user.id,
        title: newMilestone.title,
        description: newMilestone.description || null,
        emoji: newMilestone.emoji || '🏅',
        type: 'user_added',
        goal_type: null,
        progress_current: Number.isFinite(cur) ? cur : null,
        progress_target: Number.isFinite(tgt) ? tgt : null,
        unit: (newMilestone as any).unit || null,
        unlocked,
        date: (newMilestone.date || new Date().toISOString()).slice(0,10)
      }
      const { data, error } = await supabase.from('milestones').insert(payload).select('*').single()
      if (!error && data) setMilestones((prev: Milestone[]) => [...prev, data as unknown as Milestone])
    } catch {}
    setNewMilestone({ title: '', date: '', emoji: '🏅', description: '', current: '', target: '', unit: '' })
    setShowAddMilestone(false)
  }

  const launchConfetti = async () => {
    try {
      const win: any = window as any
      if (!win.confetti) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
          s.async = true
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Failed to load confetti'))
          document.body.appendChild(s)
        })
      }
      ;(win.confetti as any)({ particleCount: 140, spread: 70, origin: { y: 0.6 } })
      setTimeout(() => (win.confetti as any)({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 150)
      setTimeout(() => (win.confetti as any)({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 300)
    } catch {}
  }

  const markCustomMilestoneCompleted = async (id: string) => {
    setMilestones((prev: Milestone[]) => prev.map((m: Milestone) => m.id === id ? { ...m, unlocked: true, date: new Date().toISOString() } : m))
    try { await supabase.from('milestones').update({ unlocked: true, date: new Date().toISOString().slice(0,10) }).eq('id', id) } catch {}
    setCelebratingId(id)
    await launchConfetti()
    setTimeout(() => setCelebratingId(null), 1200)
  }
  
  const completedTasks = tasks.filter((task) => task.completed).length
  const currentWeek = Math.ceil(currentDay / 7)
  const currentWeekGoals = weekStats[currentWeek - 1]?.goals || []
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const handleCompleteTask = (taskId: string | number) => {
    onCompleteTask(taskId)
    onTaskUpdate?.()
  }

  const handleDeleteTask = (taskId: string | number) => {
    onDeleteTask?.(taskId)
    onTaskUpdate?.()
  }

  const handleAddTask = () => {
    if (newTitle.trim()) {
      onAddTask?.(newTitle.trim(), newDesc.trim())
      setNewTitle("")
      setNewDesc("")
      onTaskUpdate?.()
    }
  }

  const startEditTask = (taskId: string, currentTitle: string) => {
    setEditingTask(taskId)
    setEditValue(currentTitle)
  }

  const commitTaskEdit = () => {
    // Note: This would need to be implemented in the parent component
    // For now, we'll just cancel the edit
    setEditingTask(null)
    setEditValue("")
  }

  const startEditTaskDetails = (task: Task) => {
    setEditingTaskId(task.id)
    setEditingTaskTitle(task.title)
    setEditingTaskDescription(task.description)
  }

  const saveTaskEdits = () => {
    if (editingTaskId && onUpdateTask) {
      onUpdateTask(editingTaskId, {
        title: editingTaskTitle,
        description: editingTaskDescription
      })
    }
    setEditingTaskId(null)
    setEditingTaskTitle("")
    setEditingTaskDescription("")
  }

  const cancelTaskEdits = () => {
    setEditingTaskId(null)
    setEditingTaskTitle("")
    setEditingTaskDescription("")
  }

  const startAddNote = (task: Task) => {
    setNoteEditingTaskId(task.id)
    setTaskNote(task.note || "")
  }

  const saveTaskNote = () => {
    if (noteEditingTaskId && onAddTaskNote) {
      onAddTaskNote(noteEditingTaskId, taskNote)
    }
    setNoteEditingTaskId(null)
    setTaskNote("")
  }

  const cancelAddNote = () => {
    setNoteEditingTaskId(null)
    setTaskNote("")
  }

  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetTask: any) => {
    e.preventDefault()
    if (draggedTask && onReorderTasks && draggedTask.id !== targetTask.id) {
      const newOrder = [...tasks]
      const draggedIndex = newOrder.findIndex(t => t.id === draggedTask.id)
      const targetIndex = newOrder.findIndex(t => t.id === targetTask.id)
      
      // Remove dragged task from its current position
      const [removed] = newOrder.splice(draggedIndex, 1)
      // Insert dragged task at target position
      newOrder.splice(targetIndex, 0, removed)
      
      onReorderTasks(newOrder)
    }
    setDraggedTask(null)
  }

  const cancelTaskEdit = () => {
    setEditingTask(null)
    setEditValue("")
  }



  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDayChange && onDayChange(Math.max(1, currentDay - 1))}
                disabled={currentDay <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Day {currentDay}</span>
                <span className="text-sm text-gray-500">(Month {Math.ceil(currentDay / 30)})</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDayChange && onDayChange(currentDay + 1)}
                disabled={false}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant={completedTasks === totalTasks ? "default" : "secondary"}>
              {completedTasks}/{totalTasks} Complete
            </Badge>
          </div>
          <CardDescription>
            {currentDay === 1 ? "Today's" : `Day ${currentDay}`} marketing tasks. Each task takes ≤ 15 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Overview */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Today's Progress</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-blue-700">{xp} XP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-blue-700">{streak} day streak</span>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-blue-600 mb-2">
              <span>{completedTasks} of {totalTasks} tasks completed</span>
              <span>{Math.round(completionRate)}% complete</span>
            </div>
            
            <div className="text-xs text-blue-600">
              Week Focus: {getWeekFocus(currentDay)}
            </div>
            
            {/* Achievement Indicators */}
            {streak >= 7 && (
              <div className="mt-3 flex items-center space-x-2 text-yellow-700 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-medium">{streak >= 30 ? '🔥 Master Marketer!' : streak >= 14 ? '🚀 Consistent Creator!' : '🔥 7-Day Streak!'}</span>
              </div>
            )}
          </div>

          {/* Enhanced Task List */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No tasks for today yet</p>
                <p className="text-sm">AI-powered tasks will be generated based on your marketing strategy</p>
              </div>
            ) : (
              tasks.map((task, index) => {
                const platformId = detectPlatformId(task)
                const PlatformIcon: any = platformId ? getPlatformIcon(platformId) : null
                return (
                <div
                  key={task.id}
                  className={`group relative transition-all duration-200 ${
                    task.completed
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                      : task.skipped
                        ? "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 opacity-75"
                        : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  } rounded-xl p-4 cursor-move`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, task)}
                >
                  {/* Task Number Badge */}
                  <div className={`absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    task.completed ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex items-start space-x-4">
                    {/* Enhanced Completion Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => !task.completed && !task.skipped && handleCompleteTask(task.id)}
                      className={`p-2 h-auto transition-all duration-200 ${
                        task.completed 
                          ? "bg-green-100 hover:bg-green-200" 
                          : task.skipped ? "bg-gray-100" : "hover:bg-blue-50 hover:scale-110"
                      }`}
                      disabled={task.completed || task.skipped}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      )}
                    </Button>

                    <div className="flex-1 min-w-0">
                      {/* Task Header with Category and Priority */}
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          {editingTaskId === task.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editingTaskTitle}
                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                className="text-sm font-medium"
                                placeholder="Task title"
                                autoFocus
                              />
                              <Input
                                value={editingTaskDescription}
                                onChange={(e) => setEditingTaskDescription(e.target.value)}
                                className="text-sm"
                                placeholder="Task description"
                              />
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={saveTaskEdits}>
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelTaskEdits}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 
                                className={`font-medium cursor-pointer transition-colors ${
                                  task.completed
                                    ? "text-green-800 line-through"
                                    : task.skipped
                                      ? "text-gray-500 line-through"
                                      : "text-gray-900 hover:text-blue-700"
                                }`}
                                onClick={() => !task.completed && startEditTaskDetails(task)}
                              >
                                {task.title}
                              </h3>
                              <p className={`text-sm leading-relaxed ${
                                task.completed ? "text-green-700" : task.skipped ? "text-gray-500" : "text-gray-600"
                              }`}>
                                {task.description}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-2">
                          <Badge variant="secondary" className="text-xs">
                            {task.estimatedTime || "15 min"}
                          </Badge>
                          <Badge variant="outline" className="text-xs flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>+{task.xp || 10} XP</span>
                          </Badge>
                          {onDeleteTask && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onDeleteTask(task.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Edit/Save/Cancel Buttons */}
                      {editingTaskId !== task.id && (
                        <div className="flex space-x-2 mt-2">
                          {onSuggestContent && PlatformIcon && !task.completed && (
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-indigo-600" onClick={() => onSuggestContent(platformId!, task)} title="Create content for this task">
                              <PlatformIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => startEditTaskDetails(task)}>
                            Edit
                          </Button>
                          {onSkipTask && !task.completed && !task.skipped && (
                            <Button size="sm" variant="outline" onClick={() => onSkipTask(task.id)}>
                              Skip
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => startAddNote(task)}>
                            {task.note ? 'Edit Note' : 'Add Note'}
                          </Button>
                        </div>
                      )}
                      
                      {/* Task Note */}
                      {noteEditingTaskId === task.id ? (
                        <div className="mt-3">
                          <textarea
                            value={taskNote}
                            onChange={(e) => setTaskNote(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            rows={3}
                            placeholder="Add a note to this task..."
                          />
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" onClick={saveTaskNote}>
                              Save Note
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelAddNote}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : task.note ? (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Note:</span> {task.note}
                          </p>
                        </div>
                      ) : null}
                      
                      {/* Status & Category Badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {task.skipped && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700">Skipped</Badge>
                        )}
                        {task.completed && (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700">Done</Badge>
                        )}
                        {task.category && (
                          <Badge 
                            className={`text-xs ${getCategoryColor(task.category)}`}
                          >
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </Badge>
                        )}
                      </div>
                      

                    </div>
                  </div>
                </div>
              )})
            )}
          </div>

          {onAddTask && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium text-gray-900">Add Custom Task</h4>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <Input
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Description (optional)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleAddTask}
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {completedTasks === totalTasks && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Awesome! You've completed all tasks for today 🎉</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your streak is now {streak + 1} days. Keep building towards your first 1000 users!
              </p>
              {streak >= 6 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800 font-medium">🎯 Milestone Unlocked!</p>
                  <p className="text-xs text-yellow-700">
                    {streak >= 30 ? "Master Marketer! You've unlocked advanced AI insights and community leaderboard access." :
                     streak >= 14 ? "Consistent Creator! You've unlocked premium content templates." :
                     "Marketing Momentum! You've unlocked AI-powered content suggestions."}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Marketing Journey */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsJourneyCollapsed(!isJourneyCollapsed)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {isJourneyCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-gray-500 rotate-90" />
                )}
              </button>
              <div>
                <CardTitle className="text-xl text-gray-900">
                  🚀 Your Marketing Journey
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Month {Math.ceil(currentDay / 30)} • {getWeekFocus(currentDay)}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline">
              Day {currentDay}
            </Badge>
          </div>
        </CardHeader>
        {!isJourneyCollapsed && (
        <CardContent>
          {/* Goal-Focused Progress - Shareable Design */}
          <div className="space-y-6">
            {/* Main Stats - Clean & Shareable */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-200 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
                <div className="text-sm text-gray-600">Tasks Today</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl border border-green-200 shadow-sm">
                <div className="text-2xl font-bold text-green-600">{streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl border border-purple-200 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{currentDay}</div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl border border-orange-200 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{xp}</div>
                <div className="text-sm text-gray-600">Total XP</div>
              </div>
            </div>
            
            {/* User Goal Progress - Editable & Shareable */}
            <div className="bg-white/80 rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">My Goal</h3>
                  <p className="text-sm text-gray-600">Track your progress toward success</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => {
                      if (confirm('Reset goals to 10x your current baselines from onboarding?')) {
                        // Reset both goals and current values to onboarding baselines and 10x targets
                        setUserGoal(getUserGoal())
                        setRevenueGoal(getRevenueGoal())
                        const cu = parseInt(user?.currentUsers || '0', 10)
                        setCurrentUsers(Number.isFinite(cu) ? cu : 0)
                        const cr = parseFloat(user?.currentMrr || '0')
                        setCurrentRevenue(Number.isFinite(cr) ? cr : 0)
                      }
                    }}
                  >
                    Reset Goals
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setShowEditGoal(!showEditGoal)}
                  >
                    {showEditGoal ? 'Save Goals' : 'Edit Goal'}
                  </Button>
                </div>
              </div>
              
              {/* Visual Progress Rings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-white rounded-lg border">
                  <ProgressRing value={currentUsers} max={userGoal} colorFrom="#3b82f6" colorTo="#6366f1" label="Users" />
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <ProgressRing value={currentRevenue} max={revenueGoal} colorFrom="#10b981" colorTo="#22c55e" label="MRR" sub="MRR" />
                </div>
              </div>

              {/* Goal Options - User can select/edit */}
              <div className="space-y-4">
                {/* Users Goal */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">👥 Users Goal</span>
                    {showEditGoal ? (
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={currentUsers} 
                          onChange={(e) => setCurrentUsers(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs border rounded"
                        />
                        <span className="text-xs text-blue-600">/</span>
                        <span className="text-xs text-blue-600 font-medium">
                          {userGoal.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-blue-600 font-medium">
                        {currentUsers.toLocaleString()} / {userGoal.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((currentUsers / userGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {((currentUsers / userGoal) * 100).toFixed(1)}% complete
                    {currentUsers >= userGoal && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2 text-xs"
                        onClick={() => {
                          const newGoal = prompt('Enter your new user goal:', (userGoal * 2).toString())
                          if (newGoal && !isNaN(Number(newGoal)) && Number(newGoal) > 0) {
                            setUserGoal(Number(newGoal))
                            // Reset current users to 0 for the new goal
                            setCurrentUsers(0)
                            // Update user data in localStorage
                            const userData = localStorage.getItem('user')
                            if (userData) {
                              const parsedUser = JSON.parse(userData)
                              if (parsedUser.goals?.primary?.type === 'users') {
                                parsedUser.goals.primary.target = newGoal
                                localStorage.setItem('user', JSON.stringify(parsedUser))
                              }
                            }
                          }
                        }}
                      >
                        Set New Goal
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Revenue Goal */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">💰 Revenue Goal</span>
                    {showEditGoal ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-600">$</span>
                        <input 
                          type="number" 
                          value={currentRevenue} 
                          onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs border rounded"
                        />
                        <span className="text-xs text-green-600">/ $</span>
                        <span className="text-xs text-green-600 font-medium">
                          {revenueGoal.toLocaleString()}
                        </span>
                        <span className="text-xs text-green-600">MRR</span>
                      </div>
                    ) : (
                      <span className="text-sm text-green-600 font-medium">
                        ${currentRevenue.toLocaleString()} / ${revenueGoal.toLocaleString()} MRR
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((currentRevenue / revenueGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {((currentRevenue / revenueGoal) * 100).toFixed(1)}% complete
                    {currentRevenue >= revenueGoal && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2 text-xs"
                        onClick={() => {
                          const newGoal = prompt('Enter your new revenue goal:', (revenueGoal * 2).toString())
                          if (newGoal && !isNaN(Number(newGoal)) && Number(newGoal) > 0) {
                            setRevenueGoal(Number(newGoal))
                            // Reset current revenue to 0 for the new goal
                            setCurrentRevenue(0)
                            // Update user data in localStorage
                            const userData = localStorage.getItem('user')
                            if (userData) {
                              const parsedUser = JSON.parse(userData)
                              if (parsedUser.goals?.primary?.type === 'revenue') {
                                parsedUser.goals.primary.target = newGoal
                                localStorage.setItem('user', JSON.stringify(parsedUser))
                              }
                            }
                          }
                        }}
                      >
                        Set New Goal
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Share Button */}
              <div className="mt-4 text-center">
                <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setShareTemplate('journey'); setShowShareModal(true) }}>
                  📷 Generate Share Card
                </Button>
              </div>
            </div>
            
            {/* Milestones Section - Achievements Style */}
            <div className="bg-white/80 rounded-xl p-6 border border-gray-200 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">🏆 Milestones</h3>
                  <p className="text-sm text-gray-600">Unlock achievements as you grow</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowAddMilestone(true)}
                >
                  Add Milestone
                </Button>
              </div>
              {/* Achievements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievementPresets.map((m) => {
                  const isCelebrating = celebratingId === m.id
                  return (
                  <div key={m.id} className={`p-4 rounded-xl border shadow-sm transition-all duration-700 ${m.unlocked ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' : 'bg-gray-50 border-gray-200'} ${isCelebrating ? 'rotate-180 ring-4 ring-amber-300 scale-[1.02]' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="text-2xl" aria-hidden>{m.icon}</div>
                      {m.unlocked ? <Badge variant="outline" className="bg-green-100 text-green-700">Unlocked</Badge> : <Badge variant="outline" className="bg-gray-100 text-gray-600">Locked</Badge>}
                    </div>
                    <div className="mt-2">
                      <div className="font-semibold text-gray-900">{m.title}</div>
                      <div className="text-xs text-gray-600">{m.unlocked ? `Unlocked ${new Date().toLocaleDateString()}` : `Progress: ${m.progress}`}</div>
                      <div className="text-xs text-gray-500 mt-2">“{m.blurb}”</div>
                    </div>
                  </div>
                  )
                })}
              </div>

              {/* Custom Milestones - user created */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Your Milestones</h4>
                {milestones.length === 0 ? (
                  <div className="text-xs text-gray-500">You haven’t added any custom milestones yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {milestones.map((m: Milestone) => {
                      const isCelebrating = celebratingId === m.id
                      const isUnlocked = !!m.unlocked
                      return (
                        <div
                          key={m.id || m.title}
                          className={`relative p-4 rounded-xl border shadow-sm transition-all duration-700 transform cursor-pointer ${isUnlocked ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gray-50 border-gray-200'} ${isCelebrating ? 'rotate-180 ring-4 ring-green-300 scale-[1.02]' : ''}`}
                          onClick={() => !isUnlocked && m.id && markCustomMilestoneCompleted(m.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="text-2xl" aria-hidden>{m.emoji || '🏅'}</div>
                            {isUnlocked ? (
                              <Badge variant="outline" className="bg-green-100 text-green-700">Completed</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-600">Locked</Badge>
                            )}
                          </div>
                          <div className="mt-2">
                            <div className="font-semibold text-gray-900 truncate" title={m.title}>{m.title}</div>
                            {m.description && <div className="text-xs text-gray-600 mt-1 truncate" title={m.description}>{m.description}</div>}
                            {(m.progressTarget != null) && (
                              <div className="text-xs text-gray-600 mt-1">
                                Progress: {Math.max(0, Math.round(m.progressCurrent || 0))}{m.unit ? m.unit : ''}/{Math.max(0, Math.round(m.progressTarget))}{m.unit ? m.unit : ''}
                              </div>
                            )}
                            <div className="text-[11px] text-gray-500 mt-1">{new Date(m.date).toLocaleDateString()}</div>
                          </div>
                          {!isUnlocked && (
                            <div className="mt-3">
                              <Button size="sm" className="text-xs" onClick={() => m.id && markCustomMilestoneCompleted(m.id)}>
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

            {/* This Week's Wins */}
            <div className="bg-white/80 rounded-xl p-6 border border-blue-200 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900">🌟 This Week's Wins</h3>
                <Button size="sm" variant="outline" onClick={() => { setShareTemplate('weekly'); setShowShareModal(true) }}>Share My Wins</Button>
              </div>
              <div className="text-sm text-blue-800">
                <div className="mb-2">Tasks completed: {weekDone}/{weekTotal} {weekTotal > 0 && '⭐'}</div>
                <ul className="list-disc ml-5 space-y-1">
                  {(winsGoals.length > 0 ? winsGoals : currentWeekGoals).map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Smart Insights */}
            {streak >= 7 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 text-sm">
                    🎯 Consistency Milestone!
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {streak >= 30 ? "Master level! You're building unstoppable momentum." :
                   streak >= 14 ? "Great consistency! You're developing strong marketing habits." :
                   "You're building momentum! Keep this streak going."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        )}
      </Card>
      
      {/* Add Milestone Modal */}
      {showAddMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Milestone</h3>
              <button
                onClick={() => setShowAddMilestone(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Circle className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Title</label>
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Reached 500 followers"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={newMilestone.emoji}
                    onChange={(e) => setNewMilestone({ ...newMilestone, emoji: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="🏅"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Short blurb for context"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Achieved</label>
                <input
                  type="date"
                  value={newMilestone.date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress (optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={newMilestone.current}
                    onChange={(e) => setNewMilestone({ ...newMilestone, current: e.target.value })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-500">/</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={newMilestone.target}
                    onChange={(e) => setNewMilestone({ ...newMilestone, target: e.target.value })}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="100"
                  />
                  <input
                    type="text"
                    value={newMilestone.unit}
                    onChange={(e) => setNewMilestone({ ...newMilestone, unit: e.target.value })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="unit (e.g. users, $ MRR)"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddMilestone(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMilestone}>
                  Add Milestone
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal with Templates */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generate Shareable Card</DialogTitle>
            <DialogDescription>Pick a template and download an image to post on social.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 space-y-3">
              <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
                <Button variant={shareTemplate==='journey'?'default':'outline'} onClick={() => setShareTemplate('journey')}>Journey</Button>
                <Button variant={shareTemplate==='milestone'?'default':'outline'} onClick={() => setShareTemplate('milestone')}>Milestone</Button>
                <Button variant={shareTemplate==='weekly'?'default':'outline'} onClick={() => setShareTemplate('weekly')}>Weekly Recap</Button>
              </div>
              <div className="pt-2">
                <Button className="w-full" onClick={handleDownloadShareCard}>
                  <Download className="h-4 w-4 mr-2" /> Download Image
                </Button>
              </div>
            </div>
            <div className="md:w-2/3">
              <div ref={shareCardRef} className="relative rounded-2xl border shadow-xl overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
                {shareTemplate === 'journey' && (
                  <div className="space-y-3">
                    <div className="text-sm text-indigo-700">🚀 My Marketing Journey</div>
                    <div className="text-gray-900 text-lg font-semibold">Day {currentDay} of building in public</div>
                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <div>📊 Progress:</div>
                      <div>👥 {currentUsers.toLocaleString()} / {userGoal.toLocaleString()} users</div>
                      <div>💰 ${currentRevenue.toLocaleString()} MRR</div>
                      <div>🔥 {streak}-day streak</div>
                    </div>
                    <div className="mt-3 text-sm text-gray-800">
                      <div className="font-medium mb-1">This week I:</div>
                      <ul className="list-disc ml-5">
                        {(winsGoals.length > 0 ? winsGoals : currentWeekGoals).slice(0,3).map((g, i) => (<li key={i}>{g}</li>))}
                      </ul>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">Building: {user?.productName || 'My Product'} • Track your journey: {typeof window !== 'undefined' ? window.location.origin : ''}/landing</div>
                  </div>
                )}
                {shareTemplate === 'milestone' && (() => {
                  const firstUnlocked = achievementPresets.find(a => a.unlocked)
                  const showcase = firstUnlocked || achievementPresets[0]
                  const nextGoal = userGoal > currentUsers ? `${userGoal.toLocaleString()} users` : `${revenueGoal.toLocaleString()} MRR`
                  return (
                  <div className="space-y-3 text-center">
                    <div className="text-2xl">🎉 MILESTONE!</div>
                    <div className="text-xl font-bold text-gray-900">{showcase.title}</div>
                    <div className="text-sm text-gray-700">{showcase.unlocked ? 'Unlocked' : 'In Progress'} • {showcase.progress}</div>
                    <div className="mt-3 h-24 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg flex items-center justify-center text-indigo-800 text-sm">Growth chart coming soon</div>
                    <div className="text-sm text-gray-800">Next goal: {nextGoal}</div>
                    <div className="mt-3 text-xs text-gray-600">Building: {user?.productName || 'My Product'} • Follow my journey: {typeof window !== 'undefined' ? window.location.origin : ''}/landing</div>
                  </div>)
                })()}
                {shareTemplate === 'weekly' && (
                  <div className="space-y-3">
                    <div className="text-sm text-blue-700">📈 Week {currentWeek} Recap</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-white/70 border">Tasks: {weekDone}/{weekTotal} ⭐</div>
                      <div className="p-2 rounded bg-white/70 border">New users: +{Math.max(0, Math.round(currentUsers/Math.max(1,currentWeek)))}</div>
                      <div className="p-2 rounded bg-white/70 border">Revenue: +${Math.max(0, Math.round(currentRevenue/Math.max(1,currentWeek)))}</div>
                      <div className="p-2 rounded bg-white/70 border">Streak: {streak} days</div>
                    </div>
                    <div className="text-sm text-gray-800">
                      <div className="font-medium mb-1">What worked:</div>
                      <ul className="list-disc ml-5">
                        {(winsGoals.length > 0 ? winsGoals : currentWeekGoals).slice(0,3).map((g, i) => (<li key={i}>{g}</li>))}
                      </ul>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">Building: {user?.productName || 'My Product'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
