"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Twitter, Linkedin, MessageSquare, Instagram, Video, FileText, Zap, Copy, Check, Loader2, CheckCircle2, Circle, Target, ChevronRight, ChevronLeft, Calendar, Clock } from "lucide-react"
import WeekProgress from "./week-progress"

interface HabitTrackerProps {
  tasks: any[]
  onCompleteTask: (taskId: string | number) => void
  onDeleteTask?: (taskId: string | number) => void
  onAddTask?: (title: string, description: string) => void
  streak: number
  xp: number
  currentDay?: number
  onDayChange?: (day: number) => void
  user?: any
  weekStats?: { total: number; done: number; goals: string[] }[]
  onTaskUpdate?: () => void
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

export default function HabitTracker({ tasks, onCompleteTask, onDeleteTask, onAddTask, streak, xp, currentDay = 1, onDayChange, user, weekStats = [], onTaskUpdate }: HabitTrackerProps) {
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [isJourneyCollapsed, setIsJourneyCollapsed] = useState(false)
  const [showEditGoal, setShowEditGoal] = useState(false)
  const [userGoal, setUserGoal] = useState(1000)
  const [revenueGoal, setRevenueGoal] = useState(1000)
  const [currentUsers, setCurrentUsers] = useState(Math.min(Math.ceil(currentDay * 5.5), 1000))
  const [currentRevenue, setCurrentRevenue] = useState(Math.min(Math.ceil(currentDay * 15), 1000))
  const completedTasks = tasks.filter((task) => task.completed).length
  const currentWeek = Math.ceil(currentDay / 7)
  const weekGoals = weekStats[currentWeek - 1]?.goals || []
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
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${
                  task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => !task.completed && handleCompleteTask(task.id)}
                  className="p-0 h-auto"
                  disabled={task.completed}
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  )}
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${task.completed ? "text-green-800 line-through" : "text-gray-900"}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.estimatedTime}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        {task.xp} XP
                      </Badge>
                    </div>
                  </div>
                  <p className={`text-sm mt-1 ${task.completed ? "text-green-700" : "text-gray-600"}`}>
                    {task.description}
                  </p>
                  {onDeleteTask && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 mt-1"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowEditGoal(!showEditGoal)}
                >
                  {showEditGoal ? 'Save Goals' : 'Edit Goal'}
                </Button>
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
                        <input 
                          type="number" 
                          value={userGoal} 
                          onChange={(e) => setUserGoal(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs border rounded"
                        />
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
                        <input 
                          type="number" 
                          value={revenueGoal} 
                          onChange={(e) => setRevenueGoal(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs border rounded"
                        />
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
                  </div>
                </div>
              </div>
              
              {/* Share Button */}
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    // Create shareable text
                    const shareText = `🚀 My Marketing Journey - Day ${currentDay}\n\n👥 Users: ${currentUsers.toLocaleString()} / ${userGoal.toLocaleString()}\n💰 Revenue: $${currentRevenue.toLocaleString()} / $${revenueGoal.toLocaleString()} MRR\n🔥 ${streak} day streak\n\nBuilding toward my first 1,000 users with @MarketingBuddy! 💪`
                    
                    if (navigator.share) {
                      navigator.share({
                        title: 'My Marketing Journey',
                        text: shareText
                      })
                    } else {
                      navigator.clipboard.writeText(shareText)
                      alert('Progress copied to clipboard! 📋')
                    }
                  }}
                >
                  📷 Share Progress
                </Button>
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
    </div>
  )
}
