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
  Calendar,
  FileText,
  Flame,
  Map,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  CheckSquare,
  BarChart3,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10 transform -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-y-1/3" />

      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Marketing Buddy</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/onboarding" className="px-5 py-2 bg-white text-slate-950 hover:bg-blue-50 rounded-full text-sm font-bold transition shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-white/10 p-4 space-y-4">
            <a href="#features" className="block text-slate-300">Features</a>
            <a href="#pricing" className="block text-slate-300">Pricing</a>
            <Link href="/onboarding" className="block w-full text-center py-2 bg-blue-600 rounded-lg font-semibold">Get Started</Link>
          </div>
        )}
      </nav>

    {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 relative overflow-visible">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Hero Copy */}
          <div className="lg:w-[45%] z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              New: AI Content Generator 2.0
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Marketing consistency, <br />
              <span 
                className="bg-gradient-to-r from-blue-400 to-purple-400"
                style={{ 
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block'
                }}
              >
                on autopilot.
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Marketing Buddy analyzes your website to build a custom weekly plan. It drafts your content, tracks your growth milestones, and pairs you with a buddy so you actually ship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/onboarding" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 fill-white" />
                Start My Marketing Plan
              </Link>
              <Link href="/analyze" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-semibold transition flex items-center justify-center">
                Free Website Checkup
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> No credit card required</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> 60-second setup</span>
            </div>
          </div>

          {/* Hero Visual: The "Command Center" */}
          <div className="lg:w-[55%] w-full relative perspective-1000">
            
            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/20 rounded-full blur-[80px] -z-10"></div>
            
            {/* Main Interface Container */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Header Bar */}
              <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                 </div>
                 <div className="text-[10px] text-slate-500 font-mono">marketingbuddy.xyz</div>
              </div>

              <div className="p-6 grid grid-cols-12 gap-6 min-h-[380px]">
                
                {/* Left Col: Strategy & Tasks */}
                <div className="col-span-7 space-y-4">
                   {/* Daily Focus Card */}
                   <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Today's Focus</div>
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                         </div>
                         <div className="text-sm text-white font-medium">Post Case Study</div>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-blue-500 w-2/3 h-full rounded-full"></div>
                      </div>
                   </div>

                   {/* Analytics Mini-Chart */}
                   <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Engagement</div>
                        <div className="text-xs text-emerald-400 font-mono">+24%</div>
                      </div>
                      <div className="flex items-end justify-between gap-1 h-16">
                         {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} style={{height: `${h}%`}} className={`w-full rounded-t-sm ${i === 5 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Right Col: Calendar Grid */}
                <div className="col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col">
                   <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-bold">Schedule</div>
                   <div className="space-y-2 mb-8">
                      <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50 text-xs text-slate-300 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> LinkedIn
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50 text-xs text-slate-300 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Twitter
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50 text-xs text-slate-300 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Blog
                      </div>
                   </div>
                   <div className="mt-auto pt-4 border-t border-slate-800 text-[10px] text-center text-slate-500">
                     System Active
                   </div>
                </div>
              </div>
            </div>

            {/* FLOATING ELEMENT 1: AI Strategy Engine (Input) */}
            <div className="absolute -left-4 -top-8 bg-slate-900/95 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl shadow-2xl w-52 animate-bounce-slow" style={{animationDuration: '5s'}}>
               <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <div className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    ANALYZE WEBSITE
                  </div>
               </div>
               {/* Simulated Input */}
               <div className="bg-slate-950 rounded px-2 py-1.5 mb-3 border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">yourwebsite.com</span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               </div>
               {/* Simulated Analysis Tags */}
               <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Audience:</span>
                    <span className="text-slate-200 font-medium">Small businesses</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Goal:</span>
                    <span className="text-slate-200 font-medium">Onboarding</span>
                  </div>
               </div>
            </div>

            {/* FLOATING ELEMENT 2: Buddy Check-In (Support) */}
            <div className="absolute -bottom-6 left-4 bg-slate-800/90 backdrop-blur-md border border-orange-500/30 p-3 rounded-xl shadow-xl flex items-center gap-3 pr-6 z-20">
               <div className="relative">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">JS</div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 border border-slate-900 w-3 h-3 rounded-full"></div>
               </div>
               <div>
                  <div className="text-[10px] text-orange-300 font-bold">BUDDY CHECK-IN</div>
                  <div className="text-xs text-white">"You hit 1k views! 🎉"</div>
               </div>
            </div>

            {/* FLOATING ELEMENT 3: AI Content Draft (Output) */}
            <div className="absolute -right-6 bottom-12 bg-slate-900/95 backdrop-blur-md border border-purple-500/30 p-4 rounded-xl shadow-2xl w-56 transform rotate-1 z-20">
               <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <div className="text-[10px] font-bold text-purple-300">AI DRAFT READY</div>
               </div>
               <div className="space-y-2 mb-3">
                  <div className="h-1.5 bg-slate-700 rounded w-full"></div>
                  <div className="h-1.5 bg-slate-700 rounded w-11/12"></div>
                  <div className="h-1.5 bg-slate-700 rounded w-4/6"></div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-500">Generated 2m ago</span>
                  <div className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-lg shadow-purple-500/20">
                    Post Now
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The hardest part is showing up.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Most marketing tools give you data. We give you a system to actually get the work done.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 p-8 hover:bg-white/10 transition duration-300 group">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Target className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analysis Paralysis</h3>
              <p className="text-slate-400 leading-relaxed">
                Stuck figuring out the "perfect" strategy? Marketing Buddy creates a plan for you so you can stop thinking and start doing.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 p-8 hover:bg-white/10 transition duration-300 group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <FileText className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Blank Screen Syndrome</h3>
              <p className="text-slate-400 leading-relaxed">
                Don't know what to write? Our AI reads your website and generates relevant posts for LinkedIn, Twitter, and your blog instantly.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 p-8 hover:bg-white/10 transition duration-300 group">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Calendar className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Inconsistency</h3>
              <p className="text-slate-400 leading-relaxed">
                Start strong, then fall off? Our streak tracking and simple daily check-ins gamify your consistency.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features / How it Works */}
      <section id="features" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
         {/* Feature 1: The Adaptive Plan */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
            <div className="lg:w-1/2">
              <div className="inline-block text-blue-400 font-bold tracking-wider text-sm mb-4">STEP 1</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                A weekly plan that adapts to you.
              </h3>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Stop guessing what to do next. Marketing Buddy analyzes your website to generate your initial strategy.
              </p>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Each week, it reads your progress and analytics to generate a fresh checklist for Monday. It keeps your plan relevant so you stay consistent.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-slate-300">
                  <div className="bg-blue-500/20 p-1 rounded mr-3"><CheckCircle className="w-4 h-4 text-blue-400" /></div>
                  Deep site & niche analysis
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="bg-blue-500/20 p-1 rounded mr-3"><CheckCircle className="w-4 h-4 text-blue-400" /></div>
                  Context-aware weekly tasks
                </li>
              </ul>
            </div>
            
            {/* Visual: The Weekly Sprint Card */}
            <div className="lg:w-1/2 relative group">
               {/* Background Glow */}
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               
               <div className="relative bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div>
                       <div className="text-xs text-slate-500 font-bold tracking-widest uppercase mb-1">Current Plan</div>
                       <div className="text-lg font-bold text-white flex items-center gap-2">
                         Week 4
                         <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">On Track</span>
                       </div>
                    </div>
                  </div>

                  {/* Dynamic Tasks List */}
                  <div className="space-y-3">
                    
                    {/* Task 1 */}
                    <div className="bg-slate-950/50 rounded-lg p-3 border border-white/5 hover:border-blue-500/30 transition flex items-center justify-between group/item">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">M</div>
                        <div>
                           <div className="font-medium text-slate-200 text-sm">Engage with 5 potential leads</div>
                           <div className="text-[10px] text-slate-500">Reason: You posted content yesterday</div>
                        </div>
                      </div>
                      <div className="w-4 h-4 border-2 border-slate-600 rounded sm:mr-2 group-hover/item:border-blue-500 transition"></div>
                    </div>

                    {/* Task 2 */}
                    <div className="bg-slate-950/50 rounded-lg p-3 border border-white/5 hover:border-blue-500/30 transition flex items-center justify-between group/item">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">W</div>
                        <div>
                           <div className="font-medium text-slate-200 text-sm">Draft Newsletter Issue #4</div>
                           <div className="text-[10px] text-slate-500">Topic: Based on last week's engagement</div>
                        </div>
                      </div>
                      <div className="w-4 h-4 border-2 border-slate-600 rounded sm:mr-2 group-hover/item:border-blue-500 transition"></div>
                    </div>

                    {/* Task 3 (Locked) */}
                    <div className="bg-slate-950/30 rounded-lg p-3 border border-white/5 opacity-60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm">F</div>
                        <div>
                           <div className="font-medium text-slate-300 text-sm">Review & Generate Next Week</div>
                           <div className="text-[10px] text-slate-500">Unlocks Sunday</div>
                        </div>
                      </div>
                      <div className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">Locked</div>
                    </div>

                  </div>

                  {/* Insight Footer - Changed from "Wins" to "Logic" */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-2">
                     <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                     <p className="text-xs text-slate-400 leading-snug">
                       <span className="text-blue-400 font-semibold">AI Context:</span> Since you completed all LinkedIn tasks last week, we are shifting focus to your newsletter to balance your growth.
                     </p>
                  </div>

               </div>
            </div>
          </div>

          {/* Feature 2: AI Content Engine */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-32">
            <div className="lg:w-1/2">
              <div className="inline-block text-purple-400 font-bold tracking-wider text-sm mb-4">STEP 2</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Turn 1 idea into 3 posts.
              </h3>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Staring at a blinking cursor is painful. Marketing Buddy takes your weekly tasks and drafts the actual content for you.
              </p>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                It knows your tone. It formats for LinkedIn carousels or Twitter threads automatically. You just polish and hit publish.
              </p>
              <div className="flex gap-3">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 px-3 py-1">LinkedIn</Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 px-3 py-1">Twitter / X</Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 px-3 py-1">Blog</Badge>
              </div>
            </div>

            {/* Visual: The Content Studio */}
            <div className="lg:w-1/2 relative group">
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                    {/* Editor Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                            <div className="text-xs text-slate-500 ml-2 font-mono">Drafting...</div>
                        </div>
                        <div className="flex gap-2">
                             <div className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded cursor-pointer hover:bg-purple-500 transition">Regenerate</div>
                        </div>
                    </div>

                    {/* Context Input */}
                    <div className="p-4 border-b border-white/5 bg-slate-900/50">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Topic from Weekly Plan</div>
                        <div className="text-sm text-white flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            "Share a mistake you made early in your startup journey"
                        </div>
                    </div>

                    {/* Generated Output */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0"></div>
                            <div className="space-y-2 w-full">
                                <div className="h-2 bg-slate-700 rounded w-24"></div>
                                <div className="text-sm text-slate-300 leading-relaxed">
                                    <span className="text-purple-400 font-semibold">Hook:</span> I lost my first 3 clients because I was too afraid to ask for feedback.<br/><br/>
                                    Here is what I learned about transparency in B2B sales...
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <div className="h-16 w-full bg-slate-800 rounded border border-white/5"></div>
                                    <div className="h-16 w-full bg-slate-800 rounded border border-white/5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

           {/* Feature 3: Accountability */}
           <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block text-orange-400 font-bold tracking-wider text-sm mb-4">STEP 3</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The only "hack" is showing up.
              </h3>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Marketing fails when you stop. We gamify your consistency so you don't break the chain.
              </p>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Track your streak, visualize your effort on a heatmap, and get nudged by your accountability buddy when you're about to slack off.
              </p>
            </div>
            
            {/* Visual: The Consistency Heatmap */}
            <div className="lg:w-1/2 relative">
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
                   
                   {/* Main Heatmap Visual */}
                   <div className="mb-6">
                       <div className="flex justify-between items-end mb-2">
                           <div>
                               <div className="text-4xl font-bold text-white">12 <span className="text-sm text-slate-500 font-normal">days</span></div>
                               <div className="text-xs text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                   <Flame className="w-3 h-3" /> Current Streak
                               </div>
                           </div>
                           <div className="text-right">
                               <div className="text-sm text-slate-400">Nov 2025</div>
                           </div>
                       </div>
                       
                       {/* The Grid */}
                       <div className="grid grid-cols-7 gap-1.5">
                           {[...Array(28)].map((_, i) => {
                               // Simulating a realistic streak (randomized active states)
                               const opacity = [0.1, 0.2, 0.6, 0.8, 1][Math.floor(Math.random() * 5)];
                               const isActive = i > 5 && i < 20; // Make the middle chunk active for visual appeal
                               return (
                                   <div 
                                       key={i} 
                                       className={`aspect-square rounded-sm ${isActive ? 'bg-orange-500' : 'bg-slate-800'}`}
                                       style={{ opacity: isActive ? Math.random() * 0.5 + 0.5 : 1 }}
                                   ></div>
                               )
                           })}
                       </div>
                   </div>

                   {/* Buddy Notification Overlay */}
                   <div className="absolute bottom-4 right-4 left-4 bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-slow">
                       <div className="relative shrink-0">
                           <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                               AI
                           </div>
                           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                       </div>
                       <div>
                           <div className="text-xs font-bold text-white flex justify-between w-full">
                               Marketing Buddy
                               <span className="text-slate-500 font-normal text-[10px]">Just now</span>
                           </div>
                           <div className="text-xs text-slate-300 leading-snug">
                               "Don't break the streak! You just need 1 more post to hit your weekly goal. 🚀"
                           </div>
                       </div>
                   </div>

               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Simple Pricing */}
      <section id="pricing" className="py-24 bg-slate-950 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-900/10 blur-[100px] -z-10"></div>
        
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing.</h2>
          <p className="text-slate-400 mb-12">Join the waitlist for early access and lock in the founder rate.</p>
          
          <Card className="relative bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
            
            <div className="flex flex-col items-center">
              <div className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold mb-4">
                Early Access Offer
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-extrabold text-white">$15</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-400 mb-8 text-sm">Cancel anytime. No contracts.</p>
              
              <Link href="/onboarding" className="w-full sm:w-auto min-w-[200px]">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-500/25">
                  Get Started Now
                </Button>
              </Link>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10 grid sm:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>Website Audit</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>AI Content Generator</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>Weekly Marketing Plan</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>Streak Tracking</span>
                </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to build marketing momentum?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding" className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg shadow-white/10">
              Get My Marketing Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-white/5 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Marketing Buddy</span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">Email</a>
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
          </div>
          
          <div className="text-slate-600">
            &copy; {new Date().getFullYear()} Marketing Buddy.
          </div>
        </div>
      </footer>
    </div>
  )
}