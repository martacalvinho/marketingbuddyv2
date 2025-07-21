"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  DollarSign, 
  Eye, 
  MessageSquare, 
  Users, 
  BarChart3,
  Settings,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Target,
  Zap,
  Calendar,
  Lightbulb
} from "lucide-react"

interface MarketingAnalyticsProps {
  user: any
  compact?: boolean // For compact view in dashboard integration
}

interface ContentPost {
  type: string
  platform: string
  views: number
  engagement: number
}

interface AnalyticsData {
  date: string
  revenue: number
  views: number
  sales: number
  posts: number
  engagement: number
  strategy: string
  platform: string
  tasksCompleted: string[]
  contentPosted: ContentPost[]
  insights: string
}

const mockAnalyticsData: AnalyticsData[] = [
  {
    date: "2024-01-15",
    revenue: 120,
    views: 2500,
    sales: 3,
    posts: 2,
    engagement: 180,
    strategy: "Content Marketing",
    platform: "Twitter",
    tasksCompleted: ["Create Twitter thread", "Engage with community"],
    contentPosted: [
      { type: "Twitter Thread", platform: "Twitter", views: 1500, engagement: 120 },
      { type: "Quote Tweet", platform: "Twitter", views: 1000, engagement: 60 }
    ],
    insights: "Your Twitter thread about productivity got 1,500 views and drove 2 sales. Community engagement boosted overall reach."
  },
  {
    date: "2024-01-16",
    revenue: 85,
    views: 1800,
    sales: 2,
    posts: 1,
    engagement: 120,
    strategy: "Social Media",
    platform: "Instagram",
    tasksCompleted: ["Post Instagram story"],
    contentPosted: [
      { type: "Instagram Story", platform: "Instagram", views: 1800, engagement: 120 }
    ],
    insights: "Single Instagram story generated 1,800 views and 2 sales. Stories are converting well for your audience."
  },
  {
    date: "2024-01-17",
    revenue: 200,
    views: 3200,
    sales: 5,
    posts: 3,
    engagement: 250,
    strategy: "Video Content",
    platform: "TikTok",
    tasksCompleted: ["Create TikTok video", "Post on Instagram Reels", "Share on Twitter"],
    contentPosted: [
      { type: "TikTok Video", platform: "TikTok", views: 2000, engagement: 150 },
      { type: "Instagram Reel", platform: "Instagram", views: 800, engagement: 60 },
      { type: "Twitter Video", platform: "Twitter", views: 400, engagement: 40 }
    ],
    insights: "Your TikTok video went viral with 2,000 views! Cross-posting to Instagram and Twitter amplified reach and drove 5 sales."
  },
  {
    date: "2024-01-18",
    revenue: 150,
    views: 2800,
    sales: 4,
    posts: 2,
    engagement: 200,
    strategy: "Blog Content",
    platform: "Website",
    tasksCompleted: ["Write blog post", "Share on LinkedIn"],
    contentPosted: [
      { type: "Blog Post", platform: "Website", views: 2000, engagement: 150 },
      { type: "LinkedIn Post", platform: "LinkedIn", views: 800, engagement: 50 }
    ],
    insights: "Your blog post about marketing automation got 2,000 views. LinkedIn sharing brought professional audience and 4 B2B sales."
  },
  {
    date: "2024-01-19",
    revenue: 95,
    views: 2100,
    sales: 2,
    posts: 1,
    engagement: 140,
    strategy: "Email Marketing",
    platform: "Newsletter",
    tasksCompleted: ["Send newsletter"],
    contentPosted: [
      { type: "Newsletter", platform: "Email", views: 2100, engagement: 140 }
    ],
    insights: "Newsletter to 2,100 subscribers had great engagement (6.7% rate) and converted 2 loyal customers."
  }
]

