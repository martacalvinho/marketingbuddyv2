import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface Milestone {
  id?: string
  title: string
  date: string
  type?: "goal_achieved" | "user_added"
  goalType?: "users" | "revenue"
  goal_type?: "users" | "revenue"
  emoji?: string
  description?: string
  progressCurrent?: number
  progressTarget?: number
  progress_current?: number
  progress_target?: number
  unit?: string
  unlocked?: boolean
  [key: string]: any
}

export const useMilestones = (userId?: string, initialMilestones: Milestone[] = []) => {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [loadingMilestones, setLoadingMilestones] = useState(false)

  const refreshMilestones = useCallback(async (shouldUpdate?: () => boolean) => {
    if (!userId) return
    const canUpdate = () => (shouldUpdate ? shouldUpdate() : true)
    if (!canUpdate()) return
    setLoadingMilestones(true)
    try {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (!error && data && canUpdate()) {
        setMilestones(data as unknown as Milestone[])
      }
    } finally {
      if (canUpdate()) {
        setLoadingMilestones(false)
      }
    }
  }, [userId])

  useEffect(() => {
    setMilestones(initialMilestones)
  }, [initialMilestones])

  useEffect(() => {
    let ignore = false
    const load = async () => {
      if (!userId || ignore) return
      await refreshMilestones(() => !ignore)
    }
    load()
    return () => {
      ignore = true
    }
  }, [userId, refreshMilestones])

  return {
    milestones,
    setMilestones,
    refreshMilestones,
    loadingMilestones,
  }
}
