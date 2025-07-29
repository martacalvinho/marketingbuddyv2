"use client"

import { useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Twitter, Linkedin, MessageSquare, Instagram, Video, FileText, Zap, Copy, Check, Loader2, CheckCircle2, Circle, Target, ChevronRight, ChevronLeft, Calendar, Clock, Lightbulb, Trophy } from "lucide-react"
import WeekProgress from "./week-progress"

interface Milestone {
  title: string
  date: string
  type: 'goal_achieved' | 'user_added'
  goalType?: 'users' | 'revenue'
}

interface HabitTrackerProps {
  tasks: any[]
  onCompleteTask: (taskId: string | number) => void
  onDeleteTask?: (taskId: string | number) => void
  onAddTask?: (title: string, description: string) => void
  onUpdateTask?: (taskId: string | number, updates: Partial<any>) => void
  onReorderTasks?: (newOrder: any[]) => void
  onAddTaskNote?: (taskId: string | number, note: string) => void
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



export default function HabitTracker({ tasks, onCompleteTask, onDeleteTask, onAddTask, onUpdateTask, onReorderTasks, onAddTaskNote, streak, xp, currentDay = 1, onDayChange, user, weekStats = [], onTaskUpdate }: HabitTrackerProps) {
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [isJourneyCollapsed, setIsJourneyCollapsed] = useState(false)
  const [showEditGoal, setShowEditGoal] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  // Use onboarding goal data or fallback to defaults
  const getUserGoal = () => {
    if (user?.goals?.primary?.type === 'users') return parseInt(user.goals.primary.target) || 1000
    if (user?.goalType === 'users') return parseInt(user.goalAmount) || 1000
    return 1000
  }
  
  const getRevenueGoal = () => {
    if (user?.goals?.primary?.type === 'revenue') return parseInt(user.goals.primary.target) || 1000
    if (user?.goalType === 'revenue') return parseInt(user.goalAmount) || 1000
    return 1000
  }
  
  const [userGoal, setUserGoal] = useState(getUserGoal())
  const [revenueGoal, setRevenueGoal] = useState(getRevenueGoal())
  const [currentUsers, setCurrentUsers] = useState(Math.min(Math.ceil(currentDay * 5.5), getUserGoal()))
  const [currentRevenue, setCurrentRevenue] = useState(Math.min(Math.ceil(currentDay * 15), getRevenueGoal()))
  const [editingTaskId, setEditingTaskId] = useState<string | number | null>(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState("")
  const [editingTaskDescription, setEditingTaskDescription] = useState("")
  const [noteEditingTaskId, setNoteEditingTaskId] = useState<string | number | null>(null)
  const [taskNote, setTaskNote] = useState("")
  const [draggedTask, setDraggedTask] = useState<any | null>(null)
  // Milestone state
  const [milestones, setMilestones] = useState(user?.milestones || [])
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '' })
  
