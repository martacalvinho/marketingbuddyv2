"use client"

import { Button } from "@/components/ui/button"
import { Flame, Zap, Trophy } from "lucide-react"
import Image from "next/image"

interface DashboardHeaderProps {
  productName?: string
  streak: number
  xp: number
  xpToNextLevel: number
  currentLevel: number
  xpProgress: number
  onOpenLeaderboard: () => void
  onOpenProfile: () => void
}

export default function DashboardHeader({ productName, streak, xp, xpToNextLevel, currentLevel, xpProgress, onOpenLeaderboard, onOpenProfile }: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md overflow-hidden">
              <Image src="/MB.png" alt="Marketing Buddy" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Marketing Buddy</h1>
              <button 
                onClick={onOpenProfile}
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Welcome back, {productName || 'Calvinho'}!
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 h-[44px]">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">{streak} day streak</span>
            </div>

            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 h-[44px]">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">Level {currentLevel}</div>
                <div className="text-xs text-gray-500">{xp} XP</div>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={onOpenLeaderboard}
              className="flex items-center space-x-2 bg-gray-50 rounded-lg border-gray-200 hover:bg-gray-100 transition-all h-[44px]"
            >
              <Trophy className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Leaderboard</span>
            </Button>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="pb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-gray-600">Progress to Level {currentLevel + 1}</span>
            <span className="font-semibold text-indigo-600">
              {xp % xpToNextLevel}/{xpToNextLevel} XP
            </span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
