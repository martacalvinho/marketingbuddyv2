import { NextRequest, NextResponse } from 'next/server'

// Industry-specific directories and communities
const INDUSTRY_RESOURCES: Record<string, { directories: string[], subreddits: string[], communities: string[] }> = {
  // Crypto/Web3/Blockchain
  crypto: {
    directories: ['Product Hunt', 'CoinMarketCap', 'CoinGecko', 'DappRadar', 'State of the Dapps', 'Crypto Twitter lists', 'DefiLlama', 'CryptoCompare'],
    subreddits: ['CryptoCurrency', 'Bitcoin', 'ethereum', 'CryptoMarkets', 'defi', 'NFT', 'web3', 'CryptoTechnology', 'altcoin', 'CryptoMoonShots'],
    communities: ['Crypto Twitter', 'Discord servers (Bankless, DeFi Pulse)', 'Telegram groups', 'Farcaster', 'Lens Protocol']
  },
  web3: {
    directories: ['Product Hunt', 'DappRadar', 'State of the Dapps', 'Web3 Jobs', 'BuildSpace', 'DefiLlama'],
    subreddits: ['web3', 'ethereum', 'defi', 'NFT', 'CryptoCurrency', 'ethdev', 'solana'],
    communities: ['Crypto Twitter', 'Farcaster', 'Lens Protocol', 'Discord (Bankless, Developer DAO)', 'Telegram']
  },
  blockchain: {
    directories: ['Product Hunt', 'DappRadar', 'CoinMarketCap', 'CoinGecko', 'Blockchain.com', 'CryptoCompare'],
    subreddits: ['CryptoCurrency', 'Bitcoin', 'ethereum', 'blockchain', 'CryptoTechnology', 'btc'],
    communities: ['Crypto Twitter', 'BitcoinTalk', 'Telegram groups', 'Discord servers']
  },
  
  // SaaS/Software
  saas: {
    directories: ['Product Hunt', 'BetaList', 'Alternativeto.net', 'SaaSHub', 'Startupstash', 'G2', 'Capterra', 'GetApp', 'Uneed.best', 'MicroLaunch'],
    subreddits: ['SaaS', 'startups', 'Entrepreneur', 'IndieHackers', 'SideProject', 'microsaas', 'growthhacking', 'IMadeThis'],
    communities: ['Indie Hackers', 'Product Hunt', 'Hacker News', 'Twitter #buildinpublic', 'LinkedIn groups']
  },
  software: {
    directories: ['Product Hunt', 'Alternativeto.net', 'GitHub', 'SourceForge', 'Slant', 'AlternativeTo'],
    subreddits: ['programming', 'coding', 'webdev', 'SideProject', 'IMadeThis', 'opensource'],
    communities: ['GitHub Discussions', 'Dev.to', 'Hashnode', 'Stack Overflow', 'Hacker News']
  },
  
  // AI/ML
  ai: {
    directories: ['Product Hunt', 'Theresanaiforthat.com', 'Futuretools.io', 'AI Valley', 'TopAI.tools', 'AIToolHunt', 'Futurepedia'],
    subreddits: ['artificial', 'MachineLearning', 'OpenAI', 'ChatGPT', 'StableDiffusion', 'LocalLLaMA', 'ArtificialIntelligence'],
    communities: ['AI Twitter', 'Hugging Face', 'Papers with Code', 'Discord (OpenAI, Midjourney)', 'LinkedIn AI groups']
  },
  
  // E-commerce/Retail (Digital Products/Apps)
  ecommerce: {
    directories: ['Shopify App Store', 'WooCommerce Extensions', 'BigCommerce Apps', 'Product Hunt', 'Capterra'],
    subreddits: ['ecommerce', 'shopify', 'Entrepreneur', 'smallbusiness', 'dropship', 'FulfillmentByAmazon'],
    communities: ['Shopify Community', 'Facebook Groups (Ecom)', 'Twitter #ecommerce', 'LinkedIn Ecommerce groups']
  },
  
  // Handmade/Craft/Jewelry
  handmade: {
    directories: ['Etsy', 'Instagram Shop', 'Pinterest Shopping', 'Facebook Marketplace', 'Local craft fairs', 'Artisan markets'],
    subreddits: ['jewelry', 'Etsy', 'crafts', 'handmade', 'ArtisanGifts', 'somethingimade', 'craftymerchants'],
    communities: ['Instagram (jewelry hashtags)', 'Pinterest boards', 'TikTok #jewelrytok', 'Facebook Groups (handmade sellers)', 'Local craft communities']
  },
  
  // Physical Retail/Local Business
  retail: {
    directories: ['Google My Business', 'Yelp', 'Local directories', 'Instagram Shop', 'Facebook Marketplace'],
    subreddits: ['smallbusiness', 'Entrepreneur', 'retailporn', 'boutique', 'localbusiness'],
    communities: ['Local Facebook Groups', 'Instagram local hashtags', 'Nextdoor', 'Chamber of Commerce', 'Local business associations']
  },
  
  // Marketing/Agency
  marketing: {
    directories: ['Product Hunt', 'G2', 'Capterra', 'MarTech', 'BuiltWith', 'Stackshare'],
    subreddits: ['marketing', 'digital_marketing', 'socialmedia', 'SEO', 'PPC', 'content_marketing', 'growthhacking'],
    communities: ['GrowthHackers', 'Inbound.org', 'Marketing Twitter', 'LinkedIn Marketing groups', 'Facebook Marketing groups']
  },
  
  // Developer Tools
  devtools: {
    directories: ['Product Hunt', 'GitHub', 'DevHunt', 'StackShare', 'Slant', 'AlternativeTo', 'Console.dev'],
    subreddits: ['programming', 'webdev', 'devops', 'coding', 'javascript', 'python', 'golang'],
    communities: ['Hacker News', 'Dev.to', 'Hashnode', 'GitHub Discussions', 'Discord (dev communities)', 'Stack Overflow']
  },
  
  // Default/General
  general: {
    directories: ['Product Hunt', 'BetaList', 'Hacker News', 'Indie Hackers', 'Reddit', 'Twitter'],
    subreddits: ['startups', 'Entrepreneur', 'SideProject', 'SmallBusiness', 'IMadeThis', 'alphaandbetausers'],
    communities: ['Indie Hackers', 'Product Hunt', 'Hacker News', 'Twitter #buildinpublic', 'LinkedIn']
  }
}

