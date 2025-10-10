import { NextRequest, NextResponse } from 'next/server'

// Curated launch/listing directories for SaaS (category: "SaaS Directories")
const SAAS_DIRECTORIES: string[] = [
  'Product Hunt.com', 'BetaList.com', 'Alternativeto.net', 'Tinylaunch.com', 'Uneed.best', 'Easysaveai.com', 'Devhunt.org', 'Peerlist.io', 'Appsumo.com', 'Futuretools.io',
  'Stackshare.io', 'Hackernews.com', 'Pitchwall.co', 'Indiehackers.com/products', 'Launchingnext.com/', 'Startupstash.com', 'Pitchwall.co', 'Theresanaiforthat.com', 'Saashub.com', '500.tools', 'startupfa.me', 'g2.com',
]

// Curated subreddits relevant to SaaS founders and marketing
const SAAS_SUBREDDITS: string[] = [
  'SaaS', 'startups', 'Entrepreneur', 'IndieHackers', 'SideProject', 'SmallBusiness', 'StartupWeekend', 'ProductHunters',
  'thesidehustle', 'startup_resources', 'startups_promotion', 'ProductHunters', 'SaaSy', 'growthhacking', 'EntrepreneurRideAlong', 'userexperience',
  'indiebiz', 'freelance', 'Design', 'NoCode', 'Freepromote', 'Growmybusiness', 'IMadeThis', 'Digitalnomad', 'RoastMyStartup', 'microsaas', 'alphaandbetausers',    
]

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

    const marketingPrompt = `You are generating Day ${day} marketing tasks for a real business. Use the context below to create SPECIFIC, ACTIONABLE tasks (not templates or placeholders).

BUSINESS CONTEXT:
- Product: ${user.productName}
- Value Prop: ${user.valueProp}
- Target Audience: ${typeof user.targetAudience === 'string' ? user.targetAudience : JSON.stringify(user.targetAudience)}
- Goal: ${user.goalAmount} ${user.goalType} in ${user.goalTimeline} months
- North Star: ${user.northStarGoal}
- Experience: ${user.experienceLevel}
- Platforms: ${user.preferredPlatforms?.join(', ')}
- Challenge: ${user.challenges}

${websiteAnalysis ? `WEBSITE ANALYSIS (use this to make tasks specific):
- Industry: ${websiteAnalysis.businessOverview?.industry}
- Key Strengths: ${websiteAnalysis.marketingStrengths?.slice(0, 3).join(', ')}
- Top Opportunities: ${websiteAnalysis.marketingOpportunities?.slice(0, 2).map((o: any) => o.title).join(', ')}
` : ''}
${contextBlock}

CRITICAL RULES:
1. NO placeholders like "[Target Audience]" or "[Service 1]" - use actual business details
2. NO generic strategy tasks like "define your message" - we already did onboarding
3. Each task must be DOABLE IN 15 MINUTES with a clear deliverable
4. Focus on EXECUTION, not planning (e.g., "Post on LinkedIn about X" not "Plan LinkedIn strategy")
5. Use the actual product name, value prop, and target audience in task descriptions
6. **EXPLORE/EXPLOIT MIX**: Generate ${Math.max(1, marketingTasksTarget - 1)} tasks on top-performing channels (exploit what works) + ${Math.min(1, marketingTasksTarget)} task trying something new (explore to learn)
7. **AVOID** channels with 3+ skips unless exploring
8. **RESPECT MONTHLY THEMES**: ${getMonthlyTheme(day, user.strategyMode || 'foundation_content_community')}
9. Treat product-launch sites as a category: use "SaaS Directories" instead of repeatedly recommending Product Hunt. Rotate across these directories: ${SAAS_DIRECTORIES.join(', ')}
10. For Reddit tasks, pick subreddits relevant to the target audience and rotate across this pool: ${SAAS_SUBREDDITS.map(s => `r/${s}`).join(', ')}
11. Do not repeat the same platform twice in the same day.

GOOD TASK EXAMPLES:
- "Post on LinkedIn: Share how ${user.productName} solves [specific pain point from target audience] in 3 bullet points"
- "Engage on Reddit: Find 2 threads in r/[relevant subreddit] where your target audience discusses [their challenge] and provide helpful advice"
- "Create Twitter thread: Write 5 tweets explaining why [specific target audience] should care about [your value prop]"

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
        marketingTasks = generateFallbackMarketingTasks(user, day, marketingTasksTarget)
      }
    } catch (error) {
      console.error('Marketing task generation failed:', error)
      // Fallback marketing tasks
      marketingTasks = generateFallbackMarketingTasks(user, day, marketingTasksTarget)
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
          const backfill = generateFallbackMarketingTasks(user, day, removedCount)
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
      const fallbackPool = generateFallbackMarketingTasks(user, day + (uniqueCombined.length || 0), Math.max(needed * 2, needed + 2))
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

function generateFallbackMarketingTasks(user: any, day: number, count: number): any[] {
  const productName = user.productName || 'your product'
  const targetAudience = typeof user.targetAudience === 'string'
    ? user.targetAudience
    : (user.targetAudience?.professions?.[0] || 'your target audience')

  // Rotate simple platform pool to avoid repetition
  const PLATFORM_POOL = ['linkedin', 'twitter', 'reddit', 'blog', 'indiehackers', 'saas_directories']
  const pick = <T,>(arr: T[], i: number) => arr[i % arr.length]
  const pickFrom = (arr: string[], i: number) => arr[(i + day) % arr.length]

  const tasks: any[] = []
  for (let i = 0; i < Math.max(3, count + 1); i++) {
    const platform = pick(PLATFORM_POOL, day + i)
    if (platform === 'saas_directories') {
      const dir = pickFrom(SAAS_DIRECTORIES, i)
      tasks.push({
        title: `Submit ${productName} to ${dir}`,
        description: `Prepare a 3-line description and 3 key benefits, then submit ${productName} to ${dir}. Keep assets handy (logo, 1 screenshot, website link).` ,
        category: 'strategy',
        impact: 'Generates discovery traffic from SaaS buyers searching directories'
      })
    } else if (platform === 'reddit') {
      const sub = pickFrom(SAAS_SUBREDDITS, i)
      tasks.push({
        title: `Engage in r/${sub}`,
        description: `Find 2 threads in r/${sub} where ${targetAudience} discuss your problem. Add helpful, non-promotional comments and save links for follow-up.`,
        category: 'community',
        impact: 'Builds awareness and relationships in a relevant community'
      })
    } else if (platform === 'indiehackers') {
      tasks.push({
        title: `Post update on Indie Hackers`,
        description: `Share one learning or small milestone from building ${productName}. Include one specific metric and a question to invite discussion.`,
        category: 'engagement',
        impact: 'Attracts feedback and early adopters from the builder community'
      })
    } else if (platform === 'blog') {
      tasks.push({
        title: `Draft a 150-word SEO snippet`,
        description: `Write a short paragraph answering one specific question your ${targetAudience} search. Save it to expand into a blog post later.`,
        category: 'content',
        impact: 'Seeds evergreen search traffic with minimal effort'
      })
    } else if (platform === 'twitter') {
      tasks.push({
        title: `Post a value tip on Twitter/X`,
        description: `Tweet one actionable tip helping ${targetAudience} related to ${user.valueProp || 'your value prop'}. Add 1 screenshot or example.`,
        category: 'content',
        impact: 'Builds authority and drives profile visits'
      })
    } else {
      // linkedin
      tasks.push({
        title: `Share a LinkedIn insight`,
        description: `Write 4-6 lines on a problem your ${targetAudience} faces and how ${productName} solves it. End with a question.`,
        category: 'content',
        impact: 'Warms up B2B audience and invites conversation'
      })
    }
  }

  // Rotate starting point by day to vary tasks across the week and return requested count
  const start = (Math.max(0, day - 1)) % tasks.length
  const rotated = [...tasks.slice(start), ...tasks.slice(0, start)]

  return rotated.slice(0, count).map((task, index) => ({
    id: `fallback-${day}-${index + 1}`,
    ...task,
    tips: [
      'Be specific and authentic',
      'Focus on helping, not selling',
      'Track what gets engagement'
    ],
    xp: 15,
    completed: false,
    estimatedTime: '15 min',
    day,
    type: 'marketing'
  }))
}
