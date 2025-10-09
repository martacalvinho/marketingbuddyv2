"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WeekLockNoticeProps {
  message: string
  onOpenWeeklyReview: () => void
  onRetry: () => void
}

export default function WeekLockNotice({ message, onOpenWeeklyReview, onRetry }: WeekLockNoticeProps) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="text-amber-700 text-sm flex-1">{message}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onOpenWeeklyReview}>Open Weekly Review</Button>
          <Button size="sm" onClick={onRetry}>Check Again</Button>
        </div>
      </CardContent>
    </Card>
  )
}
