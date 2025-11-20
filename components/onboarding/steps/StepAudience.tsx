"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, Users, Target, BrainCircuit, AlertCircle, 
  RefreshCw, MapPin, Heart, Wallet, Search, Globe 
} from "lucide-react"

export default function StepAudience({ formData, updateFormData }: any) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [audienceData, setAudienceData] = useState<any>(null)

  useEffect(() => {
      if (formData.targetAudience && typeof formData.targetAudience === 'object') {
          setAudienceData(formData.targetAudience)
      }
  }, [formData.targetAudience])

  const generateAudience = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-target-audience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.productName,
          valueProp: formData.valueProp,
          website: formData.website,
          websiteAnalysis: formData.websiteAnalysis,
          northStarGoal: formData.northStarGoal
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setAudienceData(data.targetAudience)
        updateFormData('targetAudience', data.targetAudience)
      }
    } catch (error) {
      console.error("Failed to generate audience", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white">Who are we talking to?</h2>
        <p className="text-slate-400">Define your Ideal Customer Profile (ICP).</p>
      </div>

      {/* EMPTY STATE */}
      {!audienceData && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-900/50 border border-white/10 rounded-3xl space-y-6 hover:border-lime-500/40 transition-colors">
              <div className="w-20 h-20 bg-lime-500/10 rounded-full flex items-center justify-center border border-lime-500/30">
                  <Users className="w-10 h-10 text-lime-400" />
              </div>
              <div className="text-center max-w-md px-4">
                  <h3 className="text-xl font-bold text-white mb-2">Let AI Build Your Persona</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                      We will analyze your website content to determine exactly who your ideal customer is, their pain points, and buying triggers.
                  </p>
                  <Button 
                    onClick={generateAudience}
                    size="lg"
                    className="bg-lime-400 hover:bg-lime-300 text-black rounded-full px-8 h-12 shadow-[0_0_25px_rgba(163,230,53,0.35)] font-bold transition-all hover:scale-105"
                  >
                    <BrainCircuit className="w-4 h-4 mr-2" /> Generate Persona
                  </Button>
              </div>
          </div>
      )}

      {/* LOADING STATE */}
      {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                  <div className="w-16 h-16 border-4 border-lime-500/30 border-t-lime-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <BrainCircuit className="w-6 h-6 text-lime-400" />
                  </div>
              </div>
              <div className="text-center space-y-2">
                  <h3 className="text-white font-bold">Analyzing Psychographics...</h3>
                  <p className="text-slate-500 text-sm">Identifying pain points and desires.</p>
              </div>
          </div>
      )}

      {/* DATA VIEW */}
      {audienceData && (
          <div className="space-y-6">
              
              {/* ROW 1: The Person */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Demographics */}
                  <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs mb-6">
                          <Users className="w-4 h-4" /> Demographics
                      </div>
                      <div className="space-y-6">
                          <div>
                              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Role / Title</div>
                              <div className="flex flex-wrap gap-2">
                                  {(audienceData.demographics?.professions || []).map((p: string, i: number) => (
                                      <Badge key={i} variant="secondary" className="bg-emerald-950/20 border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/40 px-3 py-1">
                                        {p}
                                      </Badge>
                                  ))}
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                                  <div className="text-xs text-slate-500 mb-1">Age Range</div>
                                  <div className="text-white font-medium">{audienceData.demographics?.ageRange}</div>
                              </div>
                              <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                                  <div className="text-xs text-slate-500 mb-1">Income</div>
                                  <div className="text-white font-medium">{audienceData.demographics?.incomeLevel}</div>
                              </div>
                          </div>
                          
                          {/* NEW: Locations */}
                          {audienceData.demographics?.locations && (
                            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 p-2 rounded-lg">
                                <MapPin className="w-3 h-3 text-emerald-400" />
                                <span>{audienceData.demographics.locations.join(", ")}</span>
                            </div>
                          )}
                      </div>
                  </div>

                  {/* Psychographics */}
                  <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl">
                       <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs mb-6">
                          <BrainCircuit className="w-4 h-4" /> Psychographics
                      </div>
                      <div className="space-y-6">
                          <div>
                              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Core Values</div>
                              <div className="flex flex-wrap gap-2">
                                  {(audienceData.psychographics?.values || []).map((v: string, i: number) => (
                                      <span key={i} className="text-xs text-slate-300 border border-white/10 px-2 py-1 rounded-lg bg-white/5">{v}</span>
                                  ))}
                              </div>
                          </div>
                          
                          {/* NEW: Interests */}
                          <div>
                              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider flex items-center gap-1">
                                <Heart className="w-3 h-3" /> Interests
                              </div>
                              <div className="text-sm text-slate-400 leading-relaxed">
                                {audienceData.psychographics?.interests?.join(", ")}
                              </div>
                          </div>

                          <div className="bg-emerald-950/10 p-4 rounded-xl border border-emerald-500/15">
                              <div className="text-xs text-emerald-300 mb-1 font-bold uppercase">Lifestyle Snapshot</div>
                              <p className="text-sm text-emerald-100/80 leading-relaxed italic">"{audienceData.psychographics?.lifestyle}"</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* ROW 2: The Strategy (Behavior & Presence) - NEW */}
              <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl">
                  <div className="flex items-center gap-2 text-orange-400 font-bold uppercase text-xs mb-6">
                      <Wallet className="w-4 h-4" /> Behavioral Intelligence
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                          <div className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider flex items-center gap-2">
                             <Search className="w-3 h-3" /> Buying Triggers
                          </div>
                          <ul className="space-y-2">
                             {(audienceData.purchasingBehavior?.decisionFactors || []).map((factor: string, i: number) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">✓</span> {factor}
                                </li>
                             ))}
                          </ul>
                      </div>
                      <div>
                          <div className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider flex items-center gap-2">
                             <Globe className="w-3 h-3" /> Where they hang out
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {(audienceData.onlinePresence || []).map((place: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-slate-950 text-slate-400 border-slate-700">
                                    {place}
                                </Badge>
                             ))}
                          </div>
                          <p className="text-xs text-slate-500 mt-3 italic">
                             Research style: {(audienceData.purchasingBehavior?.researchMethods || []).join(", ")}
                          </p>
                      </div>
                  </div>
              </div>

              {/* ROW 3: Pain & Gain */}
              <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs mb-4">
                              <AlertCircle className="w-4 h-4" /> Pain Points
                          </div>
                          <ul className="space-y-3">
                              {(audienceData.painPoints || []).map((p: string, i: number) => (
                                  <li key={i} className="text-sm text-slate-400 flex gap-3 items-start">
                                      <span className="text-rose-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span> 
                                      <span className="leading-snug">{p}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div>
                           <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs mb-4">
                              <Target className="w-4 h-4" /> Desired Outcomes
                          </div>
                          <ul className="space-y-3">
                              {(audienceData.goals || []).map((g: string, i: number) => (
                                  <li key={i} className="text-sm text-slate-400 flex gap-3 items-start">
                                      <span className="text-emerald-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span> 
                                      <span className="leading-snug">{g}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>

              <div className="flex justify-center pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={generateAudience}
                    className="text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                  >
                      <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                  </Button>
              </div>
          </div>
      )}
    </div>
  )
}