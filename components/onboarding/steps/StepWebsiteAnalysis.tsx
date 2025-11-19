"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Sparkles, Loader2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function StepWebsiteAnalysis({ formData, updateFormData, onNext }: any) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!formData.website) return
    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: formData.website.trim() })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Analysis failed")
        setIsAnalyzing(false)
        return
      }

      // Save analysis to state
      updateFormData('websiteAnalysis', data)
      
      // Auto-fill bits
      if (data.businessOverview?.summary) {
         const derivedName = data.businessOverview.summary.split(' ')[0]
         updateFormData('productName', derivedName)
      }
      if (data.businessOverview?.valueProps?.[0]) {
         updateFormData('valueProp', data.businessOverview.valueProps[0])
      }

      setIsAnalyzing(false)
      onNext() // Auto advance

    } catch (err) {
      setError("Failed to connect. Please try again.")
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
        <Sparkles className="w-3 h-3" /> Step 1 of 4
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
        Let's calibrate your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">marketing engine.</span>
      </h1>

      <div className="max-w-md mx-auto space-y-4">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-slate-900 border border-white/10 p-2 rounded-xl flex gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-slate-500" />
                    </div>
                    <Input 
                        className="bg-transparent border-none text-white pl-10 h-12 focus-visible:ring-0 text-base placeholder:text-slate-600"
                        placeholder="yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => updateFormData('website', e.target.value)}
                    />
                </div>
            </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button 
            onClick={handleAnalyze}
            disabled={!formData.website || isAnalyzing}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
        >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze Website"}
            {!isAnalyzing && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
        
        <p className="text-slate-500 text-xs">
          We use AI to extract your value props and target audience.
        </p>
      </div>
    </div>
  )
}