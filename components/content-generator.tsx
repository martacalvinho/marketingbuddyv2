"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Twitter, Linkedin, MessageSquare, Instagram, Video, FileText, Zap, Copy, Check, Loader2, CheckCircle2, Circle, BookOpen, Trash2, Edit3, Eye, Heart, BarChart3, ThumbsUp, Rocket, MoreHorizontal, Plus, Calendar, Clock, Save, Send } from "lucide-react"
import InstagramImageDisplay from "@/components/instagram-image-display"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ContentGeneratorProps {
  user: any
  dailyTasks?: any[]
  onTaskUpdate?: () => void
  onContentSaved?: () => void
  initialPlatformId?: string
  initialSelectedTask?: any
}

const contentTypes = [
  {
    id: "x-post",
    name: "X Post / Thread",
    icon: Twitter,
    description: "Quick post or multi-post thread",
    color: "text-blue-500",
    platformKey: "x"
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post",
    icon: Linkedin,
    description: "Professional story or insight",
    color: "text-blue-700",
    platformKey: "linkedin"
  },
  {
    id: "reddit-post",
    name: "Reddit Post",
    icon: MessageSquare,
    description: "Value-first community post",
    color: "text-orange-500",
    platformKey: "reddit"
  },
  {
    id: "instagram-post",
    name: "Instagram Post",
    icon: Instagram,
    description: "Visual story with caption",
    color: "text-pink-500",
    platformKey: "instagram"
  },
  {
    id: "instagram-carousel",
    name: "Instagram Carousel",
    icon: Instagram,
    description: "Multi-slide educational content",
    color: "text-pink-400",
    platformKey: "instagram"
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    icon: Instagram,
    description: "Behind-the-scenes content",
    color: "text-purple-500",
    platformKey: "instagram"
  },
  {
    id: "tiktok-script",
    name: "TikTok/Reels Script",
    icon: Video,
    description: "30-second video script",
    color: "text-red-500",
    platformKey: "tiktok"
  },
  {
    id: "build-in-public",
    name: "Build in Public",
    icon: Zap,
    description: "Share your journey transparently",
    color: "text-yellow-500",
    platformKey: "blog"
  },
  {
    id: "seo-blog",
    name: "SEO Blog Post",
    icon: FileText,
    description: "Full blog post with SEO optimization",
    color: "text-green-600",
    platformKey: "blog"
  },
  {
    id: "product-hunt-post",
    name: "Product Hunt Launch",
    icon: Rocket,
    description: "Launch post for Product Hunt",
    color: "text-orange-600",
    platformKey: "producthunt"
  },
  {
    id: "indie-hackers-post",
    name: "Indie Hackers Post",
    icon: BookOpen,
    description: "Transparent milestone/learning",
    color: "text-indigo-700",
    platformKey: "indiehackers"
  },
  {
    id: "youtube-script",
    name: "YouTube Script",
    icon: Video,
    description: "Long-form video script",
    color: "text-red-600",
    platformKey: "youtube"
  },
  {
    id: "email-newsletter",
    name: "Email Newsletter",
    icon: FileText,
    description: "Engaging email content",
    color: "text-yellow-500",
    platformKey: "email"
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    icon: MessageSquare,
    description: "Community engagement post",
    color: "text-blue-600",
    platformKey: "facebook"
  },
  {
    id: "pinterest-pin",
    name: "Pinterest Pin",
    icon: Instagram,
    description: "Visual discovery content",
    color: "text-red-500",
    platformKey: "pinterest"
  },
]

export default function ContentGenerator({ user, dailyTasks = [], onTaskUpdate, onContentSaved, initialPlatformId, initialSelectedTask }: ContentGeneratorProps) {
  const [selectedType, setSelectedType] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [marketingStyle, setMarketingStyle] = useState("")
  const [contentWarning, setContentWarning] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [contentSaved, setContentSaved] = useState(false)
  const [savedForLater, setSavedForLater] = useState(false)
  const [savingContent, setSavingContent] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null)
  const [showKeywords, setShowKeywords] = useState(false)
  const [suggestedKeywords, setSuggestedKeywords] = useState("")
  const [selectedKeywords, setSelectedKeywords] = useState("")
  const [loadingKeywords, setLoadingKeywords] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [imagePrompt, setImagePrompt] = useState<string | null>(null)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [showXOptions, setShowXOptions] = useState(false)
  const [threadCount, setThreadCount] = useState(5)
  const [xMode, setXMode] = useState<'post' | 'thread'>('post')
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
  const [localPreferredPlatforms, setLocalPreferredPlatforms] = useState<string[]>(user.preferredPlatforms || [])

  // Sync local preferences if user prop changes
  useEffect(() => {
    if (user.preferredPlatforms) {
      setLocalPreferredPlatforms(user.preferredPlatforms)
    }
  }, [user.preferredPlatforms])

  const togglePreference = async (platformKey: string) => {
    let newPreferences
    if (localPreferredPlatforms.includes(platformKey)) {
      newPreferences = localPreferredPlatforms.filter(p => p !== platformKey)
    } else {
      newPreferences = [...localPreferredPlatforms, platformKey]
    }
    
    setLocalPreferredPlatforms(newPreferences)

    try {
      const { error } = await supabase
        .from('onboarding')
        .update({ preferred_platforms: newPreferences })
        .eq('user_id', user.id)

      if (error) throw error
    } catch (e) {
      console.error('Failed to update preferences:', e)
      // Revert on error
      setLocalPreferredPlatforms(localPreferredPlatforms)
    }
  }

  const isPreferred = (platformKey: string) => {
    // Handle edge case where platform names in DB might slightly differ or need normalization
    // The contentTypes platformKey is normalized.
    return localPreferredPlatforms.some(p => p.toLowerCase() === platformKey.toLowerCase())
  }

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
    if (p.includes('twitter') || p === 'x' || p.includes('tweet')) return 'x-post'
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
      else if (text.includes('thread')) chosen = 'twitter-thread'
      else if (text.includes('twitter') || text.includes('tweet') || text.includes('x.com')) chosen = 'x-post'
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
      setContentWarning(data?.warning || null)
      if (data.imagePrompt && (chosen === 'instagram-post' || chosen === 'instagram-story')) {
        setImagePrompt(data.imagePrompt)
        await generateImage(data.imagePrompt)
      }
    } catch (e) {
      console.error('Daily-habit generation failed:', e)
      setGeneratedContent('Failed to generate content. Please try again.')
      setContentWarning(null)
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
      'twitter': ['x-post', 'twitter-thread', 'build-in-public'],
      'x': ['x-post', 'twitter-thread', 'build-in-public'],
      'instagram': ['instagram-post', 'instagram-carousel', 'instagram-story'],
      'reddit': ['reddit-post'],
      'tiktok': ['tiktok-script'],
      'blog': ['seo-blog', 'build-in-public'],
      'content': ['seo-blog', 'build-in-public'],
      'youtube': ['youtube-script', 'tiktok-script'],
      'email': ['email-newsletter'],
      'facebook': ['facebook-post'],
      'pinterest': ['pinterest-pin'],
      'producthunt': ['product-hunt-post'],
      'indiehackers': ['indie-hackers-post'],
      'indie hackers': ['indie-hackers-post'],
      'product hunt': ['product-hunt-post']
    }
    
    const relevantTypeIds = detectedPlatforms.flatMap(platform => 
      platformToContentTypes[platform] || []
    )
    
    return contentTypes.filter(type => relevantTypeIds.includes(type.id))
  }

  const saveToContentLibrary = async () => {
    if (!generatedContent || !selectedType || savingContent) {
      console.log('saveToContentLibrary early return:', { generatedContent: !!generatedContent, selectedType: !!selectedType, savingContent })
      alert('Cannot save: Missing content or already saving')
      return
    }
    
    console.log('saveToContentLibrary called, userId:', user?.id)
    
    const normalizePlatform = (id: string) => {
      switch (id) {
        case 'x-post':
        case 'twitter-thread':
        case 'build-in-public': return 'x'
        case 'linkedin-post': return 'linkedin'
        case 'reddit-post': return 'reddit'
        case 'instagram-post':
        case 'instagram-carousel':
        case 'instagram-story': return 'instagram'
        case 'tiktok-script': return 'tiktok'
        case 'seo-blog': return 'blog'
        case 'product-hunt-post': return 'producthunt'
        case 'indie-hackers-post': return 'indiehackers'
        case 'youtube-script': return 'youtube'
        case 'email-newsletter': return 'email'
        case 'facebook-post': return 'facebook'
        case 'pinterest-pin': return 'pinterest'
        default: return id
      }
    }

    if (!user?.id) {
      console.error('No user ID available for saveToContentLibrary')
      alert('You must be logged in to save content')
      return
    }

    setSavingContent(true)
    const nowIso = new Date().toISOString()
    const platform = normalizePlatform(selectedType.id)
    let taskId = contentMode === 'daily-habit' && selectedDailyTask ? (selectedDailyTask.db_id || selectedDailyTask.id) : null
    const titleFromContent = (generatedContent || '').split('\n')[0].slice(0, 80)
    const title = selectedDailyTask?.title ? `${selectedType.name}: ${selectedDailyTask.title.slice(0, 50)}` : (titleFromContent || `${selectedType.name} Draft`)

    try {
      console.log('saveToContentLibrary inserting:', { user_id: user.id, title, platform })
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

      // Insert content row with status 'published' since user clicked "Use Now"
      const { data: inserted, error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title,
          content_text: generatedContent,
          platform,
          content_type: selectedType.id,
          status: 'published',
          published_at: nowIso,
          ai_generated: true,
          task_id: taskId || null,
          engagement_metrics: { views: 0, comments: 0, followers: 0, acquisitions: 0 },
          metadata: { marketingStyle, imageUrl: generatedImage, mode: contentMode }
        })
        .select('id, task_id')
        .single()
      if (error) {
        console.error('saveToContentLibrary Supabase error:', error.message, error.details, error.hint)
        throw error
      }

      console.log('saveToContentLibrary success:', inserted)

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
      setTimeout(() => setContentSaved(false), 3000)
      alert('✅ Content published successfully!')
      onTaskUpdate?.()
      onContentSaved?.()
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
    } finally {
      setSavingContent(false)
    }
  }

  // Save content as draft for later use
  const saveForLater = async (scheduledFor?: Date) => {
    if (!generatedContent || !selectedType || savingContent) {
      console.log('saveForLater early return:', { generatedContent: !!generatedContent, selectedType: !!selectedType, savingContent })
      return
    }
    
    console.log('saveForLater called with:', { scheduledFor, userId: user?.id })
    
    const normalizePlatform = (id: string) => {
      switch (id) {
        case 'x-post':
        case 'twitter-thread':
        case 'build-in-public': return 'x'
        case 'linkedin-post': return 'linkedin'
        case 'reddit-post': return 'reddit'
        case 'instagram-post':
        case 'instagram-carousel':
        case 'instagram-story': return 'instagram'
        case 'tiktok-script': return 'tiktok'
        case 'seo-blog': return 'blog'
        case 'product-hunt-post': return 'producthunt'
        case 'indie-hackers-post': return 'indiehackers'
        case 'youtube-script': return 'youtube'
        case 'email-newsletter': return 'email'
        case 'facebook-post': return 'facebook'
        case 'pinterest-pin': return 'pinterest'
        default: return id
      }
    }

    setSavingContent(true)
    const platform = normalizePlatform(selectedType.id)
    const titleFromContent = (generatedContent || '').split('\n')[0].slice(0, 80)
    const title = titleFromContent || `${selectedType.name} Draft`
    const status = scheduledFor ? 'scheduled' : 'draft'

    if (!user?.id) {
      console.error('No user ID available')
      alert('You must be logged in to save content')
      setSavingContent(false)
      return
    }

    try {
      console.log('Attempting to save content:', {
        user_id: user.id,
        title,
        platform,
        content_type: selectedType.id,
        status,
        scheduled_for: scheduledFor?.toISOString() || null,
      })
      
      const { data, error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title,
          content_text: generatedContent,
          platform,
          content_type: selectedType.id,
          status,
          scheduled_for: scheduledFor?.toISOString() || null,
          ai_generated: true,
          metadata: { marketingStyle, imageUrl: generatedImage }
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error.message, error.details, error.hint)
        throw error
      }

      console.log('Content saved successfully:', data)
      setSavedForLater(true)
      setTimeout(() => setSavedForLater(false), 2000)
      setShowScheduleModal(false)
      setScheduleDate(null)
      onTaskUpdate?.()
      onContentSaved?.()
    } catch (e: any) {
      console.error('Failed to save content:', e?.message || e)
      alert(`Failed to save content: ${e?.message || 'Unknown error'}`)
    } finally {
      setSavingContent(false)
    }
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
    
    // For X, allow choosing post vs thread and thread length
    if (contentType.id === "x-post") {
      setXMode('post')
      setShowXOptions(true)
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
      const fallback = "Failed to generate content. Please try again."
      setGeneratedContent(data?.content || data?.error || fallback)
      setMarketingStyle(data?.marketingStyle || "General")
      setContentWarning(data?.warning || null)
      
      // If this is Instagram content with an image prompt, generate the image
      if (data.imagePrompt && (contentType.id === 'instagram-post' || contentType.id === 'instagram-story')) {
        setImagePrompt(data.imagePrompt)
        await generateImage(data.imagePrompt)
      }
    } catch (error) {
      console.error("Content generation failed:", error)
      setGeneratedContent("Failed to generate content. Please try again.")
      setContentWarning(null)
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
      const fallback = "Failed to generate content. Please try again."
      setGeneratedContent(data?.content || data?.error || fallback)
      setMarketingStyle(data?.marketingStyle || "General")
      setContentWarning(data?.warning || null)
    } catch (error) {
      console.error("Content generation failed:", error)
      setGeneratedContent("Failed to generate content. Please try again.")
      setContentWarning(null)
    }

    setGenerating(false)
  }

  const generateXContent = async () => {
    setShowXOptions(false)
    setGenerating(true)
    setGeneratedContent("")
    setGeneratedImage(null)
    setImagePrompt(null)

    const ctId = xMode === 'thread' ? 'twitter-thread' : 'x-post'
    const displayType = { ...(selectedType || {}), id: ctId, name: xMode === 'thread' ? 'X Thread' : 'X Post' }
    setSelectedType(displayType)

    try {
      const response = await fetch("/api/generate-specific-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: ctId,
          product: user.productName,
          valueProp: user.valueProp,
          goal: user.northStarGoal,
          websiteAnalysis: user.websiteAnalysis,
          threadCount: xMode === 'thread' ? threadCount : undefined,
          dailyTask: contentMode === 'daily-habit' ? selectedDailyTask : null,
          targetAudience: user.targetAudience,
          preferredPlatforms: user.preferredPlatforms,
        }),
      })

      const data = await response.json()
      const fallback = "Failed to generate content. Please try again."
      setGeneratedContent(data?.content || data?.error || fallback)
      setMarketingStyle(data?.marketingStyle || "General")
      setContentWarning(data?.warning || null)
    } catch (error) {
      console.error("Content generation failed:", error)
      setGeneratedContent("Failed to generate content. Please try again.")
      setContentWarning(null)
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
        <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white tracking-tight">Select Today's Task</CardTitle>
            <CardDescription className="text-zinc-400">
              Choose which daily task you want to create content for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysTasks.map((task: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedDailyTask?.title === task.title
                      ? 'border-lime-500/50 bg-lime-500/10'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                  onClick={() => setSelectedDailyTask(task)}
                >
                  <h4 className="font-medium text-zinc-200">{task.title}</h4>
                  <p className="text-sm text-zinc-500 mt-1">{task.description}</p>
                </div>
              ))}
            </div>
            {contentMode === 'daily-habit' && (
              <div className="mt-4">
                <Button className="w-full bg-lime-400 text-black hover:bg-lime-300 font-bold shadow-[0_0_20px_rgba(163,230,53,0.3)]" disabled={!selectedDailyTask || generating} onClick={generateForSelectedTask}>
                  {generating ? 'Generating…' : 'Generate content for this task'}
                </Button>
              </div>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowTaskSelection(false)} className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white">
                Cancel
              </Button>
              <Button
                onClick={() => setShowTaskSelection(false)}
                disabled={!selectedDailyTask}
                className="bg-lime-400 text-black hover:bg-lime-300 font-bold"
              >
                Continue with Selected Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
        <CardHeader className="border-b border-white/5 pb-6">
          <CardTitle className="flex items-center space-x-2 text-white tracking-tight">
            <Zap className="h-5 w-5 text-lime-400" />
            <span>Content Generator</span>
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Generate platform-specific content based on your business analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-8">
            <Label className="text-sm font-medium mb-3 block text-zinc-400">Content Mode</Label>
            <div className="flex p-1 bg-white/5 rounded-lg border border-white/5">
              <Button
                variant="ghost"
                onClick={() => {
                  setContentMode('freestyle')
                  setSelectedDailyTask(null)
                }}
                className={`flex-1 h-9 rounded-md transition-all ${
                  contentMode === 'freestyle' 
                    ? 'bg-lime-400 text-black font-bold shadow-sm' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Freestyle Content
              </Button>
              <Button
                variant="ghost"
                onClick={() => setContentMode('daily-habit')}
                className={`flex-1 h-9 rounded-md transition-all ${
                  contentMode === 'daily-habit' 
                    ? 'bg-lime-400 text-black font-bold shadow-sm' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                disabled={dailyTasks.length === 0}
              >
                Daily Habit Content ({dailyTasks.length})
              </Button>
            </div>
            
            {contentMode === 'daily-habit' && dailyTasks.length > 0 && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                <Label className="text-sm font-medium mb-3 block text-zinc-400">Select Daily Task</Label>
                <div className="grid gap-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
                  {dailyTasks.map((task, index) => (
                    <div
                      key={task.id || index}
                      className={`p-4 border rounded-xl cursor-pointer transition-all group ${
                        selectedDailyTask?.id === task.id
                          ? 'border-lime-500/50 bg-lime-500/10'
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                      }`}
                      onClick={() => setSelectedDailyTask(task)}
                    >
                      <div className="flex items-start space-x-3">
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-lime-400 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-zinc-600 mt-0.5 group-hover:text-zinc-500" />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${selectedDailyTask?.id === task.id ? 'text-white' : 'text-zinc-300'}`}>{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{task.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {!selectedDailyTask && (
                  <p className="text-sm text-zinc-500 mt-3 flex items-center gap-2">
                    <Circle className="h-2 w-2 fill-lime-400 text-lime-400 animate-pulse" />
                    Select a task above to start generating content
                  </p>
                )}
              </div>
            )}
            
            {contentMode === 'daily-habit' && dailyTasks.length === 0 && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 items-start">
                <div className="p-1 bg-amber-500/20 rounded text-amber-500 mt-0.5">
                  <Zap size={14} />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-amber-200">No tasks available</h4>
                   <p className="text-sm text-amber-200/60 mt-1">
                     Switch to the Daily Habits tab to create tasks first.
                   </p>
                </div>
              </div>
            )}
          </div>
          {contentMode === 'freestyle' && (
            <div className="space-y-8">
              {/* Preferred Platforms Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-zinc-400">Your Preferred Platforms</h3>
                  <span className="text-xs text-zinc-500">{contentTypes.filter(t => isPreferred(t.platformKey)).length} selected</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {contentTypes.filter(t => isPreferred(t.platformKey)).map((type) => (
                    <Card
                      key={type.id}
                      className="cursor-pointer transition-all duration-200 border bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 relative group"
                      onClick={() => generateContent(type)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); togglePreference(type.platformKey); }}>
                                <Trash2 className="mr-2 h-4 w-4" /> Remove from preferred
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <type.icon className={`h-8 w-8 mx-auto mb-2 ${type.color}`} />
                        <h3 className="font-medium text-sm mb-1 text-slate-200">{type.name}</h3>
                        <p className="text-xs text-slate-400">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {contentTypes.filter(t => isPreferred(t.platformKey)).length === 0 && (
                     <div className="col-span-full flex flex-col items-center justify-center py-8 border border-dashed border-white/10 rounded-lg text-zinc-500 bg-white/[0.02]">
                        <Zap className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm font-medium">No preferred platforms selected</p>
                        <p className="text-xs mt-1 opacity-60">Add platforms from the options below to quick-access them here</p>
                     </div>
                  )}
                </div>
              </div>

              {/* Other Platforms Section */}
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3">More Content Options</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {contentTypes.filter(t => !isPreferred(t.platformKey)).map((type) => (
                    <div
                      key={type.id}
                      className="group relative flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                      onClick={() => generateContent(type)}
                    >
                      <type.icon className={`h-5 w-5 flex-shrink-0 ${type.color}`} />
                      <span className="text-sm text-zinc-300 font-medium truncate">{type.name}</span>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/20 rounded-full">
                                <MoreHorizontal className="h-3 w-3 text-zinc-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); togglePreference(type.platformKey); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add to preferred
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                <Button variant="ghost" onClick={() => setShowKeywords(false)} className="bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700">
                  Cancel
                </Button>
                <Button onClick={generateWithKeywords} className="bg-lime-500 text-black hover:bg-lime-400 font-bold">
                  Generate Blog Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* X Content Options Modal */}
      {showXOptions && (
        <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">X Content Options</CardTitle>
            <CardDescription className="text-zinc-400">
              Choose between a single post or a multi-post thread
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Content Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={xMode === 'post' ? 'default' : 'outline'}
                    onClick={() => setXMode('post')}
                    className={xMode === 'post' ? 'bg-lime-400 text-black hover:bg-lime-300' : 'border-white/10 text-zinc-400 hover:bg-white/5'}
                  >
                    Single Post
                  </Button>
                  <Button
                    variant={xMode === 'thread' ? 'default' : 'outline'}
                    onClick={() => setXMode('thread')}
                    className={xMode === 'thread' ? 'bg-lime-400 text-black hover:bg-lime-300' : 'border-white/10 text-zinc-400 hover:bg-white/5'}
                  >
                    Thread
                  </Button>
                </div>
              </div>
              
              {xMode === 'thread' && (
                <div className="space-y-2">
                  <Label htmlFor="threadCount" className="text-zinc-400">Number of Tweets</Label>
                  <Input
                    id="threadCount"
                    type="number"
                    min="2"
                    max="20"
                    value={threadCount}
                    onChange={(e) => setThreadCount(parseInt(e.target.value) || 5)}
                    placeholder="5"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-sm text-zinc-500">
                    Choose between 2-20 tweets for your thread. Recommended: 5-8 tweets.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowXOptions(false)} className="border-white/10 text-zinc-400 hover:bg-white/5">
                  Cancel
                </Button>
                <Button onClick={generateXContent} className="bg-lime-400 text-black hover:bg-lime-300 font-bold">
                  Generate {xMode === 'thread' ? 'Thread' : 'Post'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(generating || generatedContent) && (
        <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              {selectedType && <selectedType.icon className={`h-5 w-5 ${selectedType.color}`} />}
              <span>{selectedType?.name}</span>
            </CardTitle>
            <CardDescription className="text-zinc-400">Generated content based on your business analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {generating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
                <span className="ml-2 text-zinc-400">Generating content...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    rows={selectedType?.id === 'seo-blog' ? 30 : 8}
                    className="pr-12 min-h-[200px] bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-lime-400/50"
                    placeholder="Generated content will appear here..."
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-black/50 border-white/10 hover:bg-white/10 hover:text-white text-zinc-400"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
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
                          className="w-full bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/30"
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

                {contentWarning && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{contentWarning}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-2">
                    {marketingStyle && (
                      <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
                        {marketingStyle}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => generateContent(selectedType)} 
                      disabled={savingContent}
                      className="bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      Regenerate
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => void saveForLater()} 
                      disabled={savedForLater || savingContent}
                      className="bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      {savingContent && !showScheduleModal ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {savedForLater ? "Saved!" : savingContent && !showScheduleModal ? "Saving..." : "Save for Later"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowScheduleModal(true)}
                      disabled={savingContent}
                      className="bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 hover:text-amber-300"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button 
                      onClick={() => void saveToContentLibrary()} 
                      disabled={contentSaved || savingContent} 
                      className="bg-lime-500 text-black hover:bg-lime-400 font-bold"
                    >
                      {savingContent && !showScheduleModal && !savedForLater ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {contentSaved ? "Saved!" : savingContent ? "Saving..." : "Use Now"}
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
        <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center space-x-2 text-white">
                <BookOpen className="h-5 w-5 text-lime-400" />
                <span>Used Content Library</span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="text-sm font-medium text-zinc-400 whitespace-nowrap">Filters:</Label>
                  <select 
                    value={contentFilter} 
                    onChange={(e) => setContentFilter(e.target.value)}
                    className="px-3 py-2 border border-white/10 rounded-md text-sm bg-black/40 text-zinc-300 focus:ring-2 focus:ring-lime-500/50 focus:border-transparent outline-none"
                  >
                    <option value="all">All Platforms</option>
                    <option value="twitter-thread">X</option>
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
                  <Label className="text-sm font-medium text-zinc-400 whitespace-nowrap">Length:</Label>
                  <select 
                    value={lengthFilter} 
                    onChange={(e) => setLengthFilter(e.target.value)}
                    className="px-3 py-2 border border-white/10 rounded-md text-sm bg-black/40 text-zinc-300 focus:ring-2 focus:ring-lime-500/50 focus:border-transparent outline-none"
                  >
                    <option value="all">All Lengths</option>
                    <option value="short">Short (&lt;200 chars)</option>
                    <option value="long">Long (200+ chars)</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="text-sm font-medium text-zinc-400 whitespace-nowrap">Date:</Label>
                  <select 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-white/10 rounded-md text-sm bg-black/40 text-zinc-300 focus:ring-2 focus:ring-lime-500/50 focus:border-transparent outline-none"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="text-sm font-medium text-zinc-400 whitespace-nowrap">Sort by:</Label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'views' | 'likes')}
                    className="px-3 py-2 border border-white/10 rounded-md text-sm bg-black/40 text-zinc-300 focus:ring-2 focus:ring-lime-500/50 focus:border-transparent outline-none"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="views">Most Views</option>
                    <option value="likes">Most Likes</option>
                  </select>
                </div>
                <Badge variant="secondary" className="ml-2 bg-lime-400/10 text-lime-400 border-lime-400/20">{getFilteredAndSortedContent().length} items</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {getFilteredAndSortedContent().map((item) => (
                <div key={item.id} className="p-4 border border-white/5 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-white/10 text-zinc-300 hover:bg-white/20">{item.type}</Badge>
                      {item.marketingStyle && (
                        <Badge variant="outline" className="text-xs border-white/10 text-zinc-400">{item.marketingStyle}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-zinc-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteUsedContent(item.id)}
                        className="h-6 w-6 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className={`text-sm text-zinc-300 ${expandedContent[item.id] ? '' : 'line-clamp-2'}`}>
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
                        className="p-0 h-auto text-lime-400 hover:text-lime-300 text-xs mt-1"
                        onClick={() => setExpandedContent(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      >
                        {expandedContent[item.id] ? 'See Less' : 'See More'}
                      </Button>
                    )}
                  </div>
                  
                  {/* Analytics Section */}
                  <div className="bg-black/40 rounded-lg p-4 mb-3 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-zinc-300 flex items-center">
                        <div className="w-2 h-2 bg-lime-400 rounded-full mr-2 shadow-[0_0_5px_rgba(163,230,53,0.5)]"></div>
                        Performance Analytics
                      </h4>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startEditingAnalytics(item.id, item.analytics)}
                        className="h-7 px-3 text-xs bg-transparent hover:bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit Metrics
                      </Button>
                    </div>
                    
                    {editingAnalytics === item.id ? (
                      <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-400 flex items-center">
                              <Eye className="h-4 w-4 mr-2 text-blue-400" />
                              24h Views
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={analyticsForm.views24h}
                              onChange={(e) => setAnalyticsForm(prev => ({ ...prev, views24h: parseInt(e.target.value) || 0 }))}
                              className="h-10 text-sm bg-black/20 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                              placeholder="Enter views"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-400 flex items-center">
                              <Heart className="h-4 w-4 mr-2 text-red-400" />
                              24h Likes
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={analyticsForm.likes24h}
                              onChange={(e) => setAnalyticsForm(prev => ({ ...prev, likes24h: parseInt(e.target.value) || 0 }))}
                              className="h-10 text-sm bg-black/20 border-white/10 text-white focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                              placeholder="Enter likes"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-400 flex items-center">
                              <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                              All Time Views
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={analyticsForm.viewsAllTime}
                              onChange={(e) => setAnalyticsForm(prev => ({ ...prev, viewsAllTime: parseInt(e.target.value) || 0 }))}
                              className="h-10 text-sm bg-black/20 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                              placeholder="Enter total views"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-400 flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-2 text-red-500" />
                              All Time Likes
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={analyticsForm.likesAllTime}
                              onChange={(e) => setAnalyticsForm(prev => ({ ...prev, likesAllTime: parseInt(e.target.value) || 0 }))}
                              className="h-10 text-sm bg-black/20 border-white/10 text-white focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                              placeholder="Enter total likes"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={cancelEditingAnalytics}
                            className="h-9 px-4 text-sm border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white bg-transparent"
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
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 shadow-inner">
                          <div className="text-2xl font-bold text-blue-400">{item.analytics?.views24h || 0}</div>
                          <div className="text-xs text-zinc-500 mt-1">24h Views</div>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 shadow-inner">
                          <div className="text-2xl font-bold text-red-400">{item.analytics?.likes24h || 0}</div>
                          <div className="text-xs text-zinc-500 mt-1">24h Likes</div>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 shadow-inner">
                          <div className="text-2xl font-bold text-blue-500">{item.analytics?.viewsAllTime || 0}</div>
                          <div className="text-xs text-zinc-500 mt-1">Total Views</div>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 shadow-inner">
                          <div className="text-2xl font-bold text-red-500">{item.analytics?.likesAllTime || 0}</div>
                          <div className="text-xs text-zinc-500 mt-1">Total Likes</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-white/10 text-zinc-500">
                      {item.characterCount} chars
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
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
                <div className="text-center py-8 text-zinc-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No content found matching your filters.</p>
                  <p className="text-sm opacity-60">Try adjusting your platform or sort preferences.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-white/10 bg-zinc-900/95 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-400" />
                Schedule Content
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Choose when to publish this content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Schedule Options */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Tomorrow 9am', days: 1, hour: 9 },
                  { label: 'Tomorrow 12pm', days: 1, hour: 12 },
                  { label: 'In 2 days', days: 2, hour: 10 },
                  { label: 'In 3 days', days: 3, hour: 10 },
                  { label: 'Next Monday', days: ((8 - new Date().getDay()) % 7) || 7, hour: 9 },
                  { label: 'Next Friday', days: ((12 - new Date().getDay()) % 7) || 7, hour: 10 },
                ].map((option) => {
                  const date = new Date()
                  date.setDate(date.getDate() + option.days)
                  date.setHours(option.hour, 0, 0, 0)
                  const isSelected = scheduleDate?.getTime() === date.getTime()
                  return (
                    <Button
                      key={option.label}
                      variant="ghost"
                      className={`justify-start ${isSelected ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                      onClick={() => setScheduleDate(date)}
                    >
                      <Clock className="h-4 w-4 mr-2 text-zinc-500" />
                      {option.label}
                    </Button>
                  )
                })}
              </div>

              {/* Custom Date/Time */}
              <div className="space-y-2">
                <Label className="text-zinc-400 text-sm">Or pick a custom date & time</Label>
                <Input
                  type="datetime-local"
                  className="bg-black/40 border-white/10 text-zinc-300"
                  value={scheduleDate ? scheduleDate.toISOString().slice(0, 16) : ''}
                  onChange={(e) => setScheduleDate(e.target.value ? new Date(e.target.value) : null)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {scheduleDate && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Scheduled for: {scheduleDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                  disabled={savingContent}
                  onClick={() => {
                    setShowScheduleModal(false)
                    setScheduleDate(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-amber-500 text-black hover:bg-amber-400 font-bold"
                  disabled={!scheduleDate || savingContent}
                  onClick={() => void saveForLater(scheduleDate!)}
                >
                  {savingContent ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Calendar className="h-4 w-4 mr-2" />
                  )}
                  {savingContent ? "Scheduling..." : "Schedule"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
