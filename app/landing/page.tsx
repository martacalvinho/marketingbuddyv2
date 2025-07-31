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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <Megaphone className="text-white text-lg" />
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight lg:leading-[1.1] max-w-4xl">
              <span>Launch-day Hype Fading?</span>
              <span className="block mt-2">Get a Marketing Plan You'll Stick To</span>
            </h1>
            <p className="text-[1.1rem] md:text-xl text-gray-800 font-semibold mt-6 mb-8 max-w-3xl">
            Analyze your site and get daily, context-aware tasks.
Content ideas, accountability, and tracking keep momentum rolling. </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/onboarding" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition text-center">
                Start Free
              </Link>
              <Link href="/analyze" className="px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-xl border border-blue-200 text-blue-600 font-bold text-base sm:text-lg shadow hover:shadow-md transition text-center">
                Analyze My Website
              </Link>
            </div>
            <p className="mt-2 sm:mt-3 text-xs sm:text-base text-gray-600">
              60‑sec setup · no card needed · 7‑day trial
            </p>
            {/* Quick feature strip */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
              <a href="#features" className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-lg px-3 py-2 border border-blue-100 hover:bg-white transition">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                Daily Tasks
              </a>
              <a href="#features" className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-lg px-3 py-2 border border-blue-100 hover:bg-white transition">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                AI Content
              </a>
              <a href="#features" className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-lg px-3 py-2 border border-blue-100 hover:bg-white transition">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
                Progress Tracking
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="relative z-10">
                <Card className="rounded-3xl p-6 sm:p-8 max-w-lg mx-auto shadow-2xl border border-blue-100">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    </div>
                    <div className="text-gray-500 font-medium text-sm">Quick start</div>
                  </div>

                  <div className="overflow-hidden rounded-2xl bg-white divide-y">
                    {/* Step 1: Paste URL */}
                    <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Paste your website</h3>
                            <Globe className="h-5 w-5 text-blue-600" />
                          </div>
                          <form action="/analyze" className="mt-2 flex items-center gap-2 bg-white rounded-lg border border-blue-200 px-2 py-1.5 text-gray-600 text-sm shadow-sm">
                            <input
                              type="url"
                              name="url"
                              defaultValue="https://yourproduct.com"
                              className="flex-1 outline-none bg-transparent"
                              aria-label="Your website URL"
                              placeholder="https://yourproduct.com"
                              required
                            />
                            <button
                              type="submit"
                              className="ml-auto inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
                            >
                              Analyze <ArrowRight className="ml-1 h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Mini analysis (accurate sections) */}
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Mini analysis</h3>
                            <PieChart className="h-5 w-5 text-blue-600" />
                          </div>
                          <ul className="mt-2 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Business Overview</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Marketing Opportunities</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Marketing Strengths</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Content & Messaging Analysis</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Competitive Positioning</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Actionable Recommendations</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Generate today's tasks */}
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Auomatically generate today’s tasks</h3>
                            <ListChecks className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white border border-blue-300">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                              </span>
                              Publish launch tweet thread
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white border border-blue-300"></span>
                              Add “Why now” to landing page
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm opacity-80">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white border border-blue-300"></span>
                              DM 3 users for feedback
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link href="/analyze" className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow">
                          Try it free <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Overload</h3>
              <p className="text-gray-600">
                Stuck staring at a blank screen? We generate platform-specific content in seconds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-6">
              How Marketing Buddy <span className="text-blue-600">Transforms Your Marketing</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Designed for solo founders and indie hackers: less theory, more action—every day.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-16 lg:mb-0">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
                <div className="relative z-10">
                  <div className="flex mb-8">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">1</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyze Your Website</h3>
                      <p className="text-gray-700">Enter your URL and let our AI perform a comprehensive marketing audit. We identify strengths, weaknesses, and opportunities specific to your business.</p>
                    </div>
                  </div>

                  <div className="flex mb-8">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">2</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Receive Your Custom Plan</h3>
                      <p className="text-gray-700">Get a detailed 6-month marketing strategy broken into phases with clear objectives, channel recommendations, and success metrics.</p>
                    </div>
                  </div>

                  <div className="flex mb-8">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">3</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Execute Daily Tasks</h3>
                      <p className="text-gray-700">Each morning, receive 1-3 prioritized marketing tasks with detailed instructions. Our system adapts based on your progress and results.</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">4</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Grow With AI Assistance</h3>
                      <p className="text-gray-700">Generate content, ask questions, and get real-time advice from your AI marketing assistant who knows your business inside-out.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <Card className="rounded-3xl p-8 max-w-xl mx-auto shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Your Marketing Dashboard</h3>
                  <p className="text-gray-600">Track your progress and manage all your marketing in one place</p>
                </div>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Task Completion</span>
                    <span className="text-sm font-medium text-gray-700">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                {/* Today's Tasks */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">Today's Tasks</h4>
                  <div className="space-y-4">
                    <div className="flex items-center bg-blue-50 rounded-xl px-4 py-3">
                      <span className="mr-3 text-blue-500">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                      </span>
                      <span className="text-gray-900">Write blog post about industry trends</span>
                    </div>
                    <div className="flex items-center bg-blue-50 rounded-xl px-4 py-3">
                      <span className="mr-3 text-blue-500">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                      </span>
                      <span className="text-gray-900">Schedule social media posts</span>
                    </div>
                    <div className="flex items-center bg-blue-50 rounded-xl px-4 py-3 opacity-60">
                      <span className="mr-3 text-gray-400">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
                      </span>
                      <span className="text-gray-900">Update website CTAs</span>
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div className="flex justify-between items-center border-t pt-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">24</div>
                    <div className="text-xs text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <div className="text-xs text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">15</div>
                    <div className="text-xs text-gray-600">Upcoming</div>
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
            <div className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full mb-3 sm:mb-4">DASHBOARD PREVIEW</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-6">What you’ll actually use every day</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">Daily tasks from a 6‑month plan, AI content for 6+ platforms based on today’s task, and a human Marketing Buddy for accountability.</p>
          </div>

          {/* Strategy Roadmap (replicate previous two-column card layout) */}
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-1">
                <div className="inline-block bg-purple-50 text-purple-700 text-sm font-medium px-3 py-1 rounded-full mb-4">STRATEGY ROADMAP</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Let AI create your 6-month marketing plan</h3>
                <p className="text-lg text-gray-600 mb-8">A complete marketing strategy broken into manageable phases with clear milestones, KPIs, and budget considerations.</p>
                <div className="text-sm text-gray-500 mb-4">Customized for your industry and business goals with quarterly reviews.</div>
              </div>
              <div className="relative lg:order-2">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-200 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-gray-900">6-Month Marketing Roadmap</h4>
                      <Map className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center bg-green-50 rounded-lg p-4">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-4"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Month 1-2: SEO Foundation</div>
                          <div className="text-sm text-gray-600">Keyword research, on-page optimization, technical SEO</div>
                          <div className="text-xs text-green-600 font-medium mt-1">✓ Completed</div>
                        </div>
                      </div>
                      <div className="flex items-center bg-blue-50 rounded-lg p-4">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Month 3-4: Content Strategy</div>
                          <div className="text-sm text-gray-600">Blog content, social media, email campaigns</div>
                          <div className="text-xs text-blue-600 font-medium mt-1">🔄 In Progress (60%)</div>
                        </div>
                      </div>
                      <div className="flex items-center bg-gray-50 rounded-lg p-4">
                        <div className="w-4 h-4 bg-gray-300 rounded-full mr-4"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-700">Month 5-6: Paid Campaigns</div>
                          <div className="text-sm text-gray-500">Google Ads, Facebook Ads, retargeting</div>
                          <div className="text-xs text-gray-500 font-medium mt-1">⏳ Upcoming</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Tasks Feature (two‑column: left card, right copy) */}
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Card */}
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-100 to-blue-200 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-gray-900">Today's Marketing Tasks</h4>
                      <svg width="24" height="24" className="text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center bg-green-50 rounded-lg p-4 border border-green-200">
                        <svg width="20" height="20" className="text-green-500 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Write blog post: "10 SEO Tips"</div>
                          <div className="text-sm text-gray-600">Est. 45 minutes • High impact</div>
                        </div>
                      </div>
                      <div className="flex items-center bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <svg width="20" height="20" className="text-blue-500 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Schedule 5 social media posts</div>
                          <div className="text-sm text-gray-600">Est. 20 minutes • Medium impact</div>
                        </div>
                      </div>
                      <div className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-700">Update website CTAs</div>
                          <div className="text-sm text-gray-500">Est. 30 minutes • Low impact</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress today:</span>
                        <span className="font-semibold text-gray-900">1 of 3 completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Copy */}
              <div>
                <div className="inline-block bg-cyan-50 text-cyan-700 text-sm font-medium px-3 py-1 rounded-full mb-4">DAILY TASKS</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Daily focus from your 6‑month plan</h3>
                <p className="text-lg text-gray-600 mb-8">1–3 clear tasks each day, derived from your long‑range strategy with instructions, estimates, and priorities.</p>
                <div className="text-sm text-gray-500">Phased roadmap → scheduled, finishable actions.</div>
              </div>
            </div>
          </div>

          {/* AI Content Feature (two‑column: right card, left copy) */}
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Copy */}
              <div className="lg:order-1">
                <div className="inline-block bg-purple-50 text-purple-700 text-sm font-medium px-3 py-1 rounded-full mb-4">AI CONTENT</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Publish faster across 6+ channels</h3>
                <p className="text-lg text-gray-600 mb-8">Turn today’s task into ready‑to‑edit posts, emails, and updates for your key platforms.</p>
                <div className="text-sm text-gray-500">Keep voice consistent, ship content, and get back to building.</div>
              </div>
              {/* Right: Card */}
              <div className="relative lg:order-2">
                <div className="bg-gradient-to-br from-purple-100 to-pink-200 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-gray-900">AI Content</h4>
                      <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">6+ platforms</span>
                    </div>
                    <div className="text-xs text-purple-700 mb-4">Based on today’s task</div>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1.5 text-center">Blog</span>
                      <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1.5 text-center">LinkedIn</span>
                      <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1.5 text-center">X/Twitter</span>
                      <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1.5 text-center">Email</span>
                      <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1.5 text-center">Instagram</span>
                      <span className="text-xs font-medium text-gray-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1.5 text-center">YouTube</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        <div className="text-sm font-semibold text-gray-900">Auto‑drafted outline</div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">“10 SEO tips for indie hackers”</div>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                          Introduction: Why SEO matters for indie hackers
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                          5 actionable SEO tips with examples
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                          Tools and resources for implementation
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                          CTA: Try our free SEO audit tool
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-700 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Ready to edit in 3 seconds
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Marketing Buddy Feature (two‑column: left card, right copy) */}
          <div className="mb-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Card */}
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-100 to-teal-200 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-gray-900">Marketing Buddy</h4>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Knowledge sharing</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">S</div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">Sara Chen</div>
                          <div className="text-xs text-gray-600">SaaS founder • Marketing Buddy since Jan</div>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-medium text-gray-900">Sara's current tasks</div>
                          <div className="text-xs text-emerald-700">Updated 1 hour ago</div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm text-gray-900">A/B test pricing page headlines</div>
                                <div className="text-xs text-gray-600 mt-1">2 variations, 500 visitors needed</div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm text-gray-700">Create case study for Client A</div>
                                <div className="text-xs text-gray-500 mt-1">Need testimonials & metrics</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <MessageSquare className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm font-semibold text-gray-900 ml-2">Sara's suggestion</span>
                        </div>
                        <div className="text-xs text-emerald-700">Click to respond</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-sm text-gray-700">"Have you tried Reddit AMAs for case study promotion? Worked well for my SaaS."
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Copy */}
              <div>
                <div className="inline-block bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full mb-4">ACCOUNTABILITY</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Pair up with a human for momentum</h3>
                <p className="text-lg text-gray-600 mb-8">Get matched with another founder for quick weekly check‑ins, progress sharing, and streaks that keep you consistent.</p>
                <div className="text-sm text-gray-500">Real people. Real follow‑through.</div>
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
              Everything you need to reach your first 1000 users and $1k MRR.
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
                  <span>Website analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>3 daily marketing tasks</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic content generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Streak tracking</span>
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
                  <span>Advanced AI content generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Marketing Buddy (accountability)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Marketing swipe files</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Analytics (coming soon)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>6-month strategy planning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Email support</span>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white/90">
              <div className="mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">RU</div>
                <span className="text-[11px] text-gray-500">r/marketing</span>
              </div>
              <blockquote className="text-gray-900 mb-4 italic leading-relaxed">
                "What I really need is something between a $10k/month agency and doing everything myself. A system that gives me a proper strategy and breaks it down into daily actions."
              </blockquote>
              <Link href="#features" className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5">
                Marketing Buddy provides exactly this
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.293 5.293a1 1 0 011.414 0L18 9.586l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"/></svg>
              </Link>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white/90">
              <div className="mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">RU</div>
                <span className="text-[11px] text-gray-500">r/Entrepreneur</span>
              </div>
              <blockquote className="text-gray-900 mb-4 italic leading-relaxed">
                "I wish there was a tool that could look at my website and tell me specifically what to fix for better conversion rates, not just generic advice."
              </blockquote>
              <Link href="/analyze" className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5">
                Our AI website analyzer does exactly this
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.293 5.293a1 1 0 011.414 0L18 9.586l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"/></svg>
              </Link>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white/90">
              <div className="mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">RU</div>
                <span className="text-[11px] text-gray-500">r/SaaS</span>
              </div>
              <blockquote className="text-gray-900 mb-4 italic leading-relaxed">
                "The hardest part is consistency. I need something that gives me small, manageable marketing tasks each day instead of overwhelming me with big projects."
              </blockquote>
              <Link href="#features" className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5">
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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to reach your first 1,000 users?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">Get a website audit, a 6‑month plan, and 1–3 daily tasks tailored to solo founders and indie hackers.</p>
          
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Megaphone className="text-white text-sm" />
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
