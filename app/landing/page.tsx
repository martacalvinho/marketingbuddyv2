"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Rocket,
  Target,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  MessageCircle,
  Calendar,
  BarChart3,
  Flame,
  Globe,
  BookOpen,
  PieChart,
  MapPin,
  ListChecks,
  FileText,
  Bot,
  Clock,
  Monitor,
  Map,
  Megaphone,
  CalendarCheck,
  Twitter,
  Sparkles,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed w-full z-50 py-4 px-6 bg-white bg-opacity-90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
              {/* Custom logo: Rocket with flame trail */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.25-2 5-2 5s3.75-.5 5-2c.625-.75 1-1.5 1-2.5a2.5 2.5 0 0 0-4-2z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
              </svg>
              {/* Flame accent */}
              <div className="absolute -bottom-0.5 -right-0.5 text-orange-400 text-xs">🔥</div>
            </div>
            <span className="text-xl font-bold text-gray-900">Marketing Buddy</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
              Validation
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/analyze" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition">
              Analyze My Website
            </Link>
            <Link href="/login" className="px-4 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="inline-block px-3 sm:px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              AI-POWERED MARKETING ASSISTANT
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-4xl mb-6">
              Launch-day Hype Fading?
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium mt-4 mb-8 max-w-3xl leading-relaxed">
              Get a marketing plan you'll actually stick to - with daily tasks, content generation, and an accountability partner who keeps you honest.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/onboarding" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition text-center">
                Start Marketing Journey
              </Link>
              <Link href="/analyze" className="px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-xl border border-blue-200 text-blue-600 font-bold text-base sm:text-lg shadow hover:shadow-md transition text-center">
                Free Website Analysis
              </Link>
            </div>
            <p className="mt-2 sm:mt-3 text-xs sm:text-base text-gray-600">
              60‑sec setup · no card needed · 7‑day trial
            </p>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="relative z-10">
                <Card className="rounded-3xl p-6 sm:p-8 max-w-lg mx-auto shadow-2xl border border-blue-100 bg-white">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">The Post-Launch Reality</h3>
                    <p className="text-sm text-gray-600">Week 1 traffic vs. Week 2</p>
                  </div>

                  {/* Chart showing traffic drop */}
                  <div className="mb-6 p-4 bg-gradient-to-b from-blue-50 to-red-50 rounded-xl">
                    <div className="flex items-end justify-between h-32 gap-2">
                      <div className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{height: '20%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{height: '100%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t" style={{height: '75%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-red-400 to-red-300 rounded-t" style={{height: '45%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-red-400 to-red-300 rounded-t" style={{height: '25%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t" style={{height: '20%'}}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Day 1</span>
                      <span>Day 2</span>
                      <span>Day 3</span>
                      <span>Day 4</span>
                      <span>Day 5</span>
                      <span>Day 6</span>
                    </div>
                    <div className="text-center mt-3">
                      <div className="text-2xl font-bold text-gray-900">What now? 🤔</div>
                      <div className="text-sm text-gray-600 mt-1">Traffic drops. Motivation fades. You freeze.</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You Built It Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-6">
              You built it. Now what?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              The hardest part isn't building your product—it's consistent, focused marketing that compounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Overwhelm</h3>
              <p className="text-gray-600">
                Endless tactics, conflicting advice, and no clear path forward. You're stuck in analysis paralysis.
              </p>
            </Card>

            <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lack of Strategy</h3>
              <p className="text-gray-600">
                Random posts here and there won't cut it. You need a systematic approach that builds momentum.
              </p>
            </Card>

            <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Paralysis</h3>
              <p className="text-gray-600">
                Stuck staring at a blank screen? You know you should post, but what?
              </p>
            </Card>

            <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Consistency Problem</h3>
              <p className="text-gray-600">
                You start strong, then life happens. Two weeks later, you haven't posted anything.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              How Marketing Buddy Helps
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-16 lg:mb-0">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
                <div className="relative z-10">
                  <div className="flex mb-10">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">1</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Unstuck</h3>
                      <p className="text-gray-700">AI analyzes your site and gives you a clear starting point—no more guessing what to do first.</p>
                    </div>
                  </div>

                  <div className="flex mb-10">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">2</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Build Momentum</h3>
                      <p className="text-gray-700">Daily tasks + AI content keep you shipping. No blank screens, no overthinking.</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">3</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay Accountable</h3>
                      <p className="text-gray-700">Streaks and buddy check-ins prevent drop-off. Real people, real follow-through.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <Card className="rounded-3xl p-6 max-w-lg mx-auto shadow-2xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Track Your Journey</h3>
                  <p className="text-sm text-gray-600">Set goals, hit milestones, celebrate wins</p>
                </div>
                
                {/* Current Progress */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Rocket className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-gray-900">My Marketing Journey</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">👥 Users</span>
                      <span className="font-semibold text-gray-900">3 / 10</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-700">💰 MRR</span>
                      <span className="font-semibold text-gray-900">$0 / $1k</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-700">🔥 Streak</span>
                      <span className="font-semibold text-orange-600">7 days</span>
                    </div>
                  </div>
                </div>
                
                {/* Milestone Celebration */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎉</div>
                    <div className="font-bold text-gray-900 mb-1">Milestone Unlocked!</div>
                    <div className="text-lg font-semibold text-purple-900">First 10 Users</div>
                    <div className="text-sm text-gray-600 mt-2">Keep going! Next: $1k MRR</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Dashboard Previews */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
            <div className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full mb-3 sm:mb-4">FEATURES</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-6">Action · Content · Accountability</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">Daily tasks, AI content generator, streak tracking, and buddy check-ins—everything you need in one dashboard.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Action Card */}
            <div className="bg-gradient-to-br from-cyan-100 to-blue-200 rounded-3xl p-6 shadow-2xl h-full">
              <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Today's Tasks</h4>
                  <svg width="20" height="20" className="text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center bg-green-50 rounded-lg p-3 border border-green-200">
                    <svg width="16" height="16" className="text-green-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                    <div className="text-sm font-medium text-gray-900">Write blog post</div>
                  </div>
                  <div className="flex items-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="h-4 w-4 border-2 border-blue-400 rounded-full mr-2"></div>
                    <div className="text-sm font-medium text-gray-900">Schedule posts</div>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <div className="text-sm text-gray-700">Update CTAs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-200 rounded-3xl p-6 shadow-2xl h-full">
              <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">AI Content</h4>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">6+ platforms</span>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 text-center">Blog</span>
                    <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 text-center">LinkedIn</span>
                    <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 text-center">Twitter</span>
                    <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 text-center">Email</span>
                    <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 text-center">Instagram</span>
                    <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 text-center">YouTube</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-sm font-semibold text-gray-900 mb-2">Auto-drafted outline</div>
                    <div className="text-xs text-gray-600">Ready to edit in seconds</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accountability Card */}
            <div className="bg-gradient-to-br from-emerald-100 to-teal-200 rounded-3xl p-6 shadow-2xl h-full">
              <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Streaks & Buddy</h4>
                  <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium text-gray-900">12 day streak</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">240 XP earned</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-sm font-medium text-gray-900 mb-1">Weekly check-in</div>
                    <div className="text-xs text-gray-600">With your buddy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-6">Simple, transparent pricing</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Start free. Upgrade when you're ready for advanced features.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="p-8 border border-gray-200 rounded-xl bg-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-6xl font-bold text-gray-900 mb-4">$0</p>
                <p className="text-gray-600 mb-8">Forever free plan to get started</p>
                <Link href="/analyze">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Website analysis & 6-month plan</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Daily tasks (1–3 per day)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic AI content generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Streak tracking & XP</span>
                </li>
              </ul>
            </Card>

            {/* Pro Tier */}
            <Card className="p-8 border border-indigo-300 rounded-xl bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-1 transform rotate-45 translate-x-8 -translate-y-2 text-sm font-medium">
                Most Popular
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <p className="text-6xl font-bold text-gray-900 mb-4">$15</p>
                <p className="text-gray-600 mb-8">Everything in Free, plus:</p>
                <Link href="/analyze">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Free Trial
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 mt-3">Built for solo founders and indie hackers</p>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Multi-platform AI content (6+ channels)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Content library with analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Marketing Buddy matching (Q2 2025)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced task customization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Weekly reviews & insights</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority email support</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 relative">
        {/* soft background accent */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="mx-auto max-w-6xl h-56 blur-3xl opacity-25 rounded-full bg-gradient-to-r from-blue-200 to-blue-300" />
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-6">
              What <span className="text-blue-600">Solo Founders</span> Are Saying
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Direct quotes pulled from Reddit communities (early‑stage founders starting their marketing)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white/90 flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">RU</div>
                <span className="text-[11px] text-gray-500">r/marketing</span>
              </div>
              <blockquote className="text-gray-900 mb-4 italic leading-relaxed flex-1">
                "What I really need is something between a $10k/month agency and doing everything myself. A system that gives me a proper strategy and breaks it down into daily actions."
              </blockquote>
              <Link href="#features" className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5 mt-auto">
                Marketing Buddy provides exactly this
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.293 5.293a1 1 0 011.414 0L18 9.586l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"/></svg>
              </Link>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white/90 flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">RU</div>
                <span className="text-[11px] text-gray-500">r/Entrepreneur</span>
              </div>
              <blockquote className="text-gray-900 mb-4 italic leading-relaxed flex-1">
                "I wish there was a tool that could look at my website and tell me specifically what to fix for better conversion rates, not just generic advice."
              </blockquote>
              <Link href="/analyze" className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5 mt-auto">
                Our AI website analyzer does exactly this
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.293 5.293a1 1 0 011.414 0L18 9.586l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"/></svg>
              </Link>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white/90 flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">RU</div>
                <span className="text-[11px] text-gray-500">r/indiehackers</span>
              </div>
              <blockquote className="text-gray-900 mb-4 italic leading-relaxed flex-1">
                "I need something to keep me consistent. I always start strong then fall off after a week."
              </blockquote>
              <Link href="#features" className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5 mt-auto">
                Streaks and buddy check-ins solve this
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.293 5.293a1 1 0 011.414 0L18 9.586l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"/></svg>
              </Link>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white/90 flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">RU</div>
                <span className="text-[11px] text-gray-500">r/SaaS</span>
              </div>
              <blockquote className="text-gray-900 mb-4 italic leading-relaxed flex-1">
                "The hardest part is consistency. I need something that gives me small, manageable marketing tasks each day instead of overwhelming me with big projects."
              </blockquote>
              <Link href="#features" className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5 mt-auto">
                Daily task system solves this perfectly
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.293 5.293a1 1 0 011.414 0L18 9.586l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"/></svg>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to build marketing momentum?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">Action · Content · Accountability. Get your 6-month plan, daily tasks, AI content, and streak tracking—all in one place.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/analyze" className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition">
              Analyze My Website Free
            </Link>
            <Link href="#how-it-works" className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.25-2 5-2 5s3.75-.5 5-2c.625-.75 1-1.5 1-2.5a2.5 2.5 0 0 0-4-2z"/>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                  </svg>
                  <div className="absolute -bottom-0.5 -right-0.5 text-orange-400 text-[8px]">🔥</div>
                </div>
                <span className="text-xl font-bold text-white">Marketing Buddy</span>
              </div>
              <p className="text-gray-400 mb-4">Your AI-powered marketing accountability partner for solo founders and indie hackers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/analyze" className="hover:text-white transition-colors">Website Analysis</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/community" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2024 Marketing Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
