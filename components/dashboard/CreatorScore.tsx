"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { 
  Flame, 
  Trophy, 
  Zap, 
  Target, 
  TrendingUp, 
  Star,
  Crown,
  Sparkles,
  Gift,
  Rocket,
  Heart,
  Award,
  Twitter,
  Linkedin,
  Instagram,
  MessageSquare,
  FileText,
  Video
} from "lucide-react"

interface CreatorScoreProps {
  user: any
  streak: number
  xp: number
  currentDay: number
  onNavigate?: (tab: string, challenge?: any) => void
}

// Platform icons for content overlay
const platformIcons: Record<string, any> = {
  x: Twitter,
  twitter: Twitter,
  linkedin: Linkedin,
  reddit: MessageSquare,
  instagram: Instagram,
  tiktok: Video,
  blog: FileText,
}

const platformColors: Record<string, string> = {
  x: "text-blue-400",
  twitter: "text-blue-400",
  linkedin: "text-blue-600",
  reddit: "text-orange-500",
  instagram: "text-pink-500",
  tiktok: "text-white",
  blog: "text-green-500",
}

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_post', title: 'First Steps', description: 'Create your first piece of content', icon: Rocket, xp: 50, condition: (stats: any) => stats.totalContent >= 1 },
  { id: 'week_warrior', title: 'Week Warrior', description: 'Complete 7 days in a row', icon: Flame, xp: 100, condition: (stats: any) => stats.streak >= 7 },
  { id: 'content_machine', title: 'Content Machine', description: 'Create 10 pieces of content', icon: Zap, xp: 150, condition: (stats: any) => stats.totalContent >= 10 },
  { id: 'multi_platform', title: 'Multi-Platform', description: 'Post on 3+ different platforms', icon: Target, xp: 100, condition: (stats: any) => stats.platformCount >= 3 },
  { id: 'streak_master', title: 'Streak Master', description: 'Maintain a 14-day streak', icon: Crown, xp: 200, condition: (stats: any) => stats.streak >= 14 },
  { id: 'prolific_creator', title: 'Prolific Creator', description: 'Create 25 pieces of content', icon: Star, xp: 250, condition: (stats: any) => stats.totalContent >= 25 },
  { id: 'month_champion', title: 'Month Champion', description: 'Complete 30 days in a row', icon: Trophy, xp: 500, condition: (stats: any) => stats.streak >= 30 },
  { id: 'content_legend', title: 'Content Legend', description: 'Create 50 pieces of content', icon: Award, xp: 500, condition: (stats: any) => stats.totalContent >= 50 },
]

// Motivational messages based on streak
const getMotivationalMessage = (streak: number, totalContent: number) => {
  if (streak === 0) return { emoji: "🌱", message: "Start your journey today!", subtext: "Every creator starts somewhere" }
  if (streak === 1) return { emoji: "🔥", message: "You're on fire!", subtext: "Keep the momentum going" }
  if (streak < 7) return { emoji: "⚡", message: `${streak} days strong!`, subtext: "Building great habits" }
  if (streak < 14) return { emoji: "🚀", message: "Week warrior!", subtext: "You're in the top 10% of creators" }
  if (streak < 30) return { emoji: "💎", message: "Unstoppable!", subtext: "Your consistency is paying off" }
  return { emoji: "👑", message: "Legendary streak!", subtext: "You're a content machine" }
}

// Calculate creator level and title
const getCreatorLevel = (xp: number) => {
  const levels = [
    { level: 1, title: "Aspiring Creator", minXp: 0, color: "text-zinc-400" },
    { level: 2, title: "Content Apprentice", minXp: 100, color: "text-blue-400" },
    { level: 3, title: "Rising Star", minXp: 300, color: "text-green-400" },
    { level: 4, title: "Content Pro", minXp: 600, color: "text-purple-400" },
    { level: 5, title: "Marketing Maven", minXp: 1000, color: "text-amber-400" },
    { level: 6, title: "Growth Hacker", minXp: 1500, color: "text-orange-400" },
    { level: 7, title: "Content Legend", minXp: 2500, color: "text-pink-400" },
    { level: 8, title: "Marketing Master", minXp: 4000, color: "text-red-400" },
    { level: 9, title: "Creator Elite", minXp: 6000, color: "text-cyan-400" },
    { level: 10, title: "Content God", minXp: 10000, color: "text-yellow-400" },
  ]
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) {
      const nextLevel = levels[i + 1]
      const xpForNext = nextLevel ? nextLevel.minXp - xp : 0
      const progress = nextLevel ? ((xp - levels[i].minXp) / (nextLevel.minXp - levels[i].minXp)) * 100 : 100
      return { ...levels[i], xpForNext, progress, nextTitle: nextLevel?.title }
    }
  }
  return { ...levels[0], xpForNext: 100, progress: 0, nextTitle: levels[1].title }
}

