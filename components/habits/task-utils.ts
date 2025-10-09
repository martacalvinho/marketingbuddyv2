import { FileText, Instagram, Linkedin, MessageSquare, Twitter, Video, Zap } from "lucide-react"

import type { HabitTask } from "./types"

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "content":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "analytics":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "community":
      return "bg-green-100 text-green-800 border-green-200"
    case "strategy":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "engagement":
      return "bg-pink-100 text-pink-800 border-pink-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const platformKeywords: Record<string, string[]> = {
  twitter: ["twitter", "tweet", "x.com"],
  linkedin: ["linkedin"],
  reddit: ["reddit", "subreddit"],
  instagram: ["instagram", "ig ", "insta"],
  tiktok: ["tiktok", "tik tok"],
  "build-in-public": ["build in public"],
  blog: ["blog", "article", "seo"],
}

export const detectPlatformId = (task: Partial<HabitTask> | null): string | null => {
  if (!task) return null
  const explicit = (task.platform || "").toLowerCase().trim()
  if (explicit) {
    return mapPlatformToGenerator(explicit)
  }

  const haystack = `${task.title || ""} ${task.description || ""}`.toLowerCase()
  const matched = Object.entries(platformKeywords).find(([, keywords]) =>
    keywords.some((keyword) => haystack.includes(keyword)),
  )

  return mapPlatformToGenerator(matched ? matched[0] : "")
}

const mapPlatformToGenerator = (platform: string): string | null => {
  switch (platform) {
    case "twitter":
      return "twitter-thread"
    case "linkedin":
      return "linkedin-post"
    case "reddit":
      return "reddit-post"
    case "instagram":
      return "instagram-post"
    case "tiktok":
      return "tiktok-script"
    case "build-in-public":
      return "build-in-public"
    case "blog":
      return "seo-blog"
    default:
      return null
  }
}

export const getPlatformIcon = (platformId: string): any => {
  switch (platformId) {
    case "twitter-thread":
      return Twitter
    case "linkedin-post":
      return Linkedin
    case "reddit-post":
      return MessageSquare
    case "instagram-post":
      return Instagram
    case "tiktok-script":
      return Video
    case "build-in-public":
      return Zap
    case "seo-blog":
      return FileText
    default:
      return null
  }
}
