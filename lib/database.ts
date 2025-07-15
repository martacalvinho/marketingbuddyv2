// Simple SQLite database operations for demo
// In production, you'd use a proper database with migrations

export interface User {
  id: string
  name: string
  productName: string
  valueProp: string
  website?: string
  audienceSize: string
  preferredChannel: string
  northStarGoal: string
  websiteAnalysis?: any
  createdAt: string
  streak: number
  xp: number
}

export interface Task {
  id: string
  userId: string
  day: number
  title: string
  description: string
  xp: number
  completed: boolean
  completedAt?: string
}

export interface ContentIdea {
  id: string
  userId: string
  title: string
  content: string
  platform: string
  status: "ideas" | "draft" | "scheduled" | "posted"
  scheduledFor?: string
  metrics: {
    likes: number
    comments: number
    shares: number
  }
}

export interface Streak {
  userId: string
  currentStreak: number
  longestStreak: number
  lastCheck: string
}

// Database operations would go here
// For this demo, we're using localStorage in the frontend
export const db = {
  users: {
    create: async (user: Omit<User, "id">) => {
      // Implementation would create user in SQLite
      return { ...user, id: Date.now().toString() }
    },
    findById: async (id: string) => {
      // Implementation would query SQLite
      return null
    },
    update: async (id: string, updates: Partial<User>) => {
      // Implementation would update user in SQLite
      return true
    },
  },
  tasks: {
    createMany: async (tasks: Omit<Task, "id">[]) => {
      // Implementation would create tasks in SQLite
      return tasks.map((task) => ({ ...task, id: Date.now().toString() }))
    },
    findByUserId: async (userId: string) => {
      // Implementation would query tasks for user
      return []
    },
    update: async (id: string, updates: Partial<Task>) => {
      // Implementation would update task in SQLite
      return true
    },
  },
  content: {
    create: async (content: Omit<ContentIdea, "id">) => {
      // Implementation would create content in SQLite
      return { ...content, id: Date.now().toString() }
    },
    findByUserId: async (userId: string) => {
      // Implementation would query content for user
      return []
    },
    update: async (id: string, updates: Partial<ContentIdea>) => {
      // Implementation would update content in SQLite
      return true
    },
  },
  streaks: {
    findByUserId: async (userId: string) => {
      // Implementation would query streak for user
      return null
    },
    upsert: async (streak: Streak) => {
      // Implementation would create or update streak
      return streak
    },
  },
}
