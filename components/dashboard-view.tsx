"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Target, Calendar, BookOpen, MessageCircle, CheckCircle2, Zap, TrendingUp } from "lucide-react"
import HabitTracker from "@/components/habit-tracker"
import ContentGenerator from "@/components/content-generator"
import ContentLibrary from "@/components/content-library"
import ChatInterface from "@/components/chat-interface"
import WebsiteAnalysis from "@/components/website-analysis"
import LearnSection from "@/components/learn-section"
import MarketingBuddy from "@/components/marketing-buddy"

interface DashboardViewProps {
  user: any
}

export default function DashboardView({ user }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("habits")
  const [tasksByDay, setTasksByDay] = useState<Record<number, any[]>>({})
  const [todaysTasks, setTodaysTasks] = useState<any[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [streak, setStreak] = useState(user.streak || 0)
  const [xp, setXp] = useState(user.xp || 0)

  useEffect(() => {
    loadTasksForDay(currentDay)
  }, [currentDay])

  const loadTasksForDay = (day: number) => {
    if (user.plan) {
      // Parse markdown format: ### Day X followed by - **Task X:** content
      const nextDay = day + 1
      const dayRegex = new RegExp(`###\\s*Day\\s*${day}[^\\n]*\\n([\\s\\S]*?)(?=###\\s*Day\\s*${nextDay}|$)`, 'i')
      const dayMatch = user.plan.match(dayRegex)
      
      if (dayMatch) {
        const taskLines = dayMatch[1]
          .split('\n')
          .filter((line: string) => line.trim().startsWith('- **Task'))
          .slice(0, 3)

        const parsed = taskLines.map((line: string, idx: number) => {
          // Extract task from "- **Task X:** content" format
          const taskMatch = line.match(/- \*\*Task \d+:\*\*\s*(.+)/)
          let taskContent = taskMatch ? taskMatch[1].trim() : line.replace(/^[-*\s]+/, '').trim()
          
          // Remove asterisks and clean up formatting
          taskContent = taskContent.replace(/\*\*/g, '').replace(/\*/g, '')
          
          // Split on first colon to separate title from description
          const colonIndex = taskContent.indexOf(':')
          let title = taskContent
          let description = taskContent
          
          if (colonIndex > 0 && colonIndex < 60) {
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
            day: day
          }
        })
        
        if (parsed.length > 0) {
          setTasksByDay((prev) => ({ ...prev, [day]: parsed }))
          setTodaysTasks(parsed)
          return
        }
      }
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
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="habits" className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Daily Habits</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="buddy" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Buddy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="habits">
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
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <ContentGenerator user={user} />
              <ContentLibrary user={user} />
            </div>
          </TabsContent>

          <TabsContent value="learn">
            <LearnSection user={user} />
          </TabsContent>

          <TabsContent value="analysis">
            <WebsiteAnalysis 
              analysis={user.websiteAnalysis} 
              websiteUrl={user.websiteUrl}
              onReAnalyze={handleReAnalyze}
            />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface user={user} />
          </TabsContent>

          <TabsContent value="buddy">
            <MarketingBuddy user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
