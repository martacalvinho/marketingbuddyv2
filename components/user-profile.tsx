"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  AlertCircle
} from "lucide-react"

interface UserProfileProps {
  user: any
  onSignOut?: () => void
  onUpdateProfile?: (updates: any) => void
}

export default function UserProfile({ user, onSignOut, onUpdateProfile }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    productName: user.productName || "",
    valueProp: user.valueProp || "",
    northStarGoal: user.northStarGoal || "",
    websiteUrl: user.websiteUrl || "",
    targetAudience: user.targetAudience || "",
    marketingExperience: user.marketingExperience || "",
    currentChallenges: user.currentChallenges || "",
    preferredPlatforms: user.preferredPlatforms || []
  })
  const [isSaving, setIsSaving] = useState(false)
  const [monthlyStrategies, setMonthlyStrategies] = useState<any[]>([])

  const handleEdit = (section: string) => {
    setEditingSection(section)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditingSection(null)
    setIsEditing(false)
    setFormData({
      productName: user.productName || "",
      valueProp: user.valueProp || "",
      northStarGoal: user.northStarGoal || "",
      websiteUrl: user.websiteUrl || "",
      targetAudience: user.targetAudience || "",
      marketingExperience: user.marketingExperience || "",
      currentChallenges: user.currentChallenges || "",
      preferredPlatforms: user.preferredPlatforms || []
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(formData)
      }
      setEditingSection(null)
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
      // Default sign out behavior
      localStorage.clear()
      window.location.href = '/landing'
    }
  }

  // Clean monthly content to remove markdown formatting
  const cleanMonthlyContent = (content: string, isMonth6: boolean = false) => {
    let cleanedContent = content
    
    // For Month 6, only show content up to "## Adaptive Daily Tasks" and remove it
    if (isMonth6) {
      const adaptiveTasksIndex = content.indexOf('## Adaptive Daily Tasks')
      cleanedContent = adaptiveTasksIndex !== -1 
        ? content.substring(0, adaptiveTasksIndex).trim()
        : content
    }
    
    // Remove markdown formatting (*, **, and #)
    cleanedContent = cleanedContent
      .replace(/\*\*/g, '')  // Remove bold markers
      .replace(/\*/g, '')     // Remove single asterisks
      .replace(/#/g, '')      // Remove hash symbols
      .replace(/^\s*\n/gm, '') // Remove empty lines
      
    return cleanedContent
  }

  // Parse monthly strategy from plan text
  const parseMonthlyStrategy = (plan: string) => {
    if (!plan) return []
    
    const months = []
    const monthRegex = /### Month (\d+): ([^\n]+)([\s\S]*?)(?=### Month \d+:|$)/g
    let match
    
    while ((match = monthRegex.exec(plan)) !== null) {
      const monthNum = match[1]
      const title = `Month ${monthNum}: ${match[2].trim()}`
      const content = match[3].trim()
      const focus = content.split('\n')[0] || 'Focus area to be defined'
      
      months.push({
        title,
        focus: focus.replace(/^-\s*/, ''),
        content: content
      })
    }
    
    return months.length > 0 ? months : [{
      title: 'Month 1: Foundation & Setup',
      focus: 'Initial strategy development',
      content: plan.substring(0, 500) + '...'
    }]
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
          multiPlatform: true // Request multi-platform analysis
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

  const regenerateMonth = async (monthNumber: number) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/adaptive-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          monthNumber,
          currentPlan: user.plan,
          multiPlatform: true
        })
      })
      const data = await response.json()
      
      // Update just this month in the plan
      const updatedPlan = updateMonthInPlan(user.plan, monthNumber, data.strategy)
      if (onUpdateProfile) {
        await onUpdateProfile({ plan: updatedPlan })
      }
    } catch (error) {
      console.error('Failed to regenerate month:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateMonthInPlan = (plan: string, monthNumber: number, newContent: string) => {
    const monthRegex = new RegExp(`(### Month ${monthNumber}:[^\n]+\n)([\s\S]*?)(?=### Month \d+:|$)`)
    return plan.replace(monthRegex, `$1${newContent}`)
  }

  const updateMonthContent = (monthIndex: number, newContent: string) => {
    const strategies = parseMonthlyStrategy(user.plan)
    strategies[monthIndex].content = newContent
    setMonthlyStrategies(strategies)
  }

  const saveMonthEdit = async (monthIndex: number) => {
    const strategies = monthlyStrategies.length > 0 ? monthlyStrategies : parseMonthlyStrategy(user.plan)
    const updatedPlan = reconstructPlanFromMonths(strategies)
    
    if (onUpdateProfile) {
      await onUpdateProfile({ plan: updatedPlan })
    }
    setEditingSection(null)
    setIsEditing(false)
  }

  const reconstructPlanFromMonths = (months: any[]) => {
    return months.map((month, index) => {
      return `### Month ${index + 1}: ${month.title.replace(/^Month \d+: /, '')}\n${month.content}`
    }).join('\n\n')
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Profile Settings</CardTitle>
                <CardDescription>
                  Manage your account, strategies, and preferences
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit('account')}
              disabled={isEditing}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productName">Product/Business Name</Label>
              {editingSection === 'account' ? (
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Enter your product name"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  {user.productName || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              {editingSection === 'account' ? (
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://your-website.com"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>{user.websiteUrl || "Not specified"}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="valueProp">Value Proposition</Label>
            {editingSection === 'account' ? (
              <Textarea
                id="valueProp"
                value={formData.valueProp}
                onChange={(e) => setFormData({ ...formData, valueProp: e.target.value })}
                placeholder="What unique value does your product provide?"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded border">
                {user.valueProp || "Not specified"}
              </div>
            )}
          </div>

          {editingSection === 'account' && (
            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing Goals & Strategy */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Marketing Goals & Strategy</span>
              </CardTitle>
              <CardDescription>Your north star goal and marketing approach</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('goals')}
                disabled={isEditing}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateStrategy}
                disabled={isSaving}
              >
                {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Regenerate Strategy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="northStarGoal">North Star Goal</Label>
            {editingSection === 'goals' ? (
              <Textarea
                id="northStarGoal"
                value={formData.northStarGoal}
                onChange={(e) => setFormData({ ...formData, northStarGoal: e.target.value })}
                placeholder="What's your ultimate business goal?"
                rows={2}
              />
            ) : (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {user.northStarGoal || "Not specified"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            {editingSection === 'goals' ? (
              <Textarea
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="Who is your ideal customer?"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded border">
                {user.targetAudience || "Not specified"}
              </div>
            )}
          </div>

          {editingSection === 'goals' && (
            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Marketing Strategy */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>6-Month Marketing Strategy</span>
              </CardTitle>
              <CardDescription>Your AI-generated multi-platform marketing plan</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateStrategy}
                disabled={isSaving}
              >
                {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Regenerate All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {user.plan ? (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Multi-Platform Strategy Active</span>
                </div>
                <p className="text-sm text-green-800">
                  AI-optimized strategy across multiple platforms based on your business analysis.
                </p>
              </div>
              
              {/* Monthly Strategy Breakdown */}
              <div className="space-y-4">
                {parseMonthlyStrategy(user.plan).map((month, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">{month.title}</h4>
                        <p className="text-sm text-gray-600">{month.focus}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => regenerateMonth(index + 1)}
                          disabled={isSaving}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(`month-${index}`)}
                          disabled={isEditing}
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      {editingSection === `month-${index}` ? (
                        <div className="space-y-3">
                          <Textarea
                            value={month.content}
                            onChange={(e) => updateMonthContent(index, e.target.value)}
                            rows={6}
                            className="text-sm"
                          />
                          <div className="flex items-center space-x-2">
                            <Button size="sm" onClick={() => saveMonthEdit(index)}>
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-3 rounded border">
                            {cleanMonthlyContent(month.content, index === 5)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>Strategy adapts based on performance and platform analytics</span>
                </div>
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">No Strategy Found</span>
              </div>
              <p className="text-sm text-yellow-800 mb-3">
                Generate an AI-optimized multi-platform marketing strategy tailored to your business.
              </p>
              <Button onClick={regenerateStrategy} disabled={isSaving}>
                {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                Generate Multi-Platform Strategy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onboarding Answers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Onboarding Answers</CardTitle>
              <CardDescription>Review and update your initial setup responses</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit('onboarding')}
              disabled={isEditing}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Marketing Experience Level</Label>
              {editingSection === 'onboarding' ? (
                <select 
                  className="w-full p-2 border rounded"
                  value={formData.marketingExperience}
                  onChange={(e) => setFormData({ ...formData, marketingExperience: e.target.value })}
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  <Badge variant="secondary">
                    {user.marketingExperience || "Not specified"}
                  </Badge>
                </div>
              )}
            </div>
            
            <div>
              <Label>Preferred Platforms</Label>
              {editingSection === 'onboarding' ? (
                <Input
                  value={formData.preferredPlatforms.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    preferredPlatforms: e.target.value.split(',').map(p => p.trim()).filter(p => p) 
                  })}
                  placeholder="Twitter, Instagram, LinkedIn..."
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  <div className="flex flex-wrap gap-1">
                    {(user.preferredPlatforms || []).map((platform: string, index: number) => (
                      <Badge key={index} variant="outline">{platform}</Badge>
                    ))}
                    {(!user.preferredPlatforms || user.preferredPlatforms.length === 0) && (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Current Marketing Challenges</Label>
            {editingSection === 'onboarding' ? (
              <Textarea
                value={formData.currentChallenges}
                onChange={(e) => setFormData({ ...formData, currentChallenges: e.target.value })}
                placeholder="What marketing challenges are you facing?"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded border">
                {user.currentChallenges || "Not specified"}
              </div>
            )}
          </div>

          {editingSection === 'onboarding' && (
            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
