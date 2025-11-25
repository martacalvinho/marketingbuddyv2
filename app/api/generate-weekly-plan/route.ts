import { NextRequest, NextResponse } from 'next/server'

// Minimal helpers (duplicated from daily generator to avoid cross-file imports)
const NUMERIC_SANITIZER = /[^0-9.-]+/g

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

function formatUsersMetric(value: number | null): string {
  if (value === null) return 'Not provided'
  const rounded = Math.max(0, Math.round(value))
  return `${rounded} user${rounded === 1 ? '' : 's'}`
}

function formatMrrMetric(value: number | null): string {
  if (value === null) return 'Not provided'
  const rounded = Math.max(0, Math.round(value))
  return `$${rounded} MRR`
}

type StageDefinition = { limit: number; label: string }

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
    const demographics = (audience as any).demographics ?? {}
    if (Array.isArray(demographics.professions) && demographics.professions.length > 0) {
      parts.push(`Professions: ${demographics.professions.slice(0, 3).join(', ')}`)
    }
    if (Array.isArray(demographics.locations) && demographics.locations.length > 0) {
      parts.push(`Locations: ${demographics.locations.slice(0, 3).join(', ')}`)
    }
    if (Array.isArray((audience as any).painPoints) && (audience as any).painPoints.length > 0) {
      parts.push(`Pain points: ${(audience as any).painPoints.slice(0, 2).join('; ')}`)
    }
    if (Array.isArray((audience as any).goals) && (audience as any).goals.length > 0) {
      parts.push(`Goals: ${(audience as any).goals.slice(0, 2).join('; ')}`)
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

function buildAudienceDeepDive(targetAudienceData: any): string {
  if (!targetAudienceData || typeof targetAudienceData !== 'object') return ''
  const parts: string[] = []
  const demographics = (targetAudienceData as any).demographics || {}
  if (Array.isArray(demographics.professions) && demographics.professions.length > 0) {
    parts.push(`Professions: ${demographics.professions.slice(0, 3).join(', ')}`)
  }
  if (demographics.ageRange) parts.push(`Age: ${demographics.ageRange}`)
  if (Array.isArray(demographics.locations) && demographics.locations.length > 0) {
    parts.push(`Locations: ${demographics.locations.slice(0, 3).join(', ')}`)
  }
  if (Array.isArray((targetAudienceData as any).painPoints) && (targetAudienceData as any).painPoints.length > 0) {
    parts.push(`Pain Points: ${(targetAudienceData as any).painPoints.slice(0, 3).join('; ')}`)
  }
  if (Array.isArray((targetAudienceData as any).goals) && (targetAudienceData as any).goals.length > 0) {
    parts.push(`Goals: ${(targetAudienceData as any).goals.slice(0, 3).join('; ')}`)
  }
  if ((targetAudienceData as any).psychographics) {
    const psycho = (targetAudienceData as any).psychographics
    if (Array.isArray(psycho.interests) && psycho.interests.length > 0) {
      parts.push(`Interests: ${psycho.interests.slice(0, 4).join(', ')}`)
    }
    if (Array.isArray(psycho.values) && psycho.values.length > 0) {
      parts.push(`Values: ${psycho.values.slice(0, 3).join(', ')}`)
    }
    if (Array.isArray(psycho.behaviors) && psycho.behaviors.length > 0) {
      parts.push(`Behaviors: ${psycho.behaviors.slice(0, 3).join('; ')}`)
    }
  }
  if (Array.isArray((targetAudienceData as any).whereTheyHangOut) && (targetAudienceData as any).whereTheyHangOut.length > 0) {
    parts.push(`Hangouts: ${(targetAudienceData as any).whereTheyHangOut.slice(0, 4).join(', ')}`)
  }
  return parts.length > 0 ? parts.join(' | ') : ''
}

function summariseOpportunities(websiteAnalysis: any): string {
  const topOpportunities = (websiteAnalysis?.marketingOpportunities || []).slice(0, 4)
  if (topOpportunities.length === 0) return 'Not specified'
  return topOpportunities
    .map((o: any, i: number) => {
      const bits = [`${i + 1}. ${o.title || 'Untitled'}`]
      if (o.reasoning) bits.push(`Why: ${o.reasoning}`)
      if (o.channels?.length) bits.push(`Channels: ${o.channels.join(', ')}`)
      return bits.join(' | ')
    })
    .join(' || ')
}

function summariseActionableRecs(websiteAnalysis: any): string {
  const actionable = (websiteAnalysis?.actionableRecommendations || []).slice(0, 4)
  if (actionable.length === 0) return 'Not specified'
  return actionable
    .map((rec: any, i: number) => {
      const bits = [`${i + 1}. ${rec.title || 'Recommendation'}`]
      if (rec.impact) bits.push(`Impact: ${rec.impact}`)
      if (rec.timeframe) bits.push(`Timeline: ${rec.timeframe}`)
      return bits.join(' | ')
    })
    .join(' || ')
}

function summariseMessagingInsights(websiteAnalysis: any): string {
  const gaps = websiteAnalysis?.contentMessagingAnalysis?.messagingGaps || []
  const improvements = websiteAnalysis?.contentMessagingAnalysis?.improvementSuggestions || []
  const combined = [...gaps, ...improvements].slice(0, 4)
  return combined.length > 0 ? combined.join('; ') : 'Not specified'
}

function summariseCompetitive(websiteAnalysis: any): string {
  const differentiators = websiteAnalysis?.competitivePositioning?.differentiators || []
  const improvements = websiteAnalysis?.competitivePositioning?.improvements || []
  const combined = [...differentiators.map((d: string) => `Strength: ${d}`), ...improvements.map((i: string) => `Improve: ${i}`)].slice(0, 4)
  return combined.length > 0 ? combined.join('; ') : 'Not specified'
}

function summariseChannelResearch(channelResearch: any) {
  if (!channelResearch) {
    return {
      recommendedPlatforms: 'Use best-fit channels for the ICP.',
      directories: 'Not specified',
      communities: 'Not specified',
      contentStrategy: 'Not specified',
      avoidNote: ''
    }
  }
  const recommendedPlatforms = channelResearch.recommendedPlatforms?.map((p: any) => `${p.platform} (${p.contentType || 'content'}, why: ${p.reasoning || 'n/a'})`).join(' | ') || 'Not specified'
  const directories = channelResearch.directories?.map((d: any) => `${d.name} (${d.reasoning || 'reason not given'})`).join(', ') || 'Not specified'
  const communities = channelResearch.communities?.map((c: any) => `${c.name} on ${c.platform} (${c.reasoning || 'reason not given'})`).join(' | ') || 'Not specified'
  const contentStrategy = channelResearch.contentStrategy || 'Not specified'
  const avoidNote = channelResearch.avoidPlatforms?.length > 0 ? `Avoid platforms: ${channelResearch.avoidPlatforms.join(', ')}` : ''
  return { recommendedPlatforms, directories, communities, contentStrategy, avoidNote }
}

function getMonthlyTheme(day: number, strategyMode?: string): string {
  const month = Math.ceil(day / 30)

  if (!strategyMode || strategyMode === 'foundation_content_community') {
    if (month === 1) return 'Month 1: Foundation & Platform Setup'
    const cycle = ((month - 2) % 2) + 2
    return cycle === 2
      ? `Month ${month}: Content Creation & Consistency`
      : `Month ${month}: Community Building & Engagement`
  }

  if (strategyMode === 'growth_acceleration') {
    return `Month ${month}: Growth Acceleration (50-200 users) - Channel optimization, referral systems, paid experiments`
  }
  if (strategyMode === 'scale_systems') {
    return `Month ${month}: Scale & Systems (200-500 users) - Automation, analytics, team processes`
  }
  if (strategyMode === 'revenue_focus') {
    return `Month ${month}: Revenue Focus (500-1000 users) - Conversion optimization, pricing, upsells`
  }

  return `Month ${month}: Content & Community`
}

const BANNED_PHRASES = ['webinar', 'funnel', 'paid ad', 'landing page', 'landing-page', 'cta & pricing', 'cta and pricing']

const normalizePlatform = (value?: string) => {
  if (!value) return ''
  const raw = value.toLowerCase().trim()
  const map: Record<string, string> = {
    'x': 'x',
    'x.com': 'x',
    'twitter': 'x',
    'twitter/x': 'x',
    'fb': 'facebook',
    'facebook groups': 'facebook',
    'facebook group': 'facebook',
    'ig': 'instagram',
    'insta': 'instagram',
    'li': 'linkedin',
    'linkedin': 'linkedin',
    'guerilla': 'guerrilla',
    'guerrilla marketing': 'guerrilla'
  }
  return map[raw] || raw
}

const isBanned = (title: string, description: string) => {
  const combined = `${title} ${description}`.toLowerCase()
  return BANNED_PHRASES.some((phrase) => combined.includes(phrase))
}

export async function POST(request: NextRequest) {
  try {
    const {
      user,
      startDay = 1,
      weekNumber = 1,
      focusArea = 'growth',
      dailyTaskCount = '3',
      websiteAnalysis,
      targetAudience,
      contextSignals,
      excludeTitles = []
    } = await request.json()

    const desiredDailyCount = parseInt(String(dailyTaskCount), 10) || 3
    const start = Number(startDay) || 1
    const end = start + 6
    const inferredWeek = Number(weekNumber) || Math.ceil(start / 7)
    const preferredPlatformsRaw = Array.isArray(user?.preferredPlatforms) ? user.preferredPlatforms : []
    const avoidPlatformsRaw = Array.isArray(contextSignals?.avoidPlatforms) ? contextSignals.avoidPlatforms : []
    const preferredPlatforms = preferredPlatformsRaw.map((p: string) => normalizePlatform(String(p))).filter(Boolean)
    const avoidPlatforms = avoidPlatformsRaw.map((p: string) => normalizePlatform(String(p))).filter(Boolean)
    const preferredNote = preferredPlatforms.length > 0 ? `Prioritize ONLY these platforms: ${preferredPlatforms.join(', ')}` : 'Use the best-fit platforms for the ICP.'
    const avoidNote = avoidPlatforms.length > 0 ? `Avoid platforms: ${avoidPlatforms.join(', ')}` : 'No explicit avoid list.'
    const guerrillaGuidance = 'If platform = "guerrilla", design unexpected, low-cost IRL/digital stunts (stickers/QR drops, chalk tags, prop demos, micro meetups) with a measurable hook (scans, DMs, photo proof). Avoid generic social posts.'

    const targetAudienceSummary = summariseTargetAudience(targetAudience || user?.targetAudience || websiteAnalysis?.businessOverview?.targetAudience)
    const websiteIndustry = safeString(websiteAnalysis?.businessOverview?.industry, 'Not specified')
    const productNameDisplay = safeString(user?.productName, 'Product')
    const productValueProp = safeString(user?.valueProp, 'Not provided')
    const goalAmountDisplay = safeString(user?.goalAmount, 'No amount set')
    const goalTypeDisplay = safeString(user?.goalType, 'goal metric')
    const goalTimelineDisplay = safeString(user?.goalTimeline, 'unspecified')
    const launchDateDisplay = safeString(user?.launchDate, 'Not provided')
    const websiteSummary = safeString(websiteAnalysis?.businessOverview?.summary, 'Not provided')
    const websiteBusinessModel = safeString(websiteAnalysis?.businessOverview?.businessModel, 'Not specified')
    const websiteValueProps = formatList(websiteAnalysis?.businessOverview?.valueProps?.slice(0, 3), 'Not specified')
    const websiteAudienceFromAnalysis = formatList(websiteAnalysis?.businessOverview?.targetAudience, 'Not specified')
    const strengthsSummary = formatList(websiteAnalysis?.marketingStrengths?.slice(0, 3), 'Not specified')
    const opportunitiesSummary = summariseOpportunities(websiteAnalysis)
    const actionableSummary = summariseActionableRecs(websiteAnalysis)
    const messagingSummary = summariseMessagingInsights(websiteAnalysis)
    const competitiveSummary = summariseCompetitive(websiteAnalysis)
    const channelResearch = summariseChannelResearch(websiteAnalysis?.marketingChannelResearch)
    const audienceDeepDive = buildAudienceDeepDive(targetAudience || user?.targetAudience || websiteAnalysis?.businessOverview?.targetAudience)
    const monthlyTheme = getMonthlyTheme(start, user?.strategyMode || 'foundation_content_community')
    const formattedUsers = formatUsersMetric(parseMetric(user?.currentUsers ?? user?.current_users))
    const formattedMrr = formatMrrMetric(parseMetric(user?.currentMrr ?? user?.current_mrr))
    const userStageSummary = describeStage(parseMetric(user?.currentUsers ?? user?.current_users), USER_STAGE_DEFINITIONS, 'No user data provided - assume pre-launch validation focus.')
    const revenueStageSummary = describeStage(parseMetric(user?.currentMrr ?? user?.current_mrr), REVENUE_STAGE_DEFINITIONS, 'No revenue data provided - assume pre-revenue focus on first conversions.')
    const excludeTitlesList = (Array.isArray(excludeTitles) ? excludeTitles : []).slice(0, 30).join(' | ') || 'None'
    const weekOneIntro = inferredWeek === 1 && start === 1
      ? 'You are a fractional CMO designing the FIRST WEEK after onboarding. Build a 7-day sprint that proves resonance fast and aligns to the ICP.'
      : `You are designing a coherent WEEKLY marketing mission for Week ${inferredWeek}.`

    const weeklyPrompt = `${weekOneIntro} Create tightly-related tasks across Days ${start}-${end}.

BUSINESS SNAPSHOT:
- Product: ${productNameDisplay}
- Website Summary: ${websiteSummary}
- Value Proposition: ${productValueProp}
- ICP / Target Audience: ${targetAudienceSummary}
- Audience cues from site: ${websiteAudienceFromAnalysis}
- Industry: ${websiteIndustry} | Model: ${websiteBusinessModel} | Strengths: ${strengthsSummary} | Value Props: ${websiteValueProps}
- Goal: ${goalAmountDisplay} ${goalTypeDisplay} in ${goalTimelineDisplay} months
- Current Users: ${formattedUsers} | Stage: ${userStageSummary}
- Current MRR: ${formattedMrr} | Revenue Stage: ${revenueStageSummary}
- Focus Area: ${focusArea}
- Launch Date: ${launchDateDisplay}
- Strategy Mode Monthly Theme: ${monthlyTheme}

WEBSITE INSIGHTS (use to make tasks hyper-specific, not generic):
- Top Opportunities: ${opportunitiesSummary}
- Actionable Recs (limit to 1-2 tasks total for the week): ${actionableSummary}
- Messaging Gaps/Improvements: ${messagingSummary}
- Competitive Positioning: ${competitiveSummary}
- Channel Research: Platforms -> ${channelResearch.recommendedPlatforms}; Directories -> ${channelResearch.directories}; Communities -> ${channelResearch.communities}; Content Strategy -> ${channelResearch.contentStrategy}${channelResearch.avoidNote ? `; ${channelResearch.avoidNote}` : ''}

AUDIENCE DEEP DIVE:
- ${audienceDeepDive || 'None provided; default to pragmatic, specific language.'}

PLATFORM GUARDRAILS:
- ${preferredNote}
- ${avoidNote}
- ${guerrillaGuidance}

CONTEXT SIGNALS (exploit what works, keep variety):
- Completed tasks last 2 weeks: ${(contextSignals?.recentTasks || []).length}
- Top content items: ${(contextSignals?.content || []).length}
- Weekly feedback (if any): ${contextSignals?.weeklyFeedback ? JSON.stringify(contextSignals.weeklyFeedback).slice(0, 180) : 'n/a'}
- Titles to avoid: ${excludeTitlesList}

WEEKLY PLANNING RULES:
1) Start with a 1-sentence weekly theme that ties all 7 days together.
2) Generate exactly ${desiredDailyCount} tasks per day for Days ${start}-${end}. DO NOT return more or fewer.
3) Tasks must be 15-minute execution micro-actions with a clear deliverable (post, reply, DM, snippet, clip). No placeholders or project-sized work.
4) No funnels/webinars/paid ads/landing-page rebuilds. Limit landing/CTA tweaks to 1 task max across the week.
5) Rotate platforms within each day (no duplicates in a day) and across the week (varied mix of X, LinkedIn, Reddit, email, communities, short-form video, niche channels relevant to the ICP).
6) Maintain exploit/explore mix across the week: ~70% on best-fit/known channels, ~30% experiments. Label each task type accordingly.
7) Ensure tasks build on each other day-by-day (e.g., Day1 insights -> Day2 messaging post -> Day3 replies/outreach -> Day4 proof/social proof -> Day5-6 community engagement -> Day7 learning/iteration).
8) At least one task must reference a unique detail from the website summary, value props, or ICP narrative so it feels personalized.
9) Avoid duplicate titles/descriptions anywhere in the week. Already generated titles to avoid: ${excludeTitlesList}
10) Return JSON ONLY in this exact shape (no markdown):
{
  "weekly_theme": "One sentence that ties the week",
  "days": [
    {
      "day": ${start},
      "focus": "short phrase for the day",
      "tasks": [
        {
          "title": "Short natural title (under 70 chars)",
          "description": "1-2 sentences, under 100 chars total",
          "category": "content|analytics|community|strategy|engagement",
          "platform": "platform name lowercase",
          "impact": "one sentence outcome",
          "tips": ["tip1", "tip2"],
          "type": "exploit|explore"
        }
      ]
    }
  ]
}
11) If the model ever returns fewer than ${desiredDailyCount} tasks for a day, regenerate that day until it has exactly ${desiredDailyCount} tasks.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://marketingbuddy.ai',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [
          { role: 'system', content: 'You are a marketing expert who creates coherent weekly plans. Return ONLY valid JSON, no markdown.' },
          { role: 'user', content: weeklyPrompt }
        ],
        max_tokens: 6000,
        temperature: 0.65,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Weekly plan generation failed:', response.status, response.statusText, text.substring(0, 500))
      return NextResponse.json({ success: false, error: 'Weekly plan generation failed' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '{}'

    let parsed: any
    try {
      parsed = JSON.parse(content)
    } catch (err) {
      console.error('❌ Weekly JSON parse error:', err, 'Raw:', content.substring(0, 400))
      return NextResponse.json({ success: false, error: 'Weekly plan parse error' }, { status: 500 })
    }

    const days = Array.isArray(parsed?.days) ? parsed.days : []
    const normalizedTasks: any[] = []

    days.forEach((dayBlock: any) => {
      const dayNumber = Number(dayBlock?.day) || start + normalizedTasks.length
      const tasks = Array.isArray(dayBlock?.tasks) ? dayBlock.tasks : []
      tasks.slice(0, desiredDailyCount).forEach((task: any, index: number) => {
        normalizedTasks.push({
          id: `marketing-${dayNumber}-${index + 1}`,
          day: dayNumber,
          title: task?.title || 'Untitled task',
          description: task?.description || '',
          category: task?.category || 'strategy',
          platform: task?.platform?.toLowerCase() || undefined,
          impact: task?.impact || 'Builds marketing momentum',
          tips: Array.isArray(task?.tips) ? task.tips.slice(0, 3) : [],
          type: task?.type || 'explore',
          xp: 15,
          completed: false,
          estimatedTime: '15 min',
          metadata: {
            algorithm_version: 'v2_weekly',
            day: dayNumber,
            week: inferredWeek || Math.ceil(dayNumber / 7),
            month: Math.ceil(dayNumber / 30),
            source: 'weekly_plan'
          }
        })
      })
    })

    const excludeSet = new Set<string>((Array.isArray(excludeTitles) ? excludeTitles : []).map((t: string) => t.toLowerCase().trim()))
    const allowedSet = new Set<string>(preferredPlatforms)
    const avoidSet = new Set<string>(avoidPlatforms)
    const seen = new Set<string>()

    const filtered: any[] = []
    normalizedTasks.forEach((task) => {
      const title = String(task.title || '').trim()
      const description = String(task.description || '').trim()
      if (!title) return
      const titleKey = title.toLowerCase()
      const key = `${titleKey}|${description.toLowerCase()}`
      const platform = normalizePlatform(task.platform)
      if (excludeSet.has(titleKey)) return
      if (isBanned(title, description)) return
      if (allowedSet.size > 0 && platform && !allowedSet.has(platform)) return
      if (avoidSet.has(platform)) return
      if (seen.has(titleKey) || seen.has(key)) return
      seen.add(titleKey)
      seen.add(key)
      filtered.push({
        ...task,
        title,
        description: description || `Do this now: ${title}. Keep it specific, helpful, and non-promotional.`,
        platform: platform || undefined
      })
    })

    const researchedPlatforms = Array.isArray(websiteAnalysis?.marketingChannelResearch?.recommendedPlatforms)
      ? websiteAnalysis.marketingChannelResearch.recommendedPlatforms.map((p: any) => normalizePlatform(p.platform)).filter(Boolean)
      : []
    const fallbackPlatformsPool = (preferredPlatforms.length > 0 ? preferredPlatforms : (researchedPlatforms.length > 0 ? researchedPlatforms : ['x', 'linkedin', 'reddit', 'email', 'indie hackers', 'discord']))
      .filter((p) => !avoidSet.has(p))
    const fallbackPlatforms = fallbackPlatformsPool.length > 0 ? fallbackPlatformsPool : ['x']

    const fallbackTemplates = [
      (platform: string) => ({
        title: `Post a pain-point hook on ${platform}`,
        description: `Share how ${productNameDisplay} fixes one ${targetAudienceSummary} pain in 3 lines.`,
        category: 'content' as const,
        platform,
        impact: 'Quick awareness nudge for the target audience.',
        tips: ['Lead with the pain, end with a 1-line outcome.'],
        type: 'exploit' as const
      }),
      (platform: string) => ({
        title: `Ask for one blocker on ${platform}`,
        description: `Post 1 question asking ${targetAudienceSummary} their top blocker; reply to 2 responses.`,
        category: 'engagement' as const,
        platform,
        impact: 'Opens a feedback loop with real prospects.',
        tips: ['Name the persona in the question.', 'Offer a quick tip in replies.'],
        type: 'explore' as const
      }),
      (platform: string) => ({
        title: `Share a mini demo on ${platform}`,
        description: `Write a 4-step text demo showing ${productNameDisplay} delivering ${productValueProp}.`,
        category: 'content' as const,
        platform,
        impact: 'Shows the product in action with a simple CTA.',
        tips: ['Use a before/after line.', 'End with a one-click CTA or link.'],
        type: 'exploit' as const
      }),
      (platform: string) => ({
        title: `Drop 3 helpful replies on ${platform}`,
        description: `Find 3 threads where ${targetAudienceSummary} hangs out; add one practical tip each.`,
        category: 'community' as const,
        platform,
        impact: 'Earns credibility and profile visits.',
        tips: ['Avoid pitching—be concise and useful.', 'Sign off with a soft mention of the product.'],
        type: 'explore' as const
      })
    ]

    const buildFallbackTask = (dayNumber: number, index: number) => {
      const platform = fallbackPlatforms[(dayNumber + index) % fallbackPlatforms.length] || 'x'
      const template = fallbackTemplates[index % fallbackTemplates.length]
      const base = platform === 'guerrilla'
        ? {
            title: 'Run a quick guerrilla stunt',
            description: 'Place 5 QR stickers with a curiosity hook near your ICP; snap 1 photo + track scans.',
            category: 'engagement',
            platform,
            impact: 'Creates memorable offline buzz that drives scans/DMs.',
            tips: ['Use bold contrast + short hook.', 'Use a unique URL/QR to measure scans.'],
            type: 'explore'
          }
        : template(platform)
      return {
        id: `marketing-${dayNumber}-fallback-${index + 1}`,
        day: dayNumber,
        ...base,
        xp: 15,
        completed: false,
        estimatedTime: '15 min',
        metadata: {
          algorithm_version: 'v2_weekly',
          day: dayNumber,
          week: inferredWeek || Math.ceil(dayNumber / 7),
          month: Math.ceil(dayNumber / 30),
          source: 'weekly_plan_fallback'
        }
      }
    }

    const perDay: Record<number, any[]> = {}
    filtered.forEach((task) => {
      const dayKey = Number(task.day) || start
      if (!perDay[dayKey]) perDay[dayKey] = []
      if (perDay[dayKey].length < desiredDailyCount) {
        perDay[dayKey].push(task)
      }
    })

    for (let dayNum = start; dayNum <= end; dayNum++) {
      if (!perDay[dayNum]) perDay[dayNum] = []
      while (perDay[dayNum].length < desiredDailyCount) {
        perDay[dayNum].push(buildFallbackTask(dayNum, perDay[dayNum].length))
      }
      perDay[dayNum] = perDay[dayNum].slice(0, desiredDailyCount)
    }

    const finalTasks = Object.keys(perDay)
      .sort((a, b) => Number(a) - Number(b))
      .flatMap((dayKey) => perDay[Number(dayKey)])

    return NextResponse.json({
      success: true,
      weeklyTheme: parsed?.weekly_theme || '',
      tasks: finalTasks,
      days: Object.keys(perDay).map((dayKey) => ({ day: Number(dayKey), tasks: perDay[Number(dayKey)] })),
      raw: content
    })
  } catch (error) {
    console.error('Weekly plan generation error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate weekly plan' }, { status: 500 })
  }
}
