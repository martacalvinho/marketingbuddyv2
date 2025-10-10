import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Circle, Zap } from "lucide-react"

import type { HabitTask } from "./types"
import { detectPlatformId, getCategoryColor, getPlatformIcon } from "./task-utils"

interface TaskPanelProps {
  tasks: HabitTask[]
  currentDay: number
  streak: number
  onDayChange?: (day: number) => void
  onCompleteTask: (taskId: string | number) => void
  onDeleteTask?: (taskId: string | number) => void
  onAddTask?: (title: string, description: string) => void
  onUpdateTask?: (taskId: string | number, updates: Partial<HabitTask>) => void
  onReorderTasks?: (newOrder: HabitTask[]) => void
  onAddTaskNote?: (taskId: string | number, note: string) => void
  onSkipTask?: (taskId: string | number) => void
  onSuggestContent?: (platformId: string, task: HabitTask) => void
  onTaskUpdate?: () => void
}

const TaskPanel = ({
  tasks,
  currentDay,
  streak,
  onDayChange,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onUpdateTask,
  onReorderTasks,
  onAddTaskNote,
  onSkipTask,
  onSuggestContent,
  onTaskUpdate,
}: TaskPanelProps) => {
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<string | number | null>(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState("")
  const [editingTaskDescription, setEditingTaskDescription] = useState("")
  const [noteEditingTaskId, setNoteEditingTaskId] = useState<string | number | null>(null)
  const [taskNote, setTaskNote] = useState("")
  const [draggedTask, setDraggedTask] = useState<HabitTask | null>(null)

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  const handleCompleteTask = (taskId: string | number) => {
    onCompleteTask(taskId)
    onTaskUpdate?.()
  }

  const handleDeleteTask = (taskId: string | number) => {
    onDeleteTask?.(taskId)
    onTaskUpdate?.()
  }

  const handleAddTask = () => {
    if (!onAddTask) return
    if (!newTitle.trim()) return

    onAddTask(newTitle.trim(), newDesc.trim())
    setNewTitle("")
    setNewDesc("")
    onTaskUpdate?.()
  }

  const startEditTaskDetails = (task: HabitTask) => {
    setEditingTaskId(task.id)
    setEditingTaskTitle(task.title)
    setEditingTaskDescription(task.description)
  }

  const saveTaskEdits = () => {
    if (!editingTaskId || !onUpdateTask) return

    onUpdateTask(editingTaskId, {
      title: editingTaskTitle,
      description: editingTaskDescription,
    })
    setEditingTaskId(null)
    setEditingTaskTitle("")
    setEditingTaskDescription("")
    onTaskUpdate?.()
  }

  const cancelTaskEdits = () => {
    setEditingTaskId(null)
    setEditingTaskTitle("")
    setEditingTaskDescription("")
  }

  const startAddNote = (task: HabitTask) => {
    if (!onAddTaskNote) return
    setNoteEditingTaskId(task.id)
    setTaskNote((task.note as string) || "")
  }

  const saveTaskNote = () => {
    if (!noteEditingTaskId || !onAddTaskNote) return
    onAddTaskNote(noteEditingTaskId, taskNote)
    setNoteEditingTaskId(null)
    setTaskNote("")
    onTaskUpdate?.()
  }

  const cancelAddNote = () => {
    setNoteEditingTaskId(null)
    setTaskNote("")
  }

  const handleDragStart = (event: React.DragEvent, task: HabitTask) => {
    setDraggedTask(task)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (event: React.DragEvent, targetTask: HabitTask) => {
    event.preventDefault()
    if (!draggedTask || !onReorderTasks || draggedTask.id === targetTask.id) return

    const newOrder = [...tasks]
    const draggedIndex = newOrder.findIndex((task) => task.id === draggedTask.id)
    const targetIndex = newOrder.findIndex((task) => task.id === targetTask.id)
    if (draggedIndex === -1 || targetIndex === -1) return

    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, removed)
    onReorderTasks(newOrder)
    setDraggedTask(null)
  }

  const handleSkipTask = (taskId: string | number) => {
    onSkipTask?.(taskId)
    onTaskUpdate?.()
  }

  return (
    <Card className="rounded-2xl border-gray-200 bg-white shadow-sm">
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
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDayChange && onDayChange(currentDay + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Badge variant={completedTasks === totalTasks ? "default" : "secondary"}>
            {completedTasks}/{totalTasks} Complete
          </Badge>
        </div>
        <CardDescription className="text-gray-600">
          Today's marketing tasks. Each task takes ≈ 15 minutes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Calendar className="mb-3 h-12 w-12 text-gray-300" />
              <p className="font-medium">No tasks for today yet</p>
              <p className="text-sm">AI-powered tasks will be generated based on your marketing strategy</p>
            </div>
          ) : (
            tasks.map((task, index) => {
              const platformId = detectPlatformId(task)
              const PlatformIcon: any = platformId ? getPlatformIcon(platformId) : null
              return (
                <div
                  key={task.id}
                  className={`group relative mb-3 rounded-xl border p-4 transition-all duration-200 ${
                    task.completed
                      ? "border-green-200 bg-green-50/30"
                      : task.skipped
                        ? "border-gray-200 bg-gray-50 opacity-60"
                        : "border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm"
                  }`}
                  draggable
                  onDragStart={(event) => handleDragStart(event, task)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, task)}
                >
                  <div
                    className={`absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                      task.completed ? "bg-green-500 text-white" : "bg-[#1e1b4b] text-white"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex items-start space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => !task.completed && !task.skipped && handleCompleteTask(task.id)}
                      className={`h-auto p-2 transition-all duration-200 ${
                        task.completed
                          ? "bg-green-100 hover:bg-green-200"
                          : task.skipped
                            ? "bg-gray-100"
                            : "hover:bg-blue-50 hover:scale-110"
                      }`}
                      disabled={task.completed || task.skipped}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300 transition-colors group-hover:text-indigo-500" />
                      )}
                    </Button>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {editingTaskId === task.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editingTaskTitle}
                                onChange={(event) => setEditingTaskTitle(event.target.value)}
                                className="text-sm font-medium"
                                placeholder="Task title"
                                autoFocus
                              />
                              <Input
                                value={editingTaskDescription}
                                onChange={(event) => setEditingTaskDescription(event.target.value)}
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
                                className={`cursor-pointer font-semibold transition-colors ${
                                  task.completed
                                    ? "text-green-800 line-through"
                                    : task.skipped
                                      ? "text-gray-500 line-through"
                                      : "text-gray-900 hover:text-indigo-600"
                                }`}
                                onClick={() => !task.completed && startEditTaskDetails(task)}
                              >
                                {task.title}
                              </h3>
                              <p
                                className={`text-sm leading-relaxed ${
                                  task.completed ? "text-green-700" : task.skipped ? "text-gray-500" : "text-gray-600"
                                }`}
                              >
                                {task.description}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="ml-2 flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {task.estimatedTime || "15 min"}
                          </Badge>
                          <Badge variant="outline" className="flex items-center space-x-1 text-xs">
                            <Zap className="h-3 w-3" />
                            <span>+{task.xp || 10} XP</span>
                          </Badge>
                          {(task.platform || platformId) && (
                            <Badge variant="outline" className="text-xs">
                              {String(task.platform || platformId)
                                .split(" ")
                                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                                .join(" ")}
                            </Badge>
                          )}
                          {onDeleteTask && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 opacity-0 transition-opacity hover:text-red-700 group-hover:opacity-100"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>

                      {editingTaskId !== task.id && (
                        <div className="mt-2 flex space-x-2">
                          {onSuggestContent && !task.completed && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                              onClick={() => onSuggestContent(platformId || "freestyle", task)}
                              title="Create content for this task"
                            >
                              {PlatformIcon ? <PlatformIcon className="mr-2 h-4 w-4" /> : null}
                              Create content
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => startEditTaskDetails(task)}>
                            Edit
                          </Button>
                          {onSkipTask && !task.completed && !task.skipped && (
                            <Button size="sm" variant="outline" onClick={() => handleSkipTask(task.id)}>
                              Skip
                            </Button>
                          )}
                          {onAddTaskNote && (
                            <Button size="sm" variant="outline" onClick={() => startAddNote(task)}>
                              {task.note ? "Edit Note" : "Add Note"}
                            </Button>
                          )}
                        </div>
                      )}

                      {noteEditingTaskId === task.id ? (
                        <div className="mt-3">
                          <textarea
                            value={taskNote}
                            onChange={(event) => setTaskNote(event.target.value)}
                            className="w-full rounded border border-gray-300 p-2 text-sm"
                            rows={3}
                            placeholder="Add a note to this task..."
                          />
                          <div className="mt-2 flex space-x-2">
                            <Button size="sm" onClick={saveTaskNote}>
                              Save Note
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelAddNote}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : task.note ? (
                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Note:</span> {task.note}
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {task.skipped && (
                          <Badge variant="outline" className="bg-gray-100 text-xs text-gray-700">
                            Skipped
                          </Badge>
                        )}
                        {task.completed && (
                          <Badge variant="outline" className="bg-green-100 text-xs text-green-700">
                            Done
                          </Badge>
                        )}
                        {task.category && (
                          <Badge className={`text-xs ${getCategoryColor(task.category)}`}>
                            {`${task.category.charAt(0).toUpperCase()}${task.category.slice(1)}`}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {onAddTask && (
          <div className="mt-6 space-y-2">
            <h4 className="font-medium text-gray-900">Add Custom Task</h4>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(event) => setNewDesc(event.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddTask}>
                Add
              </Button>
            </div>
          </div>
        )}

        {completedTasks === totalTasks && totalTasks > 0 && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Awesome! You've completed all tasks for today 🎉</span>
            </div>
            <p className="mt-1 text-sm text-green-700">
              Your streak is now {streak + 1} days. Keep building towards your first 1000 users!
            </p>
            {streak >= 6 && (
              <div className="mt-2 rounded border border-yellow-200 bg-yellow-50 p-2">
                <p className="text-sm font-medium text-yellow-800">🏆 Milestone Unlocked!</p>
                <p className="text-xs text-yellow-700">
                  {streak >= 30
                    ? "Master Marketer! You've unlocked advanced AI insights and community leaderboard access."
                    : streak >= 14
                      ? "Consistent Creator! You've unlocked premium content templates."
                      : "Marketing Momentum! You've unlocked AI-powered content suggestions."}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TaskPanel
