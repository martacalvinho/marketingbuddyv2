"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  LogOut, 
  Edit3, 
  Save, 
  X, 
  Target, 
  Globe, 
  Lightbulb, 
  Calendar,
  Settings,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Users,
  Rocket,
  FileText,
  Building,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Zap,
  CreditCard
} from "lucide-react"
import SubscriptionTab from "@/components/dashboard/SubscriptionTab"

interface UserProfileProps {
  user: any
  onSignOut?: () => void
  onUpdateProfile?: (updates: any) => void
}

type SettingsTab = 'account' | 'website' | 'audience' | 'goals' | 'strategy' | 'subscription'

const tabs = [
  { id: 'account' as SettingsTab, label: 'Account', icon: User },
  { id: 'website' as SettingsTab, label: 'Website Analysis', icon: Search },
  { id: 'audience' as SettingsTab, label: 'Target Audience', icon: Users },
  { id: 'goals' as SettingsTab, label: 'Goals', icon: Target },
  { id: 'strategy' as SettingsTab, label: 'Strategy', icon: Rocket },
  { id: 'subscription' as SettingsTab, label: 'Plan & Billing', icon: CreditCard },
]

export default function UserProfile({ user, onSignOut, onUpdateProfile }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    productName: user.productName || "",
    websiteUrl: user.websiteUrl || user.website || "",
    valueProp: user.valueProp || "",
    northStarGoal: user.northStarGoal || "",
    marketingExperience: user.marketingExperience || user.experienceLevel || "",
    preferredPlatforms: user.preferredPlatforms || [],
    currentChallenges: user.currentChallenges || user.challenges || "",
    goalType: user.goalType || "",
    goalAmount: user.goalAmount || "",
    goalTimeline: user.goalTimeline || "6"
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(formData)
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut()
    } else {
      // Clear localStorage but preserve achievements
      const keysToPreserve = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('achievements_')) {
          keysToPreserve.push(key)
        }
      }
      
      const preservedData: Record<string, string> = {}
      keysToPreserve.forEach(key => {
        preservedData[key] = localStorage.getItem(key) || ''
      })
      
      localStorage.clear()
      
      // Restore achievement data
      Object.entries(preservedData).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })
      
      window.location.href = '/landing'
    }
  }

  const regenerateStrategy = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
          multiPlatform: true
        })
      })
      const data = await response.json()
      if (onUpdateProfile) {
        await onUpdateProfile({ plan: data.plan })
      }
    } catch (error) {
      console.error('Failed to regenerate strategy:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const reAnalyzeWebsite = async () => {
    if (!user.website) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: user.website })
      })
      const data = await res.json()
      if (onUpdateProfile) {
        await onUpdateProfile({ websiteAnalysis: {
          businessOverview: data.businessOverview,
          marketingOpportunities: data.marketingOpportunities,
          marketingStrengths: data.marketingStrengths,
          contentMessagingAnalysis: data.contentMessagingAnalysis,
          competitivePositioning: data.competitivePositioning,
          actionableRecommendations: data.actionableRecommendations,
        }})
      }
    } catch (e) {
      console.error('Re-analyze failed:', e)
    } finally {
      setIsSaving(false)
    }
  }

  // Parse monthly strategy from plan text
  const parseMonthlyStrategy = (plan: string) => {
    if (!plan) return []
    const months: { title: string; focus: string; content: string }[] = []
    const monthRegex = /### Month (\d+): ([^\n]+)([\s\S]*?)(?=### Month \d+:|$)/g
    let match
    while ((match = monthRegex.exec(plan)) !== null) {
      months.push({
        title: `Month ${match[1]}: ${match[2].trim()}`,
        focus: match[3].trim().split('\n')[0]?.replace(/^-\s*/, '') || '',
        content: match[3].trim()
      })
    }
    return months.length > 0 ? months : [{ title: 'Month 1: Foundation', focus: 'Initial setup', content: plan.substring(0, 500) }]
  }

  const cleanContent = (content: string) => {
    return content.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').replace(/^\s*\n/gm, '')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Sign Out */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lime-500/20 rounded-sm flex items-center justify-center">
            <Settings className="h-5 w-5 text-lime-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user.productName || 'Your Business'}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSignOut}
          className="text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-lime-500 text-black'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Account Information</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-lime-500 hover:bg-lime-400 text-black">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              <div>
                <Label className="text-slate-300">Business Name</Label>
                {isEditing ? (
                  <Input
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                ) : (
                  <div className="p-3 bg-white/5 rounded border border-white/10 text-slate-200 mt-1">
                    {user.productName || "Not specified"}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-slate-300">Website URL</Label>
                {isEditing ? (
                  <Input
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                ) : (
                  <div className="p-3 bg-white/5 rounded border border-white/10 text-slate-200 mt-1 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-500" />
                    {user.websiteUrl || user.website || "Not specified"}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-slate-300">Value Proposition</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.valueProp}
                    onChange={(e) => setFormData({ ...formData, valueProp: e.target.value })}
                    rows={3}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                ) : (
                  <div className="p-3 bg-white/5 rounded border border-white/10 text-slate-200 mt-1">
                    {user.valueProp || "Not specified"}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Experience Level</Label>
                  {isEditing ? (
                    <select
                      value={formData.marketingExperience}
                      onChange={(e) => setFormData({ ...formData, marketingExperience: e.target.value })}
                      className="w-full mt-1 p-3 bg-zinc-900 border border-white/10 rounded text-white text-sm"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-white/5 rounded border border-white/10 mt-1">
                      <Badge className="bg-lime-500/20 text-lime-300 border-lime-500/30">
                        {user.marketingExperience || user.experienceLevel || "Not specified"}
                      </Badge>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-slate-300">Preferred Platforms</Label>
                  {isEditing ? (
                    <div className="mt-1 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {['Twitter', 'LinkedIn', 'Instagram', 'TikTok', 'YouTube', 'Facebook', 'Blog', 'Newsletter'].map((platform) => (
                          <button
                            key={platform}
                            type="button"
                            onClick={() => {
                              const current = formData.preferredPlatforms || []
                              if (current.includes(platform)) {
                                setFormData({ ...formData, preferredPlatforms: current.filter((p: string) => p !== platform) })
                              } else {
                                setFormData({ ...formData, preferredPlatforms: [...current, platform] })
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              (formData.preferredPlatforms || []).includes(platform)
                                ? 'bg-lime-500 text-black font-medium'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                            }`}
                          >
                            {platform}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white/5 rounded border border-white/10 mt-1 flex flex-wrap gap-1">
                      {(user.preferredPlatforms || []).map((p: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-white/20 text-slate-300">{p}</Badge>
                      ))}
                      {(!user.preferredPlatforms || user.preferredPlatforms.length === 0) && (
                        <span className="text-slate-500 text-sm">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Website Analysis Tab */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Website Analysis</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={reAnalyzeWebsite}
                disabled={isSaving}
                className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                Re-analyze
              </Button>
            </div>

            {user.websiteAnalysis ? (
              <div className="space-y-4">
                {/* Business Overview */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-4 w-4 text-lime-400" />
                    <h4 className="font-medium text-white">Business Overview</h4>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{user.websiteAnalysis.businessOverview?.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-slate-300">{user.websiteAnalysis.businessOverview?.industry}</Badge>
                    <Badge className="bg-white/10 text-slate-300">{user.websiteAnalysis.businessOverview?.businessModel}</Badge>
                  </div>
                </div>

                {/* Marketing Strengths */}
                {user.websiteAnalysis.marketingStrengths?.length > 0 && (
                  <div className="p-4 bg-lime-500/10 rounded-lg border border-lime-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-lime-400" />
                      <h4 className="font-medium text-lime-300">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                      {user.websiteAnalysis.marketingStrengths.slice(0, 3).map((s: string, i: number) => (
                        <li key={i} className="text-lime-200/80 text-sm flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-1 text-lime-500 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Marketing Opportunities */}
                {user.websiteAnalysis.marketingOpportunities?.length > 0 && (
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-blue-400" />
                      <h4 className="font-medium text-blue-300">Opportunities</h4>
                    </div>
                    <ul className="space-y-2">
                      {user.websiteAnalysis.marketingOpportunities.slice(0, 3).map((o: any, i: number) => (
                        <li key={i} className="text-blue-200/80 text-sm">
                          <span className="font-medium text-blue-300">{o.title}:</span> {o.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Content Analysis */}
                {user.websiteAnalysis.contentMessagingAnalysis && (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-slate-400" />
                      <h4 className="font-medium text-white">Messaging</h4>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{user.websiteAnalysis.contentMessagingAnalysis.currentMessaging}</p>
                    <Badge className="bg-white/10 text-slate-300">{user.websiteAnalysis.contentMessagingAnalysis.toneOfVoice}</Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-white/5 rounded-lg border border-white/10 text-center">
                <Search className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No website analysis available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Target Audience Tab */}
        {activeTab === 'audience' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Target Audience</h3>

            {user.targetAudience ? (
              <div className="space-y-4">
                {/* Demographics */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-lime-400" />
                    <h4 className="font-medium text-white">Demographics</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Age Range:</span>
                      <span className="text-slate-200 ml-2">{user.targetAudience.demographics?.ageRange || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Income:</span>
                      <span className="text-slate-200 ml-2">{user.targetAudience.demographics?.incomeLevel || 'N/A'}</span>
                    </div>
                  </div>
                  {user.targetAudience.demographics?.professions?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {user.targetAudience.demographics.professions.map((p: string, i: number) => (
                        <Badge key={i} className="bg-white/10 text-slate-300">{p}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Psychographics */}
                {user.targetAudience.psychographics && (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-lime-400" />
                      <h4 className="font-medium text-white">Psychographics</h4>
                    </div>
                    {user.targetAudience.psychographics.values?.length > 0 && (
                      <div className="mb-3">
                        <span className="text-slate-500 text-sm">Values:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.targetAudience.psychographics.values.map((v: string, i: number) => (
                            <Badge key={i} className="bg-lime-500/20 text-lime-300 border-lime-500/30">{v}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {user.targetAudience.psychographics.interests?.length > 0 && (
                      <div>
                        <span className="text-slate-500 text-sm">Interests:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.targetAudience.psychographics.interests.map((i: string, idx: number) => (
                            <Badge key={idx} className="bg-white/10 text-slate-300">{i}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pain Points & Goals */}
                <div className="grid grid-cols-2 gap-4">
                  {user.targetAudience.painPoints?.length > 0 && (
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <h4 className="font-medium text-red-300">Pain Points</h4>
                      </div>
                      <ul className="space-y-1">
                        {user.targetAudience.painPoints.slice(0, 4).map((p: string, i: number) => (
                          <li key={i} className="text-red-200/80 text-sm">• {p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {user.targetAudience.goals?.length > 0 && (
                    <div className="p-4 bg-lime-500/10 rounded-lg border border-lime-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-lime-400" />
                        <h4 className="font-medium text-lime-300">Goals</h4>
                      </div>
                      <ul className="space-y-1">
                        {user.targetAudience.goals.slice(0, 4).map((g: string, i: number) => (
                          <li key={i} className="text-lime-200/80 text-sm">• {g}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Online Presence */}
                {user.targetAudience.onlinePresence?.length > 0 && (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-4 w-4 text-slate-400" />
                      <h4 className="font-medium text-white">Where They Hang Out</h4>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {user.targetAudience.onlinePresence.map((p: string, i: number) => (
                        <Badge key={i} className="bg-white/10 text-slate-300">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-white/5 rounded-lg border border-white/10 text-center">
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No target audience data available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Marketing Goals</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-lime-500 hover:bg-lime-400 text-black">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="p-4 bg-lime-500/10 rounded-lg border border-lime-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-lime-400" />
                <span className="text-sm text-lime-400 font-medium">North Star Goal</span>
              </div>
              {isEditing ? (
                <Textarea
                  value={formData.northStarGoal}
                  onChange={(e) => setFormData({ ...formData, northStarGoal: e.target.value })}
                  rows={2}
                  className="bg-zinc-900 border-lime-500/30 text-lime-200 mt-1"
                  placeholder="What's your main goal?"
                />
              ) : (
                <p className="text-lg font-medium text-lime-300">
                  {user.northStarGoal || "Not specified"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 text-sm">Goal Type</span>
                {isEditing ? (
                  <select
                    value={formData.goalType}
                    onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                    className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm"
                  >
                    <option value="">Select type</option>
                    <option value="revenue">Revenue (MRR)</option>
                    <option value="users">User Growth</option>
                    <option value="awareness">Brand Awareness</option>
                    <option value="engagement">Engagement</option>
                  </select>
                ) : (
                  <p className="text-white font-medium mt-1">{user.goalType || 'N/A'}</p>
                )}
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 text-sm">Timeline</span>
                {isEditing ? (
                  <select
                    value={formData.goalTimeline}
                    onChange={(e) => setFormData({ ...formData, goalTimeline: e.target.value })}
                    className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm"
                  >
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                ) : (
                  <p className="text-white font-medium mt-1">{user.goalTimeline || '6'} months</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 text-sm">Target Amount</span>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.goalAmount}
                  onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., 5000 or 1000 users"
                />
              ) : (
                <p className="text-white font-medium mt-1">{user.goalAmount || 'Not set'}</p>
              )}
            </div>

            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 text-sm">Current Challenges</span>
              {isEditing ? (
                <Textarea
                  value={formData.currentChallenges}
                  onChange={(e) => setFormData({ ...formData, currentChallenges: e.target.value })}
                  rows={3}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="What challenges are you facing?"
                />
              ) : (
                <p className="text-zinc-200 mt-2">{user.currentChallenges || user.challenges || 'None specified'}</p>
              )}
            </div>
          </div>
        )}

        {/* Strategy Tab */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">6-Month Strategy</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateStrategy}
                disabled={isSaving}
                className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>

            {user.plan ? (
              <div className="space-y-3">
                <div className="p-3 bg-lime-500/10 rounded border border-lime-500/20 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-lime-400" />
                  <span className="text-lime-300 text-sm font-medium">Strategy Active</span>
                </div>

                {parseMonthlyStrategy(user.plan).map((month, index) => (
                  <div key={index} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <div className="p-3 bg-white/5 border-b border-white/10">
                      <h4 className="font-medium text-white text-sm">{month.title}</h4>
                      <p className="text-xs text-slate-400">{month.focus}</p>
                    </div>
                    <div className="p-3">
                      <pre className="whitespace-pre-wrap text-xs text-slate-300 max-h-32 overflow-y-auto">
                        {cleanContent(month.content).substring(0, 300)}...
                      </pre>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                  <Calendar className="h-3 w-3" />
                  <span>Strategy adapts based on your progress</span>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white/5 rounded-lg border border-white/10 text-center">
                <Rocket className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">No strategy generated yet.</p>
                <Button onClick={regenerateStrategy} disabled={isSaving} className="bg-lime-500 hover:bg-lime-400 text-black">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Strategy
                </Button>
              </div>
            )}
          </div>
        )}
        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <SubscriptionTab user={user} />
        )}
      </div>
    </div>
  )
}
