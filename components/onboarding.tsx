"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2, LayoutDashboard, ArrowRight } from "lucide-react"

// Imports
import StepWebsiteAnalysis from "./onboarding/steps/StepWebsiteAnalysis"
import StepBasicInfo from "./onboarding/steps/StepBasicInfo"
import StepPlatforms from "./onboarding/steps/StepPlatforms"
import StepAudience from "./onboarding/steps/StepAudience"
import AnalysisView from "@/components/analysis-view"

interface OnboardingProps {
  flow: 'post-analysis' | 'from-landing'
  initialData?: any
  onComplete: (data: any) => void
  onSkip: () => void
}

export default function Onboarding({ flow, initialData, onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(flow === 'post-analysis' ? 1 : 0)
  
  const [formData, setFormData] = useState({
    productName: initialData?.productName || '',
    website: initialData?.website || '',
    valueProp: initialData?.valueProp || '',
    preferredPlatforms: [] as string[],
    targetAudience: null, // Store JSON object here
    websiteAnalysis: initialData?.websiteAnalysis || null,
    ...initialData
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
  }

  // STEPS:
  // 0: Input (if needed)
  // 1: Review Analysis
  // 2: Basic Info
  // 3: Target Audience (NEW)
  // 4: Platforms
  // 5: Final
  const totalSteps = 6 
  
  const handleNext = () => {
    if (step === totalSteps - 1) {
      handleSubmit()
    } else {
      setStep(s => s + 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await onComplete(formData)
    setIsSubmitting(false)
  }

  // Helper to check if we can proceed
  const canProceed = () => {
    if (step === 3 && !formData.targetAudience) return false; // Require audience generation
    if (step === 4 && formData.preferredPlatforms.length === 0) return false; // Require platforms
    return true;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none -z-10 transform -translate-y-1/2 opacity-50" />

      {/* Top Bar Progress */}
      <div className="h-1 bg-slate-900 w-full fixed top-0 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${((step) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 pb-32 max-w-5xl mx-auto w-full relative z-10">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 0: INPUT WEBSITE */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full">
               <StepWebsiteAnalysis 
                  formData={formData} 
                  updateFormData={updateFormData} 
                  onNext={() => setStep(1)} 
               />
            </motion.div>
          )}

          {/* STEP 1: REVIEW ANALYSIS */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                 <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Intelligence Report</h1>
                    <p className="text-slate-400 text-lg">Strategy extracted for <span className="text-indigo-400">{formData.website}</span></p>
                 </div>
                 
                 {/* Styled "Skip" Button */}
                 <button 
                    onClick={() => setStep(2)} 
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-400 text-sm font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all group"
                 >
                    Skip to Setup 
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                 </button>
              </div>
              
              <AnalysisView analysis={formData.websiteAnalysis} />
            </motion.div>
          )}

          {/* STEP 2: BASIC INFO */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-lg">
               <StepBasicInfo formData={formData} updateFormData={updateFormData} />
            </motion.div>
          )}

          {/* STEP 3: TARGET AUDIENCE (NEW) */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-4xl">
               <StepAudience formData={formData} updateFormData={updateFormData} />
            </motion.div>
          )}

          {/* STEP 4: PLATFORMS */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-5xl">
               <StepPlatforms formData={formData} updateFormData={updateFormData} />
            </motion.div>
          )}

           {/* STEP 5: FINAL */}
           {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-lg text-center">
               <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <LayoutDashboard className="w-10 h-10 text-emerald-500" />
               </div>
               <h2 className="text-4xl font-bold text-white mb-4">Ready to Launch</h2>
               <p className="text-slate-400 mb-10 text-lg">
                 We have everything we need. Click below to generate your dashboard and first weekly plan.
               </p>
               <Button 
                 onClick={handleSubmit} 
                 disabled={isSubmitting}
                 size="lg"
                 className="bg-white text-slate-950 hover:bg-indigo-50 rounded-full px-12 h-14 text-lg font-bold shadow-lg shadow-white/10 transition-all hover:scale-105"
               >
                 {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Generate Dashboard"}
               </Button>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Footer Navigation */}
      {step > 0 && step < 5 && (
        <footer className="fixed bottom-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/5 p-6 z-50">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Button 
                variant="ghost" 
                onClick={() => setStep(s => s - 1)} 
                className="text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="flex gap-4">
                
                <Button 
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {step === 1 ? 'Looks good, continue' : 'Continue'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
            </div>
        </footer>
      )}
    </div>
  )
}