// Helper: Get industry-specific resources
function getIndustryResources(industry: string): { directories: string[], subreddits: string[], communities: string[] } {
  const normalized = (industry || '').toLowerCase().trim()
  
  // Check for crypto/web3/blockchain keywords
  if (normalized.includes('crypto') || normalized.includes('web3') || normalized.includes('blockchain') || 
      normalized.includes('defi') || normalized.includes('nft') || normalized.includes('token')) {
    return INDUSTRY_RESOURCES.crypto
  }
  
  // Check for AI/ML keywords
  if (normalized.includes('ai') || normalized.includes('artificial intelligence') || 
      normalized.includes('machine learning') || normalized.includes('ml') || normalized.includes('llm')) {
    return INDUSTRY_RESOURCES.ai
  }
  
  // Check for SaaS keywords
  if (normalized.includes('saas') || normalized.includes('software as a service') || 
      normalized.includes('b2b software') || normalized.includes('enterprise software')) {
    return INDUSTRY_RESOURCES.saas
  }
  
  // Check for developer tools
  if (normalized.includes('developer') || normalized.includes('devtool') || normalized.includes('api') || 
      normalized.includes('sdk') || normalized.includes('framework') || normalized.includes('library')) {
    return INDUSTRY_RESOURCES.devtools
  }
  
  // Check for handmade/craft/jewelry
  if (normalized.includes('jewelry') || normalized.includes('jewellery') || 
      normalized.includes('handmade') || normalized.includes('craft') || 
      normalized.includes('artisan') || normalized.includes('etsy') || 
      normalized.includes('handcrafted') || normalized.includes('accessories')) {
    return INDUSTRY_RESOURCES.handmade
  }
  
  // Check for physical retail/local business
  if (normalized.includes('retail') || normalized.includes('boutique') || 
      normalized.includes('local business') || normalized.includes('brick and mortar') || 
      normalized.includes('physical store') || normalized.includes('shop') && !normalized.includes('online')) {
    return INDUSTRY_RESOURCES.retail
  }
  
  // Check for ecommerce (digital/online only)
  if (normalized.includes('ecommerce') || normalized.includes('e-commerce') || 
      normalized.includes('online store') || normalized.includes('dropship')) {
    return INDUSTRY_RESOURCES.ecommerce
  }
  
  // Check for marketing
  if (normalized.includes('marketing') || normalized.includes('agency') || 
      normalized.includes('advertising') || normalized.includes('martech')) {
    return INDUSTRY_RESOURCES.marketing
  }
  
  // Default to general
  return INDUSTRY_RESOURCES.general
}

// Helper: Get monthly theme based on strategy mode
function getMonthlyTheme(day: number, strategyMode?: string): string {
  const month = Math.ceil(day / 30)
  
  // Default strategy: Foundation → Content/Community cycle (for 0-50 user stage)
  if (!strategyMode || strategyMode === 'foundation_content_community') {
    if (month === 1) return "Month 1: Foundation & Platform Setup"
    // After Month 1, alternate between Content and Community
    const cycle = ((month - 2) % 2) + 2 // Cycles between 2 and 3
    return cycle === 2 
      ? `Month ${month}: Content Creation & Consistency` 
      : `Month ${month}: Community Building & Engagement`
  }
  
  // Advanced modes (opt-in only, gated by user count)
  if (strategyMode === 'growth_acceleration') {
    return `Month ${month}: Growth Acceleration (50-200 users) - Channel optimization, referral systems, paid experiments`
  }
  if (strategyMode === 'scale_systems') {
    return `Month ${month}: Scale & Systems (200-500 users) - Automation, analytics, team processes`
  }
  if (strategyMode === 'revenue_focus') {
    return `Month ${month}: Revenue Focus (500-1000 users) - Conversion optimization, pricing, upsells`
  }
  
  // Fallback
  return `Month ${month}: Content & Community`
}

type StageDefinition = { limit: number; label: string }

const NUMERIC_SANITIZER = /[^0-9.-]+/g
const USER_STAGE_DEFINITIONS: StageDefinition[] = [
  { limit: 0, label: 'Pre-launch: no active users yet - focus on validation, audience insight, and awareness.' },
  { limit: 10, label: 'Validation: 1-10 users - prioritise direct outreach, interviews, and proof of value.' },
  { limit: 50, label: 'Early traction: 10-50 users - build repeatable acquisition loops and onboarding.' },
  { limit: 200, label: 'Growth: 50-200 users - double down on working channels and conversion mechanics.' },
  { limit: Infinity, label: 'Scaling: 200+ users - optimise systems, referrals, and leverage.' },
]
const REVENUE_STAGE_DEFINITIONS: StageDefinition[] = [
  { limit: 0, label: 'Pre-revenue: $0 MRR - focus on first paying customers and monetisation proof.' },
  { limit: 100, label: 'First revenue: <$100 MRR - run scrappy sales loops and tighten conversion paths.' },
  { limit: 500, label: 'Early revenue: $100-$500 MRR - reinforce repeatable acquisition and upgrades.' },
  { limit: 2000, label: 'Growth revenue: $500-$2k MRR - scale high-performing channels and retention.' },
  { limit: Infinity, label: 'Scaling revenue: $2k+ MRR - optimise funnels, LTV, and expansion.' },
]

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function parseMetric(value: unknown): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const parsed = Number(trimmed.replace(NUMERIC_SANITIZER, ''))
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function describeStage(value: number | null, definitions: StageDefinition[], fallback: string): string {
  if (value === null) return fallback
  const metric = Math.max(0, value)
  for (const definition of definitions) {
    if (metric <= definition.limit) {
      return definition.label
    }
  }
  return definitions[definitions.length - 1]?.label ?? fallback
}

