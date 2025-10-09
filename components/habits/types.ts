export type HabitTaskCategory = "content" | "analytics" | "community" | "strategy" | "engagement"

export interface HabitTask {
  id: string | number
  title: string
  description: string
  completed: boolean
  skipped?: boolean
  platform?: string
  estimatedTime?: string
  xp?: number
  category?: HabitTaskCategory
  impact?: string
  tips?: string[]
  note?: string
  [key: string]: unknown
}

export interface MilestoneDraft {
  title: string
  date: string
  emoji: string
  description: string
  current: string
  target: string
  unit: string
  isCompleted?: boolean
}
