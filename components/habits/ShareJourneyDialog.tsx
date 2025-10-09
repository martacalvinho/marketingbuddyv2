import { Download } from "lucide-react"
import type { RefObject } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AchievementPreset {
  id: string
  title: string
  icon: string
  progress: string
  blurb: string
  unlocked: boolean
}

interface ShareJourneyDialogProps {
  open: boolean
  template: "journey" | "milestone" | "weekly"
  onTemplateChange: (template: "journey" | "milestone" | "weekly") => void
  onOpenChange: (state: boolean) => void
  onDownload: () => void | Promise<void>
  shareCardRef: RefObject<HTMLDivElement | null>
  currentDay: number
  currentUsers: number
  userGoal: number
  currentRevenue: number
  revenueGoal: number
  streak: number
  winsGoals: string[]
  currentWeekGoals: string[]
  currentWeek: number
  weekDone: number
  weekTotal: number
  userProductName?: string
  achievementPresets: AchievementPreset[]
}

const ShareJourneyDialog = ({
  open,
  template,
  onTemplateChange,
  onOpenChange,
  onDownload,
  shareCardRef,
  currentDay,
  currentUsers,
  userGoal,
  currentRevenue,
  revenueGoal,
  streak,
  winsGoals,
  currentWeekGoals,
  currentWeek,
  weekDone,
  weekTotal,
  userProductName,
  achievementPresets,
}: ShareJourneyDialogProps) => {
  const achievements = achievementPresets
  const firstUnlocked = achievements.find((item) => item.unlocked)
  const showcase = firstUnlocked ?? achievements[0]
  const nextGoal =
    userGoal > currentUsers
      ? `${userGoal.toLocaleString()} users`
      : `${revenueGoal.toLocaleString()} MRR`
  const wins = winsGoals.length > 0 ? winsGoals : currentWeekGoals

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Shareable Card</DialogTitle>
          <DialogDescription>Pick a template and download an image to post on social.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="space-y-3 md:w-1/3">
            <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
              <Button variant={template === "journey" ? "default" : "outline"} onClick={() => onTemplateChange("journey")}>
                Journey
              </Button>
              <Button variant={template === "milestone" ? "default" : "outline"} onClick={() => onTemplateChange("milestone")}>
                Milestone
              </Button>
              <Button variant={template === "weekly" ? "default" : "outline"} onClick={() => onTemplateChange("weekly")}>
                Weekly Recap
              </Button>
            </div>
            <div className="pt-2">
              <Button className="w-full" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </div>
          </div>

          <div className="md:w-2/3">
            <div
              ref={shareCardRef}
              className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-xl"
            >
              {template === "journey" && (
                <div className="space-y-3">
                  <div className="text-sm text-indigo-700">?? My Marketing Journey</div>
                  <div className="text-lg font-semibold text-gray-900">Day {currentDay} of building in public</div>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <div>?? Progress:</div>
                    <div>?? {currentUsers.toLocaleString()} / {userGoal.toLocaleString()} users</div>
                    <div>?? ${currentRevenue.toLocaleString()} MRR</div>
                    <div>?? {streak}-day streak</div>
                  </div>
                  <div className="mt-3 text-sm text-gray-800">
                    <div className="mb-1 font-medium">This week I:</div>
                    <ul className="ml-5 list-disc">
                      {wins.slice(0, 3).map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    Building: {userProductName || "My Product"} • Track your journey:{" "}
                    {typeof window !== "undefined" ? window.location.origin : ""}/landing
                  </div>
                </div>
              )}

              {template === "milestone" && showcase && (
                <div className="space-y-3 text-center">
                  <div className="text-2xl">?? MILESTONE!</div>
                  <div className="text-xl font-bold text-gray-900">{showcase.title}</div>
                  <div className="text-sm text-gray-700">
                    {showcase.unlocked ? "Unlocked" : "In Progress"} • {showcase.progress}
                  </div>
                  <div className="mt-3 flex h-24 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-200 to-purple-200 text-sm text-indigo-800">
                    Growth chart coming soon
                  </div>
                  <div className="text-sm text-gray-800">Next goal: {nextGoal}</div>
                  <div className="mt-3 text-xs text-gray-600">
                    Building: {userProductName || "My Product"} • Follow my journey:{" "}
                    {typeof window !== "undefined" ? window.location.origin : ""}/landing
                  </div>
                </div>
              )}

              {template === "weekly" && (
                <div className="space-y-3">
                  <div className="text-sm text-blue-700">?? Week {currentWeek} Recap</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded border bg-white/70 p-2">Tasks: {weekDone}/{weekTotal} ??</div>
                    <div className="rounded border bg-white/70 p-2">
                      New users: +{Math.max(0, Math.round(currentUsers / Math.max(1, currentWeek)))}
                    </div>
                    <div className="rounded border bg-white/70 p-2">
                      Revenue: +${Math.max(0, Math.round(currentRevenue / Math.max(1, currentWeek)))}
                    </div>
                    <div className="rounded border bg-white/70 p-2">Streak: {streak} days</div>
                  </div>
                  <div className="text-sm text-gray-800">
                    <div className="mb-1 font-medium">What worked:</div>
                    <ul className="ml-5 list-disc">
                      {wins.slice(0, 3).map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">Building: {userProductName || "My Product"}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareJourneyDialog
