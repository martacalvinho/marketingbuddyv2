"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Globe,
  ArrowRight,
  Building,
  Users,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  TrendingUp,
  MessageSquare,
  Zap,
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react"
import Link from "next/link"

export default function AnalyzePage() {
  const router = useRouter();
  const [website, setWebsite] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState("")
  const [analysisInfo, setAnalysisInfo] = useState(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!website.trim()) return

    setAnalyzing(true)
    setError("")
    setAnalysis(null)
    setAnalysisInfo(null)

    try {
      const response = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: website.trim() }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Analysis failed")
        return
      }

      // Extract analysis info
      setAnalysisInfo({
        url: data.url,
        contentLength: data.contentLength,
        extractedAt: data.extractedAt,
      })

      // Set the analysis data
      setAnalysis({
        businessOverview: data.businessOverview,
        marketingOpportunities: data.marketingOpportunities,
        marketingStrengths: data.marketingStrengths,
        contentMessagingAnalysis: data.contentMessagingAnalysis,
        competitivePositioning: data.competitivePositioning,
        actionableRecommendations: data.actionableRecommendations,
      })
    } catch (err) {
      setError("Failed to analyze website. Please try again.")
      console.error("Analysis error:", err)
    }

    setAnalyzing(false)
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const formatUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url
    }
    return url
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/landing" className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Marketing Buddy</span>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to App</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysis && !analyzing && (
          <div className="text-center mb-12">
            <Globe className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Website Analysis</h1>
            <p className="text-xl text-gray-600 mb-8">
              Get AI-powered insights into your marketing opportunities, strengths, and actionable recommendations.
            </p>

            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Analyze Your Website</CardTitle>
                <CardDescription>Enter your website URL to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => {
                        const formattedUrl = formatUrl(e.target.value)
                        setWebsite(formattedUrl)
                      }}
                      placeholder="https://yourwebsite.com"
                      required
                    />
                    {website && !validateUrl(website) && (
                      <p className="text-sm text-red-600 mt-1">Please enter a valid URL</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={analyzing || !validateUrl(website)}>
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Analyze Website
                      </>
                    )}
                  </Button>
                </form>

                {error && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tips for best results:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                      <li>Use your main website URL (not subpages)</li>
                      <li>Ensure your site has clear value propositions</li>
                      <li>Make sure your website loads quickly</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {analyzing && (
          <div className="text-center py-20">
            <Loader2 className="h-16 w-16 text-indigo-600 mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Your Website...</h2>
            <p className="text-gray-600 mb-4">This may take a few moments while we extract and analyze your content.</p>
            <div className="max-w-md mx-auto">
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Fetching website content with Jina AI</p>
                <p>✓ Extracting key information</p>
                <p>⏳ Analyzing marketing opportunities</p>
                <p>⏳ Generating recommendations</p>
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Website Analysis Complete! 🎉</h1>
              <p className="text-gray-600">Here's what we found about your website and marketing opportunities.</p>
              {analysisInfo && (
                <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
                  <span>📊 {analysisInfo.contentLength.toLocaleString()} characters analyzed</span>
                  <span>🕒 {new Date(analysisInfo.extractedAt).toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            {/* Business Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Business Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">What You Do</h4>
                    <p className="text-gray-700">{analysis.businessOverview?.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Industry</h4>
                      <Badge variant="outline">{analysis.businessOverview?.industry || "Not specified"}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Business Model</h4>
                      <Badge variant="outline">{analysis.businessOverview?.businessModel || "Not specified"}</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
                    <div className="flex flex-wrap gap-2">
                      {(analysis.businessOverview?.targetAudience || []).map((audience: string, index: number) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{audience}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Value Propositions</h4>
                    <ul className="space-y-2">
                      {(analysis.businessOverview?.valueProps || []).map((prop: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{prop}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Marketing Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analysis.marketingOpportunities || []).map((opportunity: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-blue-900">{opportunity.title}</h4>
                        <div className="flex space-x-1">
                          <Badge
                            variant={
                              opportunity.priority === "high"
                                ? "destructive"
                                : opportunity.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {opportunity.priority} priority
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {opportunity.effort} effort
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-blue-800 mb-2">{opportunity.description}</p>
                      {opportunity.reasoning && (
                        <p className="text-xs text-blue-700 italic">Why: {opportunity.reasoning}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Marketing Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Marketing Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(analysis.marketingStrengths || []).map((strength: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content & Messaging Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Content & Messaging Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Current Messaging</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                      {analysis.contentMessagingAnalysis?.currentMessaging || "No messaging analysis available"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tone of Voice</h4>
                    <Badge variant="outline">{analysis.contentMessagingAnalysis?.toneOfVoice || "Not analyzed"}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Messaging Gaps</h4>
                      <ul className="space-y-1">
                        {(analysis.contentMessagingAnalysis?.messagingGaps || []).map((gap: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertCircle className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Improvement Suggestions</h4>
                      <ul className="space-y-1">
                        {(analysis.contentMessagingAnalysis?.improvementSuggestions || []).map(
                          (suggestion: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <Zap className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{suggestion}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitive Positioning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Competitive Positioning</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Market Position</h4>
                    <p className="text-gray-700 text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                      {analysis.competitivePositioning?.marketPosition || "Market position analysis not available"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Unique Differentiators</h4>
                      <ul className="space-y-2">
                        {(analysis.competitivePositioning?.differentiators || []).map((diff: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">{diff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {(analysis.competitivePositioning?.improvements || []).map(
                          (improvement: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2 p-2 bg-orange-50 rounded">
                              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-orange-800">{improvement}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actionable Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Actionable Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analysis.actionableRecommendations || []).map((rec: any, index: number) => (
                    <div key={index} className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-indigo-900">{rec.title}</h4>
                        <div className="flex space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {rec.timeframe}
                          </Badge>
                          <Badge
                            variant={
                              rec.impact === "High" ? "destructive" : rec.impact === "Medium" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {rec.impact} impact
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-indigo-800 mb-3">{rec.description}</p>
                      {rec.implementation && (
                        <div className="bg-white p-3 rounded border">
                          <h5 className="text-xs font-medium text-gray-900 mb-1">How to implement:</h5>
                          <p className="text-xs text-gray-700">{rec.implementation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to turn these insights into action?</h2>
                <p className="text-indigo-100 mb-6">
                  Start your 30-day marketing journey with personalized daily tasks based on this analysis.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-3"
                  onClick={async () => {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("marketing-buddy-visited", "true")
                    }
                    // Retrieve existing user data
                    let userData = {}
                    if (typeof window !== "undefined") {
                      const stored = localStorage.getItem("marketing-buddy-user")
                      if (stored) {
                        try {
                          userData = JSON.parse(stored)
                        } catch {
                          userData = {}
                        }
                      }
                    }

                    // Attach website analysis so dashboard can render it
                    const payload = { ...userData, websiteAnalysis: analysis }

                    try {
                      const res = await fetch("/api/generate-plan", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      })
                      if (res.ok) {
                        const data = await res.json()
                        payload["plan"] = data.plan || "Plan generation in progress..."
                      }
                    } catch (e) {
                      console.error("Plan generation failed", e)
                    }

                    if (typeof window !== "undefined") {
                      localStorage.setItem("marketing-buddy-user", JSON.stringify(payload))
                      localStorage.setItem("marketing-buddy-visited", "true")
                    }
                    router.push("/")
                  }}
                >
                  Start Your 30-Day Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
