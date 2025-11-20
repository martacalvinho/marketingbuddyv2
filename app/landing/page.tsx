"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Menu, 
  X, 
  Rocket,
  Flame,
  Calendar as CalendarIcon,
  Search, 
  MessageSquare,
  Sparkles,
  LayoutTemplate,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// --- Visual Components ---

// 1. Hero Visual: The "Storytelling" Dashboard
const DashboardVisual = () => {
  return (
    <div className="w-full bg-[#0A0F0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden relative z-20 select-none group">
      
      {/* Window Header */}
      <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
        </div>
        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">MARKETING_BUDDY_OS</div>
      </div>

      <div className="p-6 grid gap-4 relative">
        
        {/* Top Row */}
        <div className="flex gap-4">
            
            {/* 1. SMART PLAN (The Input) */}
            <div className="flex-1 bg-white/5 border border-white/5 p-4 rounded-md relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Action Plan</div>
                   {/* Auto-Gen Badge */}
                   <div className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                      <Zap className="w-2 h-2" /> Auto-Gen
                   </div>
                </div>
                <div className="text-sm font-medium text-white mb-3 leading-tight">
                   "Promote 'Pricing Tier' feature found on /pricing"
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500 h-full w-[66%]" />
                </div>
            </div>
            
            {/* 2. STREAK (The Motivation) */}
            <div className="flex-1 bg-white/5 border border-white/5 p-4 rounded-md flex flex-col justify-center relative">
                <div className="text-[10px] text-slate-400 uppercase mb-2 font-bold tracking-wider">Consistency</div>
                <div className="text-3xl font-bold text-white flex items-center gap-2">
                    12 <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Day Streak</div>
            </div>
        </div>

        {/* 3. CONTENT GEN (The Output) */}
        <div className="bg-lime-900/5 border border-lime-500/20 p-5 rounded-md flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lime-400 text-black flex items-center justify-center rounded-md shadow-lg shadow-lime-400/10">
                    <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">LinkedIn Draft Ready</div>
                    <div className="text-xs text-slate-400">Based on your action plan...</div>
                </div>
            </div>
            <div className="px-5 py-2 bg-lime-400 text-black text-xs font-bold rounded-md cursor-pointer hover:bg-lime-300 transition shadow-lg shadow-lime-400/20">
                Review
            </div>
        </div>

        {/* 4. THE BUDDY NOTIFICATION (The Accountability) */}
        <div className="absolute -right-4 top-24 bg-[#1a1f1c] border border-white/10 p-3 rounded-lg shadow-2xl max-w-[200px] animate-in slide-in-from-right-5 fade-in duration-1000">
           <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center shrink-0 text-black">
                 <Bell className="w-4 h-4 fill-current" />
              </div>
              <div>
                 <div className="text-[10px] font-bold text-white mb-1">Buddy Check-in</div>
                 <div className="text-[10px] text-slate-400 leading-snug">
                    "You're on a roll! Post today to protect your streak 🔥"
                 </div>
              </div>
           </div>
        </div>

        {/* Terminal Logic */}
        <div className="font-mono text-[10px] text-slate-500 space-y-2 mt-2 border-t border-white/5 pt-4 pl-1">
            <div className="flex gap-2 items-center"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Analyzed https://yoursite.com</div>
            <div className="flex gap-2 items-center"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Pain Points Extracted</div>
            <div className="flex gap-2 items-center animate-pulse text-lime-500/70">➜ Generating Content Plan...</div>
        </div>
      </div>
    </div>
  )
}

// Step 1 Visual: The "Brand Report"
const BrandReportVisual = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-[#0A0F0C] border border-white/10 rounded-xl shadow-2xl overflow-hidden relative">
      <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-300 tracking-wide">WEBSITE_AUDIT_RESULTS</span>
        </div>
        <div className="text-[10px] bg-lime-500/20 text-lime-400 px-2 py-0.5 rounded-full border border-lime-500/30">Analysis Complete</div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Detected Brand Voice */}
        <div className="space-y-2">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Detected Brand Voice</div>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-white">Professional</span>
                <span className="px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-md text-sm text-lime-400 font-bold">Authoritative</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-white">Direct</span>
            </div>
        </div>

        {/* Detected Audience */}
        <div className="space-y-2">
             <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Target Audience</div>
             <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-lime-500 shrink-0" />
                <p className="text-sm text-slate-300 leading-relaxed">
                    "Small Business Owners & Solopreneurs looking for automation tools to save time."
                </p>
             </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
            <div className="w-full py-2 bg-lime-400 text-black font-bold text-center text-sm rounded-md shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                Generate Strategy &rarr;
            </div>
        </div>
      </div>
    </div>
  )
}

