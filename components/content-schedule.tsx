"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { 
  Twitter, 
  Linkedin, 
  MessageSquare, 
  Instagram, 
  Video, 
  FileText, 
  Zap, 
  Rocket, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Send,
  RefreshCw
} from "lucide-react"

interface ContentItem {
  id: string
  title: string
  content_text: string
  platform: string
  content_type: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  scheduled_for: string | null
  published_at: string | null
  created_at: string
  metadata: any
}

interface ContentScheduleProps {
  user: any
  onContentUpdate?: () => void
}

// Platform icon mapping
const platformIcons: Record<string, any> = {
  x: Twitter,
  twitter: Twitter,
  linkedin: Linkedin,
  reddit: MessageSquare,
  instagram: Instagram,
  tiktok: Video,
  blog: FileText,
  producthunt: Rocket,
  indiehackers: BookOpen,
}

const platformColors: Record<string, string> = {
  x: "bg-blue-500",
  twitter: "bg-blue-500",
  linkedin: "bg-blue-700",
  reddit: "bg-orange-500",
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  tiktok: "bg-black",
  blog: "bg-green-600",
  producthunt: "bg-orange-600",
  indiehackers: "bg-indigo-600",
}

const platformBgColors: Record<string, string> = {
  x: "bg-blue-500/10 border-blue-500/20",
  twitter: "bg-blue-500/10 border-blue-500/20",
  linkedin: "bg-blue-700/10 border-blue-700/20",
  reddit: "bg-orange-500/10 border-orange-500/20",
  instagram: "bg-pink-500/10 border-pink-500/20",
  tiktok: "bg-zinc-500/10 border-zinc-500/20",
  blog: "bg-green-500/10 border-green-500/20",
  producthunt: "bg-orange-500/10 border-orange-500/20",
  indiehackers: "bg-indigo-500/10 border-indigo-500/20",
}

export interface ContentScheduleRef {
  refresh: () => Promise<void>
}

