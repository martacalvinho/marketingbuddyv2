"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle2, Users } from "lucide-react"
import TaskPanel from "@/components/habits/TaskPanel"
import JourneyPanel from "@/components/habits/JourneyPanel"
import ContentGenerator from "@/components/content-generator"
import MarketingBuddy from "@/components/marketing-buddy"
import { supabase } from "@/lib/supabase"
import { Milestone, useMilestones } from "@/hooks/use-milestones"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import GoalsCard from "@/components/dashboard/GoalsCard"
import WeekLockNotice from "@/components/dashboard/WeekLockNotice"
import ProfileModal from "@/components/dashboard/ProfileModal"
import AddMilestoneDialog from "@/components/dashboard/AddMilestoneDialog"
import WeeklyReviewDialog from "@/components/dashboard/WeeklyReviewDialog"
import LeaderboardDialog from "@/components/dashboard/LeaderboardDialog"
import { parseTasks } from "@/lib/parse-tasks"

interface DashboardViewProps {
  user: any
  onUserRefresh?: () => Promise<void> | void
}

export default function DashboardView({ user, onUserRefresh }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("today")
  const [tasksByDay, setTasksByDay] = useState<Record<number, any[]>>({})
  const [todaysTasks, setTodaysTasks] = useState<any[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [streak, setStreak] = useState(user.streak || 0)
  const [xp, setXp] = useState(user.xp || 0)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const { milestones, setMilestones, refreshMilestones } = useMilestones(user?.id, user.milestones || [])
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [skipCounts, setSkipCounts] = useState<Record<string, number>>({})
  const [avoidPlatforms, setAvoidPlatforms] = useState<string[]>([])
  const [showWeeklyReview, setShowWeeklyReview] = useState(false)
  const [weeklyForm, setWeeklyForm] = useState({
    tractionChannel: "",
    wasteChannel: "",
    focusNextWeek: [] as string[],
    feeling: "7",
    notes: "",
  })
  const [newMilestone, setNewMilestone] = useState<Pick<Milestone, 'title' | 'date'>>({ title: '', date: '' })
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [goalType, setGoalType] = useState<'users' | 'mrr'>(user.goalType || 'users')
  const [goalAmount, setGoalAmount] = useState<string>(user.goalAmount || '')
  const [goalTimeline, setGoalTimeline] = useState<string>(String(user.goalTimeline || '6'))
  const [weekLockMessage, setWeekLockMessage] = useState<string | null>(null)
  const [contentHint, setContentHint] = useState<{ platformId: string; task: any } | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadTasksForDay(currentDay)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDay, user?.id])

  // Prompt for goals if not set yet (post-onboarding simplification)
  useEffect(() => {
    const missingStructuredGoal = !(user.goals && user.goals.primary && user.goals.primary.target)
    const missingFlatGoal = !(user.goalType && user.goalAmount)
    if (missingStructuredGoal && missingFlatGoal) {
      setShowGoalModal(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save goals
  const saveGoals = async () => {
    try {
      const parsedTimeline = parseInt(String(goalTimeline), 10)
      const { error } = await supabase
        .from('onboarding')
        .update({
          goal_type: goalType,
          goal_amount: goalAmount,
          goal_timeline: Number.isFinite(parsedTimeline) ? parsedTimeline : null,
          goals: {
            primary: {
              type: goalType,
              target: goalAmount,
              timeline: String(goalTimeline || '6'),
              startDate: new Date().toISOString(),
              status: 'active'
            }
          }
        })
        .eq('user_id', user.id)

      if (error) throw error
      setShowGoalModal(false)
      loadTasksForDay(currentDay)
    } catch (e) {
      console.error('Failed to save goals:', e)
      setShowGoalModal(false)
    }
  }

  // Ensure a DB row exists then update
  const updateTaskInDB = async (taskId: string | number, updates: any, derive?: (row: any) => any) => {
    try {
      const task = todaysTasks.find((t: any) => t.id === taskId) || (tasksByDay[currentDay] || []).find((t: any) => t.id === taskId)
      if (!task) return
      let dbId = (task as any).db_id
      if (!dbId) {
        const insertPayload: any = {
          user_id: user.id,
          title: task.title,
          description: task.description || null,
          category: task.category || null,
          platform: task.platform || null,
          status: (updates?.status as string) || 'pending',
          metadata: { day: task.day || currentDay }
        }
        const { data: inserted, error: insErr } = await supabase.from('tasks').insert(insertPayload).select('id').single()
        if (insErr) throw insErr
        dbId = inserted?.id
        setTodaysTasks((prev: any[]) => prev.map((t) => t.id === taskId ? { ...t, db_id: dbId } : t))
        setTasksByDay((prev) => ({ ...prev, [currentDay]: (prev[currentDay] || []).map((t: any) => t.id === taskId ? { ...t, db_id: dbId } : t) }))
      }
      let finalUpdates = { ...updates }
      if (derive && dbId) {
        const { data: row, error: rowErr } = await supabase.from('tasks').select('*').eq('id', dbId).single()
        if (!rowErr && row) {
          finalUpdates = { ...finalUpdates, ...derive(row) }
        }
      }
      if (dbId) {
        await supabase.from('tasks').update(finalUpdates).eq('id', dbId)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('updateTaskInDB error:', e)
    }
  }

  const skipTask = (taskId: string | number) => {
    setTodaysTasks((prev: any[]) => prev.map((task: any) => (task.id === taskId ? { ...task, skipped: true } : task)))
    setTasksByDay((prev) => ({
      ...prev,
      [currentDay]: (prev[currentDay] || []).map((t: any) => t.id === taskId ? { ...t, skipped: true, skippedCount: (t.skippedCount || 0) + 1 } : t)
    }))

    const task = todaysTasks.find((t: any) => t.id === taskId)
    if (task) {
      const key = (task.platform || task.title || '').toLowerCase()
      setSkipCounts((prev: Record<string, number>) => ({ ...prev, [key]: (prev[key] || 0) + 1 }))
      updateTaskInDB(taskId, { status: 'skipped', last_status_change: new Date().toISOString() }, (row) => ({ skipped_count: (row?.skipped_count || 0) + 1 }))

      const isReddit = (task.title || '').toLowerCase().includes('reddit') || (task.platform || '').toLowerCase() === 'reddit'
      const count = (skipCounts[key] || 0) + 1
      if (isReddit && count >= 3) {
        const confirmSwitch = typeof window !== 'undefined' ? window.confirm('You seem to skip Reddit tasks. Pause Reddit and try a different channel?') : false
        if (confirmSwitch) {
          setAvoidPlatforms((prev: string[]) => Array.from(new Set([...(prev || []), 'reddit'])))
          const alt = {
            id: `${currentDay + 1}-${Date.now()}-alt`,
            title: 'Try a LinkedIn post instead of Reddit',
            description: 'Share a short LinkedIn post targeting your ideal users. Focus on a key value proposition.',
            xp: 10,
            completed: false,
            estimatedTime: '15 min',
            day: currentDay + 1,
            category: 'content',
            platform: 'linkedin',
          }
          setTasksByDay((prev) => ({ ...prev, [currentDay + 1]: [...(prev[currentDay + 1] || []), alt] }))
        }
      }
    }
  }

  const mapDbTasksToUi = (rows: any[], day: number) => {
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description || '',
      xp: 10,
      completed: r.status === 'completed',
      skipped: r.status === 'skipped',
      estimatedTime: r.estimated_minutes ? `${r.estimated_minutes} min` : '15 min',
      day,
      category: r.category || 'strategy',
      platform: r.platform || undefined,
      note: r.completion_note || undefined,
      db_id: r.id,
    }))
  }

  const checkWeekUnlocked = async (targetWeek: number) => {
    if (targetWeek <= 1) return true
    const prevWeek = targetWeek - 1
    try {
      const { data: rows, error } = await supabase
        .from('tasks')
        .select('id,status,metadata')
        .eq('user_id', user.id)
        .contains('metadata', { week: prevWeek })
      if (error) return false
      const total = rows?.length || 0
      const attempted = rows?.filter((r: any) => r.status === 'completed' || r.status === 'skipped').length || 0
      const attemptedPct = total > 0 ? (attempted / total) : 0
      // Unlock next week based on 50% of previous week attempted (completed or skipped)
      return attemptedPct >= 0.5
    } catch {
      return false
    }
  }

  // Ensure a week's tasks are seeded once unlocked, using adaptive context from prior week
  const ensureWeekSeeded = async (weekNumber: number) => {
    try {
      if (weekNumber <= 1) return
      const { data: existing, error: exErr } = await supabase
        .from('tasks')
        .select('id')
        .eq('user_id', user.id)
        .contains('metadata', { week: weekNumber })
        .limit(1)
      if (!exErr && existing && existing.length > 0) return

      // Build adaptive context from previous week
      const prevWeek = weekNumber - 1
      const startDay = (prevWeek - 1) * 7 + 1
      const endDay = prevWeek * 7
      const { data: prevWeekTasks } = await supabase
        .from('tasks')
        .select('status, category, platform, completed_at, skipped_count')
        .eq('user_id', user.id)
        .gte('metadata->>day', String(startDay))
        .lte('metadata->>day', String(endDay))
      const { data: contentRows } = await supabase
        .from('content')
        .select('platform, engagement_metrics')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)
      const { data: wr } = await supabase
        .from('weekly_reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const weeklyFeedback = wr && wr.length > 0 ? wr[0] : null
      const contextSignals = {
        recentTasks: prevWeekTasks || [],
        content: contentRows || [],
        goals: user.goals || null,
        milestones,
        weeklyFeedback
      }

      // Seed the new week days
      const newStart = (weekNumber - 1) * 7 + 1
      const newEnd = weekNumber * 7
      for (let day = newStart; day <= newEnd; day++) {
        try {
          const month = Math.ceil(day / 30)
          const weekInMonth = Math.ceil((((day - 1) % 30) + 1) / 7)
          const resp = await fetch('/api/generate-enhanced-daily-tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user,
              day,
              month,
              weekInMonth,
              monthStrategy: '',
              focusArea: user.focusArea || 'growth',
              dailyTaskCount: user.dailyTaskCount || '3',
              websiteAnalysis: user.websiteAnalysis,
              contextSignals
            })
          })
          const json = await resp.json()
          const tasks = Array.isArray(json.tasks) ? json.tasks : []
          if (tasks.length > 0) {
            const rows = tasks.map((t: any) => ({
              user_id: user.id,
              title: t.title,
              description: t.description || null,
              category: t.category || null,
              platform: t.platform || null,
              status: 'pending',
              metadata: { day, week: weekNumber, month, source: 'week_seed' }
            }))
            await supabase.from('tasks').insert(rows)
          }
        } catch (seedErr) {
          // eslint-disable-next-line no-console
          console.warn('Failed to seed adaptive week', weekNumber, 'day', day, seedErr)
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('ensureWeekSeeded error:', e)
    }
  }

  const loadTasksForDay = async (day: number) => {
    setWeekLockMessage(null)
    // Enforce gating before any DB read or generation
    const week = Math.ceil(day / 7)
    if (week > 1) {
      const unlocked = await checkWeekUnlocked(week)
      if (!unlocked) {
        setWeekLockMessage(`Week ${week} is locked. Requirement: attempt at least 50% of Week ${week - 1} tasks to unlock.`)
        setTasksByDay((prev) => ({ ...prev, [day]: [] }))
        setTodaysTasks([])
        return
      }
      // If unlocked and not yet seeded, seed this week adaptively
      await ensureWeekSeeded(week)
    }
    // Always try to load from DB first for the given day
    const planText = typeof user.plan === 'string' ? user.plan : (user.plan?.markdown || '')
    const desiredDailyCountParsed = parseInt(String(user?.dailyTaskCount ?? '3'), 10)
    const desiredDailyCount = Number.isFinite(desiredDailyCountParsed) && desiredDailyCountParsed > 0 ? desiredDailyCountParsed : 3
    try {
      const { data: dbRows } = await supabase
        .from('tasks')
        .select('id,title,description,category,platform,status,metadata,estimated_minutes,completed_at')
        .eq('user_id', user.id)
        .filter('metadata->>day', 'eq', String(day))
        .order('created_at', { ascending: true })
      if (dbRows && dbRows.length > 0) {
        const ui = mapDbTasksToUi(dbRows, day)
        setTasksByDay((prev) => ({ ...prev, [day]: ui }))
        setTodaysTasks(ui)
        return
      }
    } catch {}
    
    // Try to use plan for first 30 days
    if (planText) {
      try {
        // Convert day to month and week context for 6-month plan
        const month = Math.ceil(day / 30) // Roughly 30 days per month
        const dayInMonth = ((day - 1) % 30) + 1
        const weekInMonth = Math.ceil(dayInMonth / 7)
        
        // Try multiple parsing strategies for the new 6-month format
        let tasks: any[] = []
        
        // Strategy 1: Look for specific day tasks in Month X format
        const dayRegex = new RegExp(`###\\s*Day\\s*${day}[^\\n]*\\n([\\s\\S]*?)(?=###\\s*Day\\s*${day + 1}|###\\s*Month|$)`, 'i')
        const dayMatch = planText.match(dayRegex)
        
        if (dayMatch) {
          tasks = parseTasks(dayMatch[1], day)
          // parsed from Day section
        } else {
          // Strategy 2: Look for Month X and extract daily tasks from week content
          const monthRegex = new RegExp(`###\\s*Month\\s*${month}[^\\n]*\\n([\\s\\S]*?)(?=###\\s*Month\\s*${month + 1}|$)`, 'i')
          const monthMatch = planText.match(monthRegex)
          
          if (monthMatch) {
            // Look for Week X content within the month
            const weekRegex = new RegExp(`Week\\s*${week}[^\\n]*([\\s\\S]*?)(?=Week\\s*${week + 1}|###|$)`, 'i')
            const weekMatch = monthMatch[1].match(weekRegex)
          
            if (weekMatch) {
              const rawWeekTasks = parseTasks(weekMatch[1], day, desiredDailyCount * 7)
              const dayIndexInWeek = (day - 1) % 7
              const startIndex = dayIndexInWeek * desiredDailyCount
              tasks = rawWeekTasks.length >= startIndex + desiredDailyCount
                ? rawWeekTasks.slice(startIndex, startIndex + desiredDailyCount)
                : []
            } else {
              // Fallback: Extract any tasks from the month content
              const rawMonthTasks = parseTasks(monthMatch[1], day, desiredDailyCount * 30)
              const dayIndexInMonth = ((day - 1) % 30)
              const startIndex = dayIndexInMonth * desiredDailyCount
              tasks = rawMonthTasks.length >= startIndex + desiredDailyCount
                ? rawMonthTasks.slice(startIndex, startIndex + desiredDailyCount)
                : []
            }
          }
          // parsed from Month/Week fallback
        }
        
        if (tasks.length > 0) {
          // Persist parsed tasks so future loads use DB
          // Deduplicate by title within parsed tasks
          const uniqueLocal = Array.from(new Map(tasks.map((t: any) => [t.title + '|' + (t.description || ''), t])).values())
          try {
            const rows = uniqueLocal.map((t: any) => ({
              user_id: user.id,
              title: t.title,
              description: t.description || null,
              category: t.category || null,
              platform: t.platform || null,
              status: 'pending',
              metadata: { day, week: Math.ceil(day / 7), month, source: 'plan_parse' }
            }))
            const { data: inserted } = await supabase.from('tasks').insert(rows).select('*')
            const ui = inserted ? mapDbTasksToUi(inserted, day) : uniqueLocal
            setTasksByDay((prev) => ({ ...prev, [day]: ui }))
            setTodaysTasks(ui)
          } catch {
            setTasksByDay((prev) => ({ ...prev, [day]: uniqueLocal }))
            setTodaysTasks(uniqueLocal)
          }
          return
        }
      } catch (e) {
        // ignore parse errors and continue to generation
      }
    }

    // If no tasks found, generate daily tasks (context-aware for week > 1)
    const month = Math.ceil(day / 30)
    const weekInMonth = Math.ceil(((day - 1) % 30 + 1) / 7)
    
    // Generate tasks for this day and persist to DB
    try {
      // Build context signals from recent activity
      let contextSignals: any = {}
      try {
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        const { data: recentTasks } = await supabase
          .from('tasks')
          .select('status, category, platform, completed_at, skipped_count')
          .eq('user_id', user.id)
          .gte('completed_at', twoWeeksAgo)
        const { data: contentRows } = await supabase
          .from('content')
          .select('platform, engagement_metrics')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100)
        const { data: ob } = await supabase
          .from('onboarding')
          .select('goals, data')
          .eq('user_id', user.id)
          .single()
        const { data: wr } = await supabase
          .from('weekly_reviews')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
        contextSignals = { recentTasks: recentTasks || [], content: contentRows || [], goals: ob?.goals || null, milestones, weeklyFeedback: wr && wr.length > 0 ? wr[0] : null }
      } catch {}

      const apiEndpoint = user.focusArea ? '/api/generate-enhanced-daily-tasks' : '/api/generate-daily-tasks'
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, day, month, weekInMonth, monthStrategy: '', focusArea: user.focusArea || 'growth', dailyTaskCount: user.dailyTaskCount || '3', websiteAnalysis: user.websiteAnalysis, contextSignals })
      })
      const data = await response.json()
      let generatedTasks = Array.isArray(data.tasks) ? data.tasks : []
      if (!Array.isArray(data.tasks) && data.tasks) {
        generatedTasks = parseTasks(String(data.tasks), day)
      }
      // Deduplicate by title+description
      const uniqueGen = Array.from(new Map(generatedTasks.map((t: any) => [String(t.title) + '|' + String(t.description || ''), t])).values())
      if (uniqueGen.length > 0) {
        const rows = uniqueGen.map((t: any) => ({
          user_id: user.id,
          title: t.title,
          description: t.description || null,
          category: t.category || null,
          platform: t.platform || null,
          status: 'pending',
          metadata: t.metadata || { day, week, month, source: 'on_demand', algorithm_version: 'v2_adaptive' }
        }))
        const { data: inserted } = await supabase.from('tasks').insert(rows).select('*')
        const ui = inserted ? mapDbTasksToUi(inserted, day) : uniqueGen
        setTasksByDay((prev) => ({ ...prev, [day]: ui }))
        setTodaysTasks(ui)
        return
      }
    } catch (e) {
      // ignore generation errors and fall back to empty
    }

    // fallback empty
    setTasksByDay((prev) => ({ ...prev, [day]: [] }))
    setTodaysTasks([])
  }



  const addTask = (title: string, description: string) => {
    const newTask = {
      id: `${currentDay}-${Date.now()}`,
      title,
      description,
      xp: 10,
      completed: false,
      estimatedTime: "15 min",
      day: currentDay,
      custom: true,
    }
    setTodaysTasks((prev: any[]) => [...prev, newTask])
    setTasksByDay((prev) => ({ ...prev, [currentDay]: [...(prev[currentDay] || []), newTask] }))
  }

  const deleteTask = (taskId: string | number) => {
    setTodaysTasks((prev: any[]) => prev.filter((t) => t.id !== taskId))
    setTasksByDay((prev) => ({ ...prev, [currentDay]: (prev[currentDay] || []).filter((t: any) => t.id !== taskId) }))
  }

  const updateTask = (taskId: string | number, updates: Partial<any>) => {
    setTodaysTasks((prev: any[]) => prev.map((task: any) => task.id === taskId ? { ...task, ...updates } : task))
    setTasksByDay((prev) => ({
      ...prev,
      [currentDay]: (prev[currentDay] || []).map((t: any) => t.id === taskId ? { ...t, ...updates } : t)
    }))
  }

  const reorderTasks = (newOrder: any[]) => {
    setTodaysTasks(newOrder)
    setTasksByDay((prev) => ({ ...prev, [currentDay]: newOrder }))
  }

  const addTaskNote = (taskId: string | number, note: string) => {
    updateTask(taskId, { note })
    // Persist note to DB
    updateTaskInDB(taskId, { completion_note: note })
  }

  interface WeekInfo { total: number; done: number; goals: string[] }

  const weekStats = useMemo<WeekInfo[]>(() => {
    const stats: WeekInfo[] = []
    for (let w = 0; w < 4; w++) {
      const start = w * 7 + 1
      const days = Array.from({ length: 7 }, (_, i) => start + i)
      let total = 0
      let done = 0
      const goalsSet = new Set<string>()
      days.forEach((d) => {
        const tasks = tasksByDay[d] || []
        total += tasks.length
        done += tasks.filter((t: any) => t.completed).length
        tasks.forEach((t: any) => goalsSet.add(t.title))
      })
      stats.push({ total, done, goals: Array.from(goalsSet) })
    }
    return stats
  }, [tasksByDay])

  const completeTask = (taskId: string | number) => {
    setTodaysTasks((prev: any[]) => prev.map((task: any) => (task.id === taskId ? { ...task, completed: true } : task)))
    setTasksByDay((prev) => ({
      ...prev,
      [currentDay]: (prev[currentDay] || []).map((t: any) => t.id === taskId ? { ...t, completed: true } : t)
    }))

    const task = todaysTasks.find((t: any) => t.id === taskId)
    if (task) {
      setXp((prev: any) => prev + task.xp)

      // Check if all tasks completed for streak
      const completedCount = todaysTasks.filter((t: any) => t.completed || t.id === taskId).length
      if (completedCount === todaysTasks.length) {
        setStreak((prev: any) => prev + 1)
      }

      // Persist completion to DB
      updateTaskInDB(taskId, { status: 'completed', completed_at: new Date().toISOString(), last_status_change: new Date().toISOString() })

      // Simple follow-up rules
      const title = (task.title || '').toLowerCase()
      const note = (task.note || '').toLowerCase()
      if (title.includes('reddit') && (note.includes('upvote') || note.includes('positive') || note.includes('good'))) {
        const followUp = {
          id: `${currentDay + 1}-${Date.now()}-reddit-followup`,
          title: 'Post in 2 more relevant subreddits',
          description: 'Double down on Reddit traction by posting in 2 additional subreddits where your audience hangs out.',
          xp: 10,
          completed: false,
          estimatedTime: '15 min',
          day: currentDay + 1,
          category: 'community',
          platform: 'reddit',
        }
        setTasksByDay((prev) => ({ ...prev, [currentDay + 1]: [...(prev[currentDay + 1] || []), followUp] }))
      }
      if (title.includes('twitter thread')) {
        const followUp = {
          id: `${currentDay + 1}-${Date.now()}-repurpose`,
          title: 'Turn your Twitter thread into a blog post',
          description: 'Repurpose the thread into a concise blog for SEO and longer-form readers.',
          xp: 10,
          completed: false,
          estimatedTime: '15 min',
          day: currentDay + 1,
          category: 'content',
          platform: 'blog',
        }
        setTasksByDay((prev) => ({ ...prev, [currentDay + 1]: [...(prev[currentDay + 1] || []), followUp] }))
      }
    }
  }



  // Milestone functions
  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim() || !newMilestone.date || !user?.id) return
    try {
      const payload: any = {
        user_id: user.id,
        title: newMilestone.title,
        date: newMilestone.date,
        type: 'user_added',
        unlocked: true
      }
      const { data, error } = await supabase.from('milestones').insert(payload).select('*').single()
      if (!error && data) {
        setMilestones((prev) => [...prev, data as Milestone])
        await refreshMilestones()
      }
    } catch {}
    setNewMilestone({ title: '', date: '' })
    setShowAddMilestone(false)
  }

  const xpToNextLevel = 100
  const currentLevel = Math.floor(xp / xpToNextLevel) + 1
  const xpProgress = useMemo(() => ((xp % xpToNextLevel) / xpToNextLevel) * 100, [xp])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30">
      <DashboardHeader
        productName={user.productName}
        streak={streak}
        xp={xp}
        xpToNextLevel={xpToNextLevel}
        currentLevel={currentLevel}
        xpProgress={xpProgress}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Simplified MVP Navigation */}
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto bg-white rounded-3xl p-1.5 shadow-sm border border-gray-100">
            <TabsTrigger value="today" className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Today's Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>My Journey</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Create Content</span>
            </TabsTrigger>
            <TabsTrigger value="buddy" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>My Buddy</span>
            </TabsTrigger>
          </TabsList>

          {/* MVP Tab 1: Today's Tasks - Core daily habit system */}
          <TabsContent value="today">
            <div className="space-y-6">
              {/* Enhanced header with clear value proposition */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Daily Marketing System</h2>
                <div className="max-w-2xl mx-auto">
                  <p className="text-gray-600 mb-4">Complete your daily tasks to build consistent marketing habits that grow your business.</p>
                </div>
              </div>
              
              {/* Growth Goals Tracking */}
              {(user.goals?.primary?.type && user.goals?.primary?.target) || (user.goalType && user.goalAmount) && (
                <GoalsCard user={user} currentDay={currentDay} milestones={milestones} onAddClick={() => setShowAddMilestone(true)} />
              )}
              
              {/* Week Lock Notice */}
              {weekLockMessage && (
                <WeekLockNotice
                  message={weekLockMessage}
                  onOpenWeeklyReview={() => setShowWeeklyReview(true)}
                  onRetry={() => loadTasksForDay(currentDay)}
                />
              )}

              <TaskPanel
                tasks={todaysTasks}
                currentDay={currentDay}
                streak={streak}
                onDayChange={setCurrentDay}
                onCompleteTask={completeTask}
                onDeleteTask={deleteTask}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onReorderTasks={reorderTasks}
                onAddTaskNote={addTaskNote}
                onSkipTask={skipTask}
                onSuggestContent={(platformId, task) => {
                  setContentHint({ platformId, task })
                  setActiveTab('create')
                }}
                onTaskUpdate={() => {}}
              />
              

            </div>
          </TabsContent>

          {/* MVP Tab 1.5: My Journey - moved from under tasks */}
          <TabsContent value="journey">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Marketing Journey</h2>
              </div>
              <JourneyPanel
                streak={streak}
                xp={xp}
                currentDay={currentDay}
                user={user}
                weekStats={weekStats}
                milestones={milestones}
                applyMilestonesChange={setMilestones}
                onRefreshMilestones={refreshMilestones}
                completedTasks={todaysTasks.filter(t => t.completed).length}
                totalTasks={todaysTasks.length}
              />
            </div>
          </TabsContent>

          {/* MVP Tab 2: Create Content - Direct connection to daily tasks */}
          <TabsContent value="create">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Content from Your Tasks</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Turn your completed daily tasks into high-converting content across multiple platforms.
                </p>
              </div>
              
              <ContentGenerator 
                user={user} 
                dailyTasks={todaysTasks}
                onTaskUpdate={() => {
                  loadTasksForDay(currentDay)
                }}
                initialPlatformId={contentHint?.platformId}
                initialSelectedTask={contentHint?.task}
              />
              
              {/* Integrated learning tips */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Content Tip</h3>
                <p className="text-blue-800 text-sm">
                  Your most engaging content comes from documenting your daily marketing journey. 
                  Share what you're learning, testing, and discovering.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* MVP Tab 3: Marketing Buddy - Accountability coming soon preview */}
          <TabsContent value="buddy">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Marketing Buddy</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Accountability coming soon. Preview how you'll check in on your buddy's tasks, website, progress, milestones, and content.
                </p>
              </div>

              <MarketingBuddy user={user} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onSignOut={() => {
          localStorage.clear()
          window.location.href = '/landing'
        }}
        onUpdateProfile={async (updates: any) => {
          try {
            const payload: any = {}
            if ('productName' in updates) payload.product_name = updates.productName
            if ('valueProp' in updates) payload.value_prop = updates.valueProp
            if ('website' in updates) payload.website = updates.website
            if ('websiteAnalysis' in updates) payload.website_analysis = updates.websiteAnalysis
            if ('plan' in updates) payload.plan = updates.plan
            if (Object.keys(payload).length > 0) {
              const { error } = await supabase
                .from('onboarding')
                .update(payload)
                .eq('user_id', user.id)
              if (error) throw error
            }
          } catch (e) {
            console.error('Failed to update profile in Supabase:', e)
          }
          if (updates.plan) {
            loadTasksForDay(currentDay)
          }
          setShowProfileModal(false)
          window.location.reload()
        }}
      />

      <AddMilestoneDialog
        open={showAddMilestone}
        onOpenChange={setShowAddMilestone}
        newMilestone={newMilestone}
        onTitleChange={(v) => setNewMilestone({ ...newMilestone, title: v })}
        onDateChange={(v) => setNewMilestone({ ...newMilestone, date: v })}
        onAdd={handleAddMilestone}
      />

      <WeeklyReviewDialog
        open={showWeeklyReview}
        onOpenChange={setShowWeeklyReview}
        weeklyForm={weeklyForm}
        onUpdateField={(field, value) => {
          if (field === 'focusNextWeek') {
            setWeeklyForm({ ...weeklyForm, focusNextWeek: value.split(',').map(s => s.trim()).filter(Boolean) })
          } else {
            setWeeklyForm({ ...weeklyForm, [field]: value } as any)
          }
        }}
        onSave={async () => {
          try {
            const weekStart = new Date()
            const day = weekStart.getDay()
            const diff = (day === 0 ? -6 : 1) - day
            weekStart.setDate(weekStart.getDate() + diff)
            const payload: any = {
              user_id: user.id,
              week_start_date: weekStart.toISOString().slice(0,10),
              traction_channel: weeklyForm.tractionChannel || null,
              waste_channel: weeklyForm.wasteChannel || null,
              focus_next_week: weeklyForm.focusNextWeek.length ? weeklyForm.focusNextWeek : null,
              feeling: parseInt(weeklyForm.feeling) || null,
              notes: weeklyForm.notes || null,
            }
            const { error } = await supabase.from('weekly_reviews').insert(payload)
            if (!error) {
              setXp((prev: number) => prev + 50)
            }
          } catch (e) {
            console.warn('Failed to save weekly review:', e)
          } finally {
            setShowWeeklyReview(false)
          }
        }}
      />

      <LeaderboardDialog open={showLeaderboardModal} onOpenChange={setShowLeaderboardModal} />
    </div>
  )
}
