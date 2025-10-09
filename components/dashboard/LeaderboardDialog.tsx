"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface LeaderboardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LeaderboardDialog({ open, onOpenChange }: LeaderboardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Marketing Leaderboard</span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-4 text-gray-700">
          <p>Leaderboards and community competitions are coming soon to boost accountability.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly Leaderboard</CardTitle>
                <CardDescription>Track streaks and XP vs your buddy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span>You</span>
                  <Badge variant="outline">95 XP</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2 opacity-70">
                  <span>Buddy</span>
                  <Badge variant="outline">120 XP</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All-time Progress</CardTitle>
                <CardDescription>Celebrate milestones together</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Tasks Completed</span>
                    <Badge>28</Badge>
                  </div>
                  <div className="flex items-center justify-between opacity-70">
                    <span>Buddy</span>
                    <Badge>45</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
