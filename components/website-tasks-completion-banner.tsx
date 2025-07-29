"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, RefreshCw, Sparkles } from "lucide-react"

interface WebsiteTasksCompletionBannerProps {
  onDismiss: () => void
  onReanalyze: () => void
}

export default function WebsiteTasksCompletionBanner({ onDismiss, onReanalyze }: WebsiteTasksCompletionBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss()
  }

  if (!isVisible) return null

  return (
    <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-8 w-8 text-green-100" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold">🎉 Website Tasks Complete!</h3>
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </div>
              <p className="text-green-100 mb-4">
                Congratulations! You've completed all the website improvement tasks based on your analysis. 
                Your daily tasks will now focus purely on marketing and growth activities.
              </p>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={onReanalyze}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-analyze Website
                </Button>
                <span className="text-green-100 text-sm">
                  Want more website improvement tasks? Re-analyze your site for fresh insights.
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
