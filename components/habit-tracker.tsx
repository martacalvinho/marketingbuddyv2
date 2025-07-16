"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, Zap, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
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
  const week = Math.ceil(day / 7)
  switch (week) {
    case 1: return "Find Your First 10 Users"
    case 2: return "Content Cadence"
    case 3: return "Launch Amplify"
    case 4: return "Retention & Referral"
    default: return "Marketing Growth"
  }
}

export default function HabitTracker({ tasks, onCompleteTask, onDeleteTask, onAddTask, streak, xp, currentDay = 1, onDayChange, user, weekStats = [], onTaskUpdate }: HabitTrackerProps) {
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
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
                <span className="text-sm text-gray-500">of 30</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDayChange && onDayChange(Math.min(30, currentDay + 1))}
                disabled={currentDay >= 30}
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
                Your streak is now {streak + 1} days. Keep the momentum going tomorrow!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="mb-2">Your 4-Week Journey</CardTitle>
          <CardDescription className="text-sm text-gray-600 mb-4">
            Click on any week to see its goals and track your progress through your 30-day marketing plan.
          </CardDescription>
          <WeekProgress stats={weekStats} currentWeek={Math.ceil(currentDay / 7)} />
        </CardHeader>
      </Card>
    </div>
  )
}
