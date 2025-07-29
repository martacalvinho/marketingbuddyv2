"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Onboarding from "@/components/onboarding"

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialData, setInitialData] = useState<any>(null)
  const [flow, setFlow] = useState<'post-analysis' | 'from-landing'>('from-landing')

  useEffect(() => {
    // Check if this is coming from website analysis
    const analysisData = searchParams.get('analysis')
    const website = searchParams.get('website')
    const flowType = searchParams.get('flow')

    if (flowType === 'post-analysis' && analysisData) {
      setFlow('post-analysis')
      try {
        const parsedAnalysis = JSON.parse(decodeURIComponent(analysisData))
        setInitialData({
          website: website || '',
          productName: parsedAnalysis.productName || '',
          valueProp: parsedAnalysis.valueProp || '',
          websiteAnalysis: parsedAnalysis.websiteAnalysis || parsedAnalysis
        })
      } catch (error) {
        console.error('Failed to parse analysis data:', error)
        setFlow('from-landing')
      }
    } else {
      setFlow('from-landing')
    }
  }, [searchParams])

  const handleOnboardingComplete = (userData: any) => {
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleSkip = () => {
    // Create minimal user data and redirect
    const minimalUser = {
      onboardingCompleted: false,
      skippedOnboarding: true,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('user', JSON.stringify(minimalUser))
    router.push('/dashboard')
  }

  return (
    <Onboarding
      flow={flow}
      initialData={initialData}
      onComplete={handleOnboardingComplete}
      onSkip={handleSkip}
    />
  )
}
