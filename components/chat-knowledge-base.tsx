"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, MessageCircle, TrendingUp, Zap } from "lucide-react"

interface KnowledgeItem {
  id: string
  type: 'insight' | 'goal' | 'challenge' | 'milestone' | 'idea'
  content: string
  timestamp: string
  context: string
  suggested_actions?: string[]
}

interface ChatKnowledgeBaseProps {
  messages: any[]
  onSuggestAction: (action: string) => void
}

export default function ChatKnowledgeBase({ messages, onSuggestAction }: ChatKnowledgeBaseProps) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Extract knowledge from chat messages
  useEffect(() => {
    const extractedKnowledge = extractKnowledgeFromMessages(messages)
    setKnowledgeItems(extractedKnowledge)
    
    // Generate contextual suggestions
    const contextualSuggestions = generateSuggestions(extractedKnowledge, messages)
    setSuggestions(contextualSuggestions)
  }, [messages])

  const extractKnowledgeFromMessages = (msgs: any[]): KnowledgeItem[] => {
    const knowledge: KnowledgeItem[] = []
    
    // Patterns to identify different types of knowledge
    const patterns = {
      insight: /learned|discovered|realized|found out|insight|understand/i,
      goal: /want to|need to|goal|objective|target|aim to/i,
      challenge: /problem|issue|challenge|difficult|stuck|struggling/i,
      milestone: /completed|finished|launched|achieved|reached/i,
      idea: /idea|think|maybe|could|should|what if/i,
    }

    msgs.forEach((msg, index) => {
      if (msg.role === 'user' && msg.content.length > 20) {
        // Check which pattern matches
        for (const [type, pattern] of Object.entries(patterns)) {
          if (pattern.test(msg.content)) {
            knowledge.push({
              id: `knowledge-${index}-${type}`,
              type: type as KnowledgeItem['type'],
              content: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : ''),
              timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
              context: `From conversation on ${new Date(msg.timestamp || new Date()).toLocaleDateString()}`,
              suggested_actions: generateActionsForType(type as KnowledgeItem['type'], msg.content)
            })
            break // Only categorize once per message
          }
        }
      }
    })

    // Keep only the most recent 10 items
    return knowledge.slice(-10)
  }

  const generateActionsForType = (type: string, content: string): string[] => {
    const actionMap: Record<string, string[]> = {
      insight: [
        "Create a LinkedIn post about this insight",
        "Turn this into an X thread",
        "Write a blog post exploring this topic"
      ],
      goal: [
        "Break this goal into smaller tasks",
        "Create content about your journey",
        "Share your goal publicly for accountability"
      ],
      challenge: [
        "Document lessons learned",
        "Create a build-in-public post about overcoming this",
        "Ask the community for advice"
      ],
      milestone: [
        "Celebrate with a social media post",
        "Share metrics and learnings",
        "Create a case study"
      ],
      idea: [
        "Validate this idea with your audience",
        "Create a poll about this concept",
        "Write about the potential impact"
      ]
    }
    
    return actionMap[type] || ["Create content about this topic"]
  }

  const generateSuggestions = (knowledge: KnowledgeItem[], msgs: any[]): string[] => {
    const suggestions: string[] = []
    
    // Recent activity-based suggestions
    const recentMessages = msgs.slice(-5)
    const hasDiscussedGoals = recentMessages.some(m => /goal|target|want to/i.test(m.content))
    const hasDiscussedChallenges = recentMessages.some(m => /problem|challenge|stuck/i.test(m.content))
    const hasDiscussedProgress = recentMessages.some(m => /progress|update|completed/i.test(m.content))

    if (hasDiscussedGoals) {
      suggestions.push("Generate content about your goals")
      suggestions.push("Create a roadmap post")
    }
    
    if (hasDiscussedChallenges) {
      suggestions.push("Share your challenges transparently")
      suggestions.push("Ask your audience for advice")
    }
    
    if (hasDiscussedProgress) {
      suggestions.push("Create a progress update post")
      suggestions.push("Share metrics and learnings")
    }

    // Knowledge-based suggestions
    const recentInsights = knowledge.filter(k => k.type === 'insight').slice(-2)
    if (recentInsights.length > 0) {
      suggestions.push("Turn recent insights into content")
    }

    const recentMilestones = knowledge.filter(k => k.type === 'milestone').slice(-1)
    if (recentMilestones.length > 0) {
      suggestions.push("Celebrate your recent achievements")
    }

    return suggestions.slice(0, 4) // Limit to 4 suggestions
  }

  const getKnowledgeIcon = (type: string) => {
    switch (type) {
      case 'insight': return <Lightbulb className="h-4 w-4" />
      case 'goal': return <TrendingUp className="h-4 w-4" />
      case 'challenge': return <MessageCircle className="h-4 w-4" />
      case 'milestone': return <Zap className="h-4 w-4" />
      case 'idea': return <Brain className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getKnowledgeColor = (type: string) => {
    switch (type) {
      case 'insight': return 'bg-purple-100 text-purple-800'
      case 'goal': return 'bg-blue-100 text-blue-800'
      case 'challenge': return 'bg-orange-100 text-orange-800'
      case 'milestone': return 'bg-green-100 text-green-800'
      case 'idea': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (knowledgeItems.length === 0 && suggestions.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Contextual Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>Suggested Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestAction(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Base */}
      {knowledgeItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Brain className="h-4 w-4 text-indigo-500" />
              <span>Conversation Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {knowledgeItems.slice(-5).map((item) => (
                <div key={item.id} className="flex items-start justify-between p-2 border rounded-lg">
                  <div className="flex items-start space-x-2 flex-1">
                    <Badge variant="secondary" className={getKnowledgeColor(item.type)}>
                      {getKnowledgeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{item.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.context}</p>
                    </div>
                  </div>
                  {item.suggested_actions && item.suggested_actions.length > 0 && (
                    <div className="flex flex-col space-y-1">
                      {item.suggested_actions.slice(0, 1).map((action, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => onSuggestAction(action)}
                          className="text-xs h-6 px-2"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
