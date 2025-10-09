import { useCallback, useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

import type { Milestone } from "@/hooks/use-milestones"

type MilestoneUpdater = (prev: Milestone[]) => Milestone[]

interface UseMilestoneStateArgs {
  externalMilestones?: Milestone[]
  fallbackMilestones?: Milestone[]
  onMilestonesChange?: Dispatch<SetStateAction<Milestone[]>>
}

export const useMilestoneState = ({
  externalMilestones,
  fallbackMilestones = [],
  onMilestonesChange,
}: UseMilestoneStateArgs) => {
  const [internalMilestones, setInternalMilestones] = useState<Milestone[]>(
    externalMilestones ?? fallbackMilestones,
  )

  useEffect(() => {
    if (externalMilestones !== undefined) {
      setInternalMilestones(externalMilestones)
    }
  }, [externalMilestones])

  useEffect(() => {
    if (externalMilestones === undefined) {
      setInternalMilestones(fallbackMilestones)
    }
  }, [externalMilestones, fallbackMilestones])

  const applyMilestonesChange = useCallback(
    (updater: MilestoneUpdater) => {
      if (onMilestonesChange) {
        onMilestonesChange((prev) => {
          const safePrev = Array.isArray(prev) ? prev : []
          return updater(safePrev)
        })
        return
      }

      setInternalMilestones((prev) => updater(prev))
    },
    [onMilestonesChange],
  )

  return {
    milestones: externalMilestones ?? internalMilestones,
    applyMilestonesChange,
    setInternalMilestones,
  }
}
