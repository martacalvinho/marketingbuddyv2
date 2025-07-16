"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface WeekStat {
  total: number
  done: number
  goals: string[]
}

interface WeekProgressProps {
  stats: WeekStat[] // length 4
  currentWeek: number // 1-based
}

export default function WeekProgress({ stats, currentWeek }: WeekProgressProps) {
  const [openWeek, setOpenWeek] = React.useState<number>(currentWeek)
  const [expandedGoals, setExpandedGoals] = React.useState<Record<number, boolean>>({})
  const brand = "#4f46e5" // indigo-600 (Tailwind)

  const toggleGoals = (week: number) => {
    setOpenWeek(openWeek === week ? 0 : week)
  }

  const toggleExpandGoals = (week: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedGoals(prev => ({ ...prev, [week]: !prev[week] }))
  }

  return (
    <div className="space-y-6">
      {/* Circles Row */}
      <div className="flex items-center justify-between gap-6">
        {stats.map((stat, idx) => {
          const week = idx + 1
          const percent = stat.total === 0 ? 0 : Math.min(100, Math.round((stat.done / stat.total) * 100))
          const isCurrent = week === currentWeek
          const isPast = week < currentWeek
          const isComplete = (percent === 100 && stat.total > 0) || isPast

          const circleClasses = cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center text-sm font-medium shadow-sm cursor-pointer transition-all hover:scale-105",
            isComplete ? "text-white" : isCurrent ? "text-indigo-600" : "text-gray-500",
            openWeek === week && "ring-2 ring-indigo-300 ring-offset-2"
          )

          const circleStyle: React.CSSProperties = isComplete
            ? { backgroundColor: brand }
            : {
                background: `conic-gradient(${brand} ${percent}%, #f9fafb ${percent}% 100%)`,
                border: `2px solid ${isCurrent ? brand : "#d1d5db"}`,
              }

          return (
            <div key={week} className="flex flex-col items-center space-y-2">
              <div className={circleClasses} style={circleStyle} onClick={() => toggleGoals(week)}>
                {isComplete ? "✓" : `W${week}`}
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 font-medium">
                  {stat.done}/{stat.total} tasks
                </div>
                <div className="text-xs text-gray-500">
                  Week {week}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Goals Section */}
      {openWeek > 0 && stats[openWeek - 1] && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Week {openWeek} Goals</h4>
            <span className="text-sm text-gray-500">
              {stats[openWeek - 1].done}/{stats[openWeek - 1].total} completed
            </span>
          </div>
          {stats[openWeek - 1].goals.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {stats[openWeek - 1].goals
                .slice(0, expandedGoals[openWeek] ? undefined : 5)
                .map((goal, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-1">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              {stats[openWeek - 1].goals.length > 5 && (
                <li>
                  <button
                    onClick={(e) => toggleExpandGoals(openWeek, e)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    {expandedGoals[openWeek]
                      ? "Show less"
                      : `+${stats[openWeek - 1].goals.length - 5} more goals`}
                  </button>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No goals set for this week yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
