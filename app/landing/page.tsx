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
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would save to your database
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Marketing Buddy</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
              <Rocket className="h-3 w-3 mr-1" />
              For indie hackers who just shipped v1
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn your app into a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                sustainable business
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered marketing accountability partner. Get personalized daily habits, content generation,
              analytics insights, and the motivation you need to reach your first 1000 users and $1k MRR.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Start Your Marketing Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/analyze">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                  <Globe className="mr-2 h-5 w-5" />
                  Analyze My Website
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free website analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Setup in 60 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-20 h-20 bg-indigo-500 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <div className="w-32 h-32 bg-blue-500 rounded-full blur-xl"></div>
        </div>
      </section>



      {/* Problem Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">You built it. Now what? 🤔</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You just shipped your product and realized that "distribution is the hard part." Sound familiar?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-red-200 bg-red-50">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Overwhelmed by Marketing</h3>
              <p className="text-red-700 text-sm">
                Twitter threads, LinkedIn posts, Reddit engagement, email lists... Where do you even start?
              </p>
            </Card>

            <Card className="text-center p-6 border-orange-200 bg-orange-50">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">No Consistent Habits</h3>
              <p className="text-orange-700 text-sm">
                You post sporadically, forget to engage, and wonder why your audience isn't growing.
              </p>
            </Card>

            <Card className="text-center p-6 border-yellow-200 bg-yellow-50">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Generic Advice Everywhere</h3>
              <p className="text-yellow-700 text-sm">
                "Just create content!" But what content? For who? Every guru says something different.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet your marketing accountability partner
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Marketing Buddy analyzes your actual product, creates personalized daily habits, and keeps you motivated
              with streaks and gamification.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Website Analysis</h3>
                  <p className="text-gray-600">
                    We analyze your actual website to understand your business, target audience, and unique value props.
                    No generic advice here.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Micro-Tasks</h3>
                  <p className="text-gray-600">
                    3 personalized tasks per day, each taking ≤15 minutes. Build consistent marketing habits without
                    burning out.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Gamified Progress</h3>
                  <p className="text-gray-600">
                    Streaks, XP points, and levels keep you motivated. See your marketing skills compound over time.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Marketing Coach</h3>
                  <p className="text-gray-600">
                    Chat with your personal marketing buddy for advice, feedback, and motivation tailored to your
                    specific business.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-6 w-6 text-indigo-600" />
                    <span className="font-semibold">Today's Tasks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">7 day streak</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">Post value-first content on Reddit</p>
                      <p className="text-xs text-green-700">Share your journey in r/entrepreneur</p>
                    </div>
                    <Badge className="text-xs">+10 XP</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-5 h-5 border-2 border-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">DM 3 potential users</p>
                      <p className="text-xs text-blue-700">Ask for feedback, not promotion</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      15 min
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Write Twitter thread</p>
                      <p className="text-xs text-gray-700">Share lesson learned building your product</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      10 min
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Level 3
              </div>
              <div className="absolute -bottom-4 -left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                245 XP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Everything you need to grow</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From website analysis to content creation, we've got your marketing journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Website Analysis</h3>
              <p className="text-gray-600 text-sm mb-4">
                AI-powered analysis of your website to identify marketing opportunities, strengths, and areas for
                improvement.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Business overview & positioning</li>
                <li>• Target audience identification</li>
                <li>• Competitive analysis</li>
                <li>• Actionable recommendations</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Habit Tracker</h3>
              <p className="text-gray-600 text-sm mb-4">
                Personalized micro-tasks that build consistent marketing habits without overwhelming you.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 3 tasks per day, ≤15 min each</li>
                <li>• Streak tracking & motivation</li>
                <li>• XP points & leveling system</li>
                <li>• Weekly progress reviews</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Content Generator</h3>
              <p className="text-gray-600 text-sm mb-4">
                Generate platform-specific content that aligns with your daily marketing tasks and business goals.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Twitter threads & LinkedIn posts</li>
                <li>• Instagram posts with AI images</li>
                <li>• Reddit & blog content</li>
                <li>• Daily habit-aligned content</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Marketing Coach</h3>
              <p className="text-gray-600 text-sm mb-4">
                Chat with your personal marketing buddy for advice, feedback, and motivation.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Personalized advice</li>
                <li>• Content feedback</li>
                <li>• Strategy recommendations</li>
                <li>• Motivational support</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Swipe Files</h3>
              <p className="text-gray-600 text-sm mb-4">
                Weekly 3-minute lessons with templates and examples you can apply immediately.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Headline formulas</li>
                <li>• Platform best practices</li>
                <li>• Copy templates</li>
                <li>• Real examples</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">
                Overlay marketing strategies with website views and sales data to see what's actually working.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Strategy performance tracking</li>
                <li>• Sales correlation analysis</li>
                <li>• Stripe integration for revenue</li>
                <li>• Goal achievement</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What indie hackers are saying</h2>
            <p className="text-xl text-gray-600">Real results from real founders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Marketing Buddy helped me go from 0 to 500 users in 30 days. The daily tasks kept me consistent, and
                the AI analysis of my website was spot-on."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-semibold">SJ</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Founder, TaskFlow</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Finally, marketing advice that's not generic! The personalized content suggestions based on my actual
                product were game-changing."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">MC</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-600">Creator, DevTools Pro</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The streak system is addictive in the best way. I've been consistent with marketing for the first time
                ever, and it's paying off."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold">AR</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Alex Rodriguez</p>
                  <p className="text-sm text-gray-600">Founder, DesignKit</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Simple, honest pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're ready to scale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 border-2 border-gray-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <Link href="/">
                  <Button variant="outline" className="w-full mb-6 bg-transparent">
                    Get Started Free
                  </Button>
                </Link>
                <ul className="text-left space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Website analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Daily habit tracker
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    AI marketing chat
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Basic content generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Marketing lessons
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 border-2 border-indigo-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-indigo-500 text-white">Recommended</Badge>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$15</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For serious growth</p>
                <Link href="/">
                  <Button className="w-full mb-6">Start Pro</Button>
                </Link>
                <ul className="text-left space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Everything in Free
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Unlimited content generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    AI image generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Marketing analytics dashboard
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Stripe sales integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    6+ month adaptive strategies
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Gamification rewards
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to turn your app into a business?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of indie hackers who are building sustainable businesses with consistent marketing habits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                Start Your Free Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-indigo-200">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6 text-indigo-400" />
                <span className="text-lg font-bold">Marketing Buddy</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your no-BS accountability partner for turning apps into sustainable businesses.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Marketing Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