const ContentSchedule = forwardRef<ContentScheduleRef, ContentScheduleProps>(({ user, onContentUpdate }, ref) => {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [activeTab, setActiveTab] = useState<'schedule' | 'drafts' | 'published'>('schedule')

  // Get week dates
  const getWeekDates = (offset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + (offset * 7))
    
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates(weekOffset)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Load content from Supabase
  const loadContent = async () => {
    if (!user?.id) {
      console.log('ContentSchedule: No user ID, skipping load')
      return
    }
    
    setLoading(true)
    try {
      console.log('ContentSchedule: Loading content for user:', user.id)
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('ContentSchedule: Supabase error:', error)
        throw error
      }
      console.log('ContentSchedule: Loaded content items:', data?.length || 0, data)
      setContent(data || [])
    } catch (e) {
      console.error('Failed to load content:', e)
    }
    setLoading(false)
  }

  // Expose refresh function via ref
  useImperativeHandle(ref, () => ({
    refresh: loadContent
  }))

  useEffect(() => {
    loadContent()
  }, [user?.id])

  // Get content for a specific date
  const getContentForDate = (date: Date) => {
    return content.filter(item => {
      if (item.status === 'scheduled' && item.scheduled_for) {
        const scheduledDate = new Date(item.scheduled_for)
        return scheduledDate.toDateString() === date.toDateString()
      }
      if (item.status === 'published' && item.published_at) {
        const publishedDate = new Date(item.published_at)
        return publishedDate.toDateString() === date.toDateString()
      }
      return false
    })
  }

  // Filter content by status
  const drafts = content.filter(c => c.status === 'draft')
  const scheduled = content.filter(c => c.status === 'scheduled')
  const published = content.filter(c => c.status === 'published')
  
  console.log('ContentSchedule: Filtered counts -', { 
    total: content.length, 
    drafts: drafts.length, 
    scheduled: scheduled.length, 
    published: published.length 
  })

  // Mark content as published
  const markAsPublished = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .update({ 
          status: 'published', 
          published_at: new Date().toISOString() 
        })
        .eq('id', contentId)

      if (error) throw error
      
      setContent(prev => prev.map(c => 
        c.id === contentId 
          ? { ...c, status: 'published' as const, published_at: new Date().toISOString() }
          : c
      ))
      setSelectedContent(null)
      onContentUpdate?.()
    } catch (e) {
      console.error('Failed to update content:', e)
    }
  }

  // Delete content
  const deleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId)

      if (error) throw error
      
      setContent(prev => prev.filter(c => c.id !== contentId))
      setSelectedContent(null)
      onContentUpdate?.()
    } catch (e) {
      console.error('Failed to delete content:', e)
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-black/20 rounded-lg border border-white/5 w-fit">
        {[
          { id: 'schedule', label: 'Schedule', count: scheduled.length },
          { id: 'drafts', label: 'Drafts', count: drafts.length },
          { id: 'published', label: 'Published', count: published.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-lime-400 text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                activeTab === tab.id 
                  ? 'bg-black/20 text-black' 
                  : 'bg-white/10 text-zinc-400'
              }`}
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Weekly Calendar View */}
      {activeTab === 'schedule' && (
        <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-lime-400" />
                Content Schedule
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWeekOffset(prev => prev - 1)}
                  className="text-zinc-400 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWeekOffset(0)}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWeekOffset(prev => prev + 1)}
                  className="text-zinc-400 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-zinc-500 text-sm">
              {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, idx) => {
                const dayContent = getContentForDate(date)
                const today = isToday(date)
                const past = isPast(date)
                
                return (
                  <div
                    key={idx}
                    className={`min-h-[120px] rounded-lg border p-2 transition-all ${
                      today 
                        ? 'border-lime-400/50 bg-lime-400/5' 
                        : past
                          ? 'border-white/5 bg-black/20 opacity-60'
                          : 'border-white/5 bg-black/20 hover:border-white/10'
                    }`}
                  >
                    <div className="text-center mb-2">
                      <div className={`text-xs font-medium ${today ? 'text-lime-400' : 'text-zinc-500'}`}>
                        {dayNames[idx]}
                      </div>
                      <div className={`text-lg font-bold ${today ? 'text-lime-400' : 'text-white'}`}>
                        {date.getDate()}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {dayContent.map(item => {
                        const Icon = platformIcons[item.platform] || FileText
                        const bgColor = platformBgColors[item.platform] || 'bg-zinc-500/10 border-zinc-500/20'
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedContent(item)}
                            className={`w-full p-1.5 rounded border ${bgColor} flex items-center gap-1.5 hover:scale-105 transition-transform`}
                          >
                            <div className={`h-5 w-5 rounded flex items-center justify-center ${platformColors[item.platform] || 'bg-zinc-600'}`}>
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-[10px] text-zinc-300 truncate flex-1 text-left">
                              {item.title?.slice(0, 15) || item.platform}
                            </span>
                            {item.status === 'published' && (
                              <CheckCircle2 className="h-3 w-3 text-green-400" />
                            )}
                          </button>
                        )
                      })}
                      
                      {dayContent.length === 0 && !past && (
                        <div className="text-center py-2">
                          <div className="text-zinc-600 text-[10px]">No content</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drafts List */}
      {activeTab === 'drafts' && (
        <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-zinc-400" />
              Saved Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {drafts.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No drafts saved yet.</p>
                <p className="text-sm opacity-60">Generate content and save it for later!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.map(item => {
                  const Icon = platformIcons[item.platform] || FileText
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border border-white/5 bg-white/5 hover:bg-white/[0.07] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${platformColors[item.platform] || 'bg-zinc-600'}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{item.title || 'Untitled'}</h4>
                            <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
                              {item.content_text?.slice(0, 100)}...
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs border-white/10 text-zinc-500">
                                {item.platform}
                              </Badge>
                              <span className="text-xs text-zinc-600">
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedContent(item)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteContent(item.id)}
                            className="text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Published List */}
      {activeTab === 'published' && (
        <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Published Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {published.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No published content yet.</p>
                <p className="text-sm opacity-60">Mark content as published to track it here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {published.map(item => {
                  const Icon = platformIcons[item.platform] || FileText
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border border-green-500/10 bg-green-500/5 hover:bg-green-500/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${platformColors[item.platform] || 'bg-zinc-600'}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{item.title || 'Untitled'}</h4>
                            <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
                              {item.content_text?.slice(0, 100)}...
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs border-green-500/20 text-green-400">
                                Published
                              </Badge>
                              <span className="text-xs text-zinc-600">
                                {item.published_at && new Date(item.published_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedContent(item)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-white/10 bg-zinc-900/95 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = platformIcons[selectedContent.platform] || FileText
                    return (
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${platformColors[selectedContent.platform] || 'bg-zinc-600'}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    )
                  })()}
                  <div>
                    <CardTitle className="text-white">{selectedContent.title || 'Untitled'}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          selectedContent.status === 'published' 
                            ? 'border-green-500/20 text-green-400'
                            : selectedContent.status === 'scheduled'
                              ? 'border-amber-500/20 text-amber-400'
                              : 'border-white/10 text-zinc-400'
                        }`}
                      >
                        {selectedContent.status}
                      </Badge>
                      <span className="text-xs text-zinc-500">{selectedContent.platform}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContent(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="bg-black/40 rounded-lg p-4 border border-white/5 mb-4">
                <p className="text-zinc-300 whitespace-pre-wrap text-sm">
                  {selectedContent.content_text}
                </p>
              </div>

              {selectedContent.scheduled_for && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Scheduled for: {new Date(selectedContent.scheduled_for).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {selectedContent.status !== 'published' && (
                  <Button
                    onClick={() => markAsPublished(selectedContent.id)}
                    className="bg-green-600 text-white hover:bg-green-500"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Published
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedContent.content_text)
                  }}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                >
                  Copy Content
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => deleteContent(selectedContent.id)}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
})

ContentSchedule.displayName = 'ContentSchedule'

export default ContentSchedule
