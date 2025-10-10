"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Twitter, Linkedin, MessageSquare, Instagram, Video, FileText, Zap, Copy, Check, Loader2, CheckCircle2, Circle, BookOpen, Trash2, Edit3, Eye, Heart, BarChart3, ThumbsUp, Rocket } from "lucide-react"
import InstagramImageDisplay from "@/components/instagram-image-display"
import { supabase } from "@/lib/supabase"

interface ContentGeneratorProps {
  user: any
  dailyTasks?: any[]
  onTaskUpdate?: () => void
  initialPlatformId?: string
  initialSelectedTask?: any
}

const contentTypes = [
  {
    id: "twitter-thread",
    name: "Twitter Thread",
    icon: Twitter,
    description: "Engaging thread to share insights",
    color: "text-blue-500",
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post",
    icon: Linkedin,
    description: "Professional story or insight",
    color: "text-blue-700",
  },
  {
    id: "reddit-post",
    name: "Reddit Post",
    icon: MessageSquare,
    description: "Value-first community post",
    color: "text-orange-500",
  },
  {
    id: "instagram-post",
    name: "Instagram Post",
    icon: Instagram,
    description: "Visual story with caption",
    color: "text-pink-500",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    icon: Instagram,
    description: "Behind-the-scenes content",
    color: "text-purple-500",
  },
  {
    id: "tiktok-script",
    name: "TikTok/Reels Script",
    icon: Video,
    description: "30-second video script",
    color: "text-red-500",
  },
  {
    id: "build-in-public",
    name: "Build in Public",
    icon: Zap,
    description: "Share your journey transparently",
    color: "text-yellow-500",
  },
  {
    id: "seo-blog",
    name: "SEO Blog Post",
    icon: FileText,
    description: "Full blog post with SEO optimization",
    color: "text-green-600",
  },
  {
    id: "product-hunt-post",
    name: "Product Hunt Launch",
    icon: Rocket,
    description: "Launch post for Product Hunt",
    color: "text-orange-600",
  },
  {
    id: "indie-hackers-post",
    name: "Indie Hackers Post",
    icon: BookOpen,
    description: "Transparent milestone/learning",
    color: "text-indigo-700",
  },
]

export default function ContentGenerator({ user, dailyTasks = [], onTaskUpdate, initialPlatformId, initialSelectedTask }: ContentGeneratorProps) {
  const [selectedType, setSelectedType] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [marketingStyle, setMarketingStyle] = useState("")
  const [copied, setCopied] = useState(false)
  const [contentSaved, setContentSaved] = useState(false)
  const [showKeywords, setShowKeywords] = useState(false)
  const [suggestedKeywords, setSuggestedKeywords] = useState("")
  const [selectedKeywords, setSelectedKeywords] = useState("")
  const [loadingKeywords, setLoadingKeywords] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [imagePrompt, setImagePrompt] = useState<string | null>(null)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [showThreadCount, setShowThreadCount] = useState(false)
  const [threadCount, setThreadCount] = useState(5)
  const [contentMode, setContentMode] = useState<'freestyle' | 'daily-habit'>('freestyle')
  const [selectedDailyTask, setSelectedDailyTask] = useState<any>(null)
  const [showTaskSelection, setShowTaskSelection] = useState(false)
  const [usedContent, setUsedContent] = useState<any[]>([])
  const [contentFilter, setContentFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'likes'>('recent')
  const [lengthFilter, setLengthFilter] = useState<string>('all') // all, short, long
  const [dateFilter, setDateFilter] = useState<string>('all') // all, today, week, month
  const [editingAnalytics, setEditingAnalytics] = useState<string | null>(null)
  const [analyticsForm, setAnalyticsForm] = useState({
    views24h: 0,
    likes24h: 0,
    viewsAllTime: 0,
    likesAllTime: 0
  })
  const [expandedContent, setExpandedContent] = useState<Record<string, boolean>>({})
  const [preferredFilter, setPreferredFilter] = useState<string | null>(null) // platform id filter

  // Function to detect platform from task title/description
  const detectPlatformFromTask = (task: any): string[] => {
    if (!task) return []
    
    const text = `${task.title} ${task.description || ''}`.toLowerCase()
    
    // Platform detection patterns - ordered by specificity (most specific first)
    const platformPatterns = {
      'linkedin': ['linkedin'],
      'twitter': ['twitter', 'tweet', 'x.com'],
      'instagram': ['instagram', 'ig story', 'ig post', 'insta'],
      'reddit': ['reddit', 'subreddit'],
      'tiktok': ['tiktok', 'tik tok'],
      'blog': ['blog post', 'article', 'seo content', 'website content'],
      'saas_directories': ['product hunt', 'betalist', 'g2', 'capterra', 'appsumo', 'directory', 'directories', 'stackshare', 'alternativeto']
    }
    // Find the most specific platform match (return only the first match to avoid conflicts)
    for (const [platform, patterns] of Object.entries(platformPatterns)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        return [platform]
      }
    }
    return [] // No platform detected
  }

  // Map explicit platform to a single content type (no auto-detection/override)
  const mapPlatformToContentType = (pid?: string): string => {
    const p = String(pid || '').toLowerCase()
    if (p.includes('linkedin')) return 'linkedin-post'
    if (p.includes('twitter') || p === 'x' || p.includes('tweet')) return 'twitter-thread'
    if (p.includes('instagram') || p.includes('ig')) return 'instagram-post'
    if (p.includes('reddit')) return 'reddit-post'
    if (p.includes('tiktok')) return 'tiktok-script'
    if (p.includes('blog') || p.includes('seo')) return 'seo-blog'
    if (p.includes('product') || p.includes('saas') || p.includes('directory')) return 'product-hunt-post'
    return 'build-in-public'
  }

  // Auto-generate content for selected task in daily-habit mode (strictly follow task/platform)
  const generateForSelectedTask = async () => {
    if (!selectedDailyTask) return
    const platformHint = selectedDailyTask.platform || initialPlatformId || ''
    // If no explicit platform, look for direct cues in the task title/description only (no heuristic prefs)
    let chosen = mapPlatformToContentType(platformHint)
    if (!platformHint) {
      const text = `${selectedDailyTask.title || ''} ${selectedDailyTask.description || ''}`.toLowerCase()
      if (text.includes('linkedin')) chosen = 'linkedin-post'
      else if (text.includes('twitter') || text.includes('tweet') || text.includes('x.com')) chosen = 'twitter-thread'
      else if (text.includes('instagram') || text.includes('ig ')) chosen = 'instagram-post'
      else if (text.includes('reddit') || text.includes('subreddit')) chosen = 'reddit-post'
      else if (text.includes('tiktok')) chosen = 'tiktok-script'
      else if (text.includes('blog') || text.includes('article') || text.includes('seo')) chosen = 'seo-blog'
      else if (text.includes('product hunt') || text.includes('directory') || text.includes('directories') || text.includes('betalist') || text.includes('g2') || text.includes('capterra')) chosen = 'product-hunt-post'
      else if (initialPlatformId) chosen = mapPlatformToContentType(initialPlatformId)
      else chosen = 'build-in-public'
    }
    const ct = contentTypes.find(ct => ct.id === chosen) || contentTypes.find(ct => ct.id === 'build-in-public') || null
    setSelectedType(ct)

    setGenerating(true)
    setGeneratedContent("")
    setGeneratedImage(null)
    setImagePrompt(null)
    try {
      const taskDesc = selectedDailyTask.description || `Create content that fulfills this task: ${selectedDailyTask.title}`
      const resp = await fetch('/api/generate-specific-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: chosen,
          product: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
          dailyTask: { ...selectedDailyTask, description: taskDesc, platform: platformHint },
          targetAudience: user.targetAudience,
          preferredPlatforms: user.preferredPlatforms,
        })
      })
      const data = await resp.json()
      setGeneratedContent(data.content)
      setMarketingStyle(data.marketingStyle || 'General')
      if (data.imagePrompt && (chosen === 'instagram-post' || chosen === 'instagram-story')) {
        setImagePrompt(data.imagePrompt)
        await generateImage(data.imagePrompt)
      }
    } catch (e) {
      console.error('Daily-habit generation failed:', e)
      setGeneratedContent('Failed to generate content. Please try again.')
    }
    setGenerating(false)
  }

  // If navigated from Daily Tasks with a selected task, switch to daily-habit and auto-generate once
  useEffect(() => {
    if (initialSelectedTask) {
      setContentMode('daily-habit')
      setSelectedDailyTask(initialSelectedTask)
      // Reset previous generation to avoid stale content/type carrying over
      setGeneratedContent("")
      setGeneratedImage(null)
      setImagePrompt(null)
      setSelectedType(null)
      setGenerating(false)
    }
  }, [initialSelectedTask])

  useEffect(() => {
    if (contentMode === 'daily-habit' && selectedDailyTask && !generating && !generatedContent) {
      void generateForSelectedTask()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentMode, selectedDailyTask])

  // Get relevant content types based on detected platforms
  const getRelevantContentTypes = () => {
    if (contentMode !== 'daily-habit' || !selectedDailyTask) {
      return contentTypes // Show all types for freestyle mode
    }
    
    const detectedPlatforms = detectPlatformFromTask(selectedDailyTask)
    
    if (detectedPlatforms.length === 0) {
      return contentTypes // Show all if no platform detected
    }
    
    // Map detected platforms to content type IDs
    const platformToContentTypes: { [key: string]: string[] } = {
      'linkedin': ['linkedin-post'],
      'twitter': ['twitter-thread'],
      'instagram': ['instagram-post', 'instagram-story'],
      'reddit': ['reddit-post'],
      'tiktok': ['tiktok-script'],
      'blog': ['seo-blog', 'build-in-public']
    }
    
    const relevantTypeIds = detectedPlatforms.flatMap(platform => 
      platformToContentTypes[platform] || []
    )
    
    return contentTypes.filter(type => relevantTypeIds.includes(type.id))
  }

  const saveToContentLibrary = () => {
    const normalizePlatform = (id: string) => {
      switch (id) {
        case 'twitter-thread': return 'twitter'
        case 'linkedin-post': return 'linkedin'
        case 'reddit-post': return 'reddit'
        case 'instagram-post':
        case 'instagram-story': return 'instagram'
        case 'tiktok-script': return 'tiktok'
        case 'seo-blog': return 'blog'
        case 'product-hunt-post': return 'producthunt'
        case 'indie-hackers-post': return 'indiehackers'
        default: return id
      }
    }

    const save = async () => {
      if (!generatedContent || !selectedType) return
      const nowIso = new Date().toISOString()
      const platform = normalizePlatform(selectedType.id)
      let taskId = contentMode === 'daily-habit' && selectedDailyTask ? (selectedDailyTask.db_id || selectedDailyTask.id) : null
      const titleFromContent = (generatedContent || '').split('\n')[0].slice(0, 80)
      const title = selectedDailyTask?.title ? `${selectedType.name}: ${selectedDailyTask.title.slice(0, 50)}` : (titleFromContent || `${selectedType.name} Draft`)

      try {
        // Ensure task exists in DB if coming from daily-habit without a db_id
        if (contentMode === 'daily-habit' && selectedDailyTask && !selectedDailyTask.db_id) {
          const insertTaskPayload: any = {
            user_id: user.id,
            title: selectedDailyTask.title,
            description: selectedDailyTask.description || null,
            category: selectedDailyTask.category || null,
            platform: normalizePlatform(selectedDailyTask.platform || platform),
            status: 'pending',
            metadata: { day: selectedDailyTask.day || 1, source: 'content_link' }
          }
          const { data: insTask, error: insTaskErr } = await supabase
            .from('tasks')
            .insert(insertTaskPayload)
            .select('id')
            .single()
          if (!insTaskErr && insTask?.id) {
            taskId = insTask.id
          }
        }

        // Insert content row
        const { data: inserted, error } = await supabase
          .from('content')
          .insert({
            user_id: user.id,
            title,
            content_text: generatedContent,
            platform,
            content_type: selectedType.id,
            status: 'draft',
            ai_generated: true,
            task_id: taskId || null,
            engagement_metrics: { views: 0, comments: 0, followers: 0, acquisitions: 0 },
            metadata: { marketingStyle, imageUrl: generatedImage, mode: contentMode }
          })
          .select('id, task_id')
          .single()
        if (error) throw error

        // Link back to task if present
        if ((taskId || inserted?.task_id) && inserted?.id) {
          const linkId = taskId || inserted.task_id
          await supabase
            .from('tasks')
            .update({ related_content_id: inserted.id, platform, last_status_change: nowIso })
            .eq('id', linkId)
        }

        // Keep local UI list for immediate feedback
        const newContent = {
          id: inserted.id,
          type: selectedType.name,
          platform: selectedType.id,
          content: generatedContent,
          image: generatedImage,
          marketingStyle: marketingStyle,
          createdAt: nowIso,
          characterCount: generatedContent.length,
          analytics: {
            views24h: 0,
            likes24h: 0,
            viewsAllTime: 0,
            likesAllTime: 0
          }
        }
        setUsedContent(prev => [newContent, ...prev])
        setContentSaved(true)
        setTimeout(() => setContentSaved(false), 2000)
        onTaskUpdate?.()
      } catch (e) {
        console.error('Failed to save content to Supabase:', e)
        // Fall back to local only
        const newContent = {
          id: Date.now(),
          type: selectedType.name,
          platform: selectedType.id,
          content: generatedContent,
          image: generatedImage,
          marketingStyle: marketingStyle,
          createdAt: nowIso,
          characterCount: generatedContent.length,
          analytics: {
            views24h: 0,
            likes24h: 0,
            viewsAllTime: 0,
            likesAllTime: 0
          }
        }
        setUsedContent(prev => [newContent, ...prev])
        setContentSaved(true)
        setTimeout(() => setContentSaved(false), 2000)
      }
    }

    void save()
  }

  const startEditingAnalytics = (contentId: string, currentAnalytics: any) => {
    setEditingAnalytics(contentId)
    setAnalyticsForm({
      views24h: currentAnalytics.views24h || 0,
      likes24h: currentAnalytics.likes24h || 0,
      viewsAllTime: currentAnalytics.viewsAllTime || 0,
      likesAllTime: currentAnalytics.likesAllTime || 0
    })
  }

  const saveAnalytics = async (contentId: string) => {
    // Local update
    setUsedContent(prev => prev.map(content => 
      content.id === contentId 
        ? { ...content, analytics: { ...analyticsForm } }
        : content
    ))
    setEditingAnalytics(null)

    // Try to persist analytics to Supabase and adopt into related task
    try {
      const nowIso = new Date().toISOString()
      // Update content.engagement_metrics
      const { error: upErr } = await supabase
        .from('content')
        .update({ engagement_metrics: { ...analyticsForm } })
        .eq('id', contentId)
      if (upErr) return
      // Fetch task_id
      const { data: row } = await supabase
        .from('content')
        .select('task_id, platform')
        .eq('id', contentId)
        .single()
      if (row?.task_id) {
        const summary = `Views24h: ${analyticsForm.views24h}, Likes24h: ${analyticsForm.likes24h}, All-time Views: ${analyticsForm.viewsAllTime}, All-time Likes: ${analyticsForm.likesAllTime}`
        await supabase
          .from('tasks')
          .update({
            performance_data: { ...analyticsForm },
            completion_note: summary,
            platform: row.platform || null,
            last_status_change: nowIso
          })
          .eq('id', row.task_id)
      }
      onTaskUpdate?.()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist analytics to Supabase:', e)
    }
  }

  const cancelEditingAnalytics = () => {
    setEditingAnalytics(null)
    setAnalyticsForm({ views24h: 0, likes24h: 0, viewsAllTime: 0, likesAllTime: 0 })
  }

  const deleteUsedContent = (contentId: string) => {
    setUsedContent(prev => prev.filter(content => content.id !== contentId))
  }

  const getFilteredAndSortedContent = () => {
    // Create a copy of the array to avoid mutating the original
    let filtered = [...usedContent]
    
    // Filter by platform
    if (contentFilter !== 'all') {
      filtered = filtered.filter(content => content.platform === contentFilter)
    }
    
    // Filter by content length (short: < 200 chars, long: >= 200 chars)
    if (lengthFilter !== 'all') {
      filtered = filtered.filter(content => {
        const length = content.characterCount || content.content?.length || 0
        if (lengthFilter === 'short') return length < 200
        if (lengthFilter === 'long') return length >= 200
        return true
      })
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(content => {
        const contentDate = new Date(content.createdAt)
        switch (dateFilter) {
          case 'today':
            return contentDate.toDateString() === now.toDateString()
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return contentDate >= weekAgo
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return contentDate >= monthAgo
          default:
            return true
        }
      })
    }
    
    // Sort content
    switch (sortBy) {
      case 'recent':
        return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'views':
        return [...filtered].sort((a, b) => {
          const aViews = (a.analytics?.viewsAllTime || 0)
          const bViews = (b.analytics?.viewsAllTime || 0)
          return bViews - aViews
        })
      case 'likes':
        return [...filtered].sort((a, b) => {
          const aLikes = (a.analytics?.likesAllTime || 0)
          const bLikes = (b.analytics?.likesAllTime || 0)
          return bLikes - aLikes
        })
      default:
        return filtered
    }
  }

  const generateSEOKeywords = async () => {
    setLoadingKeywords(true)
    try {
      const response = await fetch("/api/generate-seo-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
        }),
      })
      const data = await response.json()
      setSuggestedKeywords(data.keywords)
      setSelectedKeywords(data.keywords)
    } catch (error) {
      console.error("Keyword generation failed:", error)
      setSuggestedKeywords("business automation, productivity tools, workflow optimization")
      setSelectedKeywords("business automation, productivity tools, workflow optimization")
    }
    setLoadingKeywords(false)
  }

  const generateImage = async (prompt: string) => {
    setGeneratingImage(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      }
    } catch (error) {
      console.error("Image generation failed:", error)
    }
    setGeneratingImage(false)
  }

  const generateContent = async (contentType: any) => {
    setSelectedType(contentType)
    
    // For SEO blog posts, show keyword selection first
    if (contentType.id === "seo-blog") {
      setShowKeywords(true)
      await generateSEOKeywords()
      return
    }
    
    // For Twitter threads, show thread count selection first
    if (contentType.id === "twitter-thread") {
      setShowThreadCount(true)
      return
    }
    
    setGenerating(true)
    setGeneratedContent("")
    setGeneratedImage(null)
    setImagePrompt(null)

    try {
      const response = await fetch("/api/generate-specific-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: contentType.id,
          product: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
          dailyTask: contentMode === 'daily-habit' ? selectedDailyTask : null,
          targetKeywords: selectedKeywords,
          targetAudience: user.targetAudience,
          preferredPlatforms: user.preferredPlatforms,
        }),
      })

      const data = await response.json()
      setGeneratedContent(data.content)
      setMarketingStyle(data.marketingStyle || "General")
      
      // If this is Instagram content with an image prompt, generate the image
      if (data.imagePrompt && (contentType.id === 'instagram-post' || contentType.id === 'instagram-story')) {
        setImagePrompt(data.imagePrompt)
        await generateImage(data.imagePrompt)
      }
    } catch (error) {
      console.error("Content generation failed:", error)
      setGeneratedContent("Failed to generate content. Please try again.")
    }

    setGenerating(false)
  }

  const generateWithKeywords = async () => {
    setShowKeywords(false)
    setGenerating(true)
    setGeneratedContent("")

    try {
      const response = await fetch("/api/generate-specific-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "seo-blog",
          product: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
          targetKeywords: selectedKeywords,
          targetAudience: user.targetAudience,
          preferredPlatforms: user.preferredPlatforms,
        }),
      })

      const data = await response.json()
      setGeneratedContent(data.content)
      setMarketingStyle(data.marketingStyle || "General")
    } catch (error) {
      console.error("Content generation failed:", error)
      setGeneratedContent("Failed to generate content. Please try again.")
    }

    setGenerating(false)
  }

  const generateWithThreadCount = async () => {
    setShowThreadCount(false)
    setGenerating(true)
    setGeneratedContent("")

    try {
      const response = await fetch("/api/generate-specific-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "twitter-thread",
          product: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
          threadCount: threadCount,
          targetAudience: user.targetAudience,
          preferredPlatforms: user.preferredPlatforms,
        }),
      })

      const data = await response.json()
      setGeneratedContent(data.content)
      setMarketingStyle(data.marketingStyle || "General")
    } catch (error) {
      console.error("Content generation failed:", error)
      setGeneratedContent("Failed to generate content. Please try again.")
    }

    setGenerating(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }



  // Get today's tasks from user's plan - same logic as dashboard
  const getTodaysTasks = () => {
    if (!user.plan?.tasks) return []
    
    // Calculate current day based on plan start date
    const planStartDate = user.plan.startDate ? new Date(user.plan.startDate) : new Date()
    const today = new Date()
    const daysDiff = Math.floor((today.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24))
    const currentDay = Math.max(1, Math.min(30, daysDiff + 1))
    
    const todayKey = `day-${currentDay}`
    return user.plan.tasks[todayKey] || []
  }

  const todaysTasks = getTodaysTasks()

  return (
    <div className="space-y-6">


      {/* Daily Task Selection Modal */}
      {showTaskSelection && contentMode === 'daily-habit' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Today's Task</CardTitle>
            <CardDescription>
              Choose which daily task you want to create content for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysTasks.map((task: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDailyTask?.title === task.title
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDailyTask(task)}
                >
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
              ))}
            </div>
            {contentMode === 'daily-habit' && (
              <div className="mt-4">
                <Button className="w-full" disabled={!selectedDailyTask || generating} onClick={generateForSelectedTask}>
                  {generating ? 'Generating…' : 'Generate content for this task'}
                </Button>
              </div>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowTaskSelection(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => setShowTaskSelection(false)}
                disabled={!selectedDailyTask}
              >
                Continue with Selected Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            <span>Content Generator</span>
          </CardTitle>
          <CardDescription>
            Generate platform-specific content based on your business analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Content Mode</Label>
            <div className="flex space-x-2">
              <Button
                variant={contentMode === 'freestyle' ? 'default' : 'outline'}
                onClick={() => {
                  setContentMode('freestyle')
                  setSelectedDailyTask(null)
                }}
                className="flex-1"
              >
                Freestyle Content
              </Button>
              <Button
                variant={contentMode === 'daily-habit' ? 'default' : 'outline'}
                onClick={() => setContentMode('daily-habit')}
                className="flex-1"
                disabled={dailyTasks.length === 0}
              >
                Daily Habit Content ({dailyTasks.length})
              </Button>
            </div>
            
            {contentMode === 'daily-habit' && dailyTasks.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">Select Daily Task</Label>
                <div className="grid gap-2 max-h-40 overflow-y-auto">
                  {dailyTasks.map((task, index) => (
                    <div
                      key={task.id || index}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDailyTask?.id === task.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDailyTask(task)}
                    >
                      <div className="flex items-center space-x-2">
                        {task.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-gray-500">{task.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {!selectedDailyTask && (
                  <p className="text-sm text-gray-500 mt-2">
                    Select a daily task to generate content that aligns with your marketing goals
                  </p>
                )}
              </div>
            )}
            
            {contentMode === 'daily-habit' && dailyTasks.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No daily tasks available. Switch to the Daily Habits tab to create tasks first.
                </p>
              </div>
            )}
          </div>
          {contentMode === 'freestyle' && Array.isArray(user?.preferredPlatforms) && user.preferredPlatforms.length > 0 && (
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Your recommended platforms</Label>
              <div className="flex flex-wrap gap-2">
                {user.preferredPlatforms.map((pid: string) => {
                  const pretty = pid.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
                  const isActive = preferredFilter === pid
                  return (
                    <Badge
                      key={pid}
                      onClick={() => setPreferredFilter(isActive ? null : pid)}
                      className={`${isActive ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-gray-100 text-gray-700'} cursor-pointer`}
                      variant="secondary"
                    >
                      {pretty}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
          {contentMode === 'freestyle' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentTypes.map((type) => {
              const isDisabled = false
              // If a preferred platform chip is selected, highlight mapped content types
              const preferredMap: { [key: string]: string[] } = {
                'linkedin': ['linkedin-post'],
                'twitter': ['twitter-thread'],
                'reddit': ['reddit-post'],
                'instagram': ['instagram-post', 'instagram-story'],
                'tiktok': ['tiktok-script'],
                'blog': ['seo-blog', 'build-in-public'],
                'seo-blog': ['seo-blog'],
                'producthunt': ['product-hunt-post'],
                'product_hunt': ['product-hunt-post'],
                'indiehackers': ['indie-hackers-post'],
                'indie_hackers': ['indie-hackers-post'],
              }
              const key = (preferredFilter || '').toLowerCase()
              const normalized = key.replace(/[_\s-]/g, '')
              const preferredMatches = preferredFilter ? (preferredMap[key] || preferredMap[normalized] || []) : []
              const isHighlighted = (!!initialPlatformId && type.id === initialPlatformId) || (preferredMatches.includes(type.id))
              const isDimmed = false
              
              return (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed border-gray-200' 
                      : isHighlighted
                        ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105 ring-2 ring-indigo-200'
                        : isDimmed
                          ? 'opacity-40 border-gray-200'
                          : 'hover:shadow-md hover:border-indigo-200'
                  }`}
                  onClick={() => !isDisabled && generateContent(type)}
                >
                  <CardContent className="p-4 text-center">
                    {isHighlighted && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <type.icon className={`h-8 w-8 mx-auto mb-2 ${
                      isDisabled 
                        ? 'text-gray-400' 
                        : isHighlighted 
                          ? 'text-indigo-600' 
                          : isDimmed 
                            ? 'text-gray-300'
                            : type.color
                    }`} />
                    <h3 className={`font-medium text-sm mb-1 ${
                      isHighlighted 
                        ? 'text-indigo-900' 
                        : isDimmed 
                          ? 'text-gray-400'
                          : 'text-gray-900'
                    }`}>{type.name}</h3>
                    <p className={`text-xs ${
                      isHighlighted 
                        ? 'text-indigo-700' 
                        : isDimmed 
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`}>{type.description}</p>
                    {/* Badge removed in freestyle grid */}
                  </CardContent>
                </Card>
              )
            })}
          </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Keywords Selection Modal */}
      {showKeywords && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Target Keywords</CardTitle>
            <CardDescription>
              Review and edit the target keywords for your blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingKeywords ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Generating keyword suggestions...
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="keywords">Target Keywords</Label>
                  <Textarea
                    id="keywords"
                    value={selectedKeywords}
                    onChange={(e) => setSelectedKeywords(e.target.value)}
                    rows={3}
                    placeholder="Enter target keywords separated by commas..."
                  />
                  <p className="text-sm text-gray-500">
                    These keywords will be naturally integrated into your blog post content.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowKeywords(false)}>
                  Cancel
                </Button>
                <Button onClick={generateWithKeywords}>
                  Generate Blog Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Twitter Thread Count Selection Modal */}
      {showThreadCount && (
        <Card>
          <CardHeader>
            <CardTitle>Twitter Thread Length</CardTitle>
            <CardDescription>
              How many tweets should your thread contain?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="threadCount">Number of Tweets</Label>
                <Input
                  id="threadCount"
                  type="number"
                  min="2"
                  max="20"
                  value={threadCount}
                  onChange={(e) => setThreadCount(parseInt(e.target.value) || 5)}
                  placeholder="5"
                />
                <p className="text-sm text-gray-500">
                  Choose between 2-20 tweets for your thread. Recommended: 5-8 tweets.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowThreadCount(false)}>
                  Cancel
                </Button>
                <Button onClick={generateWithThreadCount}>
                  Generate Thread
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(generating || generatedContent) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {selectedType && <selectedType.icon className={`h-5 w-5 ${selectedType.color}`} />}
              <span>{selectedType?.name}</span>
            </CardTitle>
            <CardDescription>Generated content based on your business analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {generating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-gray-600">Generating content...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    rows={selectedType?.id === 'seo-blog' ? 30 : 8}
                    className="pr-12 min-h-[200px]"
                    placeholder="Generated content will appear here..."
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

                {/* Instagram Image Display */}
                {(selectedType?.id === 'instagram-post' || selectedType?.id === 'instagram-story') && (
                  <div>
                    <InstagramImageDisplay
                      imageUrl={generatedImage}
                      imagePrompt={imagePrompt}
                      isGenerating={generatingImage}
                      onRegenerate={() => imagePrompt && generateImage(imagePrompt)}
                    />
                    
                    {/* Generate Image Button */}
                    {!generatedImage && !generatingImage && imagePrompt && (
                      <div className="mt-4">
                        <Button
                          onClick={() => imagePrompt && generateImage(imagePrompt)}
                          disabled={generatingImage}
                          className="w-full"
                        >
                          {generatingImage ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Image...
                            </>
                          ) : (
                            'Generate Image'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant="outline">{generatedContent.length} characters</Badge>
                    {marketingStyle && (
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                        {marketingStyle}
                      </Badge>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => generateContent(selectedType)}>
                      Regenerate
                    </Button>
                    <Button onClick={saveToContentLibrary} disabled={contentSaved}>
                      {contentSaved ? "Saved!" : "Use This Content"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Used Content Library */}
      {usedContent.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Used Content Library</span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filters:</Label>
                  <select 
                    value={contentFilter} 
                    onChange={(e) => setContentFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Platforms</option>
                    <option value="twitter-thread">Twitter</option>
                    <option value="linkedin-post">LinkedIn</option>
                    <option value="instagram-post">Instagram</option>
                    <option value="instagram-story">Instagram Story</option>
                    <option value="reddit-post">Reddit</option>
                    <option value="tiktok-script">TikTok</option>
                    <option value="seo-blog-post">SEO Blog</option>
                    <option value="build-in-public">Build in Public</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Length:</Label>
                  <select 
                    value={lengthFilter} 
                    onChange={(e) => setLengthFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Lengths</option>
                    <option value="short">Short (&lt;200 chars)</option>
                    <option value="long">Long (200+ chars)</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Date:</Label>
                  <select 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</Label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'views' | 'likes')}
                    className="px-3 py-2 border rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="views">Most Views</option>
                    <option value="likes">Most Likes</option>
                  </select>
                </div>
                <Badge variant="secondary" className="ml-2">{getFilteredAndSortedContent().length} items</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getFilteredAndSortedContent().map((item) => (
                <div key={item.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      {item.marketingStyle && (
                        <Badge variant="outline" className="text-xs">{item.marketingStyle}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteUsedContent(item.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className={`text-sm text-gray-700 ${expandedContent[item.id] ? '' : 'line-clamp-2'}`}>
                      {expandedContent[item.id] 
                        ? item.content.split('\n').map((paragraph: string, index: number) => (
                            <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
                          ))
                        : item.content.length > 120 
                          ? item.content.substring(0, 120) + '...'
                          : item.content}
                    </div>
                    {item.content.length > 120 && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-indigo-600 hover:text-indigo-800 text-xs mt-1"
                        onClick={() => setExpandedContent(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      >
                        {expandedContent[item.id] ? 'See Less' : 'See More'}
                      </Button>
                    )}
                  </div>
                  
                  {/* Analytics Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                        Performance Analytics
                      </h4>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startEditingAnalytics(item.id, item.analytics)}
                        className="h-7 px-3 text-xs bg-white hover:bg-gray-50 border-indigo-200 text-indigo-700 hover:text-indigo-800 hover:border-indigo-300"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit Metrics
                      </Button>
                    </div>
                    
                    {editingAnalytics === item.id ? (
                      <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center">
                              <Eye className="h-4 w-4 mr-2 text-blue-500" />
                              24h Views
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={analyticsForm.views24h}
                              onChange={(e) => setAnalyticsForm(prev => ({ ...prev, views24h: parseInt(e.target.value) || 0 }))}
                              className="h-10 text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter views"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center">
                              <Heart className="h-4 w-4 mr-2 text-red-500" />
                              24h Likes
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={analyticsForm.likes24h}
                              onChange={(e) => setAnalyticsForm(prev => ({ ...prev, likes24h: parseInt(e.target.value) || 0 }))}
                              className="h-10 text-sm border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              placeholder="Enter likes"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center">
                              <BarChart3 className="h-4 w-4 mr-2 text-blue-700" />
                              All Time Views
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={analyticsForm.viewsAllTime}
                              onChange={(e) => setAnalyticsForm(prev => ({ ...prev, viewsAllTime: parseInt(e.target.value) || 0 }))}
                              className="h-10 text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter total views"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-2 text-red-700" />
                              All Time Likes
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={analyticsForm.likesAllTime}
                              onChange={(e) => setAnalyticsForm(prev => ({ ...prev, likesAllTime: parseInt(e.target.value) || 0 }))}
                              className="h-10 text-sm border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              placeholder="Enter total likes"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={cancelEditingAnalytics}
                            className="h-9 px-4 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => saveAnalytics(item.id)}
                            className="h-9 px-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            Save Metrics
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{item.analytics?.views24h || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">24h Views</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <div className="text-2xl font-bold text-red-600">{item.analytics?.likes24h || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">24h Likes</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <div className="text-2xl font-bold text-blue-800">{item.analytics?.viewsAllTime || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">Total Views</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <div className="text-2xl font-bold text-red-800">{item.analytics?.likesAllTime || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">Total Likes</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {item.characterCount} chars
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(item.content)
                        alert('Content copied to clipboard!')
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
              
              {getFilteredAndSortedContent().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No content found matching your filters.</p>
                  <p className="text-sm">Try adjusting your platform or sort preferences.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
