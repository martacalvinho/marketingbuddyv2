"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Zap, MessageCircle, TrendingUp, Users, Copy, Check } from "lucide-react"

interface BuildInPublicTrackerProps {
  user: any
  chatHistory?: any[]
}

interface Milestone {
  id: string
  type: 'feature' | 'metric' | 'lesson' | 'challenge'
  title: string
  description: string
  timestamp: string
  metrics?: {
    users?: number
    revenue?: number
    features?: number
  }
}

export default function BuildInPublicTracker({ user, chatHistory = [] }: BuildInPublicTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [suggestedContent, setSuggestedContent] = useState("")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  // Extract milestones from chat history
  useEffect(() => {
    const extractedMilestones = extractMilestonesFromChat(chatHistory)
    setMilestones(extractedMilestones)
  }, [chatHistory])

  const extractMilestonesFromChat = (chats: any[]): Milestone[] => {
    const milestones: Milestone[] = []
    
    // Look for key phrases that indicate milestones
    const milestonePatterns = [
      { pattern: /launched|deployed|released|shipped/i, type: 'feature' as const },
      { pattern: /users?|customers?|signups?/i, type: 'metric' as const },
      { pattern: /learned|discovered|realized|found out/i, type: 'lesson' as const },
      { pattern: /problem|issue|challenge|bug|error/i, type: 'challenge' as const },
    ]

    chats.forEach((chat, index) => {
      if (chat.role === 'user') {
        milestonePatterns.forEach(({ pattern, type }) => {
          if (pattern.test(chat.content)) {
            milestones.push({
              id: `milestone-${index}`,
              type,
              title: chat.content.substring(0, 50) + '...',
              description: chat.content,
              timestamp: new Date().toISOString(),
            })
          }
        })
      }
    })

    return milestones.slice(-5) // Keep only the last 5 milestones
  }

  const generateBuildInPublicContent = async (milestone: Milestone) => {
    setGenerating(true)
    
    try {
      const response = await fetch("/api/generate-specific-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "build-in-public",
          product: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
          milestone: milestone,
        }),
      })

      const data = await response.json()
      setSuggestedContent(data.content)
    } catch (error) {
      console.error("Build-in-public content generation failed:", error)
      setSuggestedContent("Failed to generate content. Please try again.")
    }

    setGenerating(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(suggestedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveToContentLibrary = () => {
    const contentItem = {
      id: Date.now().toString(),
      type: "Build in Public",
      platform: "build-in-public",
      content: suggestedContent,
      marketingStyle: "Behind-the-Scenes",
      status: "draft",
      createdAt: new Date().toISOString(),
      analytics: {
        views: 0,
        comments: 0,
        followers: 0,
        acquisitions: 0
      }
    }

    // Get existing content from localStorage
    const existingContent = JSON.parse(localStorage.getItem('contentLibrary') || '[]')
    
    // Add new content
    existingContent.push(contentItem)
    
    // Save back to localStorage
    localStorage.setItem('contentLibrary', JSON.stringify(existingContent))
  }

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Zap className="h-4 w-4" />
      case 'metric': return <TrendingUp className="h-4 w-4" />
      case 'lesson': return <MessageCircle className="h-4 w-4" />
      case 'challenge': return <Users className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-green-100 text-green-800'
      case 'metric': return 'bg-blue-100 text-blue-800'
      case 'lesson': return 'bg-purple-100 text-purple-800'
      case 'challenge': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Build in Public Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start chatting to track your journey!</p>
                <p className="text-sm">I'll automatically detect milestones and suggest build-in-public content.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-gray-700">Recent Milestones</h3>
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className={getMilestoneColor(milestone.type)}>
                        {getMilestoneIcon(milestone.type)}
                        <span className="ml-1 capitalize">{milestone.type}</span>
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{milestone.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(milestone.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateBuildInPublicContent(milestone)}
                      disabled={generating}
                    >
                      Share This
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {suggestedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Suggested Build-in-Public Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={suggestedContent}
                  onChange={(e) => setSuggestedContent(e.target.value)}
                  rows={6}
                  className="pr-12"
                  placeholder="Generated build-in-public content will appear here..."
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline">{suggestedContent.length} characters</Badge>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setSuggestedContent("")}>
                    Clear
                  </Button>
                  <Button onClick={saveToContentLibrary}>
                    Save to Library
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
