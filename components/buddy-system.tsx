"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Trophy, 
  Target, 
  Heart, 
  Flame, 
  Star, 
  Crown, 
  Medal, 
  Zap, 
  Calendar,
  MessageCircle,
  CheckCircle,
  TrendingUp,
  Award,
  Gift,
  UserPlus,
  Search,
  Filter,
  Plus
} from "lucide-react"

interface BuddySystemProps {
  user: any
  streak: number
  xp: number
  todaysTasks: any[]
  showOnlyLeaderboard?: boolean
}

interface Buddy {
  id: string
  name: string
  avatar?: string
  streak: number
  xp: number
  level: number
  isOnline: boolean
  website?: string
  industry?: string
  goals?: string[]
  tasksCompleted: number
  weeklyProgress: number
  currentTasks?: BuddyTask[]
  recentActivity?: BuddyActivity[]
  suggestedTasks?: SuggestedTask[]
}

interface BuddyTask {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate: string
  category: string
}

interface BuddyActivity {
  id: string
  type: 'task_completed' | 'goal_set' | 'challenge_joined' | 'milestone'
  description: string
  timestamp: string
  xpEarned?: number
}

interface SuggestedTask {
  id: string
  title: string
  description: string
  reason: string
  category: string
  xpReward: number
  suggestedBy: string
}

interface Challenge {
  id: string
  title: string
  description: string
  type: 'individual' | 'buddy' | 'community'
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  deadline: string
  participants: number
  completed: boolean
  progress: number
}

interface LeaderboardEntry {
  rank: number
  user: {
    id: string
    name: string
    avatar?: string
  }
  id: string
  name: string
  avatar?: string
  xp: number
  streak: number
  tasksCompleted: number
  level: number
  weeklyXp: number
  monthlyXp?: number
  totalXp?: number
  website?: string
  industry?: string
  product?: string
  goals?: string[]
  recentActivity?: BuddyActivity[]
}

