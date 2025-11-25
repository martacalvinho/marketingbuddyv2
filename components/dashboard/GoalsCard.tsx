"use client"

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

export default function GoalsCard({ user, currentDay, milestones, onAddClick, compact = false }: GoalsCardProps) {
  if (compact) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-lime-400" />
              <span className="text-sm font-medium text-white">Goal Progress</span>
            </div>
            <span className="text-xs text-lime-400 font-medium">Day {currentDay} of {parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30}</span>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-lime-400 transition-all duration-500" 
              style={{ width: `${Math.min(100, (currentDay / (parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)) * 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">
              Target: {parseInt(user.goals?.primary?.target || user.goalAmount).toLocaleString()} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'MRR'}
            </span>
            <Button variant="ghost" size="sm" onClick={onAddClick} className="h-5 px-2 text-[10px] text-slate-400 hover:text-white hover:bg-white/5">
              <Plus className="h-3 w-3 mr-1" /> Add Milestone
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
          Track your progress towards your {user.goals?.primary?.timeline || user.goalTimeline}-month goal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-200">
                {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'User Growth Goal' : 'Revenue Goal (MRR)'}
              </h3>
              <p className="text-sm text-slate-400">
                Target: {parseInt(user.goals?.primary?.target || user.goalAmount).toLocaleString()} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'} in {user.goals?.primary?.timeline || user.goalTimeline} months
              </p>
            </div>
            <Badge variant="outline" className="text-sm border-white/10 text-slate-300">
              {user.goals?.primary?.timeline || user.goalTimeline} month plan
            </Badge>
          </div>
          
          {/* Progress visualization */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Current Progress</span>
              <span className="font-medium text-lime-400">Day {currentDay} of {parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30}</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-lime-400 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (currentDay / (parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)) * 100)}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Started</span>
              <span>{Math.round((currentDay / (parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)) * 100)}% complete</span>
              <span>Goal: {user.goals?.primary?.target || user.goalAmount} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'}</span>
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
              {/* Predefined milestones */}
              {[25, 50, 75, 100].map((percentage) => {
                const milestoneDay = Math.round((percentage / 100) * parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)
                const milestoneValue = Math.round((percentage / 100) * parseInt(user.goals?.primary?.target || user.goalAmount))
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
                      {percentage}% - {milestoneValue.toLocaleString()} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'}
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
              {milestones.map((milestone: any, index: number) => (
                <div key={milestone.id || index} className="flex items-center space-x-2 p-2 rounded bg-blue-900/20 border border-blue-500/20 text-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">
                    {milestone.title}
                    <span className="text-xs ml-1 opacity-70">({milestone.date})</span>
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