// Step 3 Visual: The "Success Calendar"
const CalendarVisual = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return (
      <div className="w-full max-w-md mx-auto bg-[#0A0F0C] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-6">
          <div className="flex justify-between items-end mb-6">
              <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Consistency Streak</div>
                  <div className="text-3xl font-bold text-white flex items-center gap-2">
                      14 Days <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                  </div>
              </div>
              <div className="text-right">
                  <div className="text-xs text-slate-400">October</div>
              </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="text-center text-[10px] text-slate-600 font-bold">{d}</div>
              ))}
              {days.slice(0, 28).map((day) => {
                  const isPast = day < 15;
                  const isToday = day === 15;
                  const isCheck = [2, 4, 5, 7, 9, 11, 12, 14].includes(day);

                  return (
                      <div key={day} className={`aspect-square flex items-center justify-center rounded-md text-xs font-medium relative
                          ${isToday ? 'bg-white/10 border border-lime-500/50 text-white' : 'text-slate-500'}
                          ${isPast ? 'bg-white/[0.02]' : ''}
                      `}>
                          {isCheck ? (
                              <div className="w-full h-full bg-lime-500/20 border border-lime-500/30 rounded-md flex items-center justify-center">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-500" />
                              </div>
                          ) : (
                             <span>{day}</span>
                          )}
                      </div>
                  )
              })}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-black fill-black" />
             </div>
             <div>
                <div className="text-xs text-slate-400">Up Next:</div>
                <div className="text-sm font-bold text-white">Schedule LinkedIn Post</div>
             </div>
             <div className="ml-auto text-xs font-bold text-lime-400">Do it &rarr;</div>
          </div>
      </div>
    )
}

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#020604] text-slate-200 font-sans selection:bg-lime-400/30 selection:text-lime-200 overflow-x-hidden">
      
      {/* --- Static Background (No Flicker) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grainy Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-lime-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-[#020604]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-lime-400 flex items-center justify-center text-black rounded-sm transform transition-transform group-hover:rotate-12">
              <Rocket className="w-4 h-4 fill-black" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-lime-400 transition-colors">Marketing Buddy</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">How it Works</a>
            <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Features</a>
            <Link href="/login" className="text-sm font-bold text-white hover:text-lime-400 transition-colors">Login</Link>
            <Link href="/onboarding">
              <Button className="bg-white text-black hover:bg-lime-400 hover:text-black rounded-sm font-bold text-sm px-6 transition-all duration-300 border border-transparent shadow-lg">
                Start Now
              </Button>
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0a0f0c] border-b border-white/10 overflow-hidden"
            >
              <div className="p-6 space-y-6 flex flex-col items-center">
                <a href="#how-it-works" className="text-lg font-medium text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
                <a href="#features" className="text-lg font-medium text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                <Link href="/login" className="text-lg font-medium text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link href="/onboarding" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-lime-400 text-black hover:bg-lime-500 font-bold rounded-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 w-full items-center">
          
          {/* Hero Content - Bigger & Bolder */}
          <div className="lg:col-span-7 z-10 flex flex-col justify-center">
            <div className="inline-flex items-center self-start gap-2 mb-8 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-lime-400 text-xs font-bold uppercase tracking-wide">
              <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse" />
              AI Marketing Agent 
            </div>
            
            {/* Updated Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] text-white mb-8 tracking-tighter">
              Stop Struggling With Marketing <br/>
             <span className="text-lime-400">Consistency.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
               Stop staring at a blank screen. We analyze your website, plan your weekly content, and write the drafts. You just hit publish.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/analyze">
                <Button size="lg" className="h-16 px-10 bg-lime-400 text-black hover:bg-lime-300 rounded-sm font-bold text-lg transition-all hover:scale-[1.02] shadow-[0_0_40px_-5px_rgba(163,230,53,0.3)]">
                  <Zap className="w-5 h-5 mr-2 fill-black" />
                  Run Free Audit
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button size="lg" variant="outline" className="h-16 px-10 border-white/20 text-white bg-transparent hover:bg-white/5 hover:text-white hover:border-white rounded-sm font-bold text-lg">
                  Start For Free
                </Button>
              </Link>
            </div>

             <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-5 h-5 text-lime-500" />
                   <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-5 h-5 text-lime-500" />
                   <span>Cancel Anytime</span>
                </div>
             </div>
          </div>

          {/* Hero Visual - NEW Dashboard */}
          <div className="lg:col-span-5 relative hidden lg:block">
             {/* Static Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/10 blur-[100px] rounded-full pointer-events-none" />
             
             {/* Main Card */}
             <DashboardVisual />
          </div>
        </div>
      </section>

      {/* --- Scrolling Marquee --- */}
      <div className="w-full py-12 border-y border-white/5 bg-black/50 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#020604] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#020604] to-transparent z-10" />
        <div className="flex whitespace-nowrap gap-24 animate-marquee opacity-50">
          {[...Array(10)].map((_, i) => (
             <span key={i} className="text-xl font-bold text-slate-600 uppercase tracking-widest flex items-center gap-6">
               Build Authority <span className="text-lime-900">•</span> Grow Audience <span className="text-lime-900">•</span> Save Time
             </span>
          ))}
        </div>
      </div>

      {/* --- Problem/Solution Section --- */}
      <section className="py-32 px-6 bg-[#050a07]">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
               Marketing is hard because <br /> it never ends.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-16">
               You know you need to post, but running a business gets in the way. We built a system to handle the heavy lifting for you.
            </p>
         </div>

         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            {[
               { icon: Search, title: "What do I say?", desc: "Stuck figuring out the perfect strategy? We scan your business and tell you exactly what to post." },
               { icon: MessageSquare, title: "I hate writing.", desc: "Don't stare at a blank screen. Our AI generates 90% ready-to-go drafts in your brand voice." },
               { icon: CalendarIcon, title: "I forget to post.", desc: "Start strong, then fall off? Our streak tracking and easy weekly plans keep you consistent." }
            ].map((item, i) => (
               <Card key={i} className="bg-white/[0.02] border-white/10 p-10 rounded-sm hover:bg-white/5 hover:border-lime-500/30 transition duration-300 group">
                  <div className="w-14 h-14 bg-white/5 rounded-sm flex items-center justify-center mb-6 group-hover:bg-lime-400 group-hover:text-black transition-all duration-300 text-slate-300">
                     <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
               </Card>
            ))}
         </div>
      </section>

      {/* --- How it Works (The Loop) --- */}
      <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="mb-24">
               <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">How it works</h2>
               <div className="w-24 h-1.5 bg-lime-500" />
            </div>

            <div className="space-y-40">
               
               {/* Step 1: Scan */}
               <div className="flex flex-col lg:flex-row gap-20 items-center">
                  <div className="lg:w-1/2">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full border border-lime-500/30 text-lime-400 flex items-center justify-center font-bold text-xl bg-lime-500/10">1</div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">We Audit Your Brand</h3>
                     </div>
                     <p className="text-lg text-slate-400 leading-relaxed mb-8">
                        No lengthy questionnaires. Just paste your website URL. Our AI acts like a marketing consultant, analyzing your text, tone, and offering to understand exactly who you are.
                     </p>
                     <ul className="space-y-4 text-slate-300 font-medium">
                        <li className="flex items-center gap-3">
                           <CheckCircle2 className="w-5 h-5 text-lime-500" />
                           Identifies your unique brand voice
                        </li>
                        <li className="flex items-center gap-3">
                           <CheckCircle2 className="w-5 h-5 text-lime-500" />
                           Defines your ideal customer profile
                        </li>
                     </ul>
                  </div>
                  
                  {/* Visual: Brand Report Card */}
                  <div className="lg:w-1/2 w-full">
                     <BrandReportVisual />
                  </div>
               </div>

               {/* Step 2: Plan */}
               <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
                  <div className="lg:w-1/2">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full border border-lime-500/30 text-lime-400 flex items-center justify-center font-bold text-xl bg-lime-500/10">2</div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">We Write the Content</h3>
                     </div>
                     <p className="text-lg text-slate-400 leading-relaxed mb-8">
                        Every week, we generate a plan and write the posts for you. You get a notification, review the drafts (which are 90% done), tweak them if needed, and hit schedule.
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {['LinkedIn', 'Twitter / X', 'Blog Posts', 'Newsletters'].map(tag => (
                           <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider rounded-full">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
                  
                  {/* Visual: Draft Editor */}
                  <div className="lg:w-1/2 w-full">
                     <div className="bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden shadow-2xl max-w-md mx-auto">
                        <div className="flex bg-[#252526] border-b border-black/20 text-slate-400 px-4 py-3 gap-4 text-xs items-center">
                           <LayoutTemplate className="w-4 h-4" />
                           <span className="font-bold text-white">Post_Editor</span>
                        </div>
                        <div className="p-8 min-h-[300px] relative flex flex-col">
                           <div className="flex gap-3 mb-6">
                              <div className="w-10 h-10 bg-lime-500/20 rounded-full flex items-center justify-center shrink-0">
                                 <Sparkles className="w-5 h-5 text-lime-400" />
                              </div>
                              <div className="text-sm text-slate-300 italic bg-white/5 p-3 rounded-lg rounded-tl-none border border-white/5">
                                 "Here is a draft based on the testimonial you received last week..."
                              </div>
                           </div>
                           
                           <div className="bg-white/[0.03] p-5 rounded-lg border border-white/5 text-slate-200 text-sm leading-relaxed shadow-inner flex-1">
                              <p className="mb-4"><span className="text-lime-400 font-bold">Hook:</span><br/>I used to think automation was impersonal. I was wrong.</p>
                              <p className="mb-4"><span className="text-lime-400 font-bold">Body:</span><br/>Most business owners ignore tools because they fear losing their 'human touch'. But when we implemented this new system, our client satisfaction actually went UP.</p>
                              <p className="text-slate-500 text-xs mt-4">#SmallBusiness #Automation #Growth</p>
                           </div>
                           
                           <div className="mt-4 flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">Edit</Button>
                              <Button size="sm" className="bg-lime-400 text-black hover:bg-lime-300 font-bold rounded-sm">
                                 Approve & Post
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Step 3: Streak */}
               <div className="flex flex-col lg:flex-row gap-20 items-center">
                  <div className="lg:w-1/2">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full border border-lime-500/30 text-lime-400 flex items-center justify-center font-bold text-xl bg-lime-500/10">3</div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">You Build the Habit</h3>
                     </div>
                     <p className="text-lg text-slate-400 leading-relaxed mb-8">
                        The secret to marketing isn't virality, it's consistency. We track your streak and nudge you when you're falling behind. It's like a gym buddy for your business.
                     </p>
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500/10 border border-lime-500/20 text-lime-400 font-bold uppercase text-xs rounded-full">
                        <Flame className="w-4 h-4 fill-lime-500" /> Streak Protection Active
                     </div>
                  </div>
                  
                  {/* Visual: Calendar */}
                  <div className="lg:w-1/2 w-full">
                     <CalendarVisual />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="py-32 px-6 border-t border-white/5 bg-[#020604]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
               { q: "Is the content generic AI garbage?", a: "No. Because we audit your website first, the AI understands your specific products, services, and tone. It's grounded in your reality, not generic internet data." },
               { q: "How much time does this take?", a: "About 15 minutes a week. You receive the plan, review the drafts, and approve them. We handle the brainstorming and writing." },
               { q: "What happens if I miss a week?", a: "We have 'Streak Protection'. We know life happens. We'll adjust your schedule so you don't feel overwhelmed, but we will gently nudge you to get back on track." }
            ].map((item, i) => (
               <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-white/[0.02] px-6 rounded-lg">
                  <AccordionTrigger className="text-lg font-bold text-slate-200 hover:text-lime-400 hover:no-underline py-6 text-left">
                     {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 leading-relaxed text-base pb-6">
                     {item.a}
                  </AccordionContent>
               </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-32 px-6 relative overflow-hidden flex items-center justify-center text-center">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.1),transparent_70%)]" />
         <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-tight">
               Turn your website into a <br/>
               <span className="text-lime-400">marketing machine.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto">
               Join the waitlist of business owners who are finally winning at consistency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/onboarding" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-16 px-12 bg-lime-400 text-black hover:bg-lime-300 font-bold text-xl rounded-sm shadow-[0_0_25px_rgba(163,230,53,0.4)] transition-transform hover:scale-105">
                     Start For Free <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
               </Link>
            </div>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-white/10 bg-[#010302] text-slate-500 text-sm font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-lime-400 flex items-center justify-center rounded-sm text-black">
               <Rocket className="w-4 h-4 fill-black" />
             </div>
            <span className="font-bold text-white tracking-wide text-lg">Marketing Buddy</span>
          </div>
          
          <div className="flex gap-8 font-bold">
            <a href="#" className="hover:text-lime-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-lime-400 transition-colors">Support</a>
            <a href="#" className="hover:text-lime-400 transition-colors">Privacy Policy</a>
          </div>
          
          <div className="text-slate-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </footer>
    </div>
  )
}