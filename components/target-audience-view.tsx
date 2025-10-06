"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, AlertCircle, Globe, DollarSign } from "lucide-react"

interface TargetAudienceViewProps {
  targetAudience: any
}

export default function TargetAudienceView({ targetAudience }: TargetAudienceViewProps) {
  if (!targetAudience) return null

  const ta = targetAudience

  return (
    <div className="space-y-6">
      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Demographics</span>
          </CardTitle>
          <CardDescription>Key demographic characteristics of your target audience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Age Range</h4>
                <Badge variant="outline">{ta.demographics?.ageRange || 'Not specified'}</Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Income Level</h4>
                <Badge variant="outline">{ta.demographics?.incomeLevel || 'Not specified'}</Badge>
              </div>
            </div>
            {ta.demographics?.companySize && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Company Size</h4>
                <Badge variant="outline">{ta.demographics.companySize}</Badge>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Locations</h4>
              <div className="flex flex-wrap gap-2">
                {(ta.demographics?.locations || []).map((location: string, i: number) => (
                  <Badge key={i} variant="secondary">{location}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Professions</h4>
              <div className="flex flex-wrap gap-2">
                {(ta.demographics?.professions || []).map((profession: string, i: number) => (
                  <Badge key={i} variant="secondary" className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{profession}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Psychographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Psychographics</span>
          </CardTitle>
          <CardDescription>Values, interests, and personality traits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Core Values</h4>
              <div className="flex flex-wrap gap-2">
                {(ta.psychographics?.values || []).map((value: string, i: number) => (
                  <Badge key={i} variant="default">{value}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {(ta.psychographics?.interests || []).map((interest: string, i: number) => (
                  <Badge key={i} variant="secondary">{interest}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Personality Traits</h4>
              <div className="flex flex-wrap gap-2">
                {(ta.psychographics?.personality || []).map((trait: string, i: number) => (
                  <Badge key={i} variant="outline">{trait}</Badge>
                ))}
              </div>
            </div>
            {ta.psychographics?.lifestyle && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Lifestyle</h4>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                  {ta.psychographics.lifestyle}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pain Points & Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Pain Points & Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pain Points</h4>
              <div className="space-y-2">
                {(ta.painPoints || []).map((p: string, i: number) => (
                  <div key={i} className="flex items-start space-x-2 p-2 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800 text-sm">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Goals</h4>
              <div className="space-y-2">
                {(ta.goals || []).map((g: string, i: number) => (
                  <div key={i} className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg">
                    <CheckIcon />
                    <span className="text-green-800 text-sm">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Online Presence & Purchasing Behavior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Online Presence</span>
            </CardTitle>
            <CardDescription>Where they spend time online</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(ta.onlinePresence || []).map((platform: string, i: number) => (
                <Badge key={i} variant="secondary">{platform}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Purchasing Behavior</span>
            </CardTitle>
            <CardDescription>How they make buying decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-1">Decision Factors</h5>
                <div className="flex flex-wrap gap-1">
                  {(ta.purchasingBehavior?.decisionFactors || []).map((f: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-1">Research Methods</h5>
                <div className="flex flex-wrap gap-1">
                  {(ta.purchasingBehavior?.researchMethods || []).map((m: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                  ))}
                </div>
              </div>
              {ta.purchasingBehavior?.buyingProcess && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Buying Process</h5>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{ta.purchasingBehavior.buyingProcess}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
  )
}
