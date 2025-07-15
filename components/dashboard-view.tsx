"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Target, Calendar, BookOpen, MessageCircle, CheckCircle2, Zap, TrendingUp } from "lucide-react"
import HabitTracker from "@/components/habit-tracker"
import ContentCalendar from "@/components/content-calendar"
import ChatInterface from "@/components/chat-interface"
import WebsiteAnalysis from "@/components/website-analysis"
import LearnSection from "@/components/learn-section"

interface DashboardViewProps {
  user: any
}

export default function DashboardView({ user }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("habits")
  const [todaysTasks, setTodaysTasks] = useState([])
  const [streak, setStreak] = useState(user.streak || 0)
  const [xp, setXp] = useState(user.xp || 0)

  useEffect(() => {
    loadTodaysTasks()
  }, [])

  const loadTodaysTasks = async () => {
    // In production, this would fetch from your database
    const today = new Date().toDateString()
    const tasks = [
      {
        id: 1,
        title: "Write 1-sentence value prop",
        description: "Post in 3 relevant subreddits asking for feedback",
        xp: 10,
        completed: false,
        estimatedTime: "15 min",
      },
      {
        id: 2,
        title: "DM 5 Twitter followers",
        description: "Reach out to people who liked similar tools",
        xp: 15,
        completed: false,
        estimatedTime: "10 min",
      },
      {
        id: 3,
        title: "Build in Public tweet",
        description: "Share your journey using our template",
        xp: 10,
        completed: false,
        estimatedTime: "5 min",
      },
    ]
    setTodaysTasks(tasks)
  }

  const completeTask = (taskId: number) => {
    setTodaysTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))

    const task = todaysTasks.find((t) => t.id === taskId)
    if (task) {
      setXp((prev) => prev + task.xp)

      // Check if all tasks completed for streak
      const completedCount = todaysTasks.filter((t) => t.completed || t.id === taskId).length
      if (completedCount === todaysTasks.length) {
        setStreak((prev) => prev + 1)
      }
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
          <TabsList className="grid w-full grid-cols-5">
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
          </TabsList>

          <TabsContent value="habits">
            <HabitTracker tasks={todaysTasks} onCompleteTask={completeTask} streak={streak} xp={xp} />
          </TabsContent>

          <TabsContent value="content">
            <ContentCalendar user={user} />
          </TabsContent>

          <TabsContent value="learn">
            <LearnSection user={user} />
          </TabsContent>

          <TabsContent value="analysis">
            <WebsiteAnalysis analysis={user.websiteAnalysis} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
