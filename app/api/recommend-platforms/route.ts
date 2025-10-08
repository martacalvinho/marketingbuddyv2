import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface Platform {
  id: string
  name: string
  category: 'must_have' | 'recommended' | 'optional'
  reasoning: string
  audienceFit: number // 1-10
  contentFit: number // 1-10
  effortLevel: 'low' | 'medium' | 'high'
}

export async function POST(request: NextRequest) {
  try {
    const { websiteAnalysis, productName, valueProp, targetAudience } = await request.json()

    if (!websiteAnalysis) {
      return NextResponse.json({ error: 'Website analysis required' }, { status: 400 })
    }

    // Extract key context from website analysis
    const industry = websiteAnalysis.businessOverview?.industry || ''
    const targetAudienceList = websiteAnalysis.businessOverview?.targetAudience || []
    const businessModel = websiteAnalysis.businessOverview?.businessModel || ''
    const strengths = websiteAnalysis.marketingStrengths?.slice(0, 3).map((s: any) => s.title).join(', ') || ''
    const opportunities = websiteAnalysis.marketingOpportunities?.slice(0, 3).map((o: any) => o.title).join(', ') || ''

    // Call AI to recommend platforms
    const platformPrompt = `You are a marketing platform strategist. Based on the business analysis below, recommend the BEST marketing platforms.

BUSINESS CONTEXT:
- Product: ${productName}
- Value Proposition: ${valueProp}
- Industry: ${industry}
- Business Model: ${businessModel}
- Target Audience: ${targetAudienceList.join(', ')}
- Marketing Strengths: ${strengths}
- Key Opportunities: ${opportunities}

AVAILABLE PLATFORMS:
1. LinkedIn (B2B, professional networking, thought leadership)
2. Twitter/X (real-time, tech community, thought leadership)
3. Instagram (visual content, lifestyle, B2C)
4. TikTok (short video, Gen Z/Millennial, viral potential)
5. YouTube (long-form video, tutorials, demos)
6. Pinterest (visual discovery, DIY, design, inspiration)
7. Medium (long-form writing, thought leadership)
8. Substack (newsletter, paid community)
9. Reddit (niche communities, discussions, authenticity)
10. Discord (real-time community, gaming/tech)
11. Facebook Groups (broad communities, local)
12. Product Hunt (product launches, tech early adopters)
13. SEO Blog (organic search, evergreen content)
14. Indie Hackers (startup/maker community)
15. Behance/Dribbble (design portfolios)
16. GitHub (developer community, open source)
17. Houzz (architecture/interior design)

CATEGORIZE platforms as:
- MUST_HAVE (2-3 platforms): Best audience fit, proven for this industry, high ROI potential
- RECOMMENDED (3-4 platforms): Good fit, worth testing, medium effort
- OPTIONAL (2-3 platforms): Experimental, niche opportunities, higher effort

For each platform, provide:
1. Category (must_have/recommended/optional)
2. Reasoning (1-2 sentences on WHY it fits this business)
3. Audience Fit (1-10 score)
4. Content Fit (1-10 score based on their strengths)
5. Effort Level (low/medium/high)

CRITICAL RULES:
- Consider the TARGET AUDIENCE's behavior (where do they actually spend time?)
- Match CONTENT TYPE to platform (visual → Instagram, written → Medium, etc.)
- Consider BUSINESS MODEL (B2B → LinkedIn, B2C → Instagram/TikTok)
- Be SPECIFIC to this industry (don't recommend TikTok for B2B SaaS)
- AVOID platforms that don't match (e.g., Pinterest for developer tools)

Return ONLY valid JSON in this format:
{
  "platforms": [
    {
      "id": "linkedin",
      "name": "LinkedIn",
      "category": "must_have",
      "reasoning": "Your target audience (real estate developers, corporate clients) are active decision-makers on LinkedIn. Perfect for B2B relationship building and showcasing project portfolios.",
      "audienceFit": 9,
      "contentFit": 8,
      "effortLevel": "medium"
    }
  ]
}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing platform strategist. Return ONLY valid JSON, no markdown, no explanations.'
          },
          {
            role: 'user',
            content: platformPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText)
      // Return fallback recommendations
      return NextResponse.json({
        platforms: getFallbackPlatforms(industry, businessModel, targetAudienceList)
      })
    }

    const data = await response.json()
    let content = data.choices[0]?.message?.content || ''

    // Clean up response (remove markdown, extract JSON)
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Extract JSON if wrapped in other text
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      content = jsonMatch[0]
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content)
      return NextResponse.json({
        platforms: getFallbackPlatforms(industry, businessModel, targetAudienceList)
      })
    }

    // Validate and sort platforms
    const platforms: Platform[] = (parsed.platforms || [])
      .filter((p: any) => p.id && p.name && p.category && p.reasoning)
      .sort((a: Platform, b: Platform) => {
        const categoryOrder = { must_have: 0, recommended: 1, optional: 2 }
        if (categoryOrder[a.category] !== categoryOrder[b.category]) {
          return categoryOrder[a.category] - categoryOrder[b.category]
        }
        return (b.audienceFit + b.contentFit) - (a.audienceFit + a.contentFit)
      })

    return NextResponse.json({
      platforms,
      summary: {
        mustHave: platforms.filter(p => p.category === 'must_have').length,
        recommended: platforms.filter(p => p.category === 'recommended').length,
        optional: platforms.filter(p => p.category === 'optional').length
      }
    })

  } catch (error) {
    console.error('Platform recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate platform recommendations' },
      { status: 500 }
    )
  }
}

// Fallback recommendations based on simple heuristics
function getFallbackPlatforms(industry: string, businessModel: string, targetAudience: string[]): Platform[] {
  const industryLower = industry.toLowerCase()
  const isB2B = businessModel.toLowerCase().includes('b2b') || 
                targetAudience.some(a => a.toLowerCase().includes('business') || a.toLowerCase().includes('enterprise'))

  const platforms: Platform[] = []

  // B2B defaults
  if (isB2B) {
    platforms.push({
      id: 'linkedin',
      name: 'LinkedIn',
      category: 'must_have',
      reasoning: 'Primary B2B platform for professional networking and thought leadership.',
      audienceFit: 9,
      contentFit: 8,
      effortLevel: 'medium'
    })
    platforms.push({
      id: 'twitter',
      name: 'Twitter/X',
      category: 'recommended',
      reasoning: 'Great for real-time engagement and building thought leadership in your industry.',
      audienceFit: 7,
      contentFit: 7,
      effortLevel: 'medium'
    })
  } else {
    // B2C defaults
    platforms.push({
      id: 'instagram',
      name: 'Instagram',
      category: 'must_have',
      reasoning: 'Visual platform perfect for showcasing products and building brand awareness.',
      audienceFit: 8,
      contentFit: 9,
      effortLevel: 'medium'
    })
    platforms.push({
      id: 'tiktok',
      name: 'TikTok',
      category: 'recommended',
      reasoning: 'High engagement potential with short-form video content.',
      audienceFit: 7,
      contentFit: 8,
      effortLevel: 'high'
    })
  }

  // Universal recommendations
  platforms.push({
    id: 'seo-blog',
    name: 'SEO Blog',
    category: 'recommended',
    reasoning: 'Evergreen content that drives organic traffic and establishes expertise.',
    audienceFit: 8,
    contentFit: 7,
    effortLevel: 'high'
  })

  platforms.push({
    id: 'youtube',
    name: 'YouTube',
    category: 'optional',
    reasoning: 'Long-form video content for tutorials, demos, and thought leadership.',
    audienceFit: 6,
    contentFit: 7,
    effortLevel: 'high'
  })

  return platforms
}
