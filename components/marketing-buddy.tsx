"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Trophy, MessageSquare, TrendingUp, Zap, Clock, Globe, CheckCircle2, Heart, Eye, ListChecks, BarChart3, Target, Sparkles, ArrowRight, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface MarketingBuddyProps {
  user: any
}

export default function MarketingBuddy({ user }: MarketingBuddyProps) {
  const [email, setEmail] = useState(user.email || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleWaitlistSubmit = async () => {
    if (!email || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await supabase.from('buddy_messages').insert({
        user_id: user.id,
        role: 'user',
        message: 'Waitlist signup for Buddy System',
        context: {
          type: 'waitlist',
          email,
          timestamp: new Date().toISOString()
        }
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting waitlist:', error)
      alert('Failed to join waitlist. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Bold Hero - No Gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-lime-400/5 blur-3xl rounded-full" />
        <div className="relative bg-black/40 border border-white/10 rounded-xl p-12 text-center backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-lime-400/10 border-2 border-lime-400/20 mb-6">
            <Users className="h-10 w-10 text-lime-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Accountability Partner System
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Get matched with another founder. Check in daily. Share wins. Give feedback. Stay consistent together.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 px-4 py-2 text-sm font-bold">
              <Sparkles className="h-4 w-4 mr-2" />
              Launching Q1 2025
            </Badge>
            <Badge className="bg-white/5 text-white border border-white/10 px-4 py-2 text-sm font-bold">
              <Users className="h-4 w-4 mr-2" />
              247 Founders Waiting
            </Badge>
          </div>
        </div>
      </div>

      {/* Why You Need a Buddy */}
      <Card className="border-white/5 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white tracking-tight">Why Solo Founders Need Accountability Partners</CardTitle>
          <CardDescription className="text-zinc-400 mt-2">
            Building alone is hard. A buddy makes it easier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Stay Consistent</h3>
              <p className="text-sm text-zinc-400">
                Knowing someone's watching your progress makes you 3x more likely to complete your daily tasks.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Get Real Feedback</h3>
              <p className="text-sm text-zinc-400">
                Share drafts, get honest opinions, and improve your content before publishing.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Learn Faster</h3>
              <p className="text-sm text-zinc-400">
                See what's working for someone in a similar stage. Steal their best tactics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-white/5 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white tracking-tight">How It Works</CardTitle>
          <CardDescription className="text-zinc-400 mt-2">
            Simple daily accountability that actually works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="absolute -left-3 top-0 w-8 h-8 rounded-full bg-lime-400 text-black font-bold flex items-center justify-center text-sm">
                1
              </div>
              <div className="pl-8">
                <h3 className="text-lg font-bold text-white mb-2">Get Matched</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  We pair you with a founder at a similar stage, working on similar goals.
                </p>
                <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Sarah Chen</p>
                      <p className="text-xs text-zinc-500">SaaS • 50 users • Day 23</p>
                    </div>
                  </div>
                  <Badge className="bg-lime-400/10 text-lime-400 border-0 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Matched!
                  </Badge>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-3 top-0 w-8 h-8 rounded-full bg-lime-400 text-black font-bold flex items-center justify-center text-sm">
                2
              </div>
              <div className="pl-8">
                <h3 className="text-lg font-bold text-white mb-2">Daily Check-ins</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Each morning, see what your buddy committed to. Each evening, check if they did it.
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Post launch thread</span>
                    <CheckCircle2 className="h-4 w-4 text-lime-400" />
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-300">DM 5 users</span>
                    <CheckCircle2 className="h-4 w-4 text-lime-400" />
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Ship feature X</span>
                    <div className="h-4 w-4 rounded-full border-2 border-zinc-700" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-3 top-0 w-8 h-8 rounded-full bg-lime-400 text-black font-bold flex items-center justify-center text-sm">
                3
              </div>
              <div className="pl-8">
                <h3 className="text-lg font-bold text-white mb-2">Give Feedback</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Review their content drafts, celebrate wins, and keep each other honest.
                </p>
                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-blue-400 mt-0.5" />
                    <p className="text-xs text-blue-200 italic">
                      "Love the hook! Maybe add a stat in the 2nd tweet?"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Heart className="h-3 w-3" />
                    <span>From your buddy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview Section */}
      <Card className="border-white/5 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white tracking-tight">What You'll See</CardTitle>
          <CardDescription className="text-zinc-400 mt-2">
            A peek at your buddy dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks */}
            <div className="p-5 rounded-xl border border-white/5 bg-black/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <h4 className="font-medium text-white text-sm">Tasks</h4>
                </div>
                <Badge variant="outline" className="border-white/10 text-zinc-500 text-[10px]">Today</Badge>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/5 text-zinc-300">
                  <span>Publish launch tweet thread</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">done</Badge>
                </li>
                <li className="flex items-center justify-between bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/5 text-zinc-300">
                  <span>Update website hero copy</span>
                  <Badge variant="secondary" className="bg-white/5 text-zinc-400 text-[10px]">in progress</Badge>
                </li>
                <li className="flex items-center justify-between bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/5 text-zinc-300">
                  <span>DM 3 users for feedback</span>
                  <Badge variant="outline" className="border-white/10 text-zinc-500 text-[10px]">queued</Badge>
                </li>
              </ul>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" disabled className="border-white/10 text-zinc-500 h-8 text-xs w-full">Suggest task</Button>
                <Button size="sm" disabled className="bg-white/10 text-zinc-500 h-8 text-xs w-full">Encourage</Button>
              </div>
            </div>

            {/* Website Snapshot */}
            <div className="p-5 rounded-xl border border-white/5 bg-black/40">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-white text-sm">Website Snapshot</h4>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-white/[0.02] rounded-lg border border-white/5 p-3 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Visits (7d)</div>
                  <div className="font-bold text-white text-lg">1,240</div>
                </div>
                <div className="bg-white/[0.02] rounded-lg border border-white/5 p-3 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Signups</div>
                  <div className="font-bold text-white text-lg">42</div>
                </div>
                <div className="bg-white/[0.02] rounded-lg border border-white/5 p-3 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Conv.</div>
                  <div className="font-bold text-white text-lg">3.4%</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 justify-center">
                <BarChart3 className="h-3 w-3" />
                <span>Deep dive metrics coming soon</span>
              </div>
            </div>

            {/* Milestones */}
            <div className="p-5 rounded-xl border border-white/5 bg-black/40">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-rose-500" />
                <h4 className="font-medium text-white text-sm">Progress & Milestones</h4>
              </div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-center gap-3 bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Reached first 10 users</span>
                </li>
                <li className="flex items-center gap-3 bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/5">
                  <div className="h-4 w-4 rounded-full border-2 border-zinc-700" />
                  <span>30-day streak</span>
                </li>
                <li className="flex items-center gap-3 bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/5">
                  <div className="h-4 w-4 rounded-full border-2 border-zinc-700" />
                  <span>$100 MRR</span>
                </li>
              </ul>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" disabled className="border-white/10 text-zinc-500 h-8 text-xs w-full">Recommend</Button>
                <Button size="sm" disabled className="bg-white/10 text-zinc-500 h-8 text-xs w-full">Celebrate</Button>
              </div>
            </div>

            {/* Recent Content */}
            <div className="p-5 rounded-xl border border-white/5 bg-black/40">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-indigo-500" />
                <h4 className="font-medium text-white text-sm">Recent Content</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-white/[0.02] rounded-lg px-3 py-3 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-300 text-xs">LinkedIn: "What I learned shipping v1"</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Views 1.2k · Likes 54</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 px-2 text-[10px] border-white/10 text-zinc-500" variant="outline" disabled>Suggest edit</Button>
                  </div>
                </div>
                <div className="bg-white/[0.02] rounded-lg px-3 py-3 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-300 text-xs">X: "3 lessons from early users"</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Views 8.4k · Likes 210</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 px-2 text-[10px] bg-white/10 text-zinc-500" disabled>
                      <Heart className="h-3 w-3 mr-1" />
                      Kudos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Proof */}
      <Card className="border-white/5 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white tracking-tight text-center">What Founders Are Saying</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/[0.02] rounded-xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">
                  🚀
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Alex Rivera</p>
                  <p className="text-xs text-zinc-500">SaaS Founder</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 italic">
                "Having someone check in on me daily completely changed my consistency. Went from 2 posts/week to 5."
              </p>
            </div>

            <div className="p-6 bg-white/[0.02] rounded-xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">
                  💪
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Jamie Park</p>
                  <p className="text-xs text-zinc-500">Content Creator</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 italic">
                "My buddy's feedback saved me from posting cringe content. Now I run everything by them first."
              </p>
            </div>

            <div className="p-6 bg-white/[0.02] rounded-xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Morgan Lee</p>
                  <p className="text-xs text-zinc-500">Indie Hacker</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 italic">
                "Seeing my buddy's progress motivated me to keep going when I wanted to quit. Best decision ever."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-center">
          <div className="text-4xl font-bold text-lime-400 mb-2">3x</div>
          <p className="text-sm text-zinc-400">Higher completion rate with a buddy</p>
        </div>
        <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-center">
          <div className="text-4xl font-bold text-lime-400 mb-2">247</div>
          <p className="text-sm text-zinc-400">Founders on the waitlist</p>
        </div>
        <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-center">
          <div className="text-4xl font-bold text-lime-400 mb-2">92%</div>
          <p className="text-sm text-zinc-400">Would recommend to a friend</p>
        </div>
        <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-center">
          <div className="text-4xl font-bold text-lime-400 mb-2">Q1</div>
          <p className="text-sm text-zinc-400">2025 launch date</p>
        </div>
      </div>

      {/* Waitlist CTA */}
      <Card className="bg-black/40 border-lime-400/30 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-400/10 border border-lime-400/20 mb-4">
              <Mail className="h-8 w-8 text-lime-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 tracking-tight text-white">Want Early Access?</h3>
            <p className="mb-6 text-zinc-400 max-w-md mx-auto">
              Join the waitlist and we'll notify you when the Buddy System launches in Q1 2025.
            </p>
            
            {!submitted ? (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
                  disabled={isSubmitting}
                />
                <Button 
                  onClick={handleWaitlistSubmit}
                  disabled={isSubmitting || !email}
                  className="bg-lime-400 hover:bg-lime-500 text-black font-bold px-8 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] transition-all whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-6 bg-lime-400/10 border border-lime-400/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-lime-400 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-bold">You're on the list!</span>
                </div>
                <p className="text-sm text-zinc-400">
                  We'll email you at <span className="text-white font-medium">{email}</span> when the Buddy System is ready.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