function formatUsersMetric(value: number | null): string {
  if (value === null) return 'Not provided'
  const rounded = Math.max(0, Math.round(value))
  return `${rounded} user${rounded === 1 ? '' : 's'}`
}

function formatMrrMetric(value: number | null): string {
  if (value === null) return 'Not provided'
  const rounded = Math.max(0, Math.round(value))
  return `${USD_FORMATTER.format(rounded)} MRR`
}

function safeString(value: unknown, fallback = 'Not provided'): string {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? trimmed : fallback
  }
  const converted = String(value)
  return converted.trim() ? converted.trim() : fallback
}

function formatList(value: unknown, fallback = 'Not provided', delimiter = ', '): string {
  if (Array.isArray(value)) {
    const filtered = value.map((item) => safeString(item, '')).filter((item) => item.length > 0)
    return filtered.length > 0 ? filtered.join(delimiter) : fallback
  }
  if (typeof value === 'string') return safeString(value, fallback)
  return fallback
}

function summariseTargetAudience(audience: any): string {
  if (!audience) return 'Not provided'
  if (Array.isArray(audience)) {
    return formatList(audience, 'Not provided')
  }
  if (typeof audience === 'string') {
    const trimmed = audience.trim()
    return trimmed || 'Not provided'
  }
  if (typeof audience === 'object') {
    const parts: string[] = []
    const demographics = audience.demographics ?? {}
    if (Array.isArray(demographics.professions) && demographics.professions.length > 0) {
      parts.push(`Professions: ${demographics.professions.slice(0, 3).join(', ')}`)
    }
    if (Array.isArray(demographics.locations) && demographics.locations.length > 0) {
      parts.push(`Locations: ${demographics.locations.slice(0, 3).join(', ')}`)
    }
    if (Array.isArray(audience.painPoints) && audience.painPoints.length > 0) {
      parts.push(`Pain points: ${audience.painPoints.slice(0, 2).join('; ')}`)
    }
    if (Array.isArray(audience.goals) && audience.goals.length > 0) {
      parts.push(`Goals: ${audience.goals.slice(0, 2).join('; ')}`)
    }
    if (Array.isArray(audience.psychographics?.interests) && audience.psychographics.interests.length > 0) {
      parts.push(`Interests: ${audience.psychographics.interests.slice(0, 3).join(', ')}`)
    }
    if (parts.length > 0) {
      return parts.join(' | ')
    }
    try {
      const serialised = JSON.stringify(audience)
      return serialised.length > 280 ? `${serialised.slice(0, 277)}...` : serialised
    } catch {
      return 'Not provided'
    }
  }
  return safeString(audience, 'Not provided')
}

type FallbackContext = {
  industry?: string
  targetAudienceSummary?: string
  productName?: string
  valueProp?: string
  goalType?: string
  goalAmount?: string
  userStageSummary?: string
  revenueStageSummary?: string
  monthlyTheme?: string
  challengeSummary?: string
  strategyMode?: string
  goalMetric?: string
}

type StageGroup = 'prelaunch' | 'validation' | 'traction' | 'growth' | 'scale'
type RevenueGroup = 'pre' | 'first' | 'growth' | 'scale'

function normaliseContextValue(value: unknown, fallback: string): string {
  const raw = safeString(value, fallback)
  const lowered = raw.toLowerCase()
  if (lowered === 'not provided' || lowered === 'none specified' || lowered === 'not specified' || lowered === 'n/a') {
    return fallback
  }
  return raw
}

function deriveStageGroup(summary?: string): StageGroup {
  const text = (summary || '').toLowerCase()
  if (text.includes('pre-launch') || text.includes('prelaunch') || text.includes('no active users')) return 'prelaunch'
  if (text.includes('validation') || text.includes('1-10 users')) return 'validation'
  if (text.includes('early traction') || text.includes('10-50 users')) return 'traction'
  if (text.includes('growth') || text.includes('repeatable acquisition') || text.includes('50-200 users')) return 'growth'
  if (text.includes('scaling') || text.includes('200+ users')) return 'scale'
  return 'validation'
}

function deriveRevenueGroup(summary?: string): RevenueGroup {
  const text = (summary || '').toLowerCase()
  if (!text || text.includes('pre-revenue') || text.includes('$0 mrr')) return 'pre'
  if (text.includes('<$100 mrr') || text.includes('first revenue')) return 'first'
  if (text.includes('$100-$500 mrr') || text.includes('growth revenue') || text.includes('$500-$2k mrr')) return 'growth'
  if (text.includes('$2k+ mrr') || text.includes('scaling revenue') || text.includes('ltv')) return 'scale'
  return 'first'
}

