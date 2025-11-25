"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Twitter, Linkedin, MessageSquare, Instagram, Video, FileText, Zap, Copy, Check, Loader2 } from "lucide-react"
import InstagramImageDisplay from "@/components/instagram-image-display"

interface ContentGeneratorProps {
  user: any
}

const contentTypes = [
  {
    id: "twitter-thread",
    name: "X Thread",
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
    description: "Short-form video script",
    color: "text-red-500",
  },
  {
    id: "build-in-public",
    name: "Build in Public Tweet",
    icon: Zap,
    description: "Share your journey",
    color: "text-yellow-500",
  },
  {
    id: "seo-blog",
    name: "SEO Blog Post",
    icon: FileText,
    description: "Search-optimized article",
    color: "text-green-500",
  },
]

export default function ContentGenerator({ user }: ContentGeneratorProps) {
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
    
    setGenerating(true)
    setGeneratedContent("")

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

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveToContentLibrary = () => {
    if (!generatedContent || !selectedType) return
    
    // Get existing content from localStorage
    const existingContent = JSON.parse(localStorage.getItem('contentLibrary') || '[]')
    
    // Create new content item
    const newContent = {
      id: Date.now().toString(),
      content: generatedContent,
      type: selectedType.name,
      platform: selectedType.id,
      marketingStyle,
      createdAt: new Date().toISOString(),
      status: 'draft',
      analytics: {
        views: 0,
        comments: 0,
        followers: 0,
        acquisitions: 0
      }
    }
    
    // Save to localStorage
    const updatedContent = [newContent, ...existingContent]
    localStorage.setItem('contentLibrary', JSON.stringify(updatedContent))
    
    setContentSaved(true)
    setTimeout(() => setContentSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Generator</CardTitle>
          <CardDescription>Choose the type of content you want to create</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentTypes.map((type) => {
              const Icon = type.icon
              return (
                <Card
                  key={type.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-indigo-200"
                  onClick={() => generateContent(type)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${type.color}`} />
                    <h3 className="font-medium text-sm mb-1">{type.name}</h3>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* SEO Keywords Selection */}
      {showKeywords && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-500" />
              <span>SEO Blog Post - Target Keywords</span>
            </CardTitle>
            <CardDescription>Review and edit the recommended target keywords for your blog post</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingKeywords ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-gray-600">Generating keywords...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keywords">Target Keywords</Label>
                  <Textarea
                    id="keywords"
                    value={selectedKeywords}
                    onChange={(e) => setSelectedKeywords(e.target.value)}
                    rows={3}
                    placeholder="Enter target keywords separated by commas"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    These keywords will be naturally integrated into your blog post for better SEO performance.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowKeywords(false)}>
                    Cancel
                  </Button>
                  <Button onClick={generateWithKeywords}>
                    Generate Blog Post
                  </Button>
                </div>
              </div>
            )}
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
                    rows={selectedType?.id === 'seo-blog' ? 20 : 8}
                    className="pr-12"
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
                  <InstagramImageDisplay
                    imageUrl={generatedImage}
                    imagePrompt={imagePrompt}
                    isGenerating={generatingImage}
                    onRegenerate={() => imagePrompt && generateImage(imagePrompt)}
                  />
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
    </div>
  )
}