export default function MarketingAnalytics({ user, compact = false }: MarketingAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>(mockAnalyticsData)
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [stripeConnected, setStripeConnected] = useState(false)
  const [websiteConnected, setWebsiteConnected] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [selectedDataPoint, setSelectedDataPoint] = useState<AnalyticsData | null>(null)
  const [activeMetric, setActiveMetric] = useState<'views' | 'revenue' | 'both'>('both')
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [showInsights, setShowInsights] = useState(true)

  const totalRevenue = analyticsData.reduce((sum, item) => sum + item.revenue, 0)
  const totalSales = analyticsData.reduce((sum, item) => sum + item.sales, 0)
  const totalViews = analyticsData.reduce((sum, item) => sum + item.views, 0)
  const totalPosts = analyticsData.reduce((sum, item) => sum + item.posts, 0)

  const conversionRate = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(2) : "0.00"
  const avgRevenuePerSale = totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : "0.00"

  const strategyPerformance = analyticsData.reduce((acc, item) => {
    if (!acc[item.strategy]) {
      acc[item.strategy] = { revenue: 0, sales: 0, views: 0, posts: 0 }
    }
    acc[item.strategy].revenue += item.revenue
    acc[item.strategy].sales += item.sales
    acc[item.strategy].views += item.views
    acc[item.strategy].posts += item.posts
    return acc
  }, {} as Record<string, { revenue: number; sales: number; views: number; posts: number }>)

  const bestStrategy = Object.entries(strategyPerformance).reduce((best, [strategy, data]) => {
    const roi = data.posts > 0 ? data.revenue / data.posts : 0
    return roi > (best.roi || 0) ? { strategy, roi, data } : best
  }, {} as any)

  // Compact view for dashboard integration
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">📊 Quick Analytics</CardTitle>
            <div className="flex items-center space-x-2">
              {!stripeConnected && (
                <Badge variant="secondary" className="text-xs">
                  Setup Required
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                Last 7 days
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!stripeConnected ? (
            <div className="text-center py-6">
              <div className="mb-4">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Connect integrations to see analytics</p>
              </div>
              <Button onClick={() => setShowSetup(true)} size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Setup Analytics
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${totalRevenue}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalSales}</div>
                  <div className="text-xs text-gray-500">Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{conversionRate}%</div>
                  <div className="text-xs text-gray-500">Conversion</div>
                </div>
              </div>
              
              {bestStrategy.strategy && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800 text-sm">
                      Best Strategy: {bestStrategy.strategy}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    ${bestStrategy.roi?.toFixed(0)} revenue per post
                  </p>
                </div>
              )}
              
              {/* Content Performance Insights */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800 text-sm">Content Insights</span>
                </div>
                <p className="text-xs text-blue-700">
                  Your {analyticsData[analyticsData.length - 1]?.platform || 'social media'} content is performing well. 
                  {analyticsData[analyticsData.length - 1]?.insights || 'Keep posting consistently for best results.'}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Marketing Analytics
          </h2>
          <p className="text-gray-600 mt-1">Track your marketing performance and optimize for growth</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowInsights(!showInsights)} variant="outline" size="sm">
            <Lightbulb className="h-4 w-4 mr-2" />
            {showInsights ? 'Hide' : 'Show'} Insights
          </Button>
          <Button onClick={() => setShowSetup(!showSetup)} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Setup
          </Button>
        </div>
      </div>

      {/* Setup Panel */}
      {showSetup && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Setup</CardTitle>
            <CardDescription>
              Connect your tools to get comprehensive analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Stripe Integration</h3>
                  <Badge variant={stripeConnected ? "default" : "secondary"}>
                    {stripeConnected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Track revenue and sales data from your Stripe account
                </p>
                <Button 
                  size="sm" 
                  variant={stripeConnected ? "outline" : "default"}
                  onClick={() => setStripeConnected(!stripeConnected)}
                >
                  {stripeConnected ? "Disconnect" : "Connect Stripe"}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Website Analytics</h3>
                  <Badge variant={websiteConnected ? "default" : "secondary"}>
                    {websiteConnected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Connect Google Analytics or similar for website traffic data
                </p>
                <Button 
                  size="sm" 
                  variant={websiteConnected ? "outline" : "default"}
                  onClick={() => setWebsiteConnected(!websiteConnected)}
                >
                  {websiteConnected ? "Disconnect" : "Connect Analytics"}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
            <p className="text-xs text-gray-500">Last {selectedTimeframe}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Sales</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            <p className="text-xs text-gray-500">Avg ${avgRevenuePerSale} per sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Total Views</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{conversionRate}% conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Content Posts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
            <p className="text-xs text-gray-500">Across all platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Performance</CardTitle>
          <CardDescription>
            See which marketing strategies are driving the most revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(strategyPerformance).map(([strategy, data]) => {
              const roi = data.posts > 0 ? (data.revenue / data.posts).toFixed(2) : "0.00"
              const isTop = strategy === bestStrategy.strategy
              
              return (
                <div key={strategy} className={`p-4 border rounded-lg ${isTop ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{strategy}</h3>
                      {isTop && <Badge className="bg-green-500">Top Performer</Badge>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${data.revenue} revenue</p>
                      <p className="text-xs text-gray-500">${roi} per post</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Posts:</span> {data.posts}
                    </div>
                    <div>
                      <span className="text-gray-600">Views:</span> {data.views.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-600">Sales:</span> {data.sales}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Impact Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span>Marketing Impact Tracker</span>
              </CardTitle>
              <CardDescription>
                Click data points to see how your daily tasks drive views and revenue
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveMetric('views')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    activeMetric === 'views' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Views
                </button>
                <button
                  onClick={() => setActiveMetric('revenue')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    activeMetric === 'revenue' ? 'bg-green-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setActiveMetric('both')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    activeMetric === 'both' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Both
                </button>
              </div>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7d</SelectItem>
                  <SelectItem value="30d">30d</SelectItem>
                  <SelectItem value="90d">90d</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
            {/* Interactive Chart */}
            <div className="grid grid-cols-5 gap-4 h-full">
              {analyticsData.map((item, index) => {
                const maxViews = Math.max(...analyticsData.map(d => d.views))
                const maxRevenue = Math.max(...analyticsData.map(d => d.revenue))
                const viewsHeight = (item.views / maxViews) * 60
                const revenueHeight = (item.revenue / maxRevenue) * 60
                const isSelected = selectedDataPoint?.date === item.date
                const isHovered = hoveredPoint === index
                
                return (
                  <div key={index} className="flex flex-col items-center justify-end h-full relative">
                    {/* Date Label */}
                    <div className="absolute -bottom-8 text-xs text-gray-500 transform -rotate-45 origin-left">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    
                    {/* Content Posts Indicator */}
                    <div className="mb-2 flex space-x-1">
                      {[...Array(item.posts)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-orange-400 rounded-full" />
                      ))}
                    </div>
                    
                    {/* Interactive Data Bars */}
                    <div 
                      className="flex space-x-2 items-end cursor-pointer"
                      onClick={() => setSelectedDataPoint(item)}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      {/* Views Bar */}
                      {(activeMetric === 'views' || activeMetric === 'both') && (
                        <div
                          className={`w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:shadow-lg ${
                            isSelected ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                          } ${isHovered ? 'scale-110' : ''}`}
                          style={{ height: `${Math.max(viewsHeight, 8)}px` }}
                        />
                      )}
                      
                      {/* Revenue Bar */}
                      {(activeMetric === 'revenue' || activeMetric === 'both') && (
                        <div
                          className={`w-6 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-300 hover:shadow-lg ${
                            isSelected ? 'ring-2 ring-green-600 ring-offset-2' : ''
                          } ${isHovered ? 'scale-110' : ''}`}
                          style={{ height: `${Math.max(revenueHeight, 8)}px` }}
                        />
                      )}
                    </div>
                    
                    {/* Hover/Selected Info */}
                    {(isHovered || isSelected) && (
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 border z-10 min-w-32">
                        <div className="text-xs font-medium text-gray-900 mb-1">
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-blue-600">Views:</span>
                            <span className="font-medium">{item.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600">Sales:</span>
                            <span className="font-medium">{item.sales}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-orange-600">Posts:</span>
                            <span className="font-medium">{item.posts}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Click for details
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border">
              <div className="text-xs font-medium text-gray-900 mb-2">Legend</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded"></div>
                  <span>Views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-t from-green-500 to-green-400 rounded"></div>
                  <span>Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Content Posts</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected Data Point Details */}
          {selectedDataPoint && (
            <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-indigo-900 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(selectedDataPoint.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </h4>
                <button 
                  onClick={() => setSelectedDataPoint(null)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  ✕ Close
                </button>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">{selectedDataPoint.views.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600">{selectedDataPoint.sales}</div>
                  <div className="text-sm text-gray-600">Sales Made</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-purple-600">${selectedDataPoint.revenue}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-orange-600">{selectedDataPoint.posts}</div>
                  <div className="text-sm text-gray-600">Posts Created</div>
                </div>
              </div>

              {/* Daily Tasks Completed */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Daily Tasks Completed</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedDataPoint.tasksCompleted.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Posted Breakdown */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span>Content Posted & Performance</span>
                </h5>
                <div className="space-y-3">
                  {selectedDataPoint.contentPosted.map((content, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{content.type}</span>
                          <span className="text-xs text-gray-500">on {content.platform}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {content.views.toLocaleString()} views
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>👀 {content.views.toLocaleString()} views</span>
                        <span>❤️ {content.engagement} engagements</span>
                        <span>📈 {((content.engagement / content.views) * 100).toFixed(1)}% rate</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h5 className="text-sm font-semibold text-purple-900 mb-2 flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>AI Insights</span>
                </h5>
                <p className="text-sm text-purple-800">{selectedDataPoint.insights}</p>
                <div className="mt-3 flex items-center space-x-4 text-xs text-purple-600">
                  <span>💰 ${(selectedDataPoint.revenue / selectedDataPoint.posts).toFixed(2)} per post</span>
                  <span>👁️ {Math.round(selectedDataPoint.views / selectedDataPoint.posts)} views per post</span>
                  <span>🎯 {((selectedDataPoint.sales / selectedDataPoint.views) * 100).toFixed(2)}% conversion</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      {bestStrategy.strategy && (
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>
              Recommendations based on your marketing performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">🎯 Top Strategy</p>
                <p className="text-sm text-blue-800">
                  <strong>{bestStrategy.strategy}</strong> is your best performing strategy with ${bestStrategy.roi.toFixed(2)} revenue per post. 
                  Consider doubling down on this approach.
                </p>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">💡 Recommendation</p>
                <p className="text-sm text-yellow-800">
                  Your conversion rate is {conversionRate}%. Focus on improving your call-to-action and landing page to increase conversions.
                </p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">🚀 Next Steps</p>
                <p className="text-sm text-green-800">
                  You're on track for your first $1k MRR! Keep posting consistently and consider expanding your {bestStrategy.strategy.toLowerCase()} efforts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