export async function POST(request: NextRequest) {
  try {
    const { 
      user, 
      day, 
      month, 
      weekInMonth, 
      monthStrategy,
      focusArea,
      dailyTaskCount,
      websiteAnalysis,
      targetAudience,
      contextSignals,
      excludeTitles 
    } = await request.json()

    // Extract website improvement tasks from analysis if focus includes website
    let websiteTasks: any[] = []
    if ((focusArea === 'website' || focusArea === 'both') && websiteAnalysis?.actionableRecommendations) {
      websiteTasks = websiteAnalysis.actionableRecommendations.map((rec: any, index: number) => ({
        id: `website-${day}-${index}`,
        title: rec.title,
        description: rec.description,
        implementation: rec.implementation,
        category: 'website',
        priority: rec.impact === 'High' ? 'high' : rec.impact === 'Medium' ? 'medium' : 'low',
        timeframe: rec.timeframe,
        impact: rec.impact,
        xp: rec.impact === 'High' ? 20 : rec.impact === 'Medium' ? 15 : 10,
        estimatedTime: rec.timeframe === 'This week' ? '30 min' : rec.timeframe === 'Next week' ? '45 min' : '60 min',
        type: 'website-improvement'
      }))
    }

    const taskCount = parseInt(dailyTaskCount) || 3
    // Reserve slots for website tasks only when focus is strictly 'website'.
    const websiteTasksToInclude = focusArea === 'website'
      ? Math.min(websiteTasks.length, taskCount)
      : (focusArea === 'both' ? Math.min(websiteTasks.length, Math.ceil(taskCount / 2)) : 0)
    const marketingTasksTarget = Math.max(0, taskCount - websiteTasksToInclude)

    // Distribute website tasks across days to avoid repeating the same set
    const rotate = <T,>(arr: T[], start: number) => (arr.length ? [...arr.slice(start), ...arr.slice(0, start)] : arr)
    const startIndex = websiteTasks.length ? (((day - 1) * Math.max(1, websiteTasksToInclude)) % websiteTasks.length) : 0
    const rotatedWebsiteTasks = rotate(websiteTasks, startIndex)
    // For mixed focus, prefer high-priority website tasks first, then the rest
    const highPriorityRotated = rotatedWebsiteTasks.filter((t: any) => (t.priority || '').toLowerCase() === 'high')
    const lowPriorityRotated = rotatedWebsiteTasks.filter((t: any) => (t.priority || '').toLowerCase() !== 'high')
    const highCount = Math.min(Math.ceil(websiteTasksToInclude / 2), highPriorityRotated.length)
    const websiteHighForDay = highPriorityRotated.slice(0, highCount)
    const websiteRemainingForDay = lowPriorityRotated.slice(0, Math.max(0, websiteTasksToInclude - highCount))
    const websiteForDay = rotatedWebsiteTasks.slice(0, websiteTasksToInclude)

    // Generate marketing tasks based on user profile
    // Summarize optional context signals for better adaptation
    const recentTasks = Array.isArray(contextSignals?.recentTasks) ? contextSignals.recentTasks : []
    const completedRecent = recentTasks.filter((t: any) => (t?.status || '').toLowerCase() === 'completed')
    const categoryCounts: Record<string, number> = {}
    completedRecent.forEach((t: any) => {
      const c = (t?.category || 'strategy').toString().toLowerCase()
      categoryCounts[c] = (categoryCounts[c] || 0) + 1
    })
    const contentRows = Array.isArray(contextSignals?.content) ? contextSignals.content : []
    const topContent = contentRows.slice(0, 5).map((c: any) => ({
      views: c?.engagement_metrics?.viewsAllTime ?? c?.engagement_metrics?.views ?? 0,
      likes: c?.engagement_metrics?.likesAllTime ?? c?.engagement_metrics?.likes ?? 0
    }))
    const weeklyFeedback = contextSignals?.weeklyFeedback || null

    // Calculate channel scores (simple engagement per post)
    const channelScores: Record<string, { posts: number; totalViews: number; totalLikes: number; avgEngagement: number }> = {}
    contentRows.forEach((c: any) => {
      const platform = (c?.platform || 'unknown').toLowerCase()
      if (!channelScores[platform]) channelScores[platform] = { posts: 0, totalViews: 0, totalLikes: 0, avgEngagement: 0 }
      channelScores[platform].posts += 1
      channelScores[platform].totalViews += (c?.engagement_metrics?.viewsAllTime ?? c?.engagement_metrics?.views ?? 0)
      channelScores[platform].totalLikes += (c?.engagement_metrics?.likesAllTime ?? c?.engagement_metrics?.likes ?? 0)
    })
    Object.keys(channelScores).forEach(platform => {
      const s = channelScores[platform]
      s.avgEngagement = s.posts > 0 ? (s.totalViews + s.totalLikes * 10) / s.posts : 0
    })
    const rankedChannels = Object.entries(channelScores)
      .sort(([, a], [, b]) => b.avgEngagement - a.avgEngagement)
      .map(([platform, stats]) => `${platform} (${stats.posts} posts, avg engagement: ${Math.round(stats.avgEngagement)})`)
      .slice(0, 3)

    // Calculate skip patterns
    const skipPatterns: Record<string, number> = {}
    recentTasks.forEach((t: any) => {
      if (t?.status === 'skipped') {
        const platform = (t?.platform || 'unknown').toLowerCase()
        skipPatterns[platform] = (skipPatterns[platform] || 0) + 1
      }
    })
    const avoidChannels = Object.entries(skipPatterns)
      .filter(([, count]) => count >= 3)
      .map(([platform]) => platform)

    const contextBlock = `\n\nADAPTIVE CONTEXT (Day ${day}):\n- Completed tasks last 2 weeks: ${completedRecent.length}\n- Categories done: ${Object.keys(categoryCounts).length > 0 ? Object.entries(categoryCounts).map(([k,v])=>`${k}:${v}`).join(', ') : 'n/a'}\n- Channel performance (ranked): ${rankedChannels.join(' > ') || 'No data yet'}\n- Channels to avoid (3+ skips): ${avoidChannels.join(', ') || 'None'}\n- Weekly feedback: ${weeklyFeedback ? (typeof weeklyFeedback === 'string' ? weeklyFeedback.slice(0,180) : JSON.stringify(weeklyFeedback).slice(0,180)) : 'n/a'}\n\n**STRATEGY: Use 2 tasks on top-performing channels (exploit) + 1 task exploring new channel/format (explore).**`

    // Determine platform preferences
    const preferred = Array.isArray(user?.preferredPlatforms) ? user.preferredPlatforms.map((p: string) => String(p).toLowerCase()) : []
    const avoidList = new Set<string>([...(Array.isArray(contextSignals?.avoidPlatforms) ? contextSignals.avoidPlatforms : [] as string[])].map((p: string) => p.toLowerCase()))
    // If user specified preferred platforms, strongly constrain suggestions to them
    const allowedNote = preferred.length > 0 ? `✅ ONLY USE THESE PLATFORMS: ${preferred.join(', ').toUpperCase()}` : ''
    const disallowedPlatforms = preferred.length > 0 
      ? ['linkedin','instagram','tiktok','twitter','x','blog','indie hackers','youtube','medium','substack','discord','facebook groups', 'facebook', 'email']
          .filter(p => !preferred.includes(p))
          .concat(Array.from(avoidList))
          .filter((v, i, a) => a.indexOf(v) === i)
      : Array.from(avoidList)
    const disallowedNote = disallowedPlatforms.length > 0 ? `❌ NEVER USE THESE PLATFORMS: ${disallowedPlatforms.join(', ').toUpperCase()}` : ''

    const currentUsersMetric = parseMetric(user?.currentUsers ?? user?.current_users)
    const currentMrrMetric = parseMetric(user?.currentMrr ?? user?.current_mrr)
    const formattedUsers = formatUsersMetric(currentUsersMetric)
    const formattedMrr = formatMrrMetric(currentMrrMetric)
    const userStageSummary = describeStage(currentUsersMetric, USER_STAGE_DEFINITIONS, 'No user data provided - assume pre-launch validation focus.')
    const revenueStageSummary = describeStage(currentMrrMetric, REVENUE_STAGE_DEFINITIONS, 'No revenue data provided - assume pre-revenue focus on first conversions.')
    const targetAudienceSummary = summariseTargetAudience(user?.targetAudience || websiteAnalysis?.businessOverview?.targetAudience)
    const websiteSummary = safeString(websiteAnalysis?.businessOverview?.summary, 'Not provided')
    const websiteIndustry = safeString(websiteAnalysis?.businessOverview?.industry, 'Not specified')
    const websiteBusinessModel = safeString(websiteAnalysis?.businessOverview?.businessModel, 'Not specified')
    const websiteValueProps = formatList(websiteAnalysis?.businessOverview?.valueProps?.slice(0, 3), 'Not specified')
    const websiteAudienceFromAnalysis = formatList(websiteAnalysis?.businessOverview?.targetAudience, 'Not specified')
    const strengthsSummary = formatList(websiteAnalysis?.marketingStrengths?.slice(0, 3), 'Not specified')
    
    // Extract full opportunity details with ALL fields
    const topOpportunities = (websiteAnalysis?.marketingOpportunities || []).slice(0, 5)
    const topOpportunitiesSummary = topOpportunities.length > 0 
      ? topOpportunities.map((o: any, i: number) => {
          const parts = [`${i + 1}. **${o.title}**`]
          if (o.description) parts.push(`\n   Description: ${o.description}`)
          if (o.reasoning) parts.push(`\n   Why this works: ${o.reasoning}`)
          if (o.channels?.length) parts.push(`\n   Channels: ${o.channels.join(', ')}`)
          if (o.priority) parts.push(`\n   Priority: ${o.priority}`)
          if (o.effort) parts.push(`\n   Effort: ${o.effort}`)
          return parts.join('')
        }).join('\n\n')
      : 'Not specified'
    
    // Extract actionable recommendations with full implementation details
    const actionableRecs = (websiteAnalysis?.actionableRecommendations || []).slice(0, 5)
    const actionableRecsSummary = actionableRecs.length > 0
      ? actionableRecs.map((rec: any, i: number) => {
          const parts = [`${i + 1}. **${rec.title}**`]
          if (rec.description) parts.push(`\n   Task: ${rec.description}`)
          if (rec.implementation) parts.push(`\n   How to execute: ${rec.implementation}`)
          if (rec.timeframe) parts.push(`\n   Timeframe: ${rec.timeframe}`)
          if (rec.impact) parts.push(`\n   Impact: ${rec.impact}`)
          return parts.join('')
        }).join('\n\n')
      : 'Not specified'
    
    // Extract messaging gaps and improvements
    const messagingGaps = websiteAnalysis?.contentMessagingAnalysis?.messagingGaps || []
    const messagingImprovements = websiteAnalysis?.contentMessagingAnalysis?.improvementSuggestions || []
    const messagingInsights = [...messagingGaps, ...messagingImprovements].slice(0, 4).join('; ')
    
    // Extract competitive differentiators
    const differentiators = websiteAnalysis?.competitivePositioning?.differentiators || []
    const competitiveImprovements = websiteAnalysis?.competitivePositioning?.improvements || []
    const competitiveInsights = [...differentiators.map((d: string) => `Strength: ${d}`), ...competitiveImprovements.map((i: string) => `Improve: ${i}`)].slice(0, 4).join('; ')
    const preferredPlatformsSummary = formatList(user?.preferredPlatforms, 'None specified')
    const focusAreaSummary = safeString(focusArea, 'growth')
    const challengeSummary = safeString(user?.challenges, 'None specified')
    const goalAmountDisplay = safeString(user?.goalAmount, 'No amount set')
    const goalTypeRaw = safeString(user?.goalType, '')
    const goalTimelineDisplay = safeString(user?.goalTimeline, 'unspecified')
    const goalTypeDisplay = goalTypeRaw === '' || goalTypeRaw === 'Not provided' ? 'goal metric' : goalTypeRaw
    const northStarDisplay = safeString(user?.northStarGoal, 'Not provided')
    const experienceLevelDisplay = safeString(user?.experienceLevel, 'Not provided')
    const productNameDisplay = safeString(user?.productName, 'Product')
    const productValueProp = safeString(user?.valueProp, 'Not provided')
    const websiteUrlDisplay = safeString(user?.website, 'Not provided')
    const strategyModeDisplay = safeString(user?.strategyMode, 'foundation_content_community')
    const launchDateDisplay = safeString(user?.launchDate, 'Not provided')
    const monthlyTheme = getMonthlyTheme(day, user?.strategyMode || 'foundation_content_community')
    const platformNotes = [allowedNote, disallowedNote].filter(Boolean).join('\n')
    const goalMetric = goalTypeDisplay.toLowerCase().includes('mrr') || goalTypeDisplay.toLowerCase().includes('revenue') ? 'MRR' : 'users'
    
    // Get marketing channel research from website analysis (AI-researched channels)
    const channelResearch = websiteAnalysis?.marketingChannelResearch
    let industryDirectories = ''
    let industrySubreddits = ''
    let industryCommunities = ''
    let recommendedPlatforms = ''
    let contentStrategy = ''
    let avoidPlatformsNote = ''
    
    if (channelResearch) {
      // Use AI-researched channels from website analysis
      industryDirectories = channelResearch.directories?.map((d: any) => `${d.name} (${d.reasoning})`).join(', ') || 'Not specified'
      industrySubreddits = channelResearch.communities?.filter((c: any) => c.platform?.toLowerCase().includes('reddit')).map((c: any) => `${c.name} (${c.reasoning})`).join(', ') || 'Not specified'
      industryCommunities = channelResearch.communities?.map((c: any) => `${c.name} on ${c.platform} (${c.reasoning})`).join(', ') || 'Not specified'
      recommendedPlatforms = channelResearch.recommendedPlatforms?.map((p: any) => `${p.platform} (Priority: ${p.priority}, Content: ${p.contentType}, Why: ${p.reasoning})`).join(' | ') || 'Not specified'
      contentStrategy = channelResearch.contentStrategy || 'Not specified'
      avoidPlatformsNote = channelResearch.avoidPlatforms?.length > 0 ? `\nPLATFORMS TO AVOID: ${channelResearch.avoidPlatforms.join(', ')}` : ''
    } else {
      // Fallback to hard-coded industry resources if no channel research
      const industryResources = getIndustryResources(websiteIndustry)
      industryDirectories = industryResources.directories.join(', ')
      industrySubreddits = industryResources.subreddits.map((s: string) => `r/${s}`).join(', ')
      industryCommunities = industryResources.communities.join(', ')
      recommendedPlatforms = 'Use industry-standard platforms'
      contentStrategy = 'Create content appropriate for the industry'
    }
    const fallbackContext: FallbackContext = {
      industry: websiteIndustry,
      targetAudienceSummary,
      productName: productNameDisplay,
      valueProp: productValueProp,
      goalType: goalTypeDisplay,
      goalAmount: goalAmountDisplay,
      userStageSummary,
      revenueStageSummary,
      monthlyTheme,
      challengeSummary,
      strategyMode: strategyModeDisplay,
      goalMetric
    }

    // Extract detailed target audience info if available
    const targetAudienceData = targetAudience || user?.targetAudience
    let audienceDeepDive = ''
    if (targetAudienceData && typeof targetAudienceData === 'object') {
      const parts: string[] = []
      if (targetAudienceData.demographics) {
        const demo = targetAudienceData.demographics
        if (demo.professions?.length) parts.push(`Professions: ${demo.professions.slice(0, 3).join(', ')}`)
        if (demo.ageRange) parts.push(`Age: ${demo.ageRange}`)
        if (demo.locations?.length) parts.push(`Locations: ${demo.locations.slice(0, 3).join(', ')}`)
      }
      if (targetAudienceData.painPoints?.length) {
        parts.push(`Pain Points: ${targetAudienceData.painPoints.slice(0, 3).join('; ')}`)
      }
      if (targetAudienceData.goals?.length) {
        parts.push(`Goals/Aspirations: ${targetAudienceData.goals.slice(0, 3).join('; ')}`)
      }
      if (targetAudienceData.psychographics) {
        const psycho = targetAudienceData.psychographics
        if (psycho.interests?.length) parts.push(`Interests: ${psycho.interests.slice(0, 4).join(', ')}`)
        if (psycho.values?.length) parts.push(`Values: ${psycho.values.slice(0, 3).join(', ')}`)
        if (psycho.behaviors?.length) parts.push(`Behaviors: ${psycho.behaviors.slice(0, 3).join('; ')}`)
      }
      if (targetAudienceData.whereTheyHangOut?.length) {
        parts.push(`Where They Hang Out: ${targetAudienceData.whereTheyHangOut.slice(0, 4).join(', ')}`)
      }
      if (parts.length > 0) {
        audienceDeepDive = `\n\nTARGET AUDIENCE DEEP DIVE (Use these specifics in every task):\n${parts.map(p => `- ${p}`).join('\n')}`
      }
    }

    const marketingPrompt = `You are generating Day ${day} marketing tasks for a real business. Use the context below to create SPECIFIC, ACTIONABLE tasks (not templates or placeholders).

BUSINESS SNAPSHOT:
- Product: ${productNameDisplay}
- Website: ${websiteUrlDisplay}
- Value Proposition: ${productValueProp}
- Target Audience Insight: ${targetAudienceSummary}
- Primary Goal: ${goalAmountDisplay} ${goalTypeDisplay} in ${goalTimelineDisplay} months
- North Star Goal: ${northStarDisplay}
- Experience Level: ${experienceLevelDisplay}
- Focus Area: ${focusAreaSummary}
- Key Challenge Shared: ${challengeSummary}${audienceDeepDive}

STARTUP TYPE & POSITIONING:
- Website Summary: ${websiteSummary}
- Industry / Category: ${websiteIndustry}
- Business Model / Startup Type: ${websiteBusinessModel}
- Differentiators / Value Props from Site: ${websiteValueProps}
- Audience cues from site: ${websiteAudienceFromAnalysis}
- Strengths to leverage: ${strengthsSummary}

WEBSITE ANALYSIS INSIGHTS (Use these to create hyper-specific tasks):
**Top Marketing Opportunities:**
${topOpportunitiesSummary}

**Actionable Recommendations from Analysis:**
${actionableRecsSummary}

**Messaging Gaps & Improvements:**
${messagingInsights || 'Not specified'}

**Competitive Positioning:**
${competitiveInsights || 'Not specified'}

TRACTION & STAGE:
- Current Users: ${formattedUsers}
- Current MRR: ${formattedMrr}
- User Traction Stage: ${userStageSummary}
- Revenue Stage: ${revenueStageSummary}
- Preferred / Active Platforms: ${preferredPlatformsSummary}
- Launch Date: ${launchDateDisplay}
- Strategy Mode: ${strategyModeDisplay}

${contextBlock}

MARKETING CHANNEL RESEARCH (Based on ${websiteIndustry} industry analysis):
- **Recommended Platforms:** ${recommendedPlatforms}
- **Content Strategy:** ${contentStrategy}
- **Directories to List On:** ${industryDirectories}
- **Subreddits to Engage:** ${industrySubreddits}
- **Communities to Join:** ${industryCommunities}${avoidPlatformsNote}
${excludeTitles && excludeTitles.length > 0 ? `
ALREADY GENERATED TASKS (DO NOT REPEAT):
${excludeTitles.map((t: string) => `- ${t}`).join('\n')}
` : ''}
CRITICAL RULES:
${platformNotes ? `1. **PLATFORM CONSTRAINTS (MUST FOLLOW):**\n   ${platformNotes.split('\n').join('\n   ')}\n   Every task MUST use only the allowed platforms. Do not suggest tasks for disallowed platforms under any circumstances.\n` : ''}2. NO placeholders like "[Target Audience]" or "[Service 1]" - use actual business details
3. NO generic strategy tasks like "define your message" - we already did onboarding
4. Each task must be DOABLE IN 15 MINUTES with a clear deliverable
5. Focus on EXECUTION, not planning (for example, "Post on LinkedIn about X" not "Plan LinkedIn strategy")
6. Use the actual product name, value prop, and target audience in task descriptions
7. **EXPLORE/EXPLOIT MIX**: Generate ${Math.max(1, marketingTasksTarget - 1)} tasks on top-performing channels (exploit what works) + ${Math.min(1, marketingTasksTarget)} task trying something new (explore to learn)
8. **AVOID** channels with 3+ skips unless exploring
9. **RESPECT MONTHLY THEMES**: ${monthlyTheme}
10. **USE RESEARCHED CHANNELS**: The marketing channel research above is based on what actually works for ${websiteIndustry} businesses. Prioritize these platforms and content types.
11. **MATCH CONTENT TO INDUSTRY**: Use the content strategy specified above. Don't suggest video content for text-based industries or vice versa.
12. Do not repeat the same platform twice in the same day.
13. Tailor channel choices, communities, and examples to the startup's specific industry/type (crypto, SaaS, AI, indie hacker tools, local services, etc.) and reference niche-specific hooks.
14. Match every task to the traction stage above: pre-launch or pre-revenue tasks focus on validation and direct outreach; growth or scaling stages focus on leverage, compounding, and optimisation.
15. At least one task must explicitly reference a unique detail from the website summary, value props, or target audience narrative so the founder sees it is personalised.
16. **USE TARGET AUDIENCE DEEP DIVE**: If provided above, weave in specific professions, pain points, interests, behaviors, and hangout spots into task descriptions. This is your secret weapon for hyper-targeted tasks that feel custom-built.
17. **BALANCED USE OF ANALYSIS**: The "Actionable Recommendations" and "Top Marketing Opportunities" above are insights to INSPIRE tasks, not dominate them. For Week 1 (Days 1-7), include 1-2 tasks TOTAL (not per day) that directly implement a specific recommendation. The rest should be a well-rounded marketing strategy: content creation, community engagement, audience research, social proof building, and channel experiments. Don't repeat the same recommendation multiple times in different forms.
18. **VARIETY IS KEY**: Each day should feel different. Mix content types (posts, threads, videos), platforms, and objectives (awareness, engagement, conversion, learning). Avoid suggesting the same initiative more than once per week.
19. Keep outcomes aligned with the user's primary goal metric (users versus MRR) when describing impact or success criteria.
20. Tone: write like an experienced marketing coach talking to a busy founder—clear, friendly, and conversational, not corporate or robotic.
21. Titles: keep them short and natural (ideally under 70 characters) with no "Task 1" or "#3" labels—make them sound like simple to-dos a human would write.
22. Every task should feel like a small, confidence-boosting step the founder can actually do today, not a big vague project.
23. **GENERATE EXACTLY ${marketingTasksTarget} TASKS** - no more, no less. This is critical.
24. **KEEP DESCRIPTIONS CONCISE**: Maximum 1-2 short sentences (under 100 chars total). Be direct and actionable, not verbose.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):

{
  "tasks": [
    {
      "title": "Short, natural task title (under 70 chars)",
      "description": "1-2 short sentences with exact steps (under 100 chars total)",
      "category": "content|analytics|community|strategy|engagement",
      "platform": "specific platform name (lowercase)",
      "impact": "One sentence on expected outcome",
      "tips": ["Tip 1", "Tip 2"],
      "type": "exploit|explore"
    }
  ]
}

Generate exactly ${marketingTasksTarget} tasks.`

    let marketingTasks: any[] = []
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://marketingbuddy.ai',
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: 'system',
              content: 'You are a marketing expert who creates personalized daily tasks. Return ONLY valid JSON, no markdown formatting.'
            },
            {
              role: 'user',
              content: marketingPrompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7,
          response_format: { type: "json_object" }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0]?.message?.content || ''
        console.log('✅ AI Response received for Day', day, '- Length:', content.length, 'chars')
        
        try {
          // Parse JSON response
          const parsed = JSON.parse(content)
          const tasksArray = Array.isArray(parsed) ? parsed : (parsed.tasks || [])
          
          marketingTasks = tasksArray.map((task: any, index: number) => ({
            id: `marketing-${day}-${index + 1}`,
            title: task.title || 'Untitled task',
            description: task.description || '',
            category: task.category || 'strategy',
            platform: task.platform?.toLowerCase() || undefined,
            impact: task.impact || 'Builds marketing momentum',
            tips: Array.isArray(task.tips) ? task.tips.slice(0, 3) : [],
            type: task.type || 'exploit',
            xp: 15,
            completed: false,
            estimatedTime: "15 min",
            day
          })).slice(0, marketingTasksTarget)
          
          console.log('✅ Parsed', marketingTasks.length, 'tasks from JSON response')
        } catch (parseError) {
          console.error('❌ JSON parsing failed:', parseError)
          console.error('Raw content:', content.substring(0, 500))
          marketingTasks = []
        }
      } else {
        const errorText = await response.text()
        console.error('❌ OpenRouter API failed:', response.status, response.statusText, errorText.substring(0, 500))
        return NextResponse.json({ 
          error: 'AI task generation failed', 
          details: `${response.status}: ${response.statusText}`,
          tasks: [] 
        }, { status: 500 })
      }
    } catch (error) {
      console.error('❌ Marketing task generation failed:', error)
      return NextResponse.json({ 
        error: 'Task generation error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        tasks: [] 
      }, { status: 500 })
    }

    // Log platform distribution for debugging
    try {
      const platformCounts: Record<string, number> = {}
      marketingTasks.forEach((t: any) => {
        const plat = String(t?.platform || 'unknown').toLowerCase()
        platformCounts[plat] = (platformCounts[plat] || 0) + 1
      })
      console.log('📊 Day', day, 'platform distribution:', platformCounts)
    } catch {}

    // Combine and prioritize tasks
    let combinedTasks: any[] = []
    
    if (focusArea === 'website') {
      // Website improvement first (distributed), then marketing
      combinedTasks = [
        ...websiteForDay,
        ...marketingTasks
      ]
    } else if (focusArea === 'growth') {
      // Only marketing tasks, request full daily count
      combinedTasks = marketingTasks
    } else {
      // Mix both - prioritize high-impact website tasks
      combinedTasks = [
        ...websiteHighForDay,
        ...marketingTasks.slice(0, Math.ceil(marketingTasksTarget / 2)),
        ...websiteRemainingForDay,
        ...marketingTasks.slice(Math.ceil(marketingTasksTarget / 2))
      ]
    }

    // Exclude titles passed by caller (e.g., onboarding week seeding to avoid repeats across days)
    const excludeSet = new Set<string>((Array.isArray(excludeTitles) ? excludeTitles : []).map((t: string) => String(t).trim().toLowerCase()))
    const filtered = combinedTasks.filter((t: any) => !excludeSet.has(String(t.title || '').trim().toLowerCase()))

    // De-duplicate by title + description and then limit to requested task count
    const uniqueCombined: any[] = []
    const seenKeys = new Set<string>()
    for (const t of filtered) {
      const key = `${(t.title || '').trim()}|${(t.description || '').trim()}`.toLowerCase()
      if (!seenKeys.has(key)) {
        seenKeys.add(key)
        uniqueCombined.push(t)
      }
    }
    let finalTasks = uniqueCombined.slice(0, taskCount)
    
    // Log if we're short on tasks
    if (finalTasks.length < taskCount) {
      console.warn(`⚠️ Only generated ${finalTasks.length} tasks for Day ${day}, requested ${taskCount}`)
    }

    // Check if all website tasks are completed (for future notification)
    const completedWebsiteTasks = user.completedTasks?.filter((task: any) => task.type === 'website-improvement') || []
    const allWebsiteTasksCompleted = websiteTasks.length > 0 && completedWebsiteTasks.length >= websiteTasks.length

    // Add metadata to tasks for tracking
    const tasksWithMetadata = finalTasks.map((task: any) => ({
      ...task,
      metadata: {
        algorithm_version: 'v2_adaptive',
        day,
        month: Math.ceil(day / 30),
        week: Math.ceil(day / 7),
        channel_scores: rankedChannels.length > 0 ? rankedChannels : undefined,
        avoid_channels: avoidChannels.length > 0 ? avoidChannels : undefined
      }
    }))

    return NextResponse.json({
      success: true,
      tasks: tasksWithMetadata,
      websiteTasksRemaining: Math.max(0, websiteTasks.length - completedWebsiteTasks.length),
      allWebsiteTasksCompleted,
      focusArea,
      totalWebsiteTasks: websiteTasks.length,
      channelPerformance: rankedChannels
    })

  } catch (error) {
    console.error('Enhanced daily task generation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate enhanced daily tasks' 
    }, { status: 500 })
  }
}

