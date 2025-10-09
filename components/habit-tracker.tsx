"use client"

import type { Dispatch, SetStateAction } from "react"

import TaskPanel from "./habits/TaskPanel"
import JourneyPanel from "./habits/JourneyPanel"
import type { HabitTask } from "./habits/types"
import type { Milestone } from "@/hooks/use-milestones"
import { useMilestoneState } from "@/hooks/useMilestoneState"

interface HabitTrackerProps {
  tasks: HabitTask[]
  onCompleteTask: (taskId: string | number) => void
  onDeleteTask?: (taskId: string | number) => void
  onAddTask?: (title: string, description: string) => void
  onUpdateTask?: (taskId: string | number, updates: Partial<HabitTask>) => void
  onReorderTasks?: (newOrder: HabitTask[]) => void
  onAddTaskNote?: (taskId: string | number, note: string) => void
  onSkipTask?: (taskId: string | number) => void
  onSuggestContent?: (platformId: string, task: HabitTask) => void
  streak: number
  xp: number
  currentDay?: number
  onDayChange?: (day: number) => void
  user?: any
  weekStats?: { total: number; done: number; goals: string[] }[]
  onTaskUpdate?: () => void
  milestones?: Milestone[]
  onMilestonesChange?: Dispatch<SetStateAction<Milestone[]>>
  onRefreshMilestones?: () => Promise<void>
}

export default function HabitTracker({
  tasks,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onUpdateTask,
  onReorderTasks,
  onAddTaskNote,
  onSkipTask,
  onSuggestContent,
  streak,
  xp,
  currentDay = 1,
  onDayChange,
  user,
  weekStats = [],
  onTaskUpdate,
  milestones: externalMilestones,
  onMilestonesChange,
  onRefreshMilestones,
}: HabitTrackerProps) {
  const { milestones, applyMilestonesChange } = useMilestoneState({
    externalMilestones,
    fallbackMilestones: user?.milestones || [],
    onMilestonesChange,
  })

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="space-y-6">
      <TaskPanel
        tasks={tasks}
        currentDay={currentDay}
        streak={streak}
        onDayChange={onDayChange}
        onCompleteTask={onCompleteTask}
        onDeleteTask={onDeleteTask}
        onAddTask={onAddTask}
        onUpdateTask={onUpdateTask}
        onReorderTasks={onReorderTasks}
        onAddTaskNote={onAddTaskNote}
        onSkipTask={onSkipTask}
        onSuggestContent={onSuggestContent}
        onTaskUpdate={onTaskUpdate}
      />

      <JourneyPanel
        streak={streak}
        xp={xp}
        currentDay={currentDay}
        user={user}
        weekStats={weekStats}
        milestones={milestones}
        applyMilestonesChange={applyMilestonesChange}
        onRefreshMilestones={onRefreshMilestones}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
      />
    </div>
  )
}
