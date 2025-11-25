"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Copy, Check } from "lucide-react"

interface InstagramImageDisplayProps {
  imageUrl: string | null
  imagePrompt: string | null
  isGenerating: boolean
  onRegenerate: () => void
}

export default function InstagramImageDisplay({ 
  imageUrl, 
  imagePrompt, 
  isGenerating, 
  onRegenerate 
}: InstagramImageDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyImageUrl = async () => {
    if (imageUrl) {
      await navigator.clipboard.writeText(imageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = 'instagram-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!imagePrompt && !imageUrl && !isGenerating) {
    return null
  }

  return (
    <Card className="mt-4 border-white/5 bg-black/20">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-zinc-300">Generated Image</h3>
            {imageUrl && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyImageUrl}
                  className="h-8 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                >
                  {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadImage}
                  className="h-8 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className="h-8 bg-pink-500/20 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30"
                >
                  Regenerate
                </Button>
              </div>
            )}
          </div>

          {imagePrompt && (
            <div className="text-xs text-zinc-400 bg-zinc-800/50 p-3 rounded border border-zinc-700">
              <strong className="text-pink-400">Image Prompt:</strong> {imagePrompt}
            </div>
          )}

          {isGenerating && (
            <div className="flex items-center justify-center py-8 text-zinc-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2 text-pink-400" />
              Generating image...
            </div>
          )}

          {imageUrl && !isGenerating && (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Generated Instagram content"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg border border-white/10"
                style={{ aspectRatio: '1/1', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
