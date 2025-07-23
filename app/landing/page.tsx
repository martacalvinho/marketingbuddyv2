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
  Sparkles
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
          <Link href="/analyze" className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition">
            Analyze My Website
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-16 lg:mb-0">
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              AI-POWERED MARKETING ASSISTANT
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transform Your Marketing With <span className="text-blue-600">AI Strategy</span> & Daily Action Plans
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl">
              Get a customized 6-month marketing roadmap broken into manageable daily tasks. We analyze your website, create tailored content, and guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/analyze" className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition text-center">
                Analyze My Website
              </Link>
              <Link href="#how-it-works" className="px-8 py-4 bg-white rounded-xl border border-blue-200 text-blue-600 font-bold text-lg shadow hover:shadow-md transition text-center">
                See How It Works
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="relative z-10">
                <Card className="rounded-3xl p-8 max-w-lg mx-auto shadow-2xl border border-blue-100">
                  <div className="flex justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-gray-500 font-medium text-sm">Your Marketing Plan</div>
                  </div>
                  <div className="overflow-hidden rounded-xl">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">Your 6-Month Roadmap</h3>
                      <p className="opacity-90">Generated based on your website analysis</p>
                    </div>
                    <div className="bg-gray-50 p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <CalendarCheck className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Month 1: Foundation Building</h4>
                          <p className="text-gray-600 text-sm">SEO Optimization, Brand Positioning</p>
                        </div>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <Megaphone className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Month 2: Content Creation</h4>
                          <p className="text-gray-600 text-sm">Blog Strategy, Social Media Setup</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                          <TrendingUp className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Month 3: Growth Phase</h4>
                          <p className="text-gray-600 text-sm">Ads Campaign, Email Marketing</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-100 p-4 border-t border-gray-200">
                      <div className="text-center">
                        <Link href="/dashboard" className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
                          <ListChecks className="mr-2 h-5 w-5" />
                          <span>View Your Daily Tasks</span>
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

      {/* Features Section - Will continue in next chunk */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Everything You Need To <span className="text-blue-600">Market Successfully</span></h2>
            <p className="text-xl text-gray-700">Our AI understands your business and creates a complete marketing strategy personalized for your goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <PieChart className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Website Analysis Audit</h3>
              <p className="text-gray-700 mb-4">Get instant actionable feedback on your website's marketing effectiveness with prioritized improvement areas.</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>SEO performance review</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Conversion rate optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>User experience evaluation</span>
                </li>
              </ul>
            </Card>

            <Card className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Map className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Long-Term Strategy Roadmap</h3>
              <p className="text-gray-700 mb-4">A complete 6-12 month marketing plan broken into manageable phases with clear milestones and KPIs.</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Customized for your industry</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Budget-aware recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Channel-specific tactics</span>
                </li>
              </ul>
            </Card>

            <Card className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-cyan-100">
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                <ListChecks className="h-8 w-8 text-cyan-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Daily Actionable Tasks</h3>
              <p className="text-gray-700 mb-4">Never feel overwhelmed again. Get 1-3 clear marketing tasks each day with detailed instructions.</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Prioritized by impact</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Time estimates provided</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Integrated with your calendar</span>
                </li>
              </ul>
            </Card>

            <Card className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-yellow-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tailored Content Creation</h3>
              <p className="text-gray-700 mb-4">Generate platform-specific content that aligns with your brand voice and marketing objectives.</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Social media posts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Email campaigns</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Blog articles</span>
                </li>
              </ul>
            </Card>

            <Card className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-indigo-100">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Bot className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Marketing Assistant</h3>
              <p className="text-gray-700 mb-4">Get real-time guidance, answers, and recommendations based on your specific marketing context.</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>24/7 support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Strategy adjustments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Competitor insights</span>
                </li>
              </ul>
            </Card>

            <Card className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Performance Analytics</h3>
              <p className="text-gray-700 mb-4">Track your marketing progress with clear visuals showing what's working and where to improve.</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>ROI measurement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Traffic sources</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2 h-4 w-4" />
                  <span>Conversion tracking</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How Marketing Buddy <span className="text-blue-600">Transforms Your Marketing</span></h2>
            <p className="text-xl text-gray-700">From analysis to execution - we handle the complexity so you can focus on growth</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-16 lg:mb-0">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
                <div className="relative z-10">
                  <div className="flex mb-8">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">1</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyze Your Website</h3>
                      <p className="text-gray-700">Enter your URL and let our AI perform a comprehensive marketing audit. We identify strengths, weaknesses, and opportunities specific to your business.</p>
                    </div>
                  </div>

                  <div className="flex mb-8">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">2</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Receive Your Custom Plan</h3>
                      <p className="text-gray-700">Get a detailed 6-month marketing strategy broken into phases with clear objectives, channel recommendations, and success metrics.</p>
                    </div>
                  </div>

                  <div className="flex mb-8">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">3</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Execute Daily Tasks</h3>
                      <p className="text-gray-700">Each morning, receive 1-3 prioritized marketing tasks with detailed instructions. Our system adapts based on your progress and results.</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">4</div>
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
                  <h3 className="text-2xl font-bold text-gray-900">Daily Task Example</h3>
                  <p className="text-gray-600">Your personalized action for today</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <Twitter className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">Create Twitter Thread</h4>
                      <p className="text-gray-700 mb-4">
                        Create a 5-tweet thread about your latest feature update. Focus on the problem it solves and include a clear CTA.
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Estimated time: 20-30 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button className="mx-auto">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content With AI
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* You Built It Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              You built it. Now what?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The hardest part isn't building your product—it's getting people to discover it.
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

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Start Free Trial
                  </Button>
                </Link>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced AI content generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>AI Marketing Coach (chat)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Marketing swipe files</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Analytics integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>6-month strategy planning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Validation From <span className="text-blue-600">Real Marketers</span></h2>
            <p className="text-xl text-gray-700">Here's what marketers say they really need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-semibold text-sm">RU</span>
                  </div>
                  <span className="text-sm text-gray-500">r/marketing</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "What I really need is something between a $10k/month agency and doing everything myself. A system that gives me a proper strategy and breaks it down into daily actions."
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 text-sm font-medium">Marketing Buddy provides exactly this</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-semibold text-sm">RU</span>
                  </div>
                  <span className="text-sm text-gray-500">r/Entrepreneur</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I wish there was a tool that could look at my website and tell me specifically what to fix for better conversion rates, not just generic advice."
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 text-sm font-medium">Our AI website analyzer does exactly this</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-semibold text-sm">RU</span>
                  </div>
                  <span className="text-sm text-gray-500">r/SaaS</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The hardest part is consistency. I need something that gives me small, manageable marketing tasks each day instead of overwhelming me with big projects."
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 text-sm font-medium">Daily task system solves this perfectly</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Marketing?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">Get your personalized marketing strategy and start executing with confidence. No more guesswork, no more overwhelm.</p>
          
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
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
