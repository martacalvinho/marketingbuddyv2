"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Trophy, MessageSquare, TrendingUp, Zap, Clock } from "lucide-react"

interface MarketingBuddyProps {
  user: any
}

export default function MarketingBuddy({ user }: MarketingBuddyProps) {
  return (
    <div className="space-y-6">
      {/* Coming Soon Header */}
      <Card className="border-2 border-dashed border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="h-6 w-6 text-indigo-600" />
            <CardTitle className="text-2xl text-indigo-900">Marketing Accountability Buddy</CardTitle>
          </div>
          <Badge variant="secondary" className="mx-auto bg-indigo-100 text-indigo-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
          <CardDescription className="text-lg text-gray-700 mt-4">
            Get paired with a marketing buddy to compete, share tips, and stay motivated on your marketing journey!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Friendly Competition</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Compete with your buddy on daily task completion, content creation, and marketing milestones.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Daily Tasks Completed</span>
                <Badge variant="outline">3/3 vs 2/3</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Content Created This Week</span>
                <Badge variant="outline">5 vs 3</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Current Streak</span>
                <Badge variant="outline">7 days vs 5 days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>Tips & Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Share marketing strategies, get feedback on content, and discover new angles for your campaigns.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">
                  "Try focusing on customer pain points in your next post - it really boosted my engagement!"
                </p>
                <p className="text-xs text-blue-600 mt-1">- Your Marketing Buddy</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-800">
                  "Have you considered using user-generated content? It's working great for similar products."
                </p>
                <p className="text-xs text-green-600 mt-1">- Your Marketing Buddy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Progress Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Track your marketing progress together and celebrate wins as a team.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Weekly Goal Achievement</span>
                <div className="flex space-x-2">
                  <Badge className="bg-green-100 text-green-800">85%</Badge>
                  <span className="text-xs text-gray-500">vs 72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Content Engagement Rate</span>
                <div className="flex space-x-2">
                  <Badge className="bg-blue-100 text-blue-800">4.2%</Badge>
                  <span className="text-xs text-gray-500">vs 3.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span>Motivation & Accountability</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Stay motivated with regular check-ins, shared challenges, and mutual accountability.
            </p>
            <div className="space-y-2">
              <div className="p-2 bg-purple-50 rounded flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Daily check-in reminders</span>
              </div>
              <div className="p-2 bg-purple-50 rounded flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Weekly challenge competitions</span>
              </div>
              <div className="p-2 bg-purple-50 rounded flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Milestone celebrations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Waitlist CTA */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Be the First to Know!</h3>
          <p className="mb-6 opacity-90">
            Join our waitlist to get early access to the Marketing Accountability Buddy feature.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-white text-indigo-600 hover:bg-gray-100"
            disabled
          >
            Join Waitlist (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
