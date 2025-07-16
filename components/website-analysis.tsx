"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Target,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
  Zap,
  RefreshCw,
} from "lucide-react"

interface WebsiteAnalysisProps {
  analysis: any
  websiteUrl?: string
  onReAnalyze?: (url: string) => Promise<void>
}

export default function WebsiteAnalysis({ analysis, websiteUrl, onReAnalyze }: WebsiteAnalysisProps) {
  const [isReAnalyzing, setIsReAnalyzing] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleReAnalyze = async () => {
    if (!websiteUrl || !onReAnalyze) return
    setIsReAnalyzing(true)
    setStatus("idle")
    try {
      await onReAnalyze(websiteUrl)
      setStatus("success")
    } catch {
      setStatus("error")
    } finally {
      setIsReAnalyzing(false)
    }
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <TrendingUp className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Website Analysis Available</h3>
          <p className="text-gray-600">
            Add your website URL during onboarding to get detailed marketing insights and recommendations.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (analysis.error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-red-400 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Error</h3>
          <p className="text-gray-600 mb-4">{analysis.error}</p>
          {analysis.details && <p className="text-sm text-gray-500">{analysis.details}</p>}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 🔁 Re-analysis bar */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Current Analysis</CardTitle>
            <Button
              size="sm"
              variant="outline"
              disabled={isReAnalyzing}
              onClick={handleReAnalyze}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isReAnalyzing ? "animate-spin" : ""}`} />
              {isReAnalyzing ? "Re-analyzing…" : "Re-run analysis"}
            </Button>
          </div>
          {status === "success" && (
            <p className="text-sm text-green-600 mt-1">✅ Analysis updated.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 mt-1">⚠️ Could not re-analyze.</p>
          )}
        </CardHeader>
      </Card>

      {/* Business Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Business Overview</span>
          </CardTitle>
          <CardDescription>AI analysis of your product and market positioning</CardDescription>
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
                <Badge variant="outline" className="text-sm">
                  {analysis.businessOverview?.industry || "Not specified"}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Business Model</h4>
                <Badge variant="outline" className="text-sm">
                  {analysis.businessOverview?.businessModel || "Not specified"}
                </Badge>
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
          <CardDescription>Specific opportunities identified for your business</CardDescription>
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
                {opportunity.reasoning && <p className="text-xs text-blue-700 italic">Why: {opportunity.reasoning}</p>}
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
          <CardDescription>What you're already doing well</CardDescription>
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
          <CardDescription>Analysis of your current messaging and content strategy</CardDescription>
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
          <CardDescription>How you stack up in the market</CardDescription>
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
                  {(analysis.competitivePositioning?.improvements || []).map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 p-2 bg-orange-50 rounded">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-orange-800">{improvement}</span>
                    </li>
                  ))}
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
          <CardDescription>Specific steps you can take based on your website analysis</CardDescription>
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
    </div>
  )
}