function parseMarketingTasks(tasksText: string, day: number, count: number): any[] {
  const taskPattern = /\*\*Task \d+:\s*(.+?)\*\*\n([\s\S]*?)(?=\*\*Task \d+:|$)/g
  const tasks: any[] = []
  let match

  while ((match = taskPattern.exec(tasksText)) !== null && tasks.length < count) {
    let title = match[1].trim()
    const content = match[2].trim()
    
    // Extract category, impact, tips, and optional platform line
    const categoryMatch = content.match(/- Category:\s*(.+)/i)
    const impactMatch = content.match(/- Impact:\s*(.+)/i)
    const tipsMatch = content.match(/- Tips:\s*([\s\S]*?)(?=\n-|\n\*\*|$)/i)
    const platformMatch = content.match(/- Platform:\s*(.+)/i)

    const category = categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'strategy'
    const impact = impactMatch ? impactMatch[1].trim() : 'Builds marketing momentum'
    const tips = tipsMatch ? tipsMatch[1].split('\n').map(tip => tip.replace(/^-\s*/, '').trim()).filter(tip => tip) : []

    const rawPlatform = platformMatch ? platformMatch[1].trim().toLowerCase() : ''
    const normPlatform = rawPlatform || undefined
    
    // Clean description (remove metadata lines that we parsed above)
    let description = content
      .replace(/- Category:.*$/gm, '')
      .replace(/- Impact:.*$/gm, '')
      .replace(/- Tips:[\s\S]*$/gm, '')
      .replace(/- Platform:.*$/gm, '')
      .trim()

    // If the AI stuffed description into the title ("Title - details"), split it
    if (!description && /[-–—]:?\s+/.test(title)) {
      const parts = title.split(/[-–—]:?\s+/)
      if (parts.length >= 2) {
        title = parts[0].trim()
        description = parts.slice(1).join(' - ').trim()
      }
    }
    if (!description) {
      description = `Do this now: ${title}. Keep it specific, helpful, and non-promotional. Timebox to 15 minutes.`
    }

    tasks.push({
      id: `marketing-${day}-${tasks.length + 1}`,
      title,
      description,
      category: ['content', 'analytics', 'community', 'strategy', 'engagement'].includes(category) ? category : 'strategy',
      impact,
      tips: tips.slice(0, 3), // Limit to 3 tips
      platform: normPlatform,
      xp: 15,
      completed: false,
      estimatedTime: "20 min",
      day,
      type: 'marketing'
    })
  }

  return tasks
}