// Daily challenges
const getDailyChallenge = (currentDay: number) => {
  const challenges = [
    { title: "Share a win", description: "Post about something that went well today", xp: 25, icon: Trophy, platform: "linkedin" },
    { title: "Teach something", description: "Create educational content for your audience", xp: 30, icon: Sparkles, platform: "x" },
    { title: "Behind the scenes", description: "Show your process or workspace", xp: 20, icon: Heart, platform: "instagram" },
    { title: "Ask for feedback", description: "Engage your audience with a question", xp: 25, icon: MessageSquare, platform: "x" },
    { title: "Share a struggle", description: "Be vulnerable about a challenge you faced", xp: 35, icon: Target, platform: "linkedin" },
    { title: "Celebrate others", description: "Highlight someone else's work", xp: 20, icon: Star, platform: "x" },
    { title: "Quick tip", description: "Share a bite-sized piece of advice", xp: 25, icon: Zap, platform: "x" },
  ]
  return challenges[currentDay % challenges.length]
}

export default function CreatorScore({ user, streak, xp, currentDay, onNavigate }: CreatorScoreProps) {
  const [contentStats, setContentStats] = useState({
    totalContent: 0,
    thisWeek: 0,
    platformCount: 0,
    platforms: {} as Record<string, number>,
    recentContent: [] as any[],
  })
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [showAchievementPopup, setShowAchievementPopup] = useState<typeof ACHIEVEMENTS[0] | null>(null)

  // Load content stats
  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) {
        console.log('CreatorScore: No user ID, skipping stats load')
        return
      }
      
      try {
        console.log('CreatorScore: Loading content stats for user:', user.id)
        const { data, error } = await supabase
          .from('content')
          .select('id, platform, status, created_at, engagement_metrics')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('CreatorScore: Supabase error:', error)
          throw error
        }

        console.log('CreatorScore: Loaded content items:', data?.length || 0)
        console.log('CreatorScore: Content statuses:', data?.map(d => ({ id: d.id, status: d.status, platform: d.platform })))

        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const platforms: Record<string, number> = {}
        let thisWeek = 0

        // Count ALL content, not just published
        data?.forEach(item => {
          platforms[item.platform] = (platforms[item.platform] || 0) + 1
          if (new Date(item.created_at) > weekAgo) thisWeek++
        })

        setContentStats({
          totalContent: data?.length || 0,
          thisWeek,
          platformCount: Object.keys(platforms).length,
          platforms,
          recentContent: data?.slice(0, 5) || [],
        })
      } catch (e) {
        console.error('Failed to load content stats:', e)
      }
    }

    loadStats()
  }, [user?.id])

  // Check for new achievements
  useEffect(() => {
    const stats = { ...contentStats, streak }
    const newUnlocked: string[] = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (achievement.condition(stats) && !unlockedAchievements.includes(achievement.id)) {
        newUnlocked.push(achievement.id)
      }
    })

    if (newUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newUnlocked])
      // Show popup for first new achievement
      const firstNew = ACHIEVEMENTS.find(a => a.id === newUnlocked[0])
      if (firstNew) setShowAchievementPopup(firstNew)
    }
  }, [contentStats, streak])

  const levelInfo = getCreatorLevel(xp)
  const motivation = getMotivationalMessage(streak, contentStats.totalContent)
  const dailyChallenge = getDailyChallenge(currentDay)
  const DailyChallengeIcon = dailyChallenge.icon

  return (
    <div className="space-y-4">
      {/* Achievement Popup */}
      {showAchievementPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-96 bg-black/60 border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center animate-bounce">
                <showAchievementPopup.icon className="h-10 w-10 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-1">Achievement Unlocked!</h3>
              <p className="text-white font-semibold text-lg">{showAchievementPopup.title}</p>
              <p className="text-zinc-400 text-sm mb-4">{showAchievementPopup.description}</p>
              <Badge className="bg-amber-500 text-black font-bold">+{showAchievementPopup.xp} XP</Badge>
              <Button 
                className="w-full mt-4 bg-amber-500 text-black hover:bg-amber-400"
                onClick={() => setShowAchievementPopup(null)}
              >
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Creator Score Card */}
      <Card className="bg-black/40 border-white/5 overflow-hidden relative">
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30`}>
                  <span className="text-2xl font-bold text-black">{levelInfo.level}</span>
                </div>
                {streak >= 7 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <Flame className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className={`font-bold text-lg ${levelInfo.color}`}>{levelInfo.title}</p>
                <p className="text-zinc-500 text-sm">{xp.toLocaleString()} XP Total</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl">{motivation.emoji}</p>
              <p className="text-xs text-zinc-500">{motivation.subtext}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* XP Progress to next level */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Level {levelInfo.level}</span>
              <span>{levelInfo.nextTitle ? `${levelInfo.xpForNext} XP to ${levelInfo.nextTitle}` : 'Max Level!'}</span>
            </div>
            <Progress value={levelInfo.progress} className="h-2 bg-zinc-800" indicatorClassName="bg-gradient-to-r from-amber-500 to-orange-500" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
              <p className="text-xl font-bold text-white">{streak}</p>
              <p className="text-xs text-zinc-500">Day Streak</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <FileText className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-xl font-bold text-white">{contentStats.totalContent}</p>
              <p className="text-xs text-zinc-500">Content Created</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
              <p className="text-xl font-bold text-white">{contentStats.thisWeek}</p>
              <p className="text-xs text-zinc-500">This Week</p>
            </div>
          </div>

          {/* Platform Distribution */}
          {Object.keys(contentStats.platforms).length > 0 && (
            <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
              <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Content by Platform</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(contentStats.platforms).map(([platform, count]) => {
                  const Icon = platformIcons[platform] || FileText
                  return (
                    <Badge key={platform} variant="outline" className="border-zinc-700 bg-zinc-800/50 text-zinc-300 gap-1.5">
                      <Icon className={`h-3 w-3 ${platformColors[platform] || 'text-zinc-400'}`} />
                      {count}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Daily Challenge */}
          <div className="p-4 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <DailyChallengeIcon className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-white">Daily Challenge</p>
                  <Badge className="bg-purple-500/20 text-purple-300 text-xs border-purple-500/30">+{dailyChallenge.xp} XP</Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{dailyChallenge.description}</p>
              </div>
              <Button 
                size="sm" 
                className="bg-purple-500 text-white hover:bg-purple-400 flex-shrink-0"
                onClick={() => {
                  const challengeTask = {
                    platformId: dailyChallenge.platform,
                    task: {
                      title: dailyChallenge.title,
                      description: dailyChallenge.description,
                      platform: dailyChallenge.platform,
                      category: 'content',
                      xp: dailyChallenge.xp
                    }
                  }
                  onNavigate?.('studio', challengeTask)
                }}
              >
                Start
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Preview */}
      <Card className="bg-black/20 border-white/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              Achievements
            </CardTitle>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
              {unlockedAchievements.length}/{ACHIEVEMENTS.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {ACHIEVEMENTS.slice(0, 8).map(achievement => {
              const isUnlocked = unlockedAchievements.includes(achievement.id) || 
                achievement.condition({ ...contentStats, streak })
              return (
                <div 
                  key={achievement.id}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all ${
                    isUnlocked 
                      ? 'bg-amber-500/20 border border-amber-500/30' 
                      : 'bg-zinc-800/50 border border-zinc-700/30 opacity-40'
                  }`}
                  title={`${achievement.title}: ${achievement.description}`}
                >
                  <achievement.icon className={`h-6 w-6 ${isUnlocked ? 'text-amber-400' : 'text-zinc-600'}`} />
                  <p className={`text-[10px] mt-1 text-center leading-tight ${isUnlocked ? 'text-amber-300' : 'text-zinc-600'}`}>
                    {achievement.title}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