export default function BuddySystem({ user, streak, xp, todaysTasks, showOnlyLeaderboard = false }: BuddySystemProps) {
  const [activeTab, setActiveTab] = useState("buddy")
  const [currentBuddy, setCurrentBuddy] = useState<Buddy | null>(null)
  const [availableBuddies, setAvailableBuddies] = useState<Buddy[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userLevel, setUserLevel] = useState(1)
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([])
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('weekly')
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate user level based on XP
  useEffect(() => {
    const level = Math.floor(xp / 100) + 1
    setUserLevel(level)
  }, [xp])

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Mock available buddies
    setAvailableBuddies([
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
        streak: 12,
        xp: 850,
        level: 9,
        isOnline: true,
        website: "sarahchendesign.com",
        industry: "Design",
        goals: ["Reach 1k followers", "Launch course"],
        tasksCompleted: 45,
        weeklyProgress: 85,
        currentTasks: [
          { id: "t1", title: "Create Instagram post", description: "Design and post about new course", completed: true, dueDate: "2024-02-01", category: "Content" },
          { id: "t2", title: "Email newsletter", description: "Send weekly newsletter to subscribers", completed: false, dueDate: "2024-02-03", category: "Email" },
          { id: "t3", title: "LinkedIn post", description: "Share design tips and insights", completed: false, dueDate: "2024-02-05", category: "Social" }
        ],
        recentActivity: [
          { id: "a1", type: "task_completed", description: "Completed Instagram post for course", timestamp: "2024-02-01T10:30:00Z", xpEarned: 25 },
          { id: "a2", type: "challenge_joined", description: "Joined '7-Day Content Sprint'", timestamp: "2024-01-30T14:15:00Z" },
          { id: "a3", type: "milestone", description: "Reached 500 followers on Instagram", timestamp: "2024-01-29T09:20:00Z" }
        ],
        suggestedTasks: [
          { id: "s1", title: "Create X thread", description: "Share your design process in a thread", reason: "I noticed you're great at visual content", category: "Social", xpReward: 30, suggestedBy: "Sarah Chen" }
        ]
      },
      {
        id: "2", 
        name: "Alex Rodriguez",
        avatar: "/avatars/alex.jpg",
        streak: 8,
        xp: 620,
        level: 7,
        isOnline: false,
        website: "alexdev.io",
        industry: "SaaS",
        goals: ["Get first 100 users", "Content marketing"],
        tasksCompleted: 32,
        weeklyProgress: 70,
        currentTasks: [
          { id: "t4", title: "Write blog post", description: "How to choose the right SaaS tools", completed: false, dueDate: "2024-02-02", category: "Content" },
          { id: "t5", title: "Product demo video", description: "Create demo of new feature", completed: false, dueDate: "2024-02-04", category: "Content" }
        ],
        recentActivity: [
          { id: "a4", type: "task_completed", description: "Published 'SaaS pricing strategies' blog post", timestamp: "2024-01-31T16:45:00Z", xpEarned: 35 },
          { id: "a5", type: "goal_set", description: "Set goal: Get first 100 users", timestamp: "2024-01-30T09:00:00Z" }
        ],
        suggestedTasks: [
          { id: "s2", title: "Create LinkedIn poll", description: "Ask your network about SaaS challenges", reason: "Great way to engage your professional network", category: "Social", xpReward: 20, suggestedBy: "Alex Rodriguez" }
        ]
      },
      {
        id: "3",
        name: "Emma Thompson",
        avatar: "/avatars/emma.jpg", 
        streak: 15,
        xp: 1200,
        level: 12,
        isOnline: true,
        website: "emmathompson.co",
        industry: "E-commerce",
        goals: ["Scale to $10k MRR", "Build email list"],
        tasksCompleted: 67,
        weeklyProgress: 95,
        currentTasks: [
          { id: "t6", title: "Email campaign", description: "Launch Valentine's Day promotion", completed: false, dueDate: "2024-02-05", category: "Email" },
          { id: "t7", title: "Product photoshoot", description: "New product line photos", completed: true, dueDate: "2024-01-30", category: "Content" }
        ],
        recentActivity: [
          { id: "a6", type: "milestone", description: "Reached $5k MRR", timestamp: "2024-02-01T12:00:00Z" },
          { id: "a7", type: "task_completed", description: "Completed product photoshoot", timestamp: "2024-01-30T15:30:00Z", xpEarned: 40 },
          { id: "a8", type: "challenge_joined", description: "Joined 'Community Engagement'", timestamp: "2024-01-28T11:20:00Z" }
        ],
        suggestedTasks: [
          { id: "s3", title: "Create product comparison", description: "Compare your products with competitors", reason: "Your product knowledge could help others make decisions", category: "Content", xpReward: 50, suggestedBy: "Emma Thompson" }
        ]
      }
    ])

    // Mock leaderboard
    setLeaderboard([
      { 
        rank: 1, 
        user: { id: "3", name: "Emma Thompson", avatar: "/avatars/emma.jpg" }, 
        id: "3", 
        name: "Emma Thompson", 
        avatar: "/avatars/emma.jpg",
        xp: 1200, 
        streak: 15, 
        tasksCompleted: 67, 
        level: 12, 
        weeklyXp: 180,
        monthlyXp: 720,
        totalXp: 1200,
        website: "emmathompson.co",
        industry: "E-commerce",
        product: "Handmade jewelry store",
        goals: ["Scale to $10k MRR", "Build email list"],
        recentActivity: [
          { id: "a6", type: "milestone", description: "Reached $5k MRR", timestamp: "2024-02-01T12:00:00Z" },
          { id: "a7", type: "task_completed", description: "Completed product photoshoot", timestamp: "2024-01-30T15:30:00Z", xpEarned: 40 }
        ]
      },
      { 
        rank: 2, 
        user: { id: "4", name: "Marcus Kim", avatar: "/avatars/marcus.jpg" }, 
        id: "4", 
        name: "Marcus Kim", 
        avatar: "/avatars/marcus.jpg",
        xp: 1150, 
        streak: 18, 
        tasksCompleted: 72, 
        level: 12, 
        weeklyXp: 165,
        monthlyXp: 660,
        totalXp: 1150,
        website: "marcustech.io",
        industry: "SaaS",
        product: "Project management tool",
        goals: ["Reach 1000 users", "Launch mobile app"],
        recentActivity: [
          { id: "a9", type: "challenge_joined", description: "Joined 'Content Creator Challenge'", timestamp: "2024-02-01T08:00:00Z" },
          { id: "a10", type: "task_completed", description: "Published feature comparison blog", timestamp: "2024-01-31T14:20:00Z", xpEarned: 35 }
        ]
      },
      { 
        rank: 3, 
        user: { id: "1", name: "Sarah Chen", avatar: "/avatars/sarah.jpg" }, 
        id: "1", 
        name: "Sarah Chen", 
        avatar: "/avatars/sarah.jpg",
        xp: 850, 
        streak: 12, 
        tasksCompleted: 45, 
        level: 9, 
        weeklyXp: 140,
        monthlyXp: 560,
        totalXp: 850,
        website: "sarahchendesign.com",
        industry: "Design",
        product: "Online design course",
        goals: ["Reach 1k followers", "Launch course"],
        recentActivity: [
          { id: "a1", type: "task_completed", description: "Completed Instagram post for course", timestamp: "2024-02-01T10:30:00Z", xpEarned: 25 },
          { id: "a2", type: "challenge_joined", description: "Joined '7-Day Content Sprint'", timestamp: "2024-01-30T14:15:00Z" }
        ]
      },
      { 
        rank: 4, 
        user: { id: "current", name: user.name || "You", avatar: user.avatar }, 
        id: "current", 
        name: user.name || "You", 
        avatar: user.avatar,
        xp: xp, 
        streak: streak, 
        tasksCompleted: 28, 
        level: userLevel, 
        weeklyXp: 95,
        monthlyXp: 380,
        totalXp: xp,
        website: user.website || "your-website.com",
        industry: user.industry || "Your Industry",
        product: user.product || "Your product or service",
        goals: user.goals || ["Build consistent marketing habits", "Grow online presence"]
      },
      { 
        rank: 5, 
        user: { id: "2", name: "Alex Rodriguez", avatar: "/avatars/alex.jpg" }, 
        id: "2", 
        name: "Alex Rodriguez", 
        avatar: "/avatars/alex.jpg",
        xp: 620, 
        streak: 8, 
        tasksCompleted: 32, 
        level: 7, 
        weeklyXp: 85,
        monthlyXp: 340,
        totalXp: 620,
        website: "alexdev.io",
        industry: "SaaS",
        product: "Developer productivity app",
        goals: ["Get first 100 users", "Content marketing"],
        recentActivity: [
          { id: "a4", type: "task_completed", description: "Published 'SaaS pricing strategies' blog post", timestamp: "2024-01-31T16:45:00Z", xpEarned: 35 },
          { id: "a5", type: "goal_set", description: "Set goal: Get first 100 users", timestamp: "2024-01-30T09:00:00Z" }
        ]
      }
    ])

    // Mock challenges
    setChallenges([
      {
        id: "1",
        title: "7-Day Content Sprint",
        description: "Create and publish content for 7 consecutive days",
        type: "individual",
        difficulty: "medium",
        xpReward: 150,
        deadline: "2024-02-07",
        participants: 24,
        completed: false,
        progress: 42
      },
      {
        id: "2", 
        title: "Buddy Goal Crusher",
        description: "Complete 15 tasks together with your buddy this week",
        type: "buddy",
        difficulty: "hard",
        xpReward: 250,
        deadline: "2024-02-05",
        participants: 12,
        completed: false,
        progress: 60
      },
      {
        id: "3",
        title: "Community Engagement",
        description: "Help 5 community members by commenting on their progress",
        type: "community", 
        difficulty: "easy",
        xpReward: 75,
        deadline: "2024-02-03",
        participants: 45,
        completed: true,
        progress: 100
      }
    ])
  }, [user.name, xp, streak, userLevel])

  const handleBuddyRequest = (buddy: Buddy) => {
    // In real app, this would send a buddy request
    console.log(`Sending buddy request to ${buddy.name}`)
  }

  const handleAcceptBuddy = (buddy: Buddy) => {
    setCurrentBuddy(buddy)
    // In real app, this would update the database
  }

  const handleAddSuggestedTask = (task: SuggestedTask) => {
    // In real app, this would add the task to user's task list
    console.log(`Adding suggested task: ${task.title}`)
    // Show success message
    alert(`Added "${task.title}" to your task list!`)
  }

  const handleHelpWithTask = (task: BuddyTask) => {
    // In real app, this would send a help request to buddy
    console.log(`Requesting help with task: ${task.title}`)
    alert(`Help request sent to ${currentBuddy?.name} for "${task.title}"`)
  }

  const handleSendMessage = () => {
    // In real app, this would open messaging interface
    console.log(`Opening message to ${currentBuddy?.name}`)
    alert(`Messaging feature would open here`)
  }

  const handleUserClick = (entry: LeaderboardEntry) => {
    setSelectedUser(entry)
    setShowUserProfile(true)
  }

  const getLeaderboardData = () => {
    // Filter based on period and search query
    let filteredData = leaderboard.map(entry => ({
      ...entry,
      displayXp: leaderboardPeriod === 'weekly' ? entry.weeklyXp : 
                 leaderboardPeriod === 'monthly' ? (entry.monthlyXp || entry.weeklyXp * 4) :
                 entry.totalXp || entry.xp
    }))

    // Apply search filter
    if (searchQuery.trim()) {
      filteredData = filteredData.filter(entry => 
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.website?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.product?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filteredData
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'  
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Target className="h-4 w-4" />
      case 'buddy': return <Users className="h-4 w-4" />
      case 'community': return <Heart className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  // If showOnlyLeaderboard is true, render only the leaderboard content
  if (showOnlyLeaderboard) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Find Your Marketing Buddy</span>
                </CardTitle>
                <CardDescription>
                  Discover successful marketers, see their strategies, and connect with potential accountability partners
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={leaderboardPeriod === 'weekly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLeaderboardPeriod('weekly')}
                >
                  Weekly
                </Button>
                <Button
                  variant={leaderboardPeriod === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLeaderboardPeriod('monthly')}
                >
                  Monthly
                </Button>
                <Button
                  variant={leaderboardPeriod === 'alltime' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLeaderboardPeriod('alltime')}
                >
                  All Time
                </Button>
              </div>
            </div>
            
            {/* Search Input */}
            <div className="mt-4">
              <Input
                placeholder="Search by name, website, industry, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getLeaderboardData().length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No marketers found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'No marketers available'}
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                getLeaderboardData().map((entry) => (
                <div 
                  key={entry.user.id} 
                  className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                    entry.user.id === 'current' ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                  onClick={() => handleUserClick(entry)}
                >
                  <div className="flex items-center space-x-3">
                    {entry.rank <= 3 ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        entry.rank === 1 ? 'bg-yellow-100' : 
                        entry.rank === 2 ? 'bg-gray-100' : 'bg-orange-100'
                      }`}>
                        {entry.rank === 1 ? <Crown className="h-4 w-4 text-yellow-600" /> :
                         entry.rank === 2 ? <Medal className="h-4 w-4 text-gray-600" /> :
                         <Award className="h-4 w-4 text-orange-600" />}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                        {entry.rank}
                      </div>
                    )}
                    <Avatar>
                      <AvatarImage src={entry.user.avatar} />
                      <AvatarFallback>{entry.user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{entry.user.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Level {entry.level}</span>
                      <span>{entry.streak} day streak</span>
                      <span>{entry.tasksCompleted} tasks</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{entry.displayXp} XP</div>
                    <div className="text-sm text-gray-600">
                      {leaderboardPeriod === 'weekly' ? 'this week' : 
                       leaderboardPeriod === 'monthly' ? 'this month' : 'all time'}
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Profile Modal */}
        <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser?.avatar} />
                  <AvatarFallback>
                    {selectedUser?.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser?.name}</h3>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                {/* User Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedUser.level}</div>
                    <p className="text-sm text-gray-600">Level</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedUser.streak}</div>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedUser.tasksCompleted}</div>
                    <p className="text-sm text-gray-600">Tasks Done</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedUser.totalXp || selectedUser.xp}</div>
                    <p className="text-sm text-gray-600">Total XP</p>
                  </Card>
                </div>

                {/* Product/Business Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>What They're Marketing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700">Product/Service</h4>
                        <p className="text-lg">{selectedUser.product}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700">Website</h4>
                        {selectedUser.website && (
                          <a 
                            href={selectedUser.website.startsWith('http') ? selectedUser.website : `https://${selectedUser.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            {selectedUser.website}
                          </a>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700">Industry</h4>
                        <p>{selectedUser.industry}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700">Goals</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedUser.goals?.map((goal, index) => (
                            <Badge key={index} variant="secondary">{goal}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                {selectedUser.recentActivity && selectedUser.recentActivity.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedUser.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                            <div className="mt-1">
                              {activity.type === 'task_completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                              {activity.type === 'goal_set' && <Target className="h-5 w-5 text-blue-500" />}
                              {activity.type === 'challenge_joined' && <Zap className="h-5 w-5 text-yellow-500" />}
                              {activity.type === 'milestone' && <Award className="h-5 w-5 text-purple-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {new Date(activity.timestamp).toLocaleDateString()}
                                </span>
                                {activity.xpEarned && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{activity.xpEarned} XP
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    className="flex items-center space-x-2"
                    onClick={() => {
                      setShowUserProfile(false)
                      alert(`Buddy request sent to ${selectedUser.name}!`)
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Send Buddy Request</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={() => {
                      setShowUserProfile(false)
                      alert(`Message sent to ${selectedUser.name}!`)
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Send Message</span>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buddy" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>My Buddy</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Challenges</span>
          </TabsTrigger>
        </TabsList>

        {/* My Buddy Tab */}
        <TabsContent value="buddy" className="space-y-6">
          {currentBuddy ? (
            <div className="space-y-6">
              {/* Current Buddy Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Your Marketing Buddy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={currentBuddy.avatar} />
                      <AvatarFallback>{currentBuddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{currentBuddy.name}</h3>
                      <p className="text-gray-600">{currentBuddy.website}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Flame className="h-3 w-3" />
                          <span>{currentBuddy.streak} day streak</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Level {currentBuddy.level}</span>
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${currentBuddy.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm text-gray-600">{currentBuddy.isOnline ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Weekly Progress</h4>
                      <Progress value={currentBuddy.weeklyProgress} className="mb-2" />
                      <p className="text-sm text-gray-600">{currentBuddy.weeklyProgress}% complete</p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Tasks Completed</h4>
                      <div className="text-2xl font-bold text-blue-600">{currentBuddy.tasksCompleted}</div>
                      <p className="text-sm text-gray-600">This month</p>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentBuddy.goals?.map((goal, index) => (
                          <Badge key={index} variant="secondary">{goal}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-6">
                    <Button 
                      className="flex items-center space-x-2"
                      onClick={handleSendMessage}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Send Message</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                      onClick={() => alert('Check-in feature would open here')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Check In</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Buddy Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>{currentBuddy.name}'s Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentBuddy.recentActivity?.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                        <div className="mt-1">
                          {activity.type === 'task_completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {activity.type === 'goal_set' && <Target className="h-5 w-5 text-blue-500" />}
                          {activity.type === 'challenge_joined' && <Zap className="h-5 w-5 text-yellow-500" />}
                          {activity.type === 'milestone' && <Award className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </span>
                            {activity.xpEarned && (
                              <Badge variant="secondary" className="text-xs">
                                +{activity.xpEarned} XP
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Buddy's Current Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{currentBuddy.name}'s Current Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentBuddy.currentTasks?.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={task.completed ? "outline" : "default"}
                          disabled={task.completed}
                          className="flex items-center space-x-1"
                          onClick={() => handleHelpWithTask(task)}
                        >
                          {task.completed ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Help</span>
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Task Suggestions from Buddy */}
              {currentBuddy.suggestedTasks && currentBuddy.suggestedTasks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-pink-500" />
                      <span>Task Suggestions from {currentBuddy.name}</span>
                    </CardTitle>
                    <CardDescription>
                      Your buddy thinks these tasks would help you based on your progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentBuddy.suggestedTasks.map((suggestion) => (
                        <div key={suggestion.id} className="p-4 rounded-lg border border-pink-200 bg-pink-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{suggestion.title}</h4>
                              <p className="text-sm text-gray-700 mt-1">{suggestion.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {suggestion.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs flex items-center space-x-1">
                                  <Zap className="h-3 w-3" />
                                  <span>{suggestion.xpReward} XP</span>
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mt-2 italic">
                                "{suggestion.reason}"
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              className="flex items-center space-x-1"
                              onClick={() => handleAddSuggestedTask(suggestion)}
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shared Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Shared Progress This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Your Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Tasks Completed</span>
                          <span className="font-semibold">5/7</span>
                        </div>
                        <Progress value={71} />
                        <div className="flex justify-between">
                          <span>XP Earned</span>
                          <span className="font-semibold">95 XP</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{currentBuddy.name}'s Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Tasks Completed</span>
                          <span className="font-semibold">6/7</span>
                        </div>
                        <Progress value={85} />
                        <div className="flex justify-between">
                          <span>XP Earned</span>
                          <span className="font-semibold">140 XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Find Your Marketing Buddy</span>
                </CardTitle>
                <CardDescription>
                  Get paired with an accountability partner who shares your goals and keeps you motivated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No buddy yet</h3>
                  <p className="text-gray-600 mb-6">Find someone to share your marketing journey with!</p>
                  <Button onClick={() => setActiveTab("find")} className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Find a Buddy</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Leaderboard</span>
                  </CardTitle>
                  <CardDescription>
                    See how you rank against other marketers
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={leaderboardPeriod === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLeaderboardPeriod('weekly')}
                  >
                    Weekly
                  </Button>
                  <Button
                    variant={leaderboardPeriod === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLeaderboardPeriod('monthly')}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={leaderboardPeriod === 'alltime' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLeaderboardPeriod('alltime')}
                  >
                    All Time
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getLeaderboardData().map((entry) => (
                  <div 
                    key={entry.user.id} 
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                      entry.user.id === 'current' ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                    onClick={() => handleUserClick(entry)}
                  >
                    <div className="flex items-center space-x-3">
                      {entry.rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.rank === 1 ? 'bg-yellow-100' : 
                          entry.rank === 2 ? 'bg-gray-100' : 'bg-orange-100'
                        }`}>
                          {entry.rank === 1 ? <Crown className="h-4 w-4 text-yellow-600" /> :
                           entry.rank === 2 ? <Medal className="h-4 w-4 text-gray-600" /> :
                           <Award className="h-4 w-4 text-orange-600" />}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                          {entry.rank}
                        </div>
                      )}
                      <Avatar>
                        <AvatarImage src={entry.user.avatar} />
                        <AvatarFallback>{entry.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold">{entry.user.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Level {entry.level}</span>
                        <span>{entry.streak} day streak</span>
                        <span>{entry.tasksCompleted} tasks</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">{entry.displayXp} XP</div>
                      <div className="text-sm text-gray-600">
                        {leaderboardPeriod === 'weekly' ? 'this week' : 
                         leaderboardPeriod === 'monthly' ? 'this month' : 'all time'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span>Marketing Challenges</span>
              </CardTitle>
              <CardDescription>
                Take on challenges to earn XP and improve your marketing skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(challenge.type)}
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        </div>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Zap className="h-3 w-3" />
                              <span>{challenge.xpReward} XP</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{challenge.participants}</span>
                            </span>
                          </div>
                          <span className="text-gray-600">Due {challenge.deadline}</span>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          disabled={challenge.completed}
                          variant={challenge.completed ? "outline" : "default"}
                        >
                          {challenge.completed ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            "Join Challenge"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Find Buddy Tab */}
        <TabsContent value="find" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Find Your Marketing Buddy</span>
              </CardTitle>
              <CardDescription>
                Connect with other marketers who share your goals and industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableBuddies.map((buddy) => (
                  <Card key={buddy.id} className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={buddy.avatar} />
                        <AvatarFallback>{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{buddy.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${buddy.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{buddy.website} • {buddy.industry}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Flame className="h-3 w-3" />
                            <span>{buddy.streak} days</span>
                          </Badge>
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>Level {buddy.level}</span>
                          </Badge>
                          <span className="text-gray-600">{buddy.tasksCompleted} tasks completed</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {buddy.goals?.slice(0, 2).map((goal, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{goal}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBuddyRequest(buddy)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Request
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptBuddy(buddy)}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Buddy Up
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Profile Modal */}
      <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedUser?.avatar} />
                <AvatarFallback>
                  {selectedUser?.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{selectedUser?.name}</h3>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedUser.level}</div>
                  <p className="text-sm text-gray-600">Level</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedUser.streak}</div>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedUser.tasksCompleted}</div>
                  <p className="text-sm text-gray-600">Tasks Done</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedUser.totalXp || selectedUser.xp}</div>
                  <p className="text-sm text-gray-600">Total XP</p>
                </Card>
              </div>

              {/* Product/Business Info */}
              <Card>
                <CardHeader>
                  <CardTitle>What They're Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Product/Service</h4>
                      <p className="text-lg">{selectedUser.product}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Website</h4>
                      {selectedUser.website && (
                        <a 
                          href={selectedUser.website.startsWith('http') ? selectedUser.website : `https://${selectedUser.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {selectedUser.website}
                        </a>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Industry</h4>
                      <p>{selectedUser.industry}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Goals</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedUser.goals?.map((goal, index) => (
                          <Badge key={index} variant="secondary">{goal}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              {selectedUser.recentActivity && selectedUser.recentActivity.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedUser.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                          <div className="mt-1">
                            {activity.type === 'task_completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {activity.type === 'goal_set' && <Target className="h-5 w-5 text-blue-500" />}
                            {activity.type === 'challenge_joined' && <Zap className="h-5 w-5 text-yellow-500" />}
                            {activity.type === 'milestone' && <Award className="h-5 w-5 text-purple-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </span>
                              {activity.xpEarned && (
                                <Badge variant="secondary" className="text-xs">
                                  +{activity.xpEarned} XP
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setShowUserProfile(false)
                    // In real app, this would send a buddy request
                    alert(`Buddy request sent to ${selectedUser.name}!`)
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Send Buddy Request</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setShowUserProfile(false)
                    alert(`Message sent to ${selectedUser.name}!`)
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Message</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
