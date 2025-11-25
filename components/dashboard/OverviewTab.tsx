"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { Zap, CheckCircle2, Trophy, ArrowRight, BarChart3, Calendar, Users, TrendingUp, Twitter, Linkedin, Instagram, MessageSquare, FileText, Video, Eye, Heart, Flame } from "lucide-react"
import type { Milestone } from "@/hooks/use-milestones"
import CreatorScore from "./CreatorScore"

interface WeekSummary {
  total: number
  done: number
  goals: string[]
  content?: { platform: string; count: number; views?: number; likes?: number }[]
}

interface OverviewTabProps {
  user: any
  streak: number
  xp: number
  currentDay: number
  todaysTasks: any[]
  onNavigate: (tab: string) => void
  onGenerateContent: () => void
  weekStats?: WeekSummary[]
  milestones?: Milestone[]
}

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 })

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return "0"
  return numberFormatter.format(Math.max(0, value))
}

const formatBadgeDate = (input?: string) => {
  if (!input) return null
  const parsed = new Date(input)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

const capitalize = (input?: string) => {
  if (!input) return ""
  return input.charAt(0).toUpperCase() + input.slice(1)
}

export default function OverviewTab({
  user,
  streak,
  xp,
  currentDay,
  todaysTasks,
  onNavigate,
  onGenerateContent,
  weekStats = [],
  milestones = []
}: OverviewTabProps) {
  const completedToday = todaysTasks.filter((t) => t.completed).length
  const totalToday = todaysTasks.length
  const progress = totalToday > 0 ? (completedToday / totalToday) * 100 : 0
  const pendingTasks = todaysTasks.filter((t) => !t.completed && !t.skipped)
  const nextTask = pendingTasks[0]

  const xpToNextLevel = 100
  const currentLevel = Math.floor(xp / xpToNextLevel) + 1
  const xpIntoLevel = xp % xpToNextLevel
  const xpRemaining = xpIntoLevel === 0 ? xpToNextLevel : xpToNextLevel - xpIntoLevel

  const primaryGoal = user.goals?.primary ?? null
  const goalType = primaryGoal?.type || user.goalType || "users"
  const goalLabel = goalType === "mrr" ? "MRR" : "users"
  const goalTarget = parseInt(String(primaryGoal?.target || user.goalAmount || "0"), 10) || 0
  const goalCurrent = parseInt(String(primaryGoal?.current || user.goalCurrent || "0"), 10) || 0
  const timelineMonths = parseInt(String(primaryGoal?.timeline || user.goalTimeline || "6"), 10)
  const totalPlanDays = Number.isFinite(timelineMonths) ? timelineMonths * 30 : null
  const timelineProgress = totalPlanDays ? Math.min(100, (currentDay / totalPlanDays) * 100) : 0
  const goalProgress = goalTarget > 0 ? Math.min(100, (goalCurrent / goalTarget) * 100) : 0

  const normalizedMilestones = Array.isArray(milestones) ? milestones : []
  const sortedMilestones = normalizedMilestones
    .slice()
    .sort((a, b) => {
      const aDate = a?.date ? new Date(a.date).getTime() : Number.NaN
      const bDate = b?.date ? new Date(b.date).getTime() : Number.NaN
      if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) return aDate - bDate
      const aSort = a?.sortOrder ?? a?.sort_order ?? 0
      const bSort = b?.sortOrder ?? b?.sort_order ?? 0
      return aSort - bSort
    })
  const upcomingMilestone =
    sortedMilestones.find((m) => m.unlocked === false) ??
    sortedMilestones.find((m) => m.unlocked !== true) ??
    sortedMilestones[0] ??
    null

  const milestoneCurrent =
    Number(
      upcomingMilestone?.progressCurrent ??
        upcomingMilestone?.progress_current ??
        goalCurrent
    ) || 0
  const milestoneTarget =
    Number(
      upcomingMilestone?.progressTarget ??
        upcomingMilestone?.progress_target ??
        goalTarget
    ) || goalTarget
  const milestoneProgress = milestoneTarget > 0 ? Math.min(100, (milestoneCurrent / milestoneTarget) * 100) : goalProgress || timelineProgress
  const milestoneTitle =
    upcomingMilestone?.title ||
    (goalTarget ? `${formatNumber(goalTarget)} ${goalLabel}` : "Add a milestone")
  const milestoneDescription =
    upcomingMilestone?.description ||
    (goalTarget
      ? `Working towards ${formatNumber(goalTarget)} ${goalLabel}.`
      : "Head to Journey to create a milestone so we can track it here.")
  const milestoneBadgeLabel =
    formatBadgeDate(upcomingMilestone?.date) ||
    upcomingMilestone?.emoji ||
    (goalTarget ? `${Math.round(goalProgress)}%` : "Active")
  const milestoneFooter =
    milestoneTarget > 0
      ? `${formatNumber(milestoneCurrent)} / ${formatNumber(milestoneTarget)} ${goalLabel}`
      : `Day ${currentDay}${totalPlanDays ? ` • ${Math.round(timelineProgress)}% of timeline` : ""}`

  const focusValue = capitalize(typeof user.focusArea === "string" ? user.focusArea : "") || "Growth"
  const audienceSummary =
    typeof user.targetAudience === "string"
      ? user.targetAudience
      : user.targetAudience?.profileName ||
        user.targetAudience?.description ||
        user.targetAudience?.primary?.name ||
        "Define your ICP"

  const weeklyBase: WeekSummary[] = weekStats && weekStats.length > 0
    ? weekStats
    : [{ total: totalToday, done: completedToday, goals: todaysTasks.map((task) => task.title), content: [] }]

  const weeklyChartData = weeklyBase.map((week, index) => ({
    name: `Week ${index + 1}`,
    completion: week.total > 0 ? Math.round((week.done / week.total) * 100) : 0,
    done: week.done,
    total: week.total,
    content: week.content || []
  }))

  // Platform icon mapping for content overlay
  const platformIconMap: Record<string, any> = {
    x: Twitter,
    twitter: Twitter,
    linkedin: Linkedin,
    reddit: MessageSquare,
    instagram: Instagram,
    tiktok: Video,
    blog: FileText,
  }

  const platformColorMap: Record<string, string> = {
    x: "text-blue-400",
    twitter: "text-blue-400",
    linkedin: "text-blue-600",
    reddit: "text-orange-500",
    instagram: "text-pink-500",
    tiktok: "text-white",
    blog: "text-green-500",
  }

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  })()

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <Card className="bg-black/20 border-white/5 overflow-hidden relative group hover:border-white/10 hover:ring-1 hover:ring-white/5 transition-all duration-300 backdrop-blur-sm">
      <div className={`absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 ${color} scale-150 rotate-12`}>
        <Icon className="h-32 w-32" />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {sub && <Badge variant="secondary" className="bg-white/5 text-zinc-400 hover:bg-white/10 border-white/5 font-normal tracking-wide">{sub}</Badge>}
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{value}</h3>
          <p className="text-sm text-zinc-500 font-medium">{title}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{user.productName || "there"}</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            {totalToday > 0
              ? <span>You have <span className="text-white font-bold">{pendingTasks.length} tasks</span> remaining for Day {currentDay}.</span>
              : "Ready to grow? Check your Daily Mission."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onGenerateContent} className="bg-lime-400 hover:bg-lime-500 text-black font-bold px-6 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] transition-all">
            <Zap className="h-4 w-4 mr-2" />
            Quick Create
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Day Streak"
          value={`${streak} days`}
          sub={streak > 0 ? "Keep going!" : "Start today!"}
          icon={Flame}
          color="text-orange-400"
        />
        <StatCard
          title="Tasks Done"
          value={`${completedToday}/${todaysTasks.length}`}
          sub={pendingTasks.length > 0 ? "Keep it up!" : "You're on fire!"}
          icon={Zap}
          color="text-amber-400"
        />
        <StatCard
          title="Experience"
          value={`Lvl ${currentLevel}`}
          sub={`${xpRemaining} XP to next`}
          icon={Trophy}
          color="text-purple-400"
        />
        <StatCard
          title="Focus Area"
          value={focusValue}
          sub={audienceSummary}
          icon={Users}
          color="text-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/20 border-white/5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-white/5">
              <div>
                <CardTitle className="text-xl text-white tracking-tight">Today's Priority</CardTitle>
                <CardDescription className="text-zinc-500 mt-1">
                  Your daily roadmap to success
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 hover:border-lime-400/30 transition-all group" onClick={() => onNavigate("plan")}>
                View Full Plan <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-xs text-zinc-400 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <div
                       className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 shadow-[0_0_10px_rgba(163,230,53,0.4)] transition-all duration-700 ease-out"
                       style={{ width: `${progress}%` }}
                     />
                   </div>
                </div>

                <div className="space-y-3">
                  {todaysTasks.slice(0, 3).map((task: any) => (
                    <div
                      key={task.id}
                      className="flex items-start space-x-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                    >
                      <div
                        className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.completed
                            ? "bg-lime-400 border-lime-400 text-black"
                            : "border-zinc-700 group-hover:border-lime-400/50"
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${task.completed ? "text-zinc-500 line-through decoration-zinc-700" : "text-zinc-200"}`}>
                          {task.title}
                        </h4>
                        {task.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{task.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.platform && (
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] text-zinc-500 uppercase tracking-wider">
                            {task.platform}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {todaysTasks.length > 3 && (
                     <div className="text-center pt-2">
                        <button onClick={() => onNavigate("plan")} className="text-xs text-zinc-500 hover:text-lime-400 transition-colors">
                           + {todaysTasks.length - 3} more tasks
                        </button>
                     </div>
                  )}
                  {todaysTasks.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm mb-4">No tasks scheduled for today.</p>
                      <Button size="sm" variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300" onClick={() => onNavigate("plan")}>
                        Create today's plan
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/5 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white tracking-tight">Weekly Momentum</CardTitle>
                {/* Content platform icons overlay */}
                <div className="flex items-center gap-1">
                  {weeklyChartData.length > 0 && weeklyChartData[weeklyChartData.length - 1].content?.map((c, i) => {
                    const Icon = platformIconMap[c.platform] || FileText
                    return (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 ${platformColorMap[c.platform] || 'text-zinc-400'}`}
                        title={`${c.count} ${c.platform} posts`}
                      >
                        <Icon className="h-3 w-3" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyChartData}>
                    <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis
                      stroke="#52525b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                      itemStyle={{ color: "#a3e635" }}
                      cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
                              <p className="text-white font-semibold">{data.name}</p>
                              <p className="text-lime-400 text-sm">{data.completion}% completion</p>
                              <p className="text-zinc-400 text-xs">{data.done}/{data.total} tasks</p>
                              {data.content && data.content.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-zinc-700">
                                  <p className="text-zinc-500 text-xs mb-1">Content created:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {data.content.map((c: any, i: number) => {
                                      const Icon = platformIconMap[c.platform] || FileText
                                      return (
                                        <div key={i} className="flex items-center gap-1 text-xs">
                                          <Icon className={`h-3 w-3 ${platformColorMap[c.platform] || 'text-zinc-400'}`} />
                                          <span className="text-zinc-300">{c.count}</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  {data.content.some((c: any) => c.views || c.likes) && (
                                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                                      {data.content.reduce((sum: number, c: any) => sum + (c.views || 0), 0) > 0 && (
                                        <span className="flex items-center gap-1">
                                          <Eye className="h-3 w-3" />
                                          {data.content.reduce((sum: number, c: any) => sum + (c.views || 0), 0)}
                                        </span>
                                      )}
                                      {data.content.reduce((sum: number, c: any) => sum + (c.likes || 0), 0) > 0 && (
                                        <span className="flex items-center gap-1">
                                          <Heart className="h-3 w-3" />
                                          {data.content.reduce((sum: number, c: any) => sum + (c.likes || 0), 0)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completion"
                      stroke="#a3e635"
                      strokeWidth={3}
                      dot={{ fill: "#09090b", stroke: "#a3e635", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#a3e635" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Content Performance Card */}
          <Card className="bg-black/20 border-white/5 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-lg text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-lime-400" />
                Content Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Total Content Created */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Total Created</p>
                      <p className="text-2xl font-bold text-white">
                        {weeklyChartData.reduce((sum, week) => sum + (week.content?.reduce((s, c) => s + c.count, 0) || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lime-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-lime-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Avg Completion</p>
                      <p className="text-2xl font-bold text-white">
                        {weeklyChartData.length > 0 
                          ? Math.round(weeklyChartData.reduce((sum, w) => sum + w.completion, 0) / weeklyChartData.length)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Engagement */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Total Engagement</p>
                      <p className="text-2xl font-bold text-white">
                        {weeklyChartData.reduce((sum, week) => {
                          const views = week.content?.reduce((s, c) => s + (c.views || 0), 0) || 0
                          const likes = week.content?.reduce((s, c) => s + (c.likes || 0), 0) || 0
                          return sum + views + likes
                        }, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-black/40 border-amber-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2 tracking-tight">
                <Trophy className="h-4 w-4 text-amber-400" /> Next Milestone
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMilestone || goalTarget ? (
                <div className="space-y-5">
                  <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-amber-500/20 blur-2xl h-24 w-24 rounded-full"></div>
                    
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-3 gap-4">
                         <div className="space-y-1">
                           <span className="text-amber-200 font-bold text-lg block leading-tight">{milestoneTitle}</span>
                           <p className="text-xs text-amber-200/60 line-clamp-2">{milestoneDescription}</p>
                         </div>
                         <Badge className="bg-amber-500 text-black hover:bg-amber-400 border-0 whitespace-nowrap font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                           {milestoneBadgeLabel}
                         </Badge>
                       </div>
                       
                       <Progress value={milestoneProgress} className="h-2 bg-amber-950/30" indicatorClassName="bg-amber-400" />
                       
                       <div className="flex items-center justify-between text-[10px] font-medium text-amber-200/50 mt-2 uppercase tracking-wider">
                         <span>Progress</span>
                         <span>{milestoneFooter}</span>
                       </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors h-10"
                    onClick={() => onNavigate("journey")}
                  >
                    View Journey Map
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-zinc-400 space-y-4 text-center py-4">
                  <p>Set a milestone to track your progress towards success.</p>
                  <Button
                    variant="outline"
                    className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    onClick={() => onNavigate("journey")}
                  >
                    Configure Milestones
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-white tracking-tight">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  className="h-24 flex flex-col items-center justify-center gap-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-lime-500/30 group transition-all rounded-xl"
                  onClick={onGenerateContent}
                >
                  <div className="h-10 w-10 rounded-full bg-lime-500/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-lime-500/20">
                     <Zap className="h-5 w-5 text-lime-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-400 group-hover:text-white">New Content</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="h-24 flex flex-col items-center justify-center gap-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-blue-500/30 group transition-all rounded-xl"
                  onClick={() => onNavigate("plan")}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-blue-500/20">
                     <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-400 group-hover:text-white">Schedule</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="h-24 flex flex-col items-center justify-center gap-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-purple-500/30 group transition-all rounded-xl"
                  onClick={() => onNavigate("buddy")}
                >
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-purple-500/20">
                     <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-400 group-hover:text-white">Ask Buddy</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="h-24 flex flex-col items-center justify-center gap-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-amber-500/30 group transition-all rounded-xl"
                  onClick={() => onNavigate("journey")}
                >
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-amber-500/20">
                     <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-400 group-hover:text-white">Log Win</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Creator Score & Gamification */}
          <CreatorScore 
            user={user}
            streak={streak}
            xp={xp}
            currentDay={currentDay}
            onNavigate={(tab: string, challenge?: any) => {
              if (challenge) {
                // Store challenge in sessionStorage so dashboard can pick it up
                sessionStorage.setItem('dailyChallenge', JSON.stringify(challenge))
              }
              onNavigate(tab)
            }}
          />
        </div>
      </div>
    </div>
  )
}
