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
  Sparkles,
  Menu,
  X,
  Star,
  ChevronDown,
  PlayCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Animation variants for reuse
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background: Deeper, richer gradients */}
      <div className="fixed top-0 left-0 right-0 h-[600px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10 transform -translate-y-1/2 opacity-60" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-10 translate-y-1/3 opacity-50" />
      <div className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -z-10 transform -translate-y-1/2" />

      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Marketing Buddy</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
            <Link href="/analyze" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
    <Zap className="w-3 h-3" /> Free Audit
  </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/onboarding">
              <Button className="bg-white text-slate-950 hover:bg-blue-50 rounded-full text-sm font-bold transition shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <a href="#features" className="block text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                <a href="#pricing" className="block text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
                <Link href="/onboarding" className="block w-full text-center py-3 bg-blue-600 rounded-lg font-semibold">Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-visible">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Hero Copy */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:w-[45%] z-10"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v2.0 Now Live: AI Content Studio
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Marketing consistency, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x bg-[length:200%_auto]">
                on autopilot.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
              Your personal AI marketing team. We analyze your site, plan your week, draft your content, and nag you until you hit publish.
            </motion.p>
            
             <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
    {/* PRIMARY CTA: Free Analysis (Low Friction) */}
    <Link href="/analyze" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
      <Zap className="w-5 h-5 fill-white" />
      Free Website Checkup
    </Link>
    
    {/* SECONDARY CTA: Direct Onboarding */}
    <Link href="/onboarding" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 group">
      Get Started
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  </motion.div>
          
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-[55%] w-full relative perspective-1000"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/20 rounded-full blur-[80px] -z-10 animate-pulse-slow"></div>
            
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                 </div>
                 <div className="text-[10px] text-slate-500 font-mono">marketingbuddy.ai</div>
              </div>

              <div className="p-6 grid grid-cols-12 gap-6 min-h-[380px] bg-slate-950/50">
                {/* Left Col: Strategy & Tasks */}
                <div className="col-span-7 space-y-4">
                   <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Today's Focus</div>
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                         </div>
                         <div className="text-sm text-white font-medium">Post Case Study</div>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: "66%" }}
                           transition={{ duration: 1.5, delay: 0.5 }}
                           className="bg-blue-500 h-full rounded-full"
                         />
                      </div>
                   </div>
                   <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Engagement</div>
                        <div className="text-xs text-emerald-400 font-mono">+24%</div>
                      </div>
                      <div className="flex items-end justify-between gap-1 h-16">
                         {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <motion.div 
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                              className={`w-full rounded-t-sm ${i === 5 ? 'bg-blue-500' : 'bg-slate-800'}`}
                            />
                         ))}
                      </div>
                   </div>
                </div>

                {/* Right Col: Calendar Grid */}
                <div className="col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col">
                   <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-bold">Schedule</div>
                   <div className="space-y-2 mb-8">
                      {['LinkedIn', 'Twitter', 'Blog'].map((platform, i) => (
                        <div key={platform} className="bg-slate-800/50 p-2 rounded border border-slate-700/50 text-xs text-slate-300 flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-purple-500' : i === 1 ? 'bg-blue-400' : 'bg-orange-400'}`}></div> {platform}
                        </div>
                      ))}
                   </div>
                   <div className="mt-auto pt-4 border-t border-slate-800 text-[10px] text-center text-slate-500">
                     System Active
                   </div>
                </div>
              </div>
            </div>

            {/* Floating Elements with Animation */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 -top-8 bg-slate-900/95 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl shadow-2xl w-52"
            >
               <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <div className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    ANALYZE WEBSITE
                  </div>
               </div>
               <div className="bg-slate-950 rounded px-2 py-1.5 mb-3 border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">yourwebsite.com</span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               </div>
            </motion.div>

            <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -right-6 bottom-12 bg-slate-900/95 backdrop-blur-md border border-purple-500/30 p-4 rounded-xl shadow-2xl w-56 z-20"
            >
               <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <div className="text-[10px] font-bold text-purple-300">AI DRAFT READY</div>
               </div>
               <div className="space-y-2 mb-3">
                  <div className="h-1.5 bg-slate-700 rounded w-full"></div>
                  <div className="h-1.5 bg-slate-700 rounded w-11/12"></div>
               </div>
               <div className="bg-purple-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-md text-center shadow-lg shadow-purple-500/20">
                  Post Now
               </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The hardest part is showing up.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Most tools just give you data. We give you a system to actually do the work.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Target, color: "text-red-400", bg: "bg-red-500/10", title: "Analysis Paralysis", desc: "Stuck figuring out the perfect strategy? We create the plan so you can stop thinking and start doing." },
              { icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10", title: "Blank Screen Syndrome", desc: "Don't know what to write? Our AI reads your website and generates relevant posts instantly." },
              { icon: Calendar, color: "text-orange-400", bg: "bg-orange-500/10", title: "Inconsistency", desc: "Start strong, then fall off? Our streak tracking and simple daily check-ins gamify your consistency." }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="bg-white/5 border-white/10 p-8 hover:bg-white/10 transition duration-300 group h-full">
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature 1: The Adaptive Plan */}
      <section id="features" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
              <div className="inline-block text-blue-400 font-bold tracking-wider text-sm mb-4">STEP 1</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                A weekly plan that adapts to you.
              </h3>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Stop guessing what to do next. Marketing Buddy analyzes your website to generate your initial strategy.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-3" /> Deep site & niche analysis
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-3" /> Context-aware weekly tasks
                </li>
              </ul>
            </motion.div>
            
            <div className="lg:w-1/2 relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               <div className="relative bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div>
                       <div className="text-xs text-slate-500 font-bold tracking-widest uppercase mb-1">Current Plan</div>
                       <div className="text-lg font-bold text-white flex items-center gap-2">
                         Week 4
                         <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">On Track</span>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-950/50 rounded-lg p-3 border border-white/5 hover:border-blue-500/30 transition flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">M</div>
                        <div>
                           <div className="font-medium text-slate-200 text-sm">Engage with 5 potential leads</div>
                           <div className="text-[10px] text-slate-500">Reason: You posted content yesterday</div>
                        </div>
                      </div>
                      <CheckCircle className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="bg-slate-950/50 rounded-lg p-3 border border-white/5 hover:border-blue-500/30 transition flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">W</div>
                        <div>
                           <div className="font-medium text-slate-200 text-sm">Draft Newsletter Issue #4</div>
                           <div className="text-[10px] text-slate-500">Topic: Based on last week's engagement</div>
                        </div>
                      </div>
                      <CheckCircle className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Feature 2: AI Content Engine */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-32">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
              <div className="inline-block text-purple-400 font-bold tracking-wider text-sm mb-4">STEP 2</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Turn 1 idea into 3 posts.
              </h3>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Staring at a blinking cursor is painful. Marketing Buddy takes your weekly tasks and drafts the actual content for you.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 px-3 py-1">LinkedIn</Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 px-3 py-1">Twitter / X</Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 px-3 py-1">Blog</Badge>
              </div>
            </motion.div>

            <div className="lg:w-1/2 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                            <span className="text-xs text-slate-500 ml-2">AI Generator</span>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="space-y-2 w-full">
                                <div className="text-sm text-slate-300 leading-relaxed">
                                    <span className="text-purple-400 font-semibold">Hook:</span> I lost my first 3 clients because I was too afraid to ask for feedback.<br/><br/>
                                    Here is what I learned about transparency in B2B sales...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Feature 3: Accountability / Streaks */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
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
              <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Streak protection included
                </div>
              </div>
            </motion.div>
            
            {/* Visual: The Consistency Heatmap */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
                   
                   {/* Main Heatmap Visual */}
                   <div className="mb-6">
                       <div className="flex justify-between items-end mb-4">
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
                       
                       {/* The Grid - Animated */}
                       <div className="grid grid-cols-7 gap-1.5">
                           {[...Array(28)].map((_, i) => {
                               const isActive = i > 5 && i < 20 || i > 22; 
                               return (
                                   <motion.div 
                                       key={i} 
                                       initial={{ opacity: 0, scale: 0 }}
                                       whileInView={{ opacity: isActive ? Math.random() * 0.5 + 0.5 : 1, scale: 1 }}
                                       transition={{ delay: i * 0.02 }}
                                       className={`aspect-square rounded-sm ${isActive ? 'bg-orange-500' : 'bg-slate-800'}`}
                                   />
                               )
                           })}
                       </div>
                   </div>

                   {/* Buddy Notification Overlay */}
                   <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="absolute bottom-4 right-4 left-4 bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3"
                    >
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
                   </motion.div>

               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How does it know what to write?", a: "We scan your landing page to understand your value proposition, then use our AI to generate weekly tasks, content that matches your industry and tone. Then we help keep motivated by tracking your goals, streaks, and wins." },
              { q: "Can I edit the posts?", a: "Absolutely. Marketing Buddy provides a solid first draft (about 90% done). You can tweak it, change the tone, or rewrite sections before posting." },
              { q: "What platforms do you support?", a: "Currently we optimize content for LinkedIn, X, Reddit, Tik Tok, Instagram, and blog posts." }
            ].map((faq, i) => (
              <div key={i} className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center text-slate-200 font-medium hover:bg-slate-900 transition"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 pb-4 text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to build marketing momentum?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding" className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg shadow-white/10 w-full sm:w-auto">
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