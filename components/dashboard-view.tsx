"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Flame, Target, Calendar, BookOpen, MessageCircle, CheckCircle2, Zap, TrendingUp, BarChart3, X, Users, Trophy, Heart } from "lucide-react"
import HabitTracker from "@/components/habit-tracker"
import ContentGenerator from "@/components/content-generator"
import ContentLibrary from "@/components/content-library"
import BuddySystem from "@/components/buddy-system"
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
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)

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
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Complete your daily tasks to build consistent marketing habits that grow your business to 1,000 users.
                </p>
              </div>
              
              {/* Growth Goals Tracking */}
              {user.goalType && user.goalAmount && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <span>Your Growth Journey</span>
                    </CardTitle>
                    <CardDescription>
                      Track your progress towards your {user.goalTimeline}-month goal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user.goalType === 'users' ? 'User Growth Goal' : 'Revenue Goal (MRR)'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Target: {parseInt(user.goalAmount).toLocaleString()} {user.goalType === 'users' ? 'users' : 'USD/month'} in {user.goalTimeline} months
                          </p>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {user.goalTimeline} month plan
                        </Badge>
                      </div>
                      
                      {/* Progress visualization */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Progress</span>
                          <span className="font-medium">Day {currentDay} of {parseInt(user.goalTimeline) * 30}</span>
                        </div>
                        <Progress 
                          value={(currentDay / (parseInt(user.goalTimeline) * 30)) * 100} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Started</span>
                          <span>{Math.round((currentDay / (parseInt(user.goalTimeline) * 30)) * 100)}% complete</span>
                          <span>Goal: {user.goalAmount} {user.goalType === 'users' ? 'users' : 'USD/month'}</span>
                        </div>
                      </div>
                      
                      {/* Milestones */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Milestones</h4>
                        <div className="space-y-2">
                          {[25, 50, 75, 100].map((percentage) => {
                            const milestoneDay = Math.round((percentage / 100) * parseInt(user.goalTimeline) * 30)
                            const milestoneValue = Math.round((percentage / 100) * parseInt(user.goalAmount))
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
                                  {percentage}% - {milestoneValue.toLocaleString()} {user.goalType === 'users' ? 'users' : 'USD/month'}
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
                        </div>
                      </div>
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
