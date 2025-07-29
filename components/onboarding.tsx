"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Target, Users, DollarSign, Calendar, Zap, Globe, ChevronRight, ChevronLeft, Loader2, CheckCircle2, Building, Lightbulb, CheckCircle, AlertCircle, TrendingUp, MessageSquare, Badge as BadgeIcon, BookOpen, BarChart3 } from "lucide-react"

interface OnboardingProps {
  flow: 'post-analysis' | 'from-landing'
  initialData?: {
    productName?: string
    website?: string
    valueProp?: string
    websiteAnalysis?: any
  }
  onComplete: (userData: any) => void
  onSkip?: () => void
}

const MARKETING_GOALS = [
  { id: 'growth', title: 'User Growth', description: 'Acquire new users and expand reach', icon: Users },
  { id: 'revenue', title: 'Revenue Growth', description: 'Increase sales and MRR', icon: DollarSign },
  { id: 'awareness', title: 'Brand Awareness', description: 'Build recognition', icon: Globe },
  { id: 'engagement', title: 'Community Building', description: 'Foster engagement', icon: Target },
  { id: 'conversion', title: 'Conversion Optimization', description: 'Improve funnel', icon: Zap },
  { id: 'retention', title: 'Customer Retention', description: 'Reduce churn', icon: CheckCircle2 }
]

const EXPERIENCE_LEVELS = [
  { id: 'beginner', title: 'Beginner', description: 'New to marketing, need guidance' },
  { id: 'intermediate', title: 'Intermediate', description: 'Some experience, looking to optimize' },
  { id: 'advanced', title: 'Advanced', description: 'Experienced marketer' }
]

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'email', name: 'Email Marketing' },
  { id: 'blog', name: 'Blog/Content' },
  { id: 'seo', name: 'SEO/Google' }
]

