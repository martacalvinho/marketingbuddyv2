"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Twitter, Linkedin, MessageSquare, Instagram, Video, FileText, Zap, Edit, Trash2, BarChart3, Copy, Check, RefreshCw } from "lucide-react"

interface ContentItem {
  id: string
  content: string
  type: string
  platform: string
  marketingStyle: string
  createdAt: string
  status: 'draft' | 'posted'
  analytics: {
    views: number
    comments: number
    followers: number
    acquisitions: number
  }
}

interface ContentLibraryProps {
  user: any
}

const platformIcons: Record<string, any> = {
  "twitter-thread": Twitter,
  "linkedin-post": Linkedin,
  "reddit-post": MessageSquare,
  "instagram-post": Instagram,
  "instagram-story": Instagram,
  "tiktok-script": Video,
  "build-in-public": Zap,
  "seo-blog": FileText,
}

const platformColors: Record<string, string> = {
  "twitter-thread": "text-blue-500",
  "linkedin-post": "text-blue-700",
  "reddit-post": "text-orange-500",
  "instagram-post": "text-pink-500",
  "instagram-story": "text-purple-500",
  "tiktok-script": "text-red-500",
  "build-in-public": "text-yellow-500",
  "seo-blog": "text-green-500",
}

export default function ContentLibrary({ user }: ContentLibraryProps) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterStyle, setFilterStyle] = useState<string>("all")
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [analyticsItem, setAnalyticsItem] = useState<ContentItem | null>(null)
  const [copied, setCopied] = useState<string>("")

  // Load content from localStorage
  useEffect(() => {
    const savedContent = JSON.parse(localStorage.getItem('contentLibrary') || '[]')
    setContent(savedContent)
    setFilteredContent(savedContent)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = content

    if (filterPlatform !== "all") {
      filtered = filtered.filter(item => item.platform === filterPlatform)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus)
    }

    if (filterStyle !== "all") {
      filtered = filtered.filter(item => item.marketingStyle === filterStyle)
    }

    setFilteredContent(filtered)
  }, [content, filterPlatform, filterStatus, filterStyle])

  const updateContent = (updatedContent: ContentItem[]) => {
    setContent(updatedContent)
    localStorage.setItem('contentLibrary', JSON.stringify(updatedContent))
  }

  const deleteContent = (id: string) => {
    const updated = content.filter(item => item.id !== id)
    updateContent(updated)
  }

  const markAsPosted = (id: string) => {
    const updated = content.map(item => 
      item.id === id ? { ...item, status: 'posted' as const } : item
    )
    updateContent(updated)
  }

  const updateAnalytics = (id: string, analytics: ContentItem['analytics']) => {
    const updated = content.map(item => 
      item.id === id ? { ...item, analytics } : item
    )
    updateContent(updated)
    setAnalyticsItem(null)
  }

  const saveEdit = (id: string, newContent: string) => {
    const updated = content.map(item => 
      item.id === id ? { ...item, content: newContent } : item
    )
    updateContent(updated)
    setEditingItem(null)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(""), 2000)
  }

  const remixContent = async (item: ContentItem) => {
    try {
      const response = await fetch("/api/generate-specific-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: item.platform,
          product: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
          remixStyle: item.marketingStyle,
          originalContent: item.content,
        }),
      })

      const data = await response.json()
      
      const remixedContent = {
        id: Date.now().toString(),
        content: data.content,
        type: item.type,
        platform: item.platform,
        marketingStyle: data.marketingStyle || item.marketingStyle,
        createdAt: new Date().toISOString(),
        status: 'draft' as const,
        analytics: {
          views: 0,
          comments: 0,
          followers: 0,
          acquisitions: 0
        }
      }

      const updated = [remixedContent, ...content]
      updateContent(updated)
    } catch (error) {
      console.error("Remix failed:", error)
    }
  }

  const uniquePlatforms = [...new Set(content.map(item => item.platform))]
  const uniqueStyles = [...new Set(content.map(item => item.marketingStyle))]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
          <CardDescription>Manage your generated content, track performance, and create variations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {uniquePlatforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStyle} onValueChange={setFilterStyle}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {uniqueStyles.map(style => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredContent.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No content found. Generate some content to get started!</p>
              </div>
            ) : (
              filteredContent.map((item) => {
                const Icon = platformIcons[item.platform] || FileText
                const color = platformColors[item.platform] || "text-gray-500"
                
                return (
                  <Card key={item.id} className="border-l-4 border-l-indigo-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-5 w-5 ${color}`} />
                          <span className="font-medium">{item.type}</span>
                          <Badge variant={item.status === 'posted' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                            {item.marketingStyle}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(item.content, item.id)}
                          >
                            {copied === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => remixContent(item)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAnalyticsItem(item)}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteContent(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="text-sm whitespace-pre-wrap">{item.content.substring(0, 200)}...</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.status === 'draft' ? (
                          <Button size="sm" onClick={() => markAsPosted(item.id)}>
                            Mark as Posted
                          </Button>
                        ) : (
                          <div className="flex space-x-4">
                            <span>👁 {item.analytics.views}</span>
                            <span>💬 {item.analytics.comments}</span>
                            <span>👥 +{item.analytics.followers}</span>
                            <span>🎯 {item.analytics.acquisitions}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>Make changes to your content</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <Textarea
                value={editingItem.content}
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                rows={10}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button onClick={() => saveEdit(editingItem.id, editingItem.content)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={!!analyticsItem} onOpenChange={() => setAnalyticsItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Analytics</DialogTitle>
            <DialogDescription>Enter the performance metrics for this post</DialogDescription>
          </DialogHeader>
          {analyticsItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="views">Views</Label>
                  <Input
                    id="views"
                    type="number"
                    value={analyticsItem.analytics.views}
                    onChange={(e) => setAnalyticsItem({
                      ...analyticsItem,
                      analytics: { ...analyticsItem.analytics, views: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Input
                    id="comments"
                    type="number"
                    value={analyticsItem.analytics.comments}
                    onChange={(e) => setAnalyticsItem({
                      ...analyticsItem,
                      analytics: { ...analyticsItem.analytics, comments: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="followers">New Followers</Label>
                  <Input
                    id="followers"
                    type="number"
                    value={analyticsItem.analytics.followers}
                    onChange={(e) => setAnalyticsItem({
                      ...analyticsItem,
                      analytics: { ...analyticsItem.analytics, followers: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="acquisitions">User Acquisitions</Label>
                  <Input
                    id="acquisitions"
                    type="number"
                    value={analyticsItem.analytics.acquisitions}
                    onChange={(e) => setAnalyticsItem({
                      ...analyticsItem,
                      analytics: { ...analyticsItem.analytics, acquisitions: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAnalyticsItem(null)}>
                  Cancel
                </Button>
                <Button onClick={() => updateAnalytics(analyticsItem.id, analyticsItem.analytics)}>
                  Update Analytics
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
