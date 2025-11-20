"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import {
  Globe,
  ArrowRight,
  CheckCircle2,
  Target,
  TrendingUp,
  MessageSquare,
  Zap,
  Loader2,
  LayoutDashboard,
  Rocket,
  ChevronRight,
  Users,
  Briefcase,
  Layers,
  Lightbulb,
  ArrowUpRight,
  ShieldAlert,
  Search,
  Sparkles
} from "lucide-react"
import Link from "next/link"

export default function AnalyzePage() {
  const router = useRouter();
  const [website, setWebsite] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState("")
  const [loadingStep, setLoadingStep] = useState(0)

  useEffect(() => {
    if (analyzing) {
        const interval = setInterval(() => {
            setLoadingStep(prev => (prev < 4 ? prev + 1 : prev))
        }, 1500)
        return () => clearInterval(interval)
    }
  }, [analyzing])

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!website.trim()) return

    setAnalyzing(true)
    setLoadingStep(0)
    setError("")
    setAnalysis(null)

    try {
      const response = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: website.trim() }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Analysis failed")
        setAnalyzing(false)
        return
      }
      setAnalysis(data)
    } catch (err) {
      setError("Failed to analyze website. Please check the URL and try again.")
      console.error("Analysis error:", err)
    }
    setAnalyzing(false)
  }

  const formatUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://") && url.length > 0) {
      return "https://" + url
    }
    return url
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-lime-400/30">
      
      {/* Ambient Background Glows (Matching Landing Page) */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10 transform -translate-y-1/2 opacity-60" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-y-1/3" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/landing" className="flex items-center space-x-3 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center shadow-lg shadow-lime-400/20">
                <Rocket className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white hidden sm:block">Marketing Buddy</span>
            </Link>
            
            <div className="hidden md:flex items-center text-sm text-slate-500 border-l border-white/10 pl-6 h-6">
                {analysis ? (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-400 font-mono">{analysis.url}</span>
                    </div>
                ) : (
                    <span className="text-slate-600">Analysis Tool</span>
                )}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Link href="/landing" className="text-sm font-medium text-slate-400 hover:text-white transition">Exit</Link>
            {analysis && (
                 <Button 
                    className="bg-white text-slate-950 hover:bg-blue-50 rounded-full font-bold px-6"
                    onClick={() => {
                        const analysisData = {
                          productName: analysis?.businessOverview?.summary?.split(' ')[0] || '',
                          website: website || '',
                          valueProp: analysis?.businessOverview?.valueProps?.[0] || '',
                          websiteAnalysis: analysis
                        }
                        const encodedAnalysis = encodeURIComponent(JSON.stringify(analysisData))
                        router.push(`/onboarding?flow=post-analysis&analysis=${encodedAnalysis}&website=${encodeURIComponent(website || '')}`)
                    }}
                 >
                    Build My Plan
                 </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* STATE 1: INPUT (Hero Style) */}
        {!analysis && !analyzing && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center relative">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl text-center z-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium mb-8 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-lime-400" /> AI Strategy Engine 2.0
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-10 tracking-tight leading-tight">
                  Identify your <br />
                  <span className="text-lime-400">unfair advantage.</span>
                </h1>
                
                <div className="relative max-w-2xl mx-auto mb-20">
                    {/* Glow behind input */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-xl blur opacity-20"></div>
                    <form onSubmit={handleAnalyze} className="relative bg-[#020604] border border-white/20 p-1.5 rounded-lg flex gap-2 shadow-2xl">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-500" />
                            </div>
                            <Input 
                                className="bg-transparent border-none text-white pl-12 h-14 focus-visible:ring-0 text-lg placeholder:text-slate-600"
                                placeholder="marketingbuddy.ai"
                                value={website}
                                onChange={(e) => setWebsite(formatUrl(e.target.value))}
                                autoFocus
                            />
                        </div>
                        <Button 
                            type="submit"
                            size="lg" 
                            className="h-14 px-8 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-md text-base transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(163,230,53,0.3)]"
                            disabled={!website}
                        >
                            Run Audit
                        </Button>
                    </form>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-8 inline-block">
                    {error}
                  </div>
                )}

                {/* Teaser Grid - Exact Match to Screenshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10 max-w-3xl mx-auto">
                    <div className="bg-[#0b1215] p-8 hover:bg-[#111a1e] transition duration-500 group text-left">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                           <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-white font-bold text-base mb-1">Action Plan</h3>
                        <p className="text-sm text-slate-500">Specific tactics to grow.</p>
                    </div>
                    <div className="bg-[#0b1215] p-8 hover:bg-[#111a1e] transition duration-500 group text-left">
                        <div className="w-10 h-10 rounded-full bg-lime-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                           <MessageSquare className="w-5 h-5 text-lime-400" />
                        </div>
                        <h3 className="text-white font-bold text-base mb-1">Messaging</h3>
                        <p className="text-sm text-slate-500">Tone & clarity audit.</p>
                    </div>
                    <div className="bg-[#0b1215] p-8 hover:bg-[#111a1e] transition duration-500 group text-left">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                           <ArrowUpRight className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-white font-bold text-base mb-1">Opportunities</h3>
                        <p className="text-sm text-slate-500">Low-hanging fruit.</p>
                    </div>
                </div>
            </motion.div>
          </div>
        )}

        {/* STATE 2: LOADING */}
        {analyzing && (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-lime-500/20 rounded-full animate-ping absolute inset-0"></div>
                    <div className="w-24 h-24 bg-slate-950 border border-lime-500/50 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_-10px_rgba(163,230,53,0.3)]">
                        <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
                    </div>
                </div>
                <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-bold text-white">Analyzing Strategy...</h3>
                    <div className="flex gap-2 justify-center mt-4">
                         <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${loadingStep >= 0 ? 'bg-lime-500' : 'bg-slate-800'}`}></span>
                         <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${loadingStep >= 1 ? 'bg-lime-500' : 'bg-slate-800'}`}></span>
                         <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${loadingStep >= 2 ? 'bg-lime-500' : 'bg-slate-800'}`}></span>
                         <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${loadingStep >= 3 ? 'bg-lime-500' : 'bg-slate-800'}`}></span>
                    </div>
                    <p className="text-slate-500 text-sm font-mono mt-6">Target: {website}</p>
                </div>
            </div>
        )}

        {/* STATE 3: DASHBOARD RESULTS */}
        {analysis && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16 pb-20"
          >
            
            {/* 1. EXECUTIVE SUMMARY (Bento Layout) */}
            <section>
                <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
                    <div>
                        <div className="text-lime-400 font-bold tracking-wider text-xs mb-2 uppercase">Section 01</div>
                        <h2 className="text-4xl font-bold text-white">Executive Summary</h2>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-xs text-slate-500 uppercase font-bold">Industry Segment</div>
                        <div className="text-slate-200 font-medium">{analysis.businessOverview?.industry}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* Main Intelligence Card */}
                    <div className="lg:col-span-8 bg-slate-900/50 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition duration-1000">
                            <Briefcase className="w-40 h-40 text-white" />
                        </div>
                        <div className="relative z-10">
                             <h3 className="text-xl font-bold text-white mb-4">{analysis.businessOverview?.summary}</h3>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-3 flex items-center gap-2">
                                        <Target className="w-3 h-3" /> Who it's for
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(analysis.businessOverview?.targetAudience || []).map((t: string, i: number) => (
                                            <div key={i} className="px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-sm text-slate-300">
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-3 flex items-center gap-2">
                                        <Layers className="w-3 h-3" /> Revenue Model
                                    </div>
                                    <div className="px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-sm text-slate-300 inline-block">
                                        {analysis.businessOverview?.businessModel}
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Key Strengths Stack */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-3xl p-6 flex-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h3 className="font-bold text-white">Winning Factors</h3>
                            </div>
                            <ul className="space-y-4">
                                {(analysis.marketingStrengths || []).slice(0,3).map((s: string, i: number) => (
                                    <li key={i} className="flex gap-3 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-300 font-medium">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Core Value Prop Teaser */}
                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 flex-1 flex flex-col justify-center">
                             <div className="text-xs text-slate-500 uppercase font-bold mb-2">Core Value Proposition</div>
                             <div className="text-white font-medium">
                                "{analysis.businessOverview?.valueProps?.[0]}"
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: GROWTH OPPORTUNITIES (Cards with visual weight) */}
            <section>
                 <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
                    <div>
                        <div className="text-orange-400 font-bold tracking-wider text-xs mb-2 uppercase">Section 02</div>
                        <h2 className="text-4xl font-bold text-white">Strategic Opportunities</h2>
                    </div>
                    <div className="text-right">
                         <div className="text-xs text-slate-500 uppercase font-bold">Generated by GPT-4o</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(analysis.marketingOpportunities || []).map((opp: any, i: number) => (
                        <div key={i} className="group relative bg-slate-900 border border-white/10 hover:border-blue-500/50 p-6 rounded-3xl transition duration-300 flex flex-col h-full">
                            {/* Number Watermark */}
                            <div className="absolute top-4 right-6 text-[60px] font-bold text-white/5 group-hover:text-white/10 transition">
                                0{i+1}
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                                        (opp.priority || '').toLowerCase() === 'high' 
                                        ? 'bg-orange-500/20 text-orange-400' 
                                        : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {opp.priority} Priority
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">{opp.effort} Effort</span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition">{opp.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6">{opp.description}</p>
                                
                                {/* Footer: Why & Where */}
                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-start gap-2 mb-3">
                                        <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-slate-300 italic">"{opp.reasoning}"</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(opp.channels || []).map((c: string, idx: number) => (
                                            <span key={idx} className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 3: MESSAGING & COMPETITION (Split Layout) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Messaging */}
                <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                     <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-emerald-300" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Messaging Audit</h3>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-200 font-bold uppercase tracking-wide">
                            {analysis.contentMessagingAnalysis?.toneOfVoice}
                        </div>
                    </div>

                    <div className="p-8 flex flex-col gap-8 flex-grow">
                        {/* Current */}
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 relative">
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Current Hook</div>
                            <p className="text-lg text-slate-300 font-serif italic">"{analysis.contentMessagingAnalysis?.currentMessaging}"</p>
                        </div>

                        {/* Gaps & Fixes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase mb-4">
                                    <ShieldAlert className="w-4 h-4" /> Blind Spots
                                </div>
                                <ul className="space-y-3">
                                    {(analysis.contentMessagingAnalysis?.messagingGaps || []).map((g: string, i: number) => (
                                        <li key={i} className="text-sm text-slate-400 leading-snug flex gap-2">
                                            <span className="text-rose-500/50 text-lg leading-none">•</span> {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-4">
                                    <Sparkles className="w-4 h-4" /> Quick Wins
                                </div>
                                <ul className="space-y-3">
                                    {(analysis.contentMessagingAnalysis?.improvementSuggestions || []).map((g: string, i: number) => (
                                        <li key={i} className="text-sm text-slate-400 leading-snug flex gap-2">
                                            <span className="text-emerald-500/50 text-lg leading-none">•</span> {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competition */}
                <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                     <div className="p-8 border-b border-white/5 bg-slate-950/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Target className="w-4 h-4 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Market Position</h3>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col gap-8 flex-grow">
                        <div className="p-6 bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-2xl">
                             <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">Positioning Statement</div>
                             <p className="text-sm text-blue-100 leading-relaxed font-medium">
                                {analysis.competitivePositioning?.marketPosition}
                             </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase mb-3">Key Differentiators</div>
                                <div className="flex flex-wrap gap-2">
                                    {(analysis.competitivePositioning?.differentiators || []).map((diff: string, i: number) => (
                                        <div key={i} className="px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-slate-300 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> {diff}
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <div className="text-xs text-slate-500 font-bold uppercase mb-3">Vulnerabilities</div>
                                <ul className="space-y-2">
                                    {(analysis.competitivePositioning?.improvements || []).map((imp: string, i: number) => (
                                        <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                            <ArrowUpRight className="w-4 h-4 text-orange-500 shrink-0" /> {imp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            {/* SECTION 4: ACTION PLAN (Timeline Style) */}
            <section className="pt-8">
                 <div className="flex items-end justify-between mb-12">
                    <div className="w-full">
                        <div className="text-emerald-400 font-bold tracking-wider text-xs mb-2 uppercase">Section 03</div>
                        <h2 className="text-4xl font-bold text-white flex items-center gap-4">
                            Execution Roadmap
                            <div className="h-px flex-grow bg-white/10 ml-4"></div>
                        </h2>
                    </div>
                </div>

                <div className="space-y-8">
                    {(analysis.actionableRecommendations || []).map((rec: any, i: number) => (
                        <div key={i} className="relative pl-8 group">
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-8 bottom-[-32px] w-px bg-gradient-to-b from-white/20 to-transparent group-last:hidden"></div>
                            
                            {/* Dot */}
                            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-slate-950 border-2 border-emerald-500 flex items-center justify-center z-10">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            </div>

                            <div className="bg-slate-900/50 border border-white/10 hover:border-emerald-500/30 p-6 rounded-2xl transition duration-300 flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 0{i+1}</div>
                                        <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                        <div className="text-xs font-bold text-slate-500 uppercase">{rec.timeframe}</div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{rec.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{rec.description}</p>
                                </div>
                                
                                <div className="md:w-1/3 w-full bg-slate-950 p-4 rounded-xl border border-white/5">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> Implementation
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        {rec.implementation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER CTA */}
            <div className="flex flex-col items-center justify-center pt-20 pb-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Turn this audit into action.</h2>
                <p className="text-slate-400 max-w-xl mb-8 text-lg">
                    Marketing Buddy can auto-generate the content for every step in this roadmap. Don't do it manually.
                </p>
                 <Button 
                    size="lg"
                    className="bg-white text-slate-950 hover:bg-blue-50 font-bold h-16 px-12 rounded-full text-lg shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
                    onClick={() => {
                        const analysisData = {
                            productName: analysis?.businessOverview?.summary?.split(' ')[0] || '',
                            website: website || '',
                            valueProp: analysis?.businessOverview?.valueProps?.[0] || '',
                            websiteAnalysis: analysis
                        }
                        const encodedAnalysis = encodeURIComponent(JSON.stringify(analysisData))
                        router.push(`/onboarding?flow=post-analysis&analysis=${encodedAnalysis}&website=${encodeURIComponent(website || '')}`)
                    }}
                >
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-slate-600 mt-6">No credit card required • Cancel anytime</p>
            </div>

          </motion.div>
        )}

      </main>
    </div>
  )
}