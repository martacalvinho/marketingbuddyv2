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
    // If user specified preferred platforms, strongly constrain suggestions to them + SaaS Directories + Reddit (common for SaaS)
    const allowedNote = preferred.length > 0 ? `ALLOWED_PLATFORMS: ${Array.from(new Set([...preferred, 'saas directories', 'reddit'])).join(', ')}` : ''
    const disallowedNote = preferred.length > 0 ? `DISALLOWED_PLATFORMS: ${['linkedin','instagram','tiktok','twitter','blog','indie hackers','youtube','medium','substack','discord','facebook groups']
      .filter(p => !preferred.includes(p))
      .concat(Array.from(avoidList))
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ')}` : (avoidList.size > 0 ? `DISALLOWED_PLATFORMS: ${Array.from(avoidList).join(', ')}` : '')

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
    const topOpportunitiesSummary = formatList(
      (websiteAnalysis?.marketingOpportunities || []).slice(0, 2).map((o: any) => o.title),
      'Not specified'
    )
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
- Key Challenge Shared: ${challengeSummary}

STARTUP TYPE & POSITIONING:
- Website Summary: ${websiteSummary}
- Industry / Category: ${websiteIndustry}
- Business Model / Startup Type: ${websiteBusinessModel}
- Differentiators / Value Props from Site: ${websiteValueProps}
- Audience cues from site: ${websiteAudienceFromAnalysis}
- Strengths to leverage: ${strengthsSummary}
- Top Opportunities flagged: ${topOpportunitiesSummary}

TRACTION & STAGE:
- Current Users: ${formattedUsers}
- Current MRR: ${formattedMrr}
- User Traction Stage: ${userStageSummary}
- Revenue Stage: ${revenueStageSummary}
- Preferred / Active Platforms: ${preferredPlatformsSummary}
- Launch Date: ${launchDateDisplay}
- Strategy Mode: ${strategyModeDisplay}

${contextBlock}
${platformNotes ? `\nPLATFORM GUARDRAILS:\n${platformNotes}\n` : ''}

MARKETING CHANNEL RESEARCH (Based on ${websiteIndustry} industry analysis):
- **Recommended Platforms:** ${recommendedPlatforms}
- **Content Strategy:** ${contentStrategy}
- **Directories to List On:** ${industryDirectories}
- **Subreddits to Engage:** ${industrySubreddits}
- **Communities to Join:** ${industryCommunities}${avoidPlatformsNote}

CRITICAL RULES:
1. NO placeholders like "[Target Audience]" or "[Service 1]" - use actual business details
2. NO generic strategy tasks like "define your message" - we already did onboarding
3. Each task must be DOABLE IN 15 MINUTES with a clear deliverable
4. Focus on EXECUTION, not planning (for example, "Post on LinkedIn about X" not "Plan LinkedIn strategy")
5. Use the actual product name, value prop, and target audience in task descriptions
6. **EXPLORE/EXPLOIT MIX**: Generate ${Math.max(1, marketingTasksTarget - 1)} tasks on top-performing channels (exploit what works) + ${Math.min(1, marketingTasksTarget)} task trying something new (explore to learn)
7. **AVOID** channels with 3+ skips unless exploring
8. **RESPECT MONTHLY THEMES**: ${monthlyTheme}
9. **USE RESEARCHED CHANNELS**: The marketing channel research above is based on what actually works for ${websiteIndustry} businesses. Prioritize these platforms and content types.
10. **MATCH CONTENT TO INDUSTRY**: Use the content strategy specified above. Don't suggest video content for text-based industries or vice versa.
11. Do not repeat the same platform twice in the same day.
12. Tailor channel choices, communities, and examples to the startup's specific industry/type (crypto, SaaS, AI, indie hacker tools, local services, etc.) and reference niche-specific hooks.
13. Match every task to the traction stage above: pre-launch or pre-revenue tasks focus on validation and direct outreach; growth or scaling stages focus on leverage, compounding, and optimisation.
14. At least one task must explicitly reference a unique detail from the website summary, value props, or target audience narrative so the founder sees it is personalised.
15. Keep outcomes aligned with the user's primary goal metric (users versus MRR) when describing impact or success criteria.

GOOD TASK EXAMPLES:
- "Post on LinkedIn: Share how ${productNameDisplay} helps ${targetAudienceSummary} achieve ${productValueProp} and invite one quick reply about ${goalTypeDisplay} progress."
- "Engage in a ${websiteIndustry} community: Join a conversation where ${targetAudienceSummary} discuss a pain point and add a practical tip referencing ${productNameDisplay}."
- "Create a Twitter thread: Break down a real outcome or insight from ${productNameDisplay} for ${targetAudienceSummary} and link to a ${goalTypeDisplay}-driving CTA."

BAD TASK EXAMPLES (avoid these):
- "Develop core messaging" (too vague, already done in onboarding)
- "Define target audience" (already done)
- "Create content strategy" (too broad for 15min)
- "Draft ideas for [Target Audience]" (placeholder, not specific)

Generate ${marketingTasksTarget} tasks in this format:
**Task X: [Specific Action Title]**
[2-3 sentences with exact steps using real business details]
- Category: [content/analytics/community/strategy/engagement]
- Platform: [specific platform name]
- Impact: [One sentence on expected outcome]
- Tips: [2 specific tips]
- Type: [exploit/explore] (exploit = proven channel, explore = new experiment)`

    let marketingTasks: any[] = []
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a marketing expert who creates personalized daily tasks based on user goals, experience level, and business context.'
            },
            {
              role: 'user',
              content: marketingPrompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const tasksText = data.choices[0]?.message?.content || ''
        marketingTasks = parseMarketingTasks(tasksText, day, marketingTasksTarget)
      } else {
        // Use deterministic fallback if API is unavailable or key missing
        console.warn('OpenAI returned non-OK status for marketing tasks:', response.status, response.statusText)
        marketingTasks = generateFallbackMarketingTasks(user, day, marketingTasksTarget, fallbackContext)
      }
    } catch (error) {
      console.error('Marketing task generation failed:', error)
      // Fallback marketing tasks
      marketingTasks = generateFallbackMarketingTasks(user, day, marketingTasksTarget, fallbackContext)
    }

    // Enforce disallowed platforms after parsing (e.g., user opted out of LinkedIn)
    try {
      const disallowed = new Set<string>((preferred.length > 0 ? ['linkedin','instagram','tiktok','twitter','blog','indie hackers','youtube','medium','substack','discord','facebook groups']
        .filter(p => !preferred.includes(p)) : []).concat(Array.from(avoidList)).map(s => s.toLowerCase()))
      if (disallowed.size > 0) {
        const allowedTasks = marketingTasks.filter((t: any) => {
          const title = String(t?.title || '').toLowerCase()
          const plat = String(t?.platform || '').toLowerCase()
          return !(plat && disallowed.has(plat)) && !Array.from(disallowed).some(k => k.length > 2 && title.includes(k))
        })
        const removedCount = Math.max(0, marketingTasksTarget - allowedTasks.length)
        if (removedCount > 0) {
          const backfill = generateFallbackMarketingTasks(user, day, removedCount, fallbackContext)
          marketingTasks = [...allowedTasks, ...backfill].slice(0, marketingTasksTarget)
        } else {
          marketingTasks = allowedTasks.slice(0, marketingTasksTarget)
        }
      }
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

    // If still short, backfill with rotated fallback tasks while respecting exclusions
    if (finalTasks.length < taskCount) {
      const needed = taskCount - finalTasks.length
      const fallbackPool = generateFallbackMarketingTasks(
        user,
        day + (uniqueCombined.length || 0),
        Math.max(needed * 2, needed + 2),
        fallbackContext
      )
      for (const ft of fallbackPool) {
        const key = `${(ft.title || '').trim()}|${(ft.description || '').trim()}`.toLowerCase()
        const titleKey = String(ft.title || '').trim().toLowerCase()
        if (!seenKeys.has(key) && !excludeSet.has(titleKey)) {
          seenKeys.add(key)
          finalTasks.push(ft)
          if (finalTasks.length >= taskCount) break
        }
      }
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
    const title = match[1].trim()
    const content = match[2].trim()
    
    // Extract category, impact, and tips
    const categoryMatch = content.match(/- Category:\s*(.+)/i)
    const impactMatch = content.match(/- Impact:\s*(.+)/i)
    const tipsMatch = content.match(/- Tips:\s*([\s\S]*?)(?=\n-|\n\*\*|$)/i)
    
    const category = categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'strategy'
    const impact = impactMatch ? impactMatch[1].trim() : 'Builds marketing momentum'
    const tips = tipsMatch ? tipsMatch[1].split('\n').map(tip => tip.replace(/^-\s*/, '').trim()).filter(tip => tip) : []
    
    // Clean description (remove category, impact, tips lines)
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
      platform: normPlatform || undefined,
      xp: 15,
      completed: false,
      estimatedTime: "20 min",
      day,
      type: 'marketing'
    })
  }

  return tasks
}

function generateFallbackMarketingTasks(user: any, day: number, count: number, context?: FallbackContext): any[] {
  const productName = normaliseContextValue(context?.productName ?? user?.productName, 'your product')
  const valueProp = normaliseContextValue(context?.valueProp ?? user?.valueProp, 'your main benefit')
  const audienceSummaryRaw = normaliseContextValue(context?.targetAudienceSummary ?? summariseTargetAudience(user?.targetAudience), 'your target audience')
  const audienceSummary = audienceSummaryRaw.length > 180 ? `${audienceSummaryRaw.slice(0, 177)}...` : audienceSummaryRaw
  const audienceShort = audienceSummary.split('|')[0]?.replace(/^[^:]*:\s*/i, '').trim() || audienceSummary
  const industry = normaliseContextValue(context?.industry, 'your market')
  const challenge = normaliseContextValue(context?.challengeSummary ?? user?.challenges, 'their biggest headache right now')
  const monthlyTheme = normaliseContextValue(context?.monthlyTheme, getMonthlyTheme(day, context?.strategyMode || user?.strategyMode || 'foundation_content_community'))
  const goalTypeRaw = (context?.goalType ?? user?.goalType ?? '').toString().toLowerCase()
  const goalMetric = (context?.goalMetric || (goalTypeRaw.includes('mrr') || goalTypeRaw.includes('revenue') ? 'MRR' : 'users')).toUpperCase()
  const goalAmount = normaliseContextValue(context?.goalAmount ?? user?.goalAmount, goalMetric === 'MRR' ? '$1k' : '100')
  const dayLabel = `Day ${day}`
  const industryShort = industry.split('/')[0]?.trim() || industry
  const challengeShort = challenge.length > 90 ? `${challenge.slice(0, 87)}...` : challenge
  const valuePropShort = valueProp.length > 90 ? `${valueProp.slice(0, 87)}...` : valueProp

  const stageGroup = deriveStageGroup(context?.userStageSummary)
  const revenueGroup = deriveRevenueGroup(context?.revenueStageSummary)

  const stageIs = {
    prelaunch: stageGroup === 'prelaunch',
    validation: stageGroup === 'validation',
    traction: stageGroup === 'traction',
    growth: stageGroup === 'growth',
    scale: stageGroup === 'scale'
  }

  const revenueIs = {
    pre: revenueGroup === 'pre',
    first: revenueGroup === 'first',
    growth: revenueGroup === 'growth',
    scale: revenueGroup === 'scale'
  }

  const monthlyHook = monthlyTheme.replace(/^month\s*\d+:\s*/i, '').trim() || monthlyTheme
  const audienceFocus = audienceShort.length > 70 ? `${audienceShort.slice(0, 67)}...` : audienceShort
  const goalOutcome = goalMetric === 'MRR' ? 'revenue momentum' : 'user growth'

  const sequenceTag = (offset: number) => `#${((day + offset) % 7) + 1}`
  
  // Get industry-specific resources for fallback
  const industryRes = getIndustryResources(industry)
  const directories = industryRes.directories.map((dir: string, idx: number) => ({
    dir,
    idx
  }))
  const subreddits = industryRes.subreddits.map((sub: string, idx: number) => ({
    sub,
    idx
  }))

  type Template = {
    allowedStages?: StageGroup[]
    allowedRevenueStages?: RevenueGroup[]
    build: (ctx: { index: number }) => {
      title: string
      description: string
      category: 'content' | 'analytics' | 'community' | 'strategy' | 'engagement'
      platform?: string
      impact: string
      estimatedTime?: string
    } | null
  }

  const templates: Template[] = [
    {
      build: ({ index }) => ({
        title: `LinkedIn insight ${sequenceTag(index)}: ${industryShort} win`,
        description: `Write 5 lines on LinkedIn covering how ${productName} helps ${audienceFocus} tackle ${challengeShort}. Highlight one data point or founder story and end by asking “How are you handling this now?”`,
        category: 'content',
        platform: 'linkedin',
        impact: `Keeps ${audienceFocus} aware of ${productName} while nudging ${goalOutcome}.`
      })
    },
    {
      build: ({ index }) => ({
        title: `Twitter/X thread ${sequenceTag(index)} on ${valuePropShort}`,
        description: `Draft a 4-tweet thread breaking down ${valuePropShort}. Lead with a hook tailored to ${audienceFocus}, include one practical tactic, and end with a single CTA aimed at ${goalOutcome}.`,
        category: 'content',
        platform: 'twitter',
        impact: `Earns saves and clicks from ${audienceFocus} looking for quick wins.`
      })
    },
    {
      build: ({ index }) => {
        const { sub } = subreddits[(day + index) % subreddits.length]
        return {
          title: `Reddit: add value in r/${sub}`,
          description: `Find or start a thread in r/${sub} where ${audienceFocus} discuss ${challengeShort}. Add a non-promotional comment that references ${productName} as a tool they can try, then note any replies.`,
          category: 'community',
          platform: 'reddit',
          impact: `Seeds trust inside a ${industryShort} community that matches your buyers.`
        }
      }
    },
    {
      allowedStages: ['prelaunch', 'validation'],
      build: ({ index }) => ({
        title: `DM 3 prospects for validation chats ${sequenceTag(index)}`,
        description: `Send short DMs or emails to 3 ${audienceFocus} asking for a 10-minute call about ${challengeShort}. Mention you’re building ${productName} and want their candid input. Capture one quote.`,
        category: 'engagement',
        platform: 'direct outreach',
        impact: `Generates real discovery data while lining up early adopters for ${productName}.`
      })
    },
    {
      allowedStages: ['prelaunch', 'validation'],
      build: ({ index }) => ({
        title: `Micro-survey in a niche community ${sequenceTag(index)}`,
        description: `Post a single-question poll in a ${industryShort} Slack/Discord asking ${audienceFocus} how they currently handle ${challengeShort}. Share one response thread with your team.`,
        category: 'community',
        platform: 'community',
        impact: `Validates messaging and uncovers phrasing prospects use when describing the pain.`
      })
    },
    {
      allowedStages: ['traction', 'growth', 'scale'],
      build: ({ index }) => ({
        title: `Share a customer mini-win ${sequenceTag(index)}`,
        description: `Turn a recent ${goalMetric === 'MRR' ? 'upgrade' : 'activation'} into a short post or DM. Mention the specific outcome ${audienceFocus} achieved thanks to ${productName} and invite replies from people chasing the same result.`,
        category: 'engagement',
        platform: 'social proof',
        impact: `Leverages social proof to persuade lookalike ${audienceFocus}.`
      })
    },
    {
      allowedStages: ['traction', 'growth', 'scale'],
      build: ({ index }) => ({
        title: `Newsletter or email blurb ${sequenceTag(index)}`,
        description: `Write a 120-word story for your list explaining a fresh learning from building ${productName} for ${audienceFocus}. Link to a CTA that directly advances ${goalOutcome}.`,
        category: 'content',
        platform: 'email',
        impact: `Warms up subscribers and funnels them toward ${goalMetric} conversions.`
      })
    },
    {
      allowedStages: ['validation', 'traction', 'growth', 'scale'],
      build: ({ index }) => {
        const { dir } = directories[(day + index) % directories.length]
        return {
          title: `List ${productName} on ${dir}`,
          description: `Refresh your tagline to emphasise ${valuePropShort}, gather one screenshot showing the outcome, and submit ${productName} to ${dir}. Tag the listing for ${audienceFocus}.`,
          category: 'strategy',
          platform: 'saas directories',
          impact: `Opens a steady discovery path to buyers browsing launch hubs.`
        }
      }
    },
    {
      build: ({ index }) => ({
        title: `Indie Hackers update ${sequenceTag(index)} (${monthlyHook})`,
        description: `Post a progress update sharing one win, one struggle about ${challengeShort}, and a question for the community. Include a link to ${productName} only at the end.`,
        category: 'community',
        platform: 'indiehackers',
        impact: `Invites feedback from fellow builders and surfaces early supporters.`
      })
    },
    {
      allowedStages: ['growth', 'scale'],
      allowedRevenueStages: ['growth', 'scale'],
      build: ({ index }) => ({
        title: `Upgrade prompt for engaged users ${sequenceTag(index)}`,
        description: `Send a quick upgrade nudge to 2 active ${audienceFocus} explaining the premium benefit linked to ${valuePropShort}. Add a deadline (e.g., “Reply by Friday”) to spark action.`,
        category: 'engagement',
        platform: 'email',
        impact: `Converts warm users into MRR by highlighting a specific premium unlock.`
      })
    },
    {
      allowedStages: ['traction', 'growth', 'scale'],
      build: ({ index }) => ({
        title: `Quick testimonial ask ${sequenceTag(index)}`,
        description: `Message one happy ${audienceFocus} and ask for a 2-line quote about ${productName}. Offer to draft it for them, then add it to your website or social proof doc.`,
        category: 'strategy',
        platform: 'customer',
        impact: `Strengthens credibility for future ${goalOutcome} pushes.`
      })
    },
    {
      allowedStages: ['growth', 'scale'],
      build: ({ index }) => ({
        title: `Inspect 3 activation metrics ${sequenceTag(index)}`,
        description: `Review analytics to spot where ${audienceFocus} drop off during onboarding. Capture one improvement idea you can implement this week to boost ${goalOutcome}.`,
        category: 'analytics',
        platform: 'analytics',
        impact: `Tightens the funnel so new ${audienceFocus} convert faster.`
      })
    },
    {
      build: ({ index }) => ({
        title: `Record a 45s Loom for ${audienceFocus} ${sequenceTag(index)}`,
        description: `Film a short Loom demo showing how ${productName} handles ${challengeShort}. Post it to LinkedIn/Twitter and share privately with one prospect.`,
        category: 'content',
        platform: 'video',
        impact: `Gives prospects a visual hook and humanises your brand.`
      })
    },
    {
      allowedStages: ['traction', 'growth', 'scale'],
      build: ({ index }) => ({
        title: `Ask for a referral ${sequenceTag(index)}`,
        description: `Pick one engaged ${audienceFocus} and ask if they know someone else facing ${challengeShort}. Provide a short blurb they can forward.`,
        category: 'engagement',
        platform: 'referral',
        impact: `Taps into existing trust networks to find high-fit leads.`
      })
    },
    {
      allowedStages: ['validation', 'traction', 'growth'],
      build: ({ index }) => ({
        title: `Guest post or collab pitch ${sequenceTag(index)}`,
        description: `Identify a micro-influencer or newsletter serving ${audienceFocus}. Pitch a 200-word guest tip aligned with ${valuePropShort}.`,
        category: 'strategy',
        platform: 'partnership',
        impact: `Places ${productName} in front of qualified audiences without ads.`
      })
    },
    {
      allowedStages: ['prelaunch', 'validation', 'traction'],
      build: ({ index }) => ({
        title: `Compile 3 objections ${sequenceTag(index)}`,
        description: `Review past conversations and list 3 common pushbacks from ${audienceFocus}. Draft one-sentence responses tied to ${valuePropShort} and share them with the team.`,
        category: 'strategy',
        platform: 'research',
        impact: `Prepares you to overcome friction and close more ${goalMetric === 'MRR' ? 'deals' : 'sign-ups'}.`
      })
    }
  ]

  const generatedTasks: any[] = []
  templates.forEach((template, index) => {
    if (template.allowedStages && !template.allowedStages.includes(stageGroup)) return
    if (template.allowedRevenueStages && !template.allowedRevenueStages.includes(revenueGroup)) return
    const result = template.build({ index: generatedTasks.length })
    if (result) {
      generatedTasks.push(result)
    }
  })

  // Provide additional directory + subreddit variations to increase unique options
  for (let i = 0; i < Math.max(3, count); i++) {
    const dir = directories[(day + generatedTasks.length + i) % directories.length]?.dir
    if (dir) {
      generatedTasks.push({
        title: `Refresh ${productName} listing for ${dir}`,
        description: `Update your ${dir} profile with one punchy bullet about ${valuePropShort} and add proof that ${audienceFocus} can trust you (metric, quote, or waitlist size).`,
        category: 'strategy',
        platform: 'saas directories',
        impact: `Keeps listings current and improves conversions from high-intent browsers.`
      })
    }
    const sub = subreddits[(day + generatedTasks.length + i) % subreddits.length]?.sub
    if (sub) {
      generatedTasks.push({
        title: `Reply in r/${sub} with a mini teardown`,
        description: `Find a post asking for help on ${challengeShort}. Share one actionable teardown referencing ${productName} as the faster path.`,
        category: 'community',
        platform: 'reddit',
        impact: `Positions you as the helpful expert in front of ${audienceFocus}.`
      })
    }
  }

  // Ensure we have more tasks than needed
  const expandedTasks = generatedTasks.filter(Boolean)
  if (expandedTasks.length === 0) {
    // Fallback to simple generic tasks if something unexpected happened
    return [
      {
        id: `fallback-${day}-1`,
        title: `Share ${productName} story`,
        description: `Write a short post explaining why you built ${productName} and how it helps ${audienceFocus}.`,
        category: 'content',
        platform: 'linkedin',
        impact: `Keeps your network updated on ${productName}.`,
        tips: [
          'Be specific and authentic',
          'Focus on helping, not selling',
          `Mention your ${goalMetric} goal`
        ],
        xp: 15,
        completed: false,
        estimatedTime: '15 min',
        day,
        type: 'marketing'
      }
    ]
  }

  // Rotate starting point for variety
  const start = expandedTasks.length > 0 ? ((day - 1) % expandedTasks.length + expandedTasks.length) % expandedTasks.length : 0
  const rotated = [...expandedTasks.slice(start), ...expandedTasks.slice(0, start)]

  return rotated.slice(0, Math.max(count, 0)).map((task, index) => ({
    id: `fallback-${day}-${index + 1}`,
    ...task,
    tips: [
      `Reference ${productName} and ${valuePropShort} explicitly`,
      `Stay focused on ${audienceFocus} and their language`,
      `Log any responses to track ${goalOutcome}`
    ],
    xp: 15,
    completed: false,
    estimatedTime: task.estimatedTime || '15 min',
    day,
    type: 'marketing'
  }))
}