  // Check if goals have been achieved and save as milestones
  // Also handle setting new goals when current goals are reached
  useEffect(() => {
    const newUserMilestones = [...milestones]
    let updated = false
    
    // Check if user goal has been achieved
    if (currentUsers >= userGoal) {
      const userGoalMilestone = {
        title: `Reached ${userGoal.toLocaleString()} users`,
        date: new Date().toISOString(),
        type: 'goal_achieved',
        goalType: 'users'
      }
      
      // Check if this milestone doesn't already exist
      const exists = newUserMilestones.some(m => 
        m.type === 'goal_achieved' && m.goalType === 'users' && m.title === userGoalMilestone.title
      )
      
      if (!exists) {
        newUserMilestones.push(userGoalMilestone)
        updated = true
      }
    }
    
    // Check if revenue goal has been achieved
    if (currentRevenue >= revenueGoal) {
      const revenueGoalMilestone = {
        title: `Reached $${revenueGoal.toLocaleString()} MRR`,
        date: new Date().toISOString(),
        type: 'goal_achieved',
        goalType: 'revenue'
      }
      
      // Check if this milestone doesn't already exist
      const exists = newUserMilestones.some(m => 
        m.type === 'goal_achieved' && m.goalType === 'revenue' && m.title === revenueGoalMilestone.title
      )
      
      if (!exists) {
        newUserMilestones.push(revenueGoalMilestone)
        updated = true
      }
    }
    
    if (updated) {
      setMilestones(newUserMilestones)
      // Update user data in localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        const updatedUser = { ...parsedUser, milestones: newUserMilestones }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
  }, [currentUsers, userGoal, currentRevenue, revenueGoal, milestones])
  
  const handleAddMilestone = () => {
    if (newMilestone.title.trim()) {
      const milestoneToAdd = {
        title: newMilestone.title,
        date: newMilestone.date || new Date().toISOString(),
        type: 'user_added'
      }
      
      const updatedMilestones = [...milestones, milestoneToAdd]
      setMilestones(updatedMilestones)
      setNewMilestone({ title: '', date: '' })
      setShowAddMilestone(false)
      
      // Update user data in localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        const updatedUser = { ...parsedUser, milestones: updatedMilestones }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
  }
  
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
              tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`group relative transition-all duration-200 ${
                    task.completed 
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" 
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
                      onClick={() => !task.completed && handleCompleteTask(task.id)}
                      className={`p-2 h-auto transition-all duration-200 ${
                        task.completed 
                          ? "bg-green-100 hover:bg-green-200" 
                          : "hover:bg-blue-50 hover:scale-110"
                      }`}
                      disabled={task.completed}
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
                                    : "text-gray-900 hover:text-blue-700"
                                }`}
                                onClick={() => !task.completed && startEditTaskDetails(task)}
                              >
                                {task.title}
                              </h3>
                              <p className={`text-sm leading-relaxed ${
                                task.completed ? "text-green-700" : "text-gray-600"
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
                          <Button size="sm" variant="outline" onClick={() => startEditTaskDetails(task)}>
                            Edit
                          </Button>
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
                      
                      {/* Category Badge */}
                      <div className="flex flex-wrap gap-2 mt-3">
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
              ))
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
                      if (confirm('Are you sure you want to reset your goals? This will reset your progress.')) {
                        // Reset both goals and current values
                        setUserGoal(getUserGoal())
                        setRevenueGoal(getRevenueGoal())
                        setCurrentUsers(0)
                        setCurrentRevenue(0)
                        
                        // Update user data in localStorage
                        const userData = localStorage.getItem('user')
                        if (userData) {
                          const parsedUser = JSON.parse(userData)
                          // Reset goals in user data
                          if (parsedUser.goals?.primary) {
                            parsedUser.goals.primary = {
                              type: parsedUser.goals.primary.type,
                              target: parsedUser.goals.primary.type === 'users' ? 1000 : 1000,
                              timeline: parsedUser.goals.primary.timeline,
                              startDate: new Date().toISOString(),
                              status: 'active'
                            }
                          }
                          localStorage.setItem('user', JSON.stringify(parsedUser))
                        }
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
            
            {/* Milestones Section */}
            <div className="bg-white/80 rounded-xl p-6 border border-gray-200 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">🎯 Milestones</h3>
                  <p className="text-sm text-gray-600">Celebrate your achievements</p>
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
              
              {/* Milestones List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {milestones.length > 0 ? (
                  milestones.map((milestone: Milestone, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                      <Trophy className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{milestone.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(milestone.date).toLocaleDateString()}
                          {milestone.type === 'goal_achieved' && ' (Goal Achieved)'}
                          {milestone.type === 'user_added' && ' (Added Manually)'}
                        </p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Trophy className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm">No milestones yet. Achieve your goals to unlock milestones!</p>
                  </div>
                )}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Achieved</label>
                <input
                  type="date"
                  value={newMilestone.date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
    </div>
  )
}
