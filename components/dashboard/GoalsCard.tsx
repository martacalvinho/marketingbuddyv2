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
}

export default function GoalsCard({ user, currentDay, milestones, onAddClick }: GoalsCardProps) {
  return (
    <Card className="mb-6 rounded-3xl border-gray-100 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span>Your Growth Journey</span>
        </CardTitle>
        <CardDescription>
          Track your progress towards your {user.goals?.primary?.timeline || user.goalTimeline}-month goal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'User Growth Goal' : 'Revenue Goal (MRR)'}
              </h3>
              <p className="text-sm text-gray-600">
                Target: {parseInt(user.goals?.primary?.target || user.goalAmount).toLocaleString()} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'} in {user.goals?.primary?.timeline || user.goalTimeline} months
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {user.goals?.primary?.timeline || user.goalTimeline} month plan
            </Badge>
          </div>
          
          {/* Progress visualization */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Progress</span>
              <span className="font-medium">Day {currentDay} of {parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30}</span>
            </div>
            <Progress 
              value={(currentDay / (parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Started</span>
              <span>{Math.round((currentDay / (parseInt(user.goals?.primary?.timeline || user.goalTimeline) * 30)) * 100)}% complete</span>
              <span>Goal: {user.goals?.primary?.target || user.goalAmount} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'}</span>
            </div>
          </div>
          
          {/* Milestones */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">Milestones</h4>
              <Button variant="outline" size="sm" onClick={onAddClick}>
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
                  <div key={percentage} className={`flex items-center space-x-2 p-2 rounded ${
                    isReached ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {isReached ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className="text-sm">
                      {percentage}% - {milestoneValue.toLocaleString()} {user.goals?.primary?.type === 'users' || user.goalType === 'users' ? 'users' : 'USD/month'}
                      <span className="text-xs ml-1">(Day {milestoneDay})</span>
                    </span>
                    {isReached && (
                      <Badge variant="secondary" className="text-xs ml-auto">
                        Reached!
                      </Badge>
                    )}
                  </div>
                )
              })}
              
              {/* User-defined milestones */}
              {milestones.map((milestone: any, index: number) => (
                <div key={milestone.id || index} className="flex items-center space-x-2 p-2 rounded bg-blue-50 text-blue-800">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    {milestone.title}
                    <span className="text-xs ml-1">({milestone.date})</span>
                  </span>
                  <Badge variant="secondary" className="text-xs ml-auto">
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
