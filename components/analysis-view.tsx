"use client"

import { Badge } from "@/components/ui/badge"
import {
  Target, TrendingUp, MessageSquare, Zap, 
  Briefcase, CheckCircle2, Rocket, Search, Lightbulb
} from "lucide-react"

interface AnalysisViewProps {
  analysis: any
}

export default function AnalysisView({ analysis }: AnalysisViewProps) {
  if (!analysis) return null

  return (
    <div className="space-y-12 pb-8">
      
      {/* SECTION 1: THE AUDIT (Blue) */}
      <section>
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            Phase 01: The Audit
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Business DNA */}
            <div className="lg:col-span-8 bg-slate-900/50 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Briefcase className="w-48 h-48 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 leading-relaxed">{analysis.businessOverview?.summary}</h3>
                <div className="flex flex-wrap gap-2 mt-6">
                    {(analysis.businessOverview?.targetAudience || []).map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-blue-950/30 border border-blue-500/10 rounded-lg text-xs text-blue-100">{t}</span>
                    ))}
                </div>
            </div>

            {/* Strengths */}
            <div className="lg:col-span-4 bg-blue-950/10 border border-blue-500/20 rounded-3xl p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4 text-white font-bold">
                    <TrendingUp className="w-5 h-5 text-blue-400" /> Key Wins
                </div>
                <ul className="space-y-3">
                    {(analysis.marketingStrengths || []).slice(0,3).map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 items-start text-sm text-blue-100/80">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> {s}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Deep Dives Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-900/40 border border-blue-500/10 p-6 rounded-3xl">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <MessageSquare className="w-5 h-5 text-blue-400" /> Messaging
                    </div>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20 text-[10px]">
                        {analysis.contentMessagingAnalysis?.toneOfVoice}
                    </Badge>
                 </div>
                 <div className="text-xs text-blue-400 uppercase font-bold mb-2">Blind Spots</div>
                 <ul className="space-y-2">
                     {(analysis.contentMessagingAnalysis?.messagingGaps || []).slice(0,2).map((gap: string, i: number) => (
                        <li key={i} className="text-sm text-slate-400 flex gap-2"><span className="text-blue-500">•</span> {gap}</li>
                     ))}
                 </ul>
            </div>
            <div className="bg-slate-900/40 border border-blue-500/10 p-6 rounded-3xl">
                 <div className="flex items-center gap-2 text-white font-bold mb-4">
                    <Target className="w-5 h-5 text-blue-400" /> Positioning
                 </div>
                 <p className="text-sm text-slate-400 italic mb-4">"{analysis.competitivePositioning?.marketPosition}"</p>
                 <div className="flex flex-wrap gap-2">
                     {(analysis.competitivePositioning?.differentiators || []).map((d: string, i: number) => (
                        <span key={i} className="text-[10px] border border-blue-500/20 px-2 py-1 rounded text-slate-300">{d}</span>
                     ))}
                 </div>
            </div>
        </div>
      </section>

      {/* SECTION 2: THE STRATEGY (Orange) */}
      <section>
        <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
            Phase 02: The Strategy
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(analysis.marketingOpportunities || []).map((opp: any, i: number) => (
                <div key={i} className="bg-slate-900 border border-orange-500/20 p-6 rounded-3xl flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg"><Zap className="w-4 h-4 text-orange-500" /></div>
                        <span className="text-[10px] uppercase font-bold text-orange-400">{opp.priority} Priority</span>
                    </div>
                    <h4 className="text-white font-bold mb-2">{opp.title}</h4>
                    <p className="text-sm text-slate-400 flex-grow">{opp.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* SECTION 3: THE EXECUTION (Green) - Added Back! */}
      <section>
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            Phase 03: The Plan
        </div>
        <div className="space-y-4">
            {(analysis.actionableRecommendations || []).map((rec: any, i: number) => (
                <div key={i} className="group relative pl-6">
                    {/* Timeline Line */}
                    <div className="absolute left-[11px] top-2 bottom-[-24px] w-px bg-slate-800 group-last:hidden"></div>
                    
                    {/* Dot */}
                    <div className="absolute left-0 top-2 w-6 h-6 bg-slate-950 border-2 border-emerald-500/50 rounded-full flex items-center justify-center z-10">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    </div>

                    <div className="bg-slate-900 border border-emerald-500/20 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-start hover:bg-slate-900/80 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Step 0{i+1}</span>
                                <span className="text-[10px] text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded uppercase">{rec.timeframe}</span>
                            </div>
                            <h4 className="text-white font-bold mb-1">{rec.title}</h4>
                            <p className="text-sm text-slate-400">{rec.description}</p>
                        </div>
                        
                        <div className="md:w-1/3 w-full bg-slate-950/50 p-3 rounded-xl border border-white/5">
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                                <Rocket className="w-3 h-3" /> How to Execute
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{rec.implementation}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  )
}