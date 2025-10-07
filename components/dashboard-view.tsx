"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flame, Target, Calendar, BookOpen, MessageCircle, CheckCircle2, Zap, TrendingUp, BarChart3, X, Users, Trophy, Heart, Plus } from "lucide-react"
import HabitTracker from "@/components/habit-tracker"
import ContentGenerator from "@/components/content-generator"
import ContentLibrary from "@/components/content-library"
import BuddySystem from "@/components/buddy-system"
import WebsiteAnalysis from "@/components/website-analysis"
import LearnSection from "@/components/learn-section"
import MarketingBuddy from "@/components/marketing-buddy"
import MarketingAnalytics from "@/components/marketing-analytics"
import UserProfile from "@/components/user-profile"
import { supabase } from "@/lib/supabase"

interface DashboardViewProps {
  user: any
}

export default function DashboardView({ user }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("today")
  const [tasksByDay, setTasksByDay] = useState<Record<number, any[]>>({})
  const [todaysTasks, setTodaysTasks] = useState<any[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [streak, setStreak] = useState(user.streak || 0)
  const [xp, setXp] = useState(user.xp || 0)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [milestones, setMilestones] = useState(user.milestones || [])
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
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '' })
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [goalType, setGoalType] = useState<'users' | 'mrr'>(user.goalType || 'users')
  const [goalAmount, setGoalAmount] = useState<string>(user.goalAmount || '')
  const [goalTimeline, setGoalTimeline] = useState<string>(String(user.goalTimeline || '6'))
  const [weekLockMessage, setWeekLockMessage] = useState<string | null>(null)
  const [contentHint, setContentHint] = useState<{ platformId: string; task: any } | null>(null)

  useEffect(() => {
    loadTasksForDay(currentDay)
  }, [currentDay])

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
      // Weekly review exists?
      const { data: wr } = await supabase
        .from('weekly_reviews')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
      const hasReview = !!(wr && wr.length > 0)
      // Content created?
      const { data: contentRows } = await supabase
        .from('content')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
      const hasContent = !!(contentRows && contentRows.length > 0)
      return attemptedPct >= 0.5 && hasReview && hasContent
    } catch {
      return false
    }
  }

  const loadTasksForDay = async (day: number) => {
    setWeekLockMessage(null)
    // Enforce gating before any DB read or generation
    const week = Math.ceil(day / 7)
    if (week > 1) {
      const unlocked = await checkWeekUnlocked(week)
      if (!unlocked) {
        setWeekLockMessage(`Week ${week} is locked. Requirements: attempt at least 50% of Week ${week - 1} tasks, create at least one piece of content, and complete a Weekly Review. Once done, check again to unlock personalized Week ${week} tasks.`)
        setTasksByDay((prev) => ({ ...prev, [day]: [] }))
        setTodaysTasks([])
        return
      }
    }
    // Load from DB first
    try {
      const { data: dbRows, error } = await supabase
        .from('tasks')
        .select('id,title,description,category,platform,status,metadata,estimated_minutes,completed_at,completion_note')
        .eq('user_id', user.id)
        .contains('metadata', { day })
        .order('created_at', { ascending: true })
      if (!error && dbRows && dbRows.length > 0) {
        const ui = mapDbTasksToUi(dbRows, day)
        setTasksByDay((prev) => ({ ...prev, [day]: ui }))
        setTodaysTasks(ui)
        return
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed loading tasks from DB:', e)
    }
    // Gating already enforced above before DB read
    if (user.plan) {
      // Convert day to month and week context for 6-month plan
      const month = Math.ceil(day / 30) // Roughly 30 days per month
      const dayInMonth = ((day - 1) % 30) + 1
      const weekInMonth = Math.ceil(dayInMonth / 7)
      
      // Try multiple parsing strategies for the new 6-month format
      let tasks: any[] = []
      
      // Strategy 1: Look for specific day tasks in Month X format
      const dayRegex = new RegExp(`###\\s*Day\\s*${day}[^\\n]*\\n([\\s\\S]*?)(?=###\\s*Day\\s*${day + 1}|###\\s*Month|$)`, 'i')
      const dayMatch = user.plan.match(dayRegex)
      
      if (dayMatch) {
        tasks = parseTasks(dayMatch[1], day)
      } else {
        // Strategy 2: Look for Month X and extract daily tasks from week content
        const monthRegex = new RegExp(`###\\s*Month\\s*${month}[^\\n]*\\n([\\s\\S]*?)(?=###\\s*Month\\s*${month + 1}|$)`, 'i')
        const monthMatch = user.plan.match(monthRegex)
        
        if (monthMatch) {
          // Look for Week X content within the month
          const weekRegex = new RegExp(`Week\\s*${week}[^\\n]*([\\s\\S]*?)(?=Week\\s*${week + 1}|###|$)`, 'i')
          const weekMatch = monthMatch[1].match(weekRegex)
          
          if (weekMatch) {
            tasks = parseTasks(weekMatch[1], day)
          } else {
            // Fallback: Extract any tasks from the month content
            tasks = parseTasks(monthMatch[1], day, 3) // Limit to 3 tasks per day
          }
        }
      }
      
      if (tasks.length > 0) {
        // Persist parsed tasks so future loads use DB
        try {
          const rows = tasks.map((t: any) => ({
            user_id: user.id,
            title: t.title,
            description: t.description || null,
            category: t.category || null,
            platform: t.platform || null,
            status: 'pending',
            metadata: { day, week: Math.ceil(day / 7), month, source: 'plan_parse' }
          }))
          const { data: inserted } = await supabase.from('tasks').insert(rows).select('*')
          const ui = inserted ? mapDbTasksToUi(inserted, day) : tasks
          setTasksByDay((prev) => ({ ...prev, [day]: ui }))
          setTodaysTasks(ui)
        } catch {
          setTasksByDay((prev) => ({ ...prev, [day]: tasks }))
          setTodaysTasks(tasks)
        }
        return
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
        contextSignals = { recentTasks: recentTasks || [], content: contentRows || [], goals: ob?.goals || null, milestones }
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
      if (generatedTasks.length > 0) {
        const rows = generatedTasks.map((t: any) => ({
          user_id: user.id,
          title: t.title,
          description: t.description || null,
          category: t.category || null,
          platform: t.platform || null,
          status: 'pending',
          metadata: { day, week, month, source: 'on_demand' }
        }))
        const { data: inserted } = await supabase.from('tasks').insert(rows).select('*')
        const ui = inserted ? mapDbTasksToUi(inserted, day) : generatedTasks
        setTasksByDay((prev) => ({ ...prev, [day]: ui }))
        setTodaysTasks(ui)
        return
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Task generation failed:', e)
    }

    // fallback empty
    setTasksByDay((prev) => ({ ...prev, [day]: [] }))
    setTodaysTasks([])
  }

  const parseTasks = (content: string, day: number, limit: number = 3) => {
    // Extract tasks from various formats
    const taskPatterns = [
      /- \*\*Task \d+:\*\*\s*([\s\S]+?)(?=\n- \*\*Task|###|$)/g,  // - **Task X:** format with metadata
      /- \*\*Task \d+:\*\*\s*(.+)/g,  // - **Task X:** format
      /- (.+?)(?=\n|$)/g,              // Simple bullet points
      /\*\*Task \d+:\*\*\s*(.+)/g,    // **Task X:** format
      /\d+\.\s*(.+?)(?=\n|$)/g        // Numbered list format
    ]
    
    let tasks: any[] = []
    
    // Try each pattern in order, but only use the first one that matches
    for (const pattern of taskPatterns) {
      const matches = Array.from(content.matchAll(pattern))
      if (matches.length > 0) {
        tasks = matches.slice(0, limit).map((match, idx) => {
          let taskContent = match[1].trim()
          
          // Clean up formatting
          taskContent = taskContent.replace(/\*\*/g, '').replace(/\*/g, '')
          
          // Split on first colon to separate title from description
          const colonIndex = taskContent.indexOf(':')
          let title = taskContent
          let description = ''
          
          if (colonIndex > 0 && colonIndex < 80) {
            title = taskContent.substring(0, colonIndex).trim()
            description = taskContent.substring(colonIndex + 1).trim()
          } else {
            // If no colon found, use the content as title and leave description empty
            title = taskContent
            description = ''
          }
          
          // Extract metadata from task content
          let category: 'content' | 'analytics' | 'community' | 'strategy' | 'engagement' = 'strategy'
          let impact = 'Builds foundational marketing skills'
          let tips: string[] = []
          
          // Extract category
          const categoryMatch = taskContent.match(/-\s*Category:\s*(\w+)/i)
          if (categoryMatch) {
            const categoryValue = categoryMatch[1].toLowerCase()
            if (['content', 'analytics', 'community', 'strategy', 'engagement'].includes(categoryValue)) {
              category = categoryValue as 'content' | 'analytics' | 'community' | 'strategy' | 'engagement'
            }
          }
          
          // Extract impact
          const impactMatch = taskContent.match(/-\s*Impact:\s*(.+?)(?=\n|$)/i)
          if (impactMatch) {
            impact = impactMatch[1].trim()
          }
          
          // Extract tips
          const tipsMatch = taskContent.match(/-\s*Tips:\s*(.+?)(?=\n|$)/i)
          if (tipsMatch) {
            tips = tipsMatch[1].split(',').map(tip => tip.trim()).filter(tip => tip.length > 0)
          }
          
          // Fallback: Determine category based on task content if not provided
          if (category === 'strategy') {
            const lowerTitle = title.toLowerCase()
            const lowerDescription = description.toLowerCase()
            const contentText = lowerTitle + ' ' + lowerDescription
            
            if (contentText.includes('post') || contentText.includes('content') || contentText.includes('create') || contentText.includes('write') || contentText.includes('publish')) {
              category = 'content'
            } else if (contentText.includes('analyze') || contentText.includes('track') || contentText.includes('metric') || contentText.includes('data') || contentText.includes('insight')) {
              category = 'analytics'
            } else if (contentText.includes('engage') || contentText.includes('comment') || contentText.includes('respond') || contentText.includes('community') || contentText.includes('follower')) {
              category = 'community'
            } else if (contentText.includes('optimize') || contentText.includes('improve') || contentText.includes('strategy') || contentText.includes('plan')) {
              category = 'strategy'
            } else if (contentText.includes('share') || contentText.includes('like') || contentText.includes('follow') || contentText.includes('interact')) {
              category = 'engagement'
            }
          }
          

          
          // Fallback: Determine impact based on task content if not provided
          if (impact === 'Builds foundational marketing skills') {
            const lowerTitle = title.toLowerCase()
            const lowerDescription = description.toLowerCase()
            const contentText = lowerTitle + ' ' + lowerDescription
            
            if (contentText.includes('growth') || contentText.includes('increase') || contentText.includes('boost')) {
              impact = 'Drives user growth and engagement'
            } else if (contentText.includes('brand') || contentText.includes('awareness')) {
              impact = 'Increases brand visibility and recognition'
            } else if (contentText.includes('conversion') || contentText.includes('revenue')) {
              impact = 'Improves conversion rates and revenue'
            } else if (contentText.includes('retention') || contentText.includes('loyalty')) {
              impact = 'Enhances user retention and loyalty'
            }
          }
          
          // Fallback: Generate tips based on category if not provided
          if (tips.length === 0) {
            switch (category) {
              case 'content':
                tips = [
                  'Focus on providing value to your audience',
                  'Use relevant hashtags to increase discoverability',
                  'Include a clear call-to-action to drive engagement'
                ]
                break
              case 'analytics':
                tips = [
                  'Look for patterns in your data, not just numbers',
                  'Compare metrics to previous periods for context',
                  'Use insights to inform your next content strategy'
                ]
                break
              case 'community':
                tips = [
                  'Be authentic and genuine in your interactions',
                  'Ask questions to encourage responses',
                  'Show appreciation for community contributions'
                ]
                break
              case 'strategy':
                tips = [
                  'Align tasks with your long-term business goals',
                  'Document your learnings for future reference',
                  'Be flexible and adapt based on results'
                ]
                break
              case 'engagement':
                tips = [
                  'Respond promptly to comments and messages',
                  'Personalize your interactions when possible',
                  'Share content that sparks conversation'
                ]
                break
            }
          }
          
          return {
            id: `${day}-${idx + 1}`,
            title: title,
            description: description,
            xp: 10,
            completed: false,
            estimatedTime: "15 min",
            day: day,
            month: Math.ceil(day / 30),
            week: Math.ceil(((day - 1) % 30 + 1) / 7),
            category,
            impact,
            tips
          }
        })
        // Break after first successful pattern to avoid duplicates
        break
      }
    }
    
    // Deduplicate tasks by title to prevent any possible duplicates
    const uniqueTasks = tasks.filter((task, index, self) => 
      index === self.findIndex(t => t.title === task.title && t.description === task.description)
    )
    
    return uniqueTasks
  }

  const generateDailyTasksForMonth = async (day: number, month: number, weekInMonth: number) => {
    try {
      // Extract month strategy from user plan
      const monthRegex = new RegExp(`###\\s*Month\\s*${month}[^\n]*\n([\\s\\S]*?)(?=###\\s*Month\\s*${month + 1}|$)`, 'i')
      const monthMatch = user.plan?.match(monthRegex)
      const monthStrategy = monthMatch ? monthMatch[1].substring(0, 1000) : ''
      
      // Use enhanced task generation if user has onboarding data
      const apiEndpoint = user.focusArea ? '/api/generate-enhanced-daily-tasks' : '/api/generate-daily-tasks'
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          day,
          month,
          weekInMonth,
          monthStrategy,
          focusArea: user.focusArea || 'growth',
          dailyTaskCount: user.dailyTaskCount || '3',
          websiteAnalysis: user.websiteAnalysis
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.tasks) {
        let generatedTasks = data.tasks
        
        // If using enhanced generation, tasks are already formatted
        if (!user.focusArea) {
          generatedTasks = parseTasks(data.tasks, day)
        }
        
        if (generatedTasks.length > 0) {
          setTasksByDay((prev) => ({ ...prev, [day]: generatedTasks }))
          setTodaysTasks(generatedTasks)
          
          // Check for website task completion notification
          if (data.allWebsiteTasksCompleted && !user.websiteTasksCompletedNotified) {
            // Show notification that all website tasks are complete
            const updatedUser = { ...user, websiteTasksCompletedNotified: true }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            
            // You could show a toast notification here
            console.log('🎉 All website improvement tasks completed! Now focusing on growth and marketing.')
          }
          
          // Update user plan if using old generation method
          if (!user.focusArea && data.tasks) {
            const updatedPlan = user.plan + '\n\n' + data.tasks
            const updatedUser = { ...user, plan: updatedPlan }
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate daily tasks for month:', error)
      // Fallback to empty tasks
      setTasksByDay((prev) => ({ ...prev, [day]: [] }))
      setTodaysTasks([])
    }
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

  const getWeekStats = (): WeekInfo[] => {
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
  }

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

  const handleReAnalyze = async (websiteUrl: string) => {
    try {
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteUrl }),
      })
      
      if (response.ok) {
        const analysisData = await response.json()
        // Update user data with new analysis
        // This would typically update the user state or trigger a refresh
        window.location.reload() // Simple refresh for now
      } else {
        console.error('Failed to re-analyze website')
      }
    } catch (error) {
      console.error('Error re-analyzing website:', error)
    }
  }

  // Milestone functions
  const handleAddMilestone = () => {
    if (newMilestone.title.trim() && newMilestone.date) {
      const updatedMilestones = [...milestones, { 
        ...newMilestone, 
        id: Date.now().toString(),
        date: newMilestone.date 
      }]
      setMilestones(updatedMilestones)
      // TODO: Update user data with new milestones
      // This would typically involve calling an API to save the milestones
      setNewMilestone({ title: '', date: '' })
      setShowAddMilestone(false)
    }
  }

  const xpToNextLevel = 100
  const currentLevel = Math.floor(xp / xpToNextLevel) + 1
  const xpProgress = ((xp % xpToNextLevel) / xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketing Buddy</h1>
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Welcome back, {user.productName || 'User'}!
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-gray-900">{streak} day streak</span>
              </div>

              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">Level {currentLevel}</div>
                  <div className="text-xs text-gray-600">{xp} XP</div>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowLeaderboardModal(true)}
                className="flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>Leaderboard</span>
              </Button>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="pb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>
                {xp % xpToNextLevel}/{xpToNextLevel} XP
              </span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Simplified MVP Navigation */}
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="today" className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Today's Tasks</span>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Daily Marketing System</h2>
                <div className="max-w-2xl mx-auto flex items-center justify-center gap-3 text-gray-600">
                  <p>Complete your daily tasks to build consistent marketing habits that grow your business to 1,000 users.</p>
                  <Button variant="outline" size="sm" onClick={() => loadTasksForDay(currentDay)}>Generate today's tasks</Button>
                </div>
              </div>
              
              {/* Growth Goals Tracking */}
              {(user.goals?.primary?.type && user.goals?.primary?.target) || (user.goalType && user.goalAmount) && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <span>Your Growth Journey</span>
                    </CardTitle>
                    <CardDescription>
                      Track your progress towards your {user.goals?.primary?.timeline || user.goalTimeline}-month goal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'User Growth Goal' : 'Revenue Goal (MRR)'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Target: {parseInt(user.goals?.primary?.target || user.goalAmount).toLocaleString()} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'} in {user.goals?.primary?.timeline || user.goalTimeline} months
                          </p>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {user.goals?.primary?.timeline || user.goalTimeline} month plan
                        </Badge>
                      </div>
                      
                      {/* Progress visualization */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Progress</span>
                          <span className="font-medium">Day {currentDay} of {parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30}</span>
                        </div>
                        <Progress 
                          value={(currentDay / (parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)) * 100} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Started</span>
                          <span>{Math.round((currentDay / (parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)) * 100)}% complete</span>
                          <span>Goal: {user.goals?.primary?.target || user.goalAmount} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'}</span>
                        </div>
                      </div>
                      
                      {/* Milestones */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">Milestones</h4>
                          <Button variant="outline" size="sm" onClick={() => setShowAddMilestone(true)}>
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {/* Predefined milestones */}
                          {[25, 50, 75, 100].map((percentage) => {
                            const milestoneDay = Math.round((percentage / 100) * parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)
                            const milestoneValue = Math.round((percentage / 100) * parseInt(user.goals?.primary?.target || user.goalAmount))
                            const isReached = currentDay >= milestoneDay
                            
                            return (
                              <div key={percentage} className={`flex items-center space-x-2 p-2 rounded ${
                                isReached ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'
                              }`}>
                                {isReached ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                )}
                                <span className="text-sm">
                                  {percentage}% - {milestoneValue.toLocaleString()} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'}
                                  <span className="text-xs ml-1">(Day {milestoneDay})</span>
                                </span>
                                {isReached && (
                                  <Badge variant="secondary" className="text-xs ml-auto">
                                    Reached!
                                  </Badge>
                                )}
                              </div>
                            )
                          })}
                          
                          {/* User-defined milestones */}
                          {milestones.map((milestone: any, index: number) => (
                            <div key={milestone.id || index} className="flex items-center space-x-2 p-2 rounded bg-blue-50 text-blue-800">
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">
                                {milestone.title}
                                <span className="text-xs ml-1">({milestone.date})</span>
                              </span>
                              <Badge variant="secondary" className="text-xs ml-auto">
                                Custom
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Week Lock Notice */}
              {weekLockMessage && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="text-amber-700 text-sm flex-1">{weekLockMessage}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowWeeklyReview(true)}>Open Weekly Review</Button>
                      <Button size="sm" onClick={() => loadTasksForDay(currentDay)}>Check Again</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <HabitTracker 
                tasks={todaysTasks} 
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
                streak={streak} 
                xp={xp} 
                currentDay={currentDay}
                onDayChange={setCurrentDay}
                user={user}
                weekStats={getWeekStats()}
                onTaskUpdate={() => {/* Force re-render for live updates */}}
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

          {/* MVP Tab 3: Marketing Buddy - Social accountability and motivation */}
          <TabsContent value="buddy">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Marketing Buddy</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Stay motivated with your accountability partner, compete on leaderboards, and tackle challenges together.
                </p>
              </div>
              
              <BuddySystem 
                user={user}
                streak={streak}
                xp={xp}
                todaysTasks={todaysTasks}
              />

            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <UserProfile 
                user={user}
                onSignOut={() => {
                  localStorage.clear()
                  window.location.href = '/landing'
                }}
                onUpdateProfile={async (updates: any) => {
                  try {
                    // Persist key fields to Supabase onboarding row
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

                  // If plan was updated, reload tasks
                  if (updates.plan) {
                    loadTasksForDay(currentDay)
                  }

                  setShowProfileModal(false)
                  // For now, reload to pick up latest data mapping
                  window.location.reload()
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddMilestone && (
        <Dialog open={showAddMilestone} onOpenChange={setShowAddMilestone}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Milestone Title</label>
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Reached 500 followers"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date Achieved</label>
                <input
                  type="date"
                  value={newMilestone.date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddMilestone(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMilestone}>
                  Add Milestone
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>)}

      {/* Weekly Review Modal */}
      <Dialog open={showWeeklyReview} onOpenChange={setShowWeeklyReview}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Weekly Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>What got traction this week?</Label>
              <Input value={weeklyForm.tractionChannel} onChange={(e) => setWeeklyForm({ ...weeklyForm, tractionChannel: e.target.value })} placeholder="e.g., Twitter, SEO, Newsletter" />
            </div>
            <div>
              <Label>What felt like a waste of time?</Label>
              <Input value={weeklyForm.wasteChannel} onChange={(e) => setWeeklyForm({ ...weeklyForm, wasteChannel: e.target.value })} placeholder="e.g., Reddit" />
            </div>
            <div>
              <Label>Focus next week (comma separated)</Label>
              <Input value={weeklyForm.focusNextWeek.join(', ')} onChange={(e) => setWeeklyForm({ ...weeklyForm, focusNextWeek: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="e.g., Twitter threads, Cold outreach" />
            </div>
            <div>
              <Label>How are you feeling? (1-10)</Label>
              <Input type="number" min={1} max={10} value={weeklyForm.feeling} onChange={(e) => setWeeklyForm({ ...weeklyForm, feeling: e.target.value })} />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={weeklyForm.notes} onChange={(e) => setWeeklyForm({ ...weeklyForm, notes: e.target.value })} placeholder="Highlights, struggles, ideas" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWeeklyReview(false)}>Cancel</Button>
              <Button onClick={async () => {
                try {
                  const weekStart = new Date()
                  // Align to previous Monday for simplicity
                  const day = weekStart.getDay() // 0=Sun
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
                  // eslint-disable-next-line no-console
                  console.warn('Failed to save weekly review:', e)
                } finally {
                  setShowWeeklyReview(false)
                }
              }}>Save Review (+50 XP)</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leaderboard Modal */}
      {showLeaderboardModal && (
        <Dialog open={showLeaderboardModal} onOpenChange={setShowLeaderboardModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>Marketing Leaderboard</span>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <BuddySystem 
                user={user}
                streak={streak}
                xp={xp}
                todaysTasks={todaysTasks}
                showOnlyLeaderboard={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
