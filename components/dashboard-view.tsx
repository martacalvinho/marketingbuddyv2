"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Target, Calendar, BookOpen, MessageCircle, CheckCircle2, Zap, TrendingUp, BarChart3, X } from "lucide-react"
import HabitTracker from "@/components/habit-tracker"
import ContentGenerator from "@/components/content-generator"
import ContentLibrary from "@/components/content-library"
import ChatInterface from "@/components/chat-interface"
import WebsiteAnalysis from "@/components/website-analysis"
import LearnSection from "@/components/learn-section"
import MarketingBuddy from "@/components/marketing-buddy"
import MarketingAnalytics from "@/components/marketing-analytics"
import UserProfile from "@/components/user-profile"

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

  useEffect(() => {
    loadTasksForDay(currentDay)
  }, [currentDay])

  const loadTasksForDay = (day: number) => {
    if (user.plan) {
      // Convert day to month and week context for 6-month plan
      const month = Math.ceil(day / 30) // Roughly 30 days per month
      const dayInMonth = ((day - 1) % 30) + 1
      const week = Math.ceil(dayInMonth / 7)
      
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
        setTasksByDay((prev) => ({ ...prev, [day]: tasks }))
        setTodaysTasks(tasks)
        return
      }
    }

    // If no tasks found and we're in a new month, generate daily tasks
    const month = Math.ceil(day / 30)
    const weekInMonth = Math.ceil(((day - 1) % 30 + 1) / 7)
    
    if (month > 1 && day > 30) {
      generateDailyTasksForMonth(day, month, weekInMonth)
      return
    }

    // fallback empty
    setTasksByDay((prev) => ({ ...prev, [day]: [] }))
    setTodaysTasks([])
  }

  const parseTasks = (content: string, day: number, limit: number = 3) => {
    // Extract tasks from various formats
    const taskPatterns = [
      /- \*\*Task \d+:\*\*\s*(.+)/g,  // - **Task X:** format
      /- (.+?)(?=\n|$)/g,              // Simple bullet points
      /\*\*Task \d+:\*\*\s*(.+)/g,    // **Task X:** format
      /\d+\.\s*(.+?)(?=\n|$)/g        // Numbered list format
    ]
    
    let tasks: any[] = []
    
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
          let description = taskContent
          
          if (colonIndex > 0 && colonIndex < 80) {
            title = taskContent.substring(0, colonIndex).trim()
            description = taskContent.substring(colonIndex + 1).trim()
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
            week: Math.ceil(((day - 1) % 30 + 1) / 7)
          }
        })
        break // Use first successful pattern
      }
    }
    
    return tasks
  }

  const generateDailyTasksForMonth = async (day: number, month: number, weekInMonth: number) => {
    try {
      // Extract month strategy from user plan
      const monthRegex = new RegExp(`###\\s*Month\\s*${month}[^\\n]*\\n([\\s\\S]*?)(?=###\\s*Month\\s*${month + 1}|$)`, 'i')
      const monthMatch = user.plan?.match(monthRegex)
      const monthStrategy = monthMatch ? monthMatch[1].substring(0, 1000) : ''
      
      const response = await fetch('/api/generate-daily-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          month,
          weekInMonth,
          currentDay: day,
          monthStrategy
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.tasks) {
        // Parse the generated tasks and update state
        const generatedTasks = parseTasks(data.tasks, day)
        if (generatedTasks.length > 0) {
          setTasksByDay((prev) => ({ ...prev, [day]: generatedTasks }))
          setTodaysTasks(generatedTasks)
          
          // Update user plan with the new daily tasks
          const updatedPlan = user.plan + '\n\n' + data.tasks
          const updatedUser = { ...user, plan: updatedPlan }
          localStorage.setItem('user', JSON.stringify(updatedUser))
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
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>AI Coach</span>
            </TabsTrigger>
          </TabsList>

          {/* MVP Tab 1: Today's Tasks - Core daily habit system */}
          <TabsContent value="today">
            <div className="space-y-6">
              {/* Enhanced header with clear value proposition */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Daily Marketing System</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Complete your daily tasks to build consistent marketing habits that grow your business to 1,000 users.
                </p>
              </div>
              
              <HabitTracker 
                tasks={todaysTasks} 
                onCompleteTask={completeTask} 
                onDeleteTask={deleteTask}
                onAddTask={addTask}
                streak={streak} 
                xp={xp} 
                currentDay={currentDay}
                onDayChange={setCurrentDay}
                user={user}
                weekStats={getWeekStats()}
                onTaskUpdate={() => {/* Force re-render for live updates */}}
              />
              
              {/* Quick analytics preview */}
              <div className="mt-8">
                <MarketingAnalytics user={user} compact={true} />
              </div>
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

          {/* MVP Tab 3: AI Coach - Integrated guidance and strategy */}
          <TabsContent value="chat">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your AI Marketing Coach</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Get personalized guidance on your daily tasks, content strategy, and growth tactics.
                </p>
              </div>
              
              <ChatInterface 
                user={user}
                dailyTasks={todaysTasks}
                completedTasks={todaysTasks.filter((t: any) => t.completed).length}
                totalTasks={todaysTasks.length}
                streak={streak}
                xp={xp}
              />
              
              {/* Quick access to website analysis */}
              <div className="mt-8">
                <WebsiteAnalysis user={user} compact={true} />
              </div>
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
                  // Update user data in localStorage or send to API
                  const updatedUser = { ...user, ...updates }
                  localStorage.setItem('user', JSON.stringify(updatedUser))
                  
                  // If plan was updated, reload tasks
                  if (updates.plan) {
                    loadTasksForDay(currentDay)
                  }
                  
                  // Close modal and force re-render
                  setShowProfileModal(false)
                  window.location.reload()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
