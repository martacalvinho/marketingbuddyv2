"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Twitter, Linkedin, MessageSquare } from "lucide-react"
import ContentGenerator from "@/components/content-generator"

interface ContentCalendarProps {
  user: any
}

export default function ContentCalendar({ user }: ContentCalendarProps) {
  const [contentItems, setContentItems] = useState([
    {
      id: 1,
      title: "Build in Public: Day 1 of Marketing Journey",
      platform: "twitter",
      status: "draft",
      content:
        "Just shipped my app and realized distribution is the hard part 😅\n\nStarting my 30-day marketing challenge with @MarketingBuddy\n\nGoal: Find my first 10 users\nDay 1: Share my story + ask for feedback\n\n#BuildInPublic #IndieHacker",
      scheduledFor: "2024-01-15T10:00:00Z",
      metrics: { likes: 0, comments: 0, shares: 0 },
    },
    {
      id: 2,
      title: "LinkedIn: Lessons from launching my first product",
      platform: "linkedin",
      status: "ideas",
      content: "",
      scheduledFor: null,
      metrics: { likes: 0, comments: 0, shares: 0 },
    },
  ])

  const [generating, setGenerating] = useState(false)

  const generateContent = async () => {
    setGenerating(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: user.productName,
          valueProp: user.valueProp,
          channel: user.preferredChannel,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis, // Pass the real analysis
        }),
      })

      const newContent = await response.json()

      // Add generated content to the calendar
      const generatedItems = [
        ...newContent.tweets.map((tweet: string, index: number) => ({
          id: Date.now() + index,
          title: `AI Generated Tweet ${index + 1}`,
          platform: "twitter",
          status: "draft",
          content: tweet,
          scheduledFor: null,
          metrics: { likes: 0, comments: 0, shares: 0 },
        })),
        {
          id: Date.now() + 100,
          title: "AI Generated LinkedIn Post",
          platform: "linkedin",
          status: "draft",
          content: newContent.linkedIn.content,
          scheduledFor: null,
          metrics: { likes: 0, comments: 0, shares: 0 },
        },
        {
          id: Date.now() + 200,
          title: "AI Generated HN Post",
          platform: "hackernews",
          status: "draft",
          content: `${newContent.hnPost.title}\n\n${newContent.hnPost.content}`,
          scheduledFor: null,
          metrics: { likes: 0, comments: 0, shares: 0 },
        },
      ]

      setContentItems((prev) => [...prev, ...generatedItems])
    } catch (error) {
      console.error("Content generation failed:", error)
    }

    setGenerating(false)
  }

  const moveToStatus = (itemId: number, newStatus: string) => {
    setContentItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ideas":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "posted":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "linkedin":
        return <Linkedin className="h-4 w-4" />
      case "reddit":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const statusColumns = [
    { key: "ideas", title: "Ideas", items: contentItems.filter((item) => item.status === "ideas") },
    { key: "draft", title: "Draft", items: contentItems.filter((item) => item.status === "draft") },
    { key: "scheduled", title: "Scheduled", items: contentItems.filter((item) => item.status === "scheduled") },
    { key: "posted", title: "Posted", items: contentItems.filter((item) => item.status === "posted") },
  ]

  return (
    <div className="space-y-6">
      {/* AI Content Generator */}
      <ContentGenerator user={user} />

      {/* Kanban Board */}
      <Card>
        <CardHeader>
          <CardTitle>Content Pipeline</CardTitle>
          <CardDescription>Drag and drop to move content through your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusColumns.map((column) => (
              <div key={column.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{column.title}</h3>
                  <Badge variant="secondary">{column.items.length}</Badge>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {column.items.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getPlatformIcon(item.platform)}
                            <span className="text-sm font-medium">{item.title}</span>
                          </div>
                          <Badge className={getStatusColor(item.status)} variant="secondary">
                            {item.status}
                          </Badge>
                        </div>

                        {item.content && <p className="text-xs text-gray-600 line-clamp-3 mb-3">{item.content}</p>}

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-1">
                            {column.key !== "posted" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const nextStatus =
                                    column.key === "ideas" ? "draft" : column.key === "draft" ? "scheduled" : "posted"
                                  moveToStatus(item.id, nextStatus)
                                }}
                              >
                                {column.key === "ideas" ? "Draft" : column.key === "draft" ? "Schedule" : "Post"}
                              </Button>
                            )}
                          </div>

                          {item.status === "posted" && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>❤️ {item.metrics.likes}</span>
                              <span>💬 {item.metrics.comments}</span>
                              <span>🔄 {item.metrics.shares}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {column.key === "ideas" && (
                    <Button
                      variant="dashed"
                      className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400"
                      onClick={() => {
                        // Add new content idea
                        const newItem = {
                          id: Date.now(),
                          title: "New Content Idea",
                          platform: "twitter",
                          status: "ideas",
                          content: "",
                          scheduledFor: null,
                          metrics: { likes: 0, comments: 0, shares: 0 },
                        }
                        setContentItems((prev) => [...prev, newItem])
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Idea
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
