import { Download, X } from "lucide-react"
import type { RefObject } from "react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Milestone } from "@/hooks/use-milestones"

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
  milestones: Milestone[]
  launchDate?: string
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
  milestones,
  launchDate,
}: ShareJourneyDialogProps) => {
  const achievements = achievementPresets
  const firstUnlocked = achievements.find((item) => item.unlocked)
  const showcase = firstUnlocked ?? achievements[0]
  const nextGoal =
    userGoal > currentUsers
      ? `${userGoal.toLocaleString()} users`
      : `${revenueGoal.toLocaleString()} MRR`
  const wins = winsGoals.length > 0 ? winsGoals : currentWeekGoals

  // Collect all completed milestones
  const presets = [
    { id: 'first-user', emoji: '👤', title: 'Got my first user', target: 1, current: currentUsers, type: 'users' },
    { id: 'first-10', emoji: '👥', title: 'Reached 10 users', target: 10, current: currentUsers, type: 'users' },
    { id: 'first-dollar', emoji: '💵', title: 'Made my first dollar', target: 1, current: currentRevenue, type: 'mrr' },
    { id: 'first-100-users', emoji: '🎯', title: 'Hit 100 users', target: 100, current: currentUsers, type: 'users' },
    { id: 'first-100-mrr', emoji: '💰', title: 'Reached $100 MRR', target: 100, current: currentRevenue, type: 'mrr' },
    { id: 'first-500-users', emoji: '🚀', title: 'Reached 500 users', target: 500, current: currentUsers, type: 'users' },
  ]

  const getAllCompletedMilestones = () => {
    const completed: any[] = []
    
    // Add launch date if exists
    if (launchDate) {
      completed.push({
        id: 'launch',
        emoji: '🚀',
        title: `Launched ${userProductName || 'my product'}`,
        date: launchDate,
        isLaunch: true
      })
    }
    
    // Add completed preset milestones
    presets.forEach(preset => {
      const existingMilestone = milestones.find(m => 
        m.title.toLowerCase().includes(preset.title.toLowerCase()) || 
        (m.type === 'goal_achieved' && m.goal_type === preset.type && preset.current >= preset.target)
      )
      if (existingMilestone?.unlocked && existingMilestone.date) {
        completed.push({
          ...preset,
          date: existingMilestone.date,
        })
      }
    })

    // Add completed custom milestones
    milestones
      .filter(m => m.type === 'user_added' && m.unlocked && m.date)
      .forEach(m => {
        completed.push({
          id: m.id || m.title,
          emoji: m.emoji || '🏅',
          title: m.title,
          date: m.date,
        })
      })

    // Sort by date
    completed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return completed
  }

  const allCompletedMilestones = getAllCompletedMilestones()
  
  // State for selected milestones (default to last 3)
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>([])

  useEffect(() => {
    // Initialize with first 4 milestones when dialog opens (or reset when switching templates)
    if (open && template === 'journey') {
      // Get all milestones for initialization
      const allMilestones: any[] = []
      
      if (launchDate) {
        allMilestones.push({ id: 'launch' })
      }
      
      presets.forEach(preset => {
        allMilestones.push({ id: preset.id })
      })
      
      milestones.filter(m => m.type === 'user_added').forEach(m => {
        allMilestones.push({ id: m.id || m.title })
      })
      
      const firstFour = allMilestones.slice(0, 4).map(m => m.id)
      setSelectedMilestoneIds(firstFour)
    }
  }, [open, template])

  const selectedMilestones = allCompletedMilestones.filter(m => selectedMilestoneIds.includes(m.id))
  const availableMilestones = allCompletedMilestones.filter(m => !selectedMilestoneIds.includes(m.id))

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

            {/* Milestone Selector for Journey Template */}
            {template === "journey" && (
              <div className="border rounded-lg p-3 space-y-2">
                {allCompletedMilestones.length > 0 ? (
                  <>
                    <div className="text-xs font-medium text-gray-700">Milestones to show (max 3):</div>
                    
                    {/* Selected Milestones */}
                    <div className="space-y-1.5">
                      {selectedMilestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-2 text-xs bg-indigo-50 border border-indigo-200 rounded px-2 py-1.5">
                          <span>{milestone.emoji}</span>
                          <span className="flex-1 truncate">{milestone.title}</span>
                          <button
                            onClick={() => setSelectedMilestoneIds(prev => prev.filter(id => id !== milestone.id))}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Available Milestones to Add */}
                    {availableMilestones.length > 0 && selectedMilestones.length < 3 && (
                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-500 mb-1.5">Add milestone:</div>
                        <div className="space-y-1">
                          {availableMilestones.slice(0, 3).map((milestone) => (
                            <button
                              key={milestone.id}
                              onClick={() => {
                                if (selectedMilestoneIds.length < 3) {
                                  setSelectedMilestoneIds(prev => [...prev, milestone.id])
                                }
                              }}
                              className="w-full flex items-center gap-2 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded px-2 py-1.5 text-left transition-colors"
                            >
                              <span>{milestone.emoji}</span>
                              <span className="flex-1 truncate">{milestone.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-gray-500 text-center py-2">
                    <div className="mb-1">🌱</div>
                    <div>Complete milestones in your journey to feature them here!</div>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-2">
              <Button className="w-full" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </div>
          </div>

          <div className="md:w-2/3">
            <div
              ref={shareCardRef}
              className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl"
            >
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 pointer-events-none" />
              
              <div className="relative">
                {template === "journey" && (() => {
                  // Get all milestones (completed and pending) for display
                  const displayMilestones: any[] = []
                  
                  // Add launch date if exists
                  if (launchDate) {
                    displayMilestones.push({
                      id: 'launch',
                      emoji: '🚀',
                      title: `Launched ${userProductName || 'my product'}`,
                      date: launchDate,
                      completed: true
                    })
                  }
                  
                  // Add all preset milestones (completed or pending)
                  presets.forEach(preset => {
                    const existingMilestone = milestones.find(m => 
                      m.title.toLowerCase().includes(preset.title.toLowerCase()) || 
                      (m.type === 'goal_achieved' && m.goal_type === preset.type && preset.current >= preset.target)
                    )
                    const completed = existingMilestone?.unlocked && existingMilestone.date
                    displayMilestones.push({
                      ...preset,
                      date: existingMilestone?.date,
                      completed: !!completed
                    })
                  })

                  // Add custom milestones
                  milestones
                    .filter(m => m.type === 'user_added')
                    .forEach(m => {
                      displayMilestones.push({
                        id: m.id || m.title,
                        emoji: m.emoji || '🏅',
                        title: m.title,
                        date: m.date,
                        completed: !!m.unlocked,
                        current: m.progressCurrent,
                        target: m.progressTarget,
                        unit: m.unit
                      })
                    })

                  // Filter to show only selected ones, or first 4 milestones (completed or pending)
                  const milestonesToShow = selectedMilestoneIds.length > 0
                    ? displayMilestones.filter(m => selectedMilestoneIds.includes(m.id))
                    : displayMilestones.slice(0, 4)

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xl">🚀</div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">My Journey</div>
                          <div className="text-xs text-gray-500">Building {userProductName || "my product"}</div>
                        </div>
                      </div>
                      
                      {/* Journey Milestones Grid - matching dashboard */}
                      <div className="grid grid-cols-2 gap-2">
                        {milestonesToShow.map((milestone: any, index: number) => (
                          <div 
                            key={index} 
                            className={`rounded-lg border p-3 shadow-sm ${
                              milestone.completed 
                                ? 'border-gray-200 bg-white' 
                                : 'border-gray-200 bg-gray-50 opacity-60'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`text-lg ${!milestone.completed ? 'grayscale' : ''}`}>{milestone.emoji}</div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-xs font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {milestone.title}
                                </div>
                                {milestone.completed && milestone.date && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                  </div>
                                )}
                                {!milestone.completed && milestone.type && (
                                  <div className="text-xs text-gray-400 mt-0.5">
                                    {milestone.type === 'mrr' 
                                      ? `$${milestone.current?.toLocaleString() || 0}/$${milestone.target?.toLocaleString()} MRR` 
                                      : `${milestone.current?.toLocaleString() || 0}/${milestone.target?.toLocaleString()} users`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{currentUsers}</div>
                          <div className="text-xs text-gray-600">Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">${currentRevenue}</div>
                          <div className="text-xs text-gray-600">MRR</div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-2 text-xs text-gray-500 text-center">
                        Track your journey at marketingbuddy.app
                      </div>
                    </div>
                  )
                })()}

                {template === "milestone" && showcase && (
                  <div className="space-y-4 text-center">
                    <div className="text-4xl mb-2">{showcase.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-indigo-600 mb-1">🎉 Milestone Unlocked!</div>
                      <div className="text-2xl font-bold text-gray-900">{showcase.title}</div>
                    </div>
                    
                    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-4">
                      <div className="text-sm text-gray-700 mb-1">Progress</div>
                      <div className="text-lg font-bold text-gray-900">{showcase.progress}</div>
                      <div className="text-xs text-gray-600 mt-1">"{showcase.blurb}"</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                        <div className="text-xs text-gray-600 mb-1">Current</div>
                        <div className="text-sm font-bold text-blue-600">{currentUsers.toLocaleString()} users</div>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50/50 p-3">
                        <div className="text-xs text-gray-600 mb-1">Next Goal</div>
                        <div className="text-sm font-bold text-green-600">{nextGoal}</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 text-xs text-gray-500">
                      Building {userProductName || "my product"} • marketingbuddy.app
                    </div>
                  </div>
                )}

                {template === "weekly" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Week {currentWeek} Recap</div>
                        <div className="text-xs text-gray-500">{userProductName || "My Product"}</div>
                      </div>
                    </div>
                    
                    {/* Compact Stats Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="rounded-lg border border-gray-200 bg-white p-2 text-center">
                        <div className="text-lg font-bold text-gray-900">{weekDone}/{weekTotal}</div>
                        <div className="text-xs text-gray-600">Tasks</div>
                      </div>
                      <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-2 text-center">
                        <div className="text-lg font-bold text-orange-600">{streak}</div>
                        <div className="text-xs text-gray-600">Streak</div>
                      </div>
                      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-2 text-center">
                        <div className="text-lg font-bold text-blue-600">{currentUsers}</div>
                        <div className="text-xs text-gray-600">Users</div>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50/50 p-2 text-center">
                        <div className="text-lg font-bold text-green-600">${currentRevenue}</div>
                        <div className="text-xs text-gray-600">MRR</div>
                      </div>
                    </div>
                    
                    {/* Tasks Completed - Random 4 */}
                    {wins.length > 0 && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                        <div className="text-xs font-medium text-gray-700 mb-2">Some tasks I completed:</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {wins.slice(0, 4).map((goal, index) => (
                            <div key={index} className="flex items-start gap-1.5 text-xs text-gray-700">
                              <div className="text-green-500 mt-0.5 text-xs">✓</div>
                              <div className="line-clamp-2">{goal}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Content Generated - Placeholder for future */}
                    <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-3">
                      <div className="text-xs font-medium text-gray-700 mb-2">📝 Content created:</div>
                      <div className="flex flex-wrap gap-1.5">
                        <div className="text-xs bg-white border border-gray-200 rounded px-2 py-1">
                          <span className="font-semibold">3</span> Twitter posts
                        </div>
                        <div className="text-xs bg-white border border-gray-200 rounded px-2 py-1">
                          <span className="font-semibold">2</span> LinkedIn posts
                        </div>
                        <div className="text-xs bg-white border border-gray-200 rounded px-2 py-1">
                          <span className="font-semibold">1</span> Blog post
                        </div>
                      </div>
                    </div>
                    
                    {/* Engagement Stats - Placeholder for future */}
                    <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3">
                      <div className="text-xs font-medium text-gray-700 mb-2">📊 Engagement:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span>👁️</span>
                          <span><span className="font-semibold">1.2k</span> views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>❤️</span>
                          <span><span className="font-semibold">89</span> likes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-2 text-xs text-gray-500 text-center">
                      Track your journey at marketingbuddy.app
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareJourneyDialog
