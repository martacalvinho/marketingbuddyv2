"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Plus, Trophy } from "lucide-react"

interface GoalsCardProps {
  user: any
  currentDay: number
  milestones: any[]
  onAddClick: () => void
  compact?: boolean
}

// Helper to extract goal info from milestones or user settings
const useGoalInfo = (user: any, milestones: any[]) => {
  return useMemo(() => {
    // First, try to find the primary goal milestone (usually the main target)
    const goalMilestone = milestones.find((m: any) => 
      m.goal_type === 'revenue' || m.goal_type === 'users' || 
      m.goalType === 'revenue' || m.goalType === 'users' ||
      (m.progress_target && m.progress_target > 0)
    )
    
    // Determine goal type
    const goalType = goalMilestone?.goal_type || goalMilestone?.goalType || 
                     user.goals?.primary?.type || user.goalType || 'revenue'
    
    // Determine target amount - prioritize milestone target, then user goals
    let targetAmount = 0
    if (goalMilestone?.progress_target) {
      targetAmount = Number(goalMilestone.progress_target)
    } else if (goalMilestone?.progressTarget) {
      targetAmount = Number(goalMilestone.progressTarget)
    } else if (user.goals?.primary?.target) {
      targetAmount = Number(user.goals.primary.target)
    } else if (user.goalAmount) {
      targetAmount = Number(user.goalAmount)
    }
    
    // Determine current progress
    let currentProgress = 0
    if (goalMilestone?.progress_current) {
      currentProgress = Number(goalMilestone.progress_current)
    } else if (goalMilestone?.progressCurrent) {
      currentProgress = Number(goalMilestone.progressCurrent)
    } else if (goalType === 'revenue' && user.currentMrr) {
      currentProgress = Number(user.currentMrr)
    } else if (goalType === 'users' && user.currentUsers) {
      currentProgress = Number(user.currentUsers)
    }
    
    // Determine timeline in months
    const timelineMonths = Number(user.goals?.primary?.timeline || user.goalTimeline) || 6
    const totalDays = timelineMonths * 30
    
    // Get unit label
    const unitLabel = goalType === 'users' ? 'users' : 'MRR'
    const unitLabelFull = goalType === 'users' ? 'users' : 'USD/month'
    
    // Calculate progress percentage (based on target, not days)
    const progressPercent = targetAmount > 0 ? Math.min(100, (currentProgress / targetAmount) * 100) : 0
    
    return {
      goalType,
      targetAmount,
      currentProgress,
      timelineMonths,
      totalDays,
      unitLabel,
      unitLabelFull,
      progressPercent,
      hasValidTarget: targetAmount > 0 && !isNaN(targetAmount),
      goalMilestone
    }
  }, [user, milestones])
}

export default function GoalsCard({ user, currentDay, milestones, onAddClick, compact = false }: GoalsCardProps) {
  const goalInfo = useGoalInfo(user, milestones)
  
  if (compact) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-lime-400" />
              <span className="text-sm font-medium text-white">Goal Progress</span>
            </div>
            <span className="text-xs text-lime-400 font-medium">
              Day {currentDay} of {goalInfo.totalDays}
            </span>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-lime-400 transition-all duration-500" 
              style={{ width: `${Math.min(100, (currentDay / goalInfo.totalDays) * 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">
              {goalInfo.hasValidTarget ? (
                <>Target: ${goalInfo.targetAmount.toLocaleString()} {goalInfo.unitLabel}</>
              ) : (
                <>Set your goal in Journey tab</>
              )}
            </span>
            <Button variant="ghost" size="sm" onClick={onAddClick} className="h-5 px-2 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10">
              <Plus className="h-3 w-3 mr-1" /> Log Win
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 rounded-lg border-white/10 bg-white/5 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Trophy className="h-5 w-5 text-lime-400" />
          <span>Your Growth Journey</span>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Track your progress towards your {goalInfo.timelineMonths}-month goal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-200">
                {goalInfo.goalType === 'users' ? 'User Growth Goal' : 'Revenue Goal (MRR)'}
              </h3>
              <p className="text-sm text-slate-400">
                {goalInfo.hasValidTarget ? (
                  <>Target: {goalInfo.goalType === 'revenue' ? '$' : ''}{goalInfo.targetAmount.toLocaleString()} {goalInfo.unitLabelFull} in {goalInfo.timelineMonths} months</>
                ) : (
                  <>Set your target in the Journey tab</>
                )}
              </p>
            </div>
            <Badge variant="outline" className="text-sm border-white/10 text-slate-300">
              {goalInfo.timelineMonths} month plan
            </Badge>
          </div>
          
          {/* Progress visualization */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Current Progress</span>
              <span className="font-medium text-lime-400">Day {currentDay} of {goalInfo.totalDays}</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-lime-400 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (currentDay / goalInfo.totalDays) * 100)}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Started</span>
              <span>{Math.round((currentDay / goalInfo.totalDays) * 100)}% complete</span>
              {goalInfo.hasValidTarget && (
                <span>Goal: {goalInfo.goalType === 'revenue' ? '$' : ''}{goalInfo.targetAmount.toLocaleString()} {goalInfo.unitLabelFull}</span>
              )}
            </div>
          </div>
          
          {/* Milestones */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-300">Milestones</h4>
              <Button variant="outline" size="sm" onClick={onAddClick} className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {/* Predefined milestones - only show if we have a valid target */}
              {goalInfo.hasValidTarget && [25, 50, 75, 100].map((percentage) => {
                const milestoneDay = Math.round((percentage / 100) * goalInfo.totalDays)
                const milestoneValue = Math.round((percentage / 100) * goalInfo.targetAmount)
                const isReached = currentDay >= milestoneDay
                
                return (
                  <div key={percentage} className={`flex items-center space-x-2 p-2 rounded border ${
                    isReached ? 'bg-lime-400/10 border-lime-400/20 text-lime-200' : 'bg-white/[0.02] border-white/5 text-slate-500'
                  }`}>
                    {isReached ? (
                      <CheckCircle2 className="h-4 w-4 text-lime-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-700" />
                    )}
                    <span className="text-sm font-medium">
                      {percentage}% - {goalInfo.goalType === 'revenue' ? '$' : ''}{milestoneValue.toLocaleString()} {goalInfo.unitLabelFull}
                      <span className="text-xs ml-1 opacity-70">(Day {milestoneDay})</span>
                    </span>
                    {isReached && (
                      <Badge variant="secondary" className="text-xs ml-auto bg-lime-400/20 text-lime-400 border-0">
                        Reached!
                      </Badge>
                    )}
                  </div>
                )
              })}
              
              {/* User-defined milestones */}
              {milestones.filter((m: any) => m.type === 'user_added' || !m.goal_type).map((milestone: any, index: number) => (
                <div key={milestone.id || index} className="flex items-center space-x-2 p-2 rounded bg-blue-900/20 border border-blue-500/20 text-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">
                    {milestone.emoji || '🎯'} {milestone.title}
                    {milestone.date && <span className="text-xs ml-1 opacity-70">({milestone.date})</span>}
                  </span>
                  <Badge variant="secondary" className="text-xs ml-auto bg-blue-500/20 text-blue-300 border-0">
                    Custom
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