export default function Onboarding({ flow, initialData, onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(flow === 'from-landing' ? 0 : 1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState({
    productName: initialData?.productName || '',
    website: initialData?.website || '',
    valueProp: initialData?.valueProp || '',
    northStarGoal: '',
    customGoal: '',
    targetAudience: '' as string | any,
    goalType: 'users',
    goalAmount: '',
    goalTimeline: '6',
    marketingStrategy: '6-month',
    currentUsers: '',
    currentPlatforms: [] as string[],
    experienceLevel: '',
    preferredPlatforms: [] as string[],
    challenges: '',
    focusArea: 'both', // 'website', 'growth', 'both'
    dailyTaskCount: '3', // Number of tasks per day
    websiteAnalysis: initialData?.websiteAnalysis || null
  })

  const totalSteps = flow === 'from-landing' ? 12 : 11
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const [analysisInfo, setAnalysisInfo] = useState<any>(null)
  const [analysisError, setAnalysisError] = useState("")

  const handleWebsiteAnalysis = async () => {
    if (!formData.website) return
    setIsAnalyzing(true)
    setAnalysisError("")
    
    try {
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: formData.website.trim() })
      })

      const data = await response.json()

      if (!data.success) {
        setAnalysisError(data.error || "Analysis failed")
        return
      }

      // Extract analysis info for display
      setAnalysisInfo({
        url: data.url,
        contentLength: data.contentLength,
        extractedAt: data.extractedAt,
      })

      // Structure the analysis data like the dedicated analyze page
      const analysisData = {
        businessOverview: data.businessOverview,
        marketingOpportunities: data.marketingOpportunities,
        marketingStrengths: data.marketingStrengths,
        contentMessagingAnalysis: data.contentMessagingAnalysis,
        competitivePositioning: data.competitivePositioning,
        actionableRecommendations: data.actionableRecommendations,
      }

      updateFormData('websiteAnalysis', analysisData)
      
      // Auto-fill business info
      if (data.businessOverview?.summary && !formData.productName) {
        const productName = data.businessOverview.summary.split(' ')[0] || ''
        updateFormData('productName', productName)
      }
      if (data.businessOverview?.valueProps?.[0] && !formData.valueProp) {
        updateFormData('valueProp', data.businessOverview.valueProps[0])
      }
    } catch (error) {
      setAnalysisError("Failed to analyze website. Please try again.")
      console.error('Website analysis failed:', error)
    }
    setIsAnalyzing(false)
  }

  const generateTargetAudience = async () => {
    try {
      const response = await fetch('/api/generate-target-audience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.productName,
          valueProp: formData.valueProp,
          website: formData.website, // Include website URL for AI analysis
          websiteAnalysis: formData.websiteAnalysis,
          northStarGoal: formData.northStarGoal
        })
      })
      if (response.ok) {
        const data = await response.json()
        updateFormData('targetAudience', data.targetAudience)
      }
    } catch (error) {
      updateFormData('targetAudience', 'Small business owners and entrepreneurs looking to grow their online presence.')
    }
  }

  const nextStep = () => {
    if (currentStep === 4 && !formData.targetAudience) {
      generateTargetAudience()
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, flow === 'from-landing' ? 0 : 1))
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/generate-marketing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        const planData = await response.json()
        const completeUserData = {
          ...formData,
          plan: planData.plan,
          onboardingCompleted: true,
          createdAt: new Date().toISOString()
        }
        onComplete(completeUserData)
      }
    } catch (error) {
      onComplete({ ...formData, onboardingCompleted: true })
    }
  }

  const renderStep = () => {
    // Adjust step number for post-analysis flow (skip website analysis)
    const adjustedStep = flow === 'post-analysis' ? currentStep + 1 : currentStep
    
    // Debug logging
    console.log('Onboarding renderStep:', {
      flow,
      currentStep,
      adjustedStep,
      hasWebsiteAnalysis: !!formData.websiteAnalysis
    })
    
    switch (adjustedStep) {
      case 0: // Website Analysis (only for from-landing flow)
        if (formData.websiteAnalysis && !isAnalyzing) {
          // Show analysis results
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Website Analysis Complete! 🎉</h2>
                <p className="text-gray-600">Here's what we found about your website and marketing opportunities.</p>
                {analysisInfo && (
                  <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
                    <span>📊 {analysisInfo.contentLength?.toLocaleString()} characters analyzed</span>
                    <span>🕒 {analysisInfo.extractedAt ? new Date(analysisInfo.extractedAt).toLocaleTimeString() : ''}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {/* Business Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>Business Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">What You Do</h4>
                        <p className="text-gray-700">{formData.websiteAnalysis.businessOverview?.summary}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Industry</h4>
                          <Badge variant="outline">
                            {formData.websiteAnalysis.businessOverview?.industry || "Not specified"}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Business Model</h4>
                          <Badge variant="outline">
                            {formData.websiteAnalysis.businessOverview?.businessModel || "Not specified"}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
                        <div className="flex flex-wrap gap-2">
                          {(formData.websiteAnalysis.businessOverview?.targetAudience || []).map((audience: string, index: number) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{audience}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Value Propositions</h4>
                        <ul className="space-y-2">
                          {(formData.websiteAnalysis.businessOverview?.valueProps || []).map((prop: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{prop}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Marketing Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Marketing Opportunities</span>
                    </CardTitle>
                    <CardDescription>Specific opportunities identified for your business</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(formData.websiteAnalysis.marketingOpportunities || []).map((opportunity: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">{opportunity.title}</h4>
                            <div className="flex space-x-1">
                              <Badge
                                variant={
                                  opportunity.priority === "high"
                                    ? "destructive"
                                    : opportunity.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {opportunity.priority} priority
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {opportunity.effort} effort
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-blue-800 mb-2">{opportunity.description}</p>
                          {opportunity.reasoning && <p className="text-xs text-blue-700 italic">Why: {opportunity.reasoning}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actionable Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Actionable Recommendations</span>
                    </CardTitle>
                    <CardDescription>Specific steps you can take based on your website analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(formData.websiteAnalysis.actionableRecommendations || []).map((rec: any, index: number) => (
                        <div key={index} className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-indigo-900">{rec.title}</h4>
                            <div className="flex space-x-1">
                              <Badge variant="outline" className="text-xs">
                                {rec.timeframe}
                              </Badge>
                              <Badge
                                variant={
                                  rec.impact === "High" ? "destructive" : rec.impact === "Medium" ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {rec.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-indigo-800 mb-2">{rec.description}</p>
                          <p className="text-xs text-indigo-700 italic">Why: {rec.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => updateFormData('websiteAnalysis', null)}>
                  Re-analyze Website
                </Button>
                
              </div>
            </div>
          )
        }
        
        // Show analysis form
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Analyze Your Website</h2>
              <p className="text-gray-600">We'll analyze your website to create a personalized marketing strategy.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                />
              </div>
              {analysisError && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                  {analysisError}
                </div>
              )}
              <Button 
                onClick={handleWebsiteAnalysis} 
                disabled={!formData.website || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Website...
                  </>
                ) : (
                  'Analyze Website'
                )}
              </Button>
            </div>
          </div>
        )

      case 1: // Basic Info
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Business</h2>
              <p className="text-gray-600">Let's start with the basics.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Business/Product Name</Label>
                <Input
                  id="productName"
                  placeholder="Your business name"
                  value={formData.productName}
                  onChange={(e) => updateFormData('productName', e.target.value)}
                />
              </div>
              {flow === 'post-analysis' && (
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="valueProp">Value Proposition</Label>
                <Textarea
                  id="valueProp"
                  placeholder="What unique value do you provide?"
                  value={formData.valueProp}
                  onChange={(e) => updateFormData('valueProp', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      case 2: // Marketing Goals
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's Your North Star Goal?</h2>
              <p className="text-gray-600">Choose your primary marketing objective.</p>
            </div>
            <RadioGroup value={formData.northStarGoal} onValueChange={(value) => updateFormData('northStarGoal', value)}>
              <div className="space-y-3">
                {MARKETING_GOALS.map((goal) => {
                  const Icon = goal.icon
                  return (
                    <div key={goal.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={goal.id} id={goal.id} />
                      <Label htmlFor={goal.id} className="flex-1 cursor-pointer">
                        <Card className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-indigo-600" />
                            <div>
                              <h3 className="font-medium text-gray-900">{goal.title}</h3>
                              <p className="text-sm text-gray-600">{goal.description}</p>
                            </div>
                          </div>
                        </Card>
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
            <div>
              <Label htmlFor="customGoal">Custom Goal (Optional)</Label>
              <Input
                id="customGoal"
                placeholder="Describe your specific goal"
                value={formData.customGoal}
                onChange={(e) => updateFormData('customGoal', e.target.value)}
              />
            </div>
          </div>
        )

      case 3: // Target Audience
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Who's Your Target Audience?</h2>
            </div>
            
            {/* Show structured target audience if available */}
            {formData.targetAudience && typeof formData.targetAudience === 'object' ? (
              <div className="space-y-6">
                {/* Demographics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Demographics</span>
                    </CardTitle>
                    <CardDescription>Key demographic characteristics of your target audience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Age Range</h4>
                          <Badge variant="outline">{formData.targetAudience.demographics?.ageRange || 'Not specified'}</Badge>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Income Level</h4>
                          <Badge variant="outline">{formData.targetAudience.demographics?.incomeLevel || 'Not specified'}</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Locations</h4>
                        <div className="flex flex-wrap gap-2">
                          {(formData.targetAudience.demographics?.locations || []).map((location: string, index: number) => (
                            <Badge key={index} variant="secondary">{location}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Professions</h4>
                        <div className="flex flex-wrap gap-2">
                          {(formData.targetAudience.demographics?.professions || []).map((profession: string, index: number) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{profession}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Psychographics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Psychographics</span>
                    </CardTitle>
                    <CardDescription>Values, interests, and personality traits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Core Values</h4>
                        <div className="flex flex-wrap gap-2">
                          {(formData.targetAudience.psychographics?.values || []).map((value: string, index: number) => (
                            <Badge key={index} variant="default">{value}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {(formData.targetAudience.psychographics?.interests || []).map((interest: string, index: number) => (
                            <Badge key={index} variant="secondary">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Personality Traits</h4>
                        <div className="flex flex-wrap gap-2">
                          {(formData.targetAudience.psychographics?.personality || []).map((trait: string, index: number) => (
                            <Badge key={index} variant="outline">{trait}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      {formData.targetAudience.psychographics?.lifestyle && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Lifestyle</h4>
                          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                            {formData.targetAudience.psychographics.lifestyle}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Pain Points */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>Pain Points & Challenges</span>
                    </CardTitle>
                    <CardDescription>Key challenges your audience faces</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(formData.targetAudience.painPoints || []).map((painPoint: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-red-800 text-sm">{painPoint}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Goals & Motivations</span>
                    </CardTitle>
                    <CardDescription>What your audience wants to achieve</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(formData.targetAudience.goals || []).map((goal: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800 text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Online Presence & Purchasing Behavior */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>Online Presence</span>
                      </CardTitle>
                      <CardDescription>Where they spend time online</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(formData.targetAudience.onlinePresence || []).map((platform: string, index: number) => (
                          <Badge key={index} variant="secondary">{platform}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Purchasing Behavior</span>
                      </CardTitle>
                      <CardDescription>How they make buying decisions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Decision Factors</h5>
                          <div className="flex flex-wrap gap-1">
                            {(formData.targetAudience.purchasingBehavior?.decisionFactors || []).map((factor: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">{factor}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Research Methods</h5>
                          <div className="flex flex-wrap gap-1">
                            {(formData.targetAudience.purchasingBehavior?.researchMethods || []).map((method: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">{method}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={generateTargetAudience}>
                    Regenerate with AI
                  </Button>
                  <Button variant="outline" onClick={() => updateFormData('targetAudience', '')}>
                    Edit Manually
                  </Button>
                </div>
              </div>
            ) : (
              /* Show simple form if no structured data */
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Button variant="outline" size="sm" onClick={generateTargetAudience}>
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    id="targetAudience"
                    placeholder="Describe your ideal customers..."
                    value={typeof formData.targetAudience === 'string' ? formData.targetAudience : ''}
                    onChange={(e) => updateFormData('targetAudience', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>
        )

      case 4: // Focus Area
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's Your Focus?</h2>
              <p className="text-gray-600">Choose how you want to approach your marketing strategy.</p>
            </div>
            <RadioGroup value={formData.focusArea} onValueChange={(value) => updateFormData('focusArea', value)}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="website" id="website" />
                  <Label htmlFor="website" className="flex-1 cursor-pointer">
                    <Card className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-indigo-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Website Improvement First</h3>
                          <p className="text-sm text-gray-600">Focus on optimizing your website based on analysis insights, then move to growth</p>
                        </div>
                      </div>
                    </Card>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="growth" id="growth" />
                  <Label htmlFor="growth" className="flex-1 cursor-pointer">
                    <Card className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5 text-indigo-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Marketing & Growth Only</h3>
                          <p className="text-sm text-gray-600">Focus purely on external marketing activities with your current website</p>
                        </div>
                      </div>
                    </Card>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="flex-1 cursor-pointer">
                    <Card className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Both Website & Growth</h3>
                          <p className="text-sm text-gray-600">Mix website improvements with marketing activities for comprehensive growth</p>
                        </div>
                      </div>
                    </Card>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 5: // Daily Task Count
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How Many Daily Tasks?</h2>
              <p className="text-gray-600">Choose how many tasks you want to tackle each day.</p>
            </div>
            <RadioGroup value={formData.dailyTaskCount} onValueChange={(value) => updateFormData('dailyTaskCount', value)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="tasks-2" />
                  <Label htmlFor="tasks-2" className="flex-1 cursor-pointer">
                    <Card className="p-4 hover:bg-gray-50 transition-colors text-center">
                      <h3 className="font-medium text-gray-900">2 Tasks</h3>
                      <p className="text-sm text-gray-600">Light workload</p>
                      <p className="text-xs text-gray-500 mt-1">~30 min/day</p>
                    </Card>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="tasks-3" />
                  <Label htmlFor="tasks-3" className="flex-1 cursor-pointer">
                    <Card className="p-4 hover:bg-gray-50 transition-colors text-center">
                      <h3 className="font-medium text-gray-900">3 Tasks</h3>
                      <p className="text-sm text-gray-600">Balanced</p>
                      <p className="text-xs text-gray-500 mt-1">~45 min/day</p>
                    </Card>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="tasks-5" />
                  <Label htmlFor="tasks-5" className="flex-1 cursor-pointer">
                    <Card className="p-4 hover:bg-gray-50 transition-colors text-center">
                      <h3 className="font-medium text-gray-900">5 Tasks</h3>
                      <p className="text-sm text-gray-600">Intensive</p>
                      <p className="text-xs text-gray-500 mt-1">~75 min/day</p>
                    </Card>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 6: // Goals & Timeline
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Growth Goals</h2>
            </div>
            <div className="space-y-4">
              <RadioGroup value={formData.goalType} onValueChange={(value) => updateFormData('goalType', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="users" id="users" />
                  <Label htmlFor="users">User Growth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mrr" id="mrr" />
                  <Label htmlFor="mrr">Monthly Recurring Revenue (MRR)</Label>
                </div>
              </RadioGroup>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goalAmount">
                    {formData.goalType === 'users' ? 'Target Users' : 'Target MRR ($)'}
                  </Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    placeholder={formData.goalType === 'users' ? '1000' : '5000'}
                    value={formData.goalAmount}
                    onChange={(e) => updateFormData('goalAmount', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="goalTimeline">Timeline (Months)</Label>
                  <Select value={formData.goalTimeline} onValueChange={(value) => updateFormData('goalTimeline', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )

      case 7: // Marketing Strategy
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketing Strategy Approach</h2>
              <p className="text-gray-600">How would you like to approach your marketing strategy?</p>
            </div>
            <RadioGroup value={formData.marketingStrategy} onValueChange={(value) => updateFormData('marketingStrategy', value)}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6-month" id="6-month" />
                  <Label htmlFor="6-month" className="flex-1 cursor-pointer">
                    <Card className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">6-Month Strategic Plan</h3>
                          <p className="text-sm text-gray-600">Comprehensive long-term strategy with detailed monthly goals</p>
                        </div>
                      </div>
                    </Card>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current-stage" id="current-stage" />
                  <Label htmlFor="current-stage" className="flex-1 cursor-pointer">
                    <Card className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-indigo-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Focus on Current Stage</h3>
                          <p className="text-sm text-gray-600">Tactical approach focused on immediate next steps</p>
                        </div>
                      </div>
                    </Card>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 8: // Experience Level
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketing Experience</h2>
              <p className="text-gray-600">What's your experience level with marketing?</p>
            </div>
            <RadioGroup value={formData.experienceLevel} onValueChange={(value) => updateFormData('experienceLevel', value)}>
              <div className="space-y-4">
                {EXPERIENCE_LEVELS.map((level) => (
                  <div key={level.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.id} id={level.id} />
                    <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                      <Card className="p-4 hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-medium text-gray-900">{level.title}</h3>
                          <p className="text-sm text-gray-600">{level.description}</p>
                        </div>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )

      case 9: // Preferred Platforms
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Preferred Marketing Platforms</h2>
              <p className="text-gray-600">Which platforms would you like to focus on? (Select all that apply)</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PLATFORMS.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={formData.preferredPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData('preferredPlatforms', [...formData.preferredPlatforms, platform.id])
                      } else {
                        updateFormData('preferredPlatforms', formData.preferredPlatforms.filter((p: string) => p !== platform.id))
                      }
                    }}
                  />
                  <Label htmlFor={platform.id} className="text-sm font-medium cursor-pointer">
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 10: // Current Challenges
        return (
          <div className="space-y-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Marketing Challenges</h2>
              <p className="text-gray-600">What are your biggest marketing challenges right now?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="challenges">Describe your main challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="e.g., Not enough time for content creation, low engagement rates, difficulty measuring ROI..."
                  value={formData.challenges}
                  onChange={(e) => updateFormData('challenges', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      case 11: // Current Users/Platforms
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Status</h2>
              <p className="text-gray-600">Tell us about your current situation</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentUsers">Current Users/Customers (approximate)</Label>
                <Input
                  id="currentUsers"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.currentUsers}
                  onChange={(e) => updateFormData('currentUsers', e.target.value)}
                />
              </div>
              <div>
                <Label>Platforms you're currently using (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {PLATFORMS.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${platform.id}`}
                        checked={formData.currentPlatforms.includes(platform.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('currentPlatforms', [...formData.currentPlatforms, platform.id])
                          } else {
                            updateFormData('currentPlatforms', formData.currentPlatforms.filter((p: string) => p !== platform.id))
                          }
                        }}
                      />
                      <Label htmlFor={`current-${platform.id}`} className="text-sm font-medium cursor-pointer">
                        {platform.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
            <p className="text-gray-600">Your personalized marketing strategy is ready.</p>
          </div>
        )
    }
  }

  const canProceed = () => {
    const adjustedStep = flow === 'post-analysis' ? currentStep + 1 : currentStep
    
    switch (adjustedStep) {
      case 0: return formData.websiteAnalysis !== null
      case 1: return formData.productName && formData.website && formData.valueProp
      case 2: return formData.northStarGoal
      case 3: return formData.targetAudience
      case 4: return formData.focusArea
      case 5: return formData.dailyTaskCount
      case 6: return formData.goalAmount && formData.goalTimeline
      case 7: return formData.marketingStrategy
      case 8: return formData.experienceLevel
      case 9: return formData.preferredPlatforms.length > 0
      case 10: return formData.challenges.trim().length > 0
      case 11: return true // Current status is optional
      default: return true
    }
  }

  const isWebsiteAnalysisStep = () => {
    return flow === 'from-landing' && currentStep === 0
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === (flow === 'from-landing' ? 0 : 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-2">
            {onSkip && currentStep < totalSteps - 1 && !isWebsiteAnalysisStep() && (
              <Button variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            )}
            
            {currentStep < totalSteps - 1 ? (
              <Button onClick={nextStep} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
