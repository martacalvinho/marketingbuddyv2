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
    <div className="bg-[#020604]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-400 flex items-center justify-center rounded-sm">
              <Image src="/MB.png" alt="Marketing Buddy" width={20} height={20} className="object-contain brightness-0" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Marketing Buddy</h1>
              <button 
                onClick={onOpenProfile}
                className="text-xs text-slate-400 hover:text-lime-400 transition-colors cursor-pointer font-medium uppercase tracking-wider flex items-center gap-1"
              >
                Welcome back, {productName || 'Calvinho'}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-sm border h-[40px] transition-all ${
              streak >= 30 
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30' 
                : streak >= 7 
                  ? 'bg-orange-500/10 border-orange-500/20'
                  : 'bg-white/5 border-white/10'
            }`}>
              <Flame className={`h-4 w-4 ${streak >= 7 ? 'text-orange-400 fill-orange-400' : 'text-orange-500 fill-orange-500'} ${streak >= 30 ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-bold text-slate-200">
                {streak > 0 ? `${streak} day${streak !== 1 ? 's' : ''}` : 'No streak'}
              </span>
              {streak >= 7 && streak < 30 && <span className="text-[10px] text-orange-400">💪</span>}
              {streak >= 30 && <span className="text-[10px] text-orange-300">🔥</span>}
            </div>

            <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-sm border border-white/10 h-[40px]">
              <Zap className="h-4 w-4 text-lime-400 fill-lime-400" />
              <div className="text-right leading-none">
                <div className="text-sm font-bold text-slate-200">Lvl {currentLevel}</div>
                <div className="text-[10px] text-slate-500 font-medium">{xp} XP</div>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={onOpenLeaderboard}
              className="flex items-center space-x-2 bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 h-[40px] rounded-sm"
            >
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-bold">Leaderboard</span>
            </Button>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="pb-0 -mb-[1px]">
          <div className="relative h-[2px] bg-white/10 w-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-lime-600 to-lime-400 transition-all duration-500 box-shadow-[0_0_10px_rgba(163,230,53,0.5)]"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
