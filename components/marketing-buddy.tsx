"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Trophy, MessageSquare, TrendingUp, Zap, Clock, Globe, CheckCircle2, Heart, Eye, ListChecks, BarChart3, Target } from "lucide-react"

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
            Action · Content · Accountability — preview how you'll check in on buddies, track progress, and keep momentum.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="opacity-90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Friendly Competition</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Compete with your buddy on daily tasks, content creation, and milestones.</p>
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

        <Card className="opacity-90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>Tips & Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Share strategies, get feedback on drafts, and discover new angles.</p>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">"Try focusing on customer pain points in your next post."</p>
                <p className="text-xs text-blue-600 mt-1">- Your Buddy</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-800">"Consider a quick case study tweet; great for engagement."</p>
                <p className="text-xs text-green-600 mt-1">- Your Buddy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Progress Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Track progress together and celebrate wins.</p>
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

        <Card className="opacity-90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span>Motivation & Accountability</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Preview reminders, challenges, and milestone celebrations.</p>
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

      {/* Accountability Preview: Check-ins UI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ListChecks className="h-5 w-5 text-indigo-600" />
            <span>Buddy Check-ins Preview</span>
          </CardTitle>
          <CardDescription>How you'll review your buddy's work and cheer them on</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h4 className="font-medium text-gray-900">Tasks</h4>
                </div>
                <Badge variant="outline">Today</Badge>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between bg-white rounded-md px-3 py-2 border">
                  <span>Publish launch tweet thread</span>
                  <Badge className="bg-emerald-100 text-emerald-800">done</Badge>
                </li>
                <li className="flex items-center justify-between bg-white rounded-md px-3 py-2 border">
                  <span>Update website hero copy</span>
                  <Badge variant="secondary">in progress</Badge>
                </li>
                <li className="flex items-center justify-between bg-white rounded-md px-3 py-2 border">
                  <span>DM 3 users for feedback</span>
                  <Badge variant="outline">queued</Badge>
                </li>
              </ul>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" disabled>Suggest task</Button>
                <Button size="sm" disabled>Send encouragement</Button>
              </div>
            </div>

            {/* Website Snapshot */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Website Snapshot</h4>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded-md border p-3">
                  <div className="text-xs text-gray-500">Visits (7d)</div>
                  <div className="font-semibold text-gray-900">1,240</div>
                </div>
                <div className="bg-white rounded-md border p-3">
                  <div className="text-xs text-gray-500">Signups (7d)</div>
                  <div className="font-semibold text-gray-900">42</div>
                </div>
                <div className="bg-white rounded-md border p-3">
                  <div className="text-xs text-gray-500">Conv. rate</div>
                  <div className="font-semibold text-gray-900">3.4%</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <BarChart3 className="h-4 w-4" />
                <span>Deep dive metrics and insights coming soon</span>
              </div>
            </div>

            {/* Milestones */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-rose-600" />
                <h4 className="font-medium text-gray-900">Progress & Milestones</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Reached first 10 users
                </li>
                <li className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  30-day streak
                </li>
                <li className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  $100 MRR
                </li>
              </ul>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" disabled>Recommend milestone</Button>
                <Button size="sm" disabled>Celebrate</Button>
              </div>
            </div>

            {/* Recent Content */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-5 w-5 text-indigo-600" />
                <h4 className="font-medium text-gray-900">Recent Content</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="bg-white rounded-md px-3 py-2 border flex items-center justify-between">
                  <div>
                    <div className="font-medium">LinkedIn post: "What I learned shipping v1"</div>
                    <div className="text-xs text-gray-600">Views 1.2k · Likes 54</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 px-2 py-1 text-xs" variant="outline" disabled>Suggest edit</Button>
                    <Button size="sm" className="h-7 px-2 py-1 text-xs" disabled>
                      <Heart className="h-3 w-3 mr-1" />
                      Encourage
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-md px-3 py-2 border flex items-center justify-between">
                  <div>
                    <div className="font-medium">Twitter thread: "3 lessons from early users"</div>
                    <div className="text-xs text-gray-600">Views 8.4k · Likes 210</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 px-2 py-1 text-xs" variant="outline" disabled>Suggest idea</Button>
                    <Button size="sm" className="h-7 px-2 py-1 text-xs" disabled>
                      <Heart className="h-3 w-3 mr-1" />
                      Kudos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
