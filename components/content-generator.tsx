"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Twitter, Linkedin, MessageSquare, Instagram, Video, FileText, Zap, Copy, Check, Loader2, CheckCircle2, Circle } from "lucide-react"
import InstagramImageDisplay from "@/components/instagram-image-display"

interface ContentGeneratorProps {
  user: any
  dailyTasks?: any[]
  onTaskUpdate?: () => void
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
]

export default function ContentGenerator({ user, dailyTasks = [], onTaskUpdate }: ContentGeneratorProps) {
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

  const saveToContentLibrary = () => {
    if (generatedContent && selectedType) {
      const newContent = {
        id: Date.now(),
        type: selectedType.name,
        platform: selectedType.id,
        content: generatedContent,
        image: generatedImage,
        marketingStyle: marketingStyle,
        createdAt: new Date().toISOString(),
        characterCount: generatedContent.length
      }
      setUsedContent(prev => [newContent, ...prev])
      setContentSaved(true)
      setTimeout(() => setContentSaved(false), 2000)
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentTypes.map((type) => {
              const isDisabled = contentMode === 'daily-habit' && !selectedDailyTask
              return (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-shadow border-2 ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed border-gray-200' 
                      : 'hover:shadow-md hover:border-indigo-200'
                  }`}
                  onClick={() => !isDisabled && generateContent(type)}
                >
                  <CardContent className="p-4 text-center">
                    <type.icon className={`h-8 w-8 mx-auto mb-2 ${isDisabled ? 'text-gray-400' : type.color}`} />
                    <h3 className="font-medium text-sm mb-1">{type.name}</h3>
                    <p className="text-xs text-gray-500">{type.description}</p>
                    {contentMode === 'daily-habit' && selectedDailyTask && (
                      <Badge className="mt-2 text-xs" variant="secondary">
                        For: {selectedDailyTask.title.substring(0, 20)}...
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
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
      
      {/* Content Used Section */}
      {usedContent.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">📚 Content Used</CardTitle>
              <div className="flex items-center space-x-2">
                <select 
                  value={contentFilter} 
                  onChange={(e) => setContentFilter(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-md bg-white"
                >
                  <option value="all">All Platforms</option>
                  <option value="twitter-thread">Twitter</option>
                  <option value="linkedin-post">LinkedIn</option>
                  <option value="instagram-post">Instagram</option>
                  <option value="reddit-post">Reddit</option>
                  <option value="seo-blog">SEO Blog</option>
                </select>
                <Badge variant="outline">{usedContent.length} items</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {usedContent
                .filter(item => contentFilter === 'all' || item.platform === contentFilter)
                .map((item) => (
                <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      {item.marketingStyle && (
                        <Badge variant="outline" className="text-xs">{item.marketingStyle}</Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {item.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between mt-3">
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
