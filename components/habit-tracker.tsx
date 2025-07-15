"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, Zap } from "lucide-react"

interface HabitTrackerProps {
  tasks: any[]
  onCompleteTask: (taskId: number) => void
  streak: number
  xp: number
}

export default function HabitTracker({ tasks, onCompleteTask, streak, xp }: HabitTrackerProps) {
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Marketing Habits</span>
            <Badge variant={completedTasks === totalTasks ? "default" : "secondary"}>
              {completedTasks}/{totalTasks} Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            Complete all 3 micro-tasks to maintain your streak! Each task takes ≤ 15 minutes.
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
                  onClick={() => !task.completed && onCompleteTask(task.id)}
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
                </div>
              </div>
            ))}
          </div>

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
          <CardTitle>This Week's Focus: Find Your First 10 Users</CardTitle>
          <CardDescription>Week 1 of your 30-day marketing journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{day}</div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === 0 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index === 0 ? "3/3" : "0/3"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-gray-900">This Week's Goals:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Post value-first content in 3 relevant subreddits</li>
              <li>• Connect with 10 potential users via DM</li>
              <li>• Share your build-in-public journey</li>
              <li>• Collect first batch of user feedback</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
