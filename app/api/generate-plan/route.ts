export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Generate a 6+ month adaptive marketing plan based on user data
    let plan: string | null = null
    try {
      const planResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
          messages: [
            {
              role: "system",
              content: `You are an expert marketing strategist creating a personalized 6+ month multi-platform adaptive marketing plan. 

IMPORTANT: Analyze the business and recommend the BEST platforms and content strategies based on:
1. Target audience behavior and demographics
2. Business type and industry
3. Content format strengths
4. Platform-specific opportunities
5. Resource requirements and ROI potential

Do NOT limit to one platform. Recommend 2-4 optimal platforms with specific strategies for each.

Generate a structured markdown document with this format:

# Multi-Platform Adaptive Marketing Strategy

## Business & Platform Analysis
${userData.websiteAnalysis ? `
Website Analysis:
- Business: ${userData.websiteAnalysis.businessOverview?.summary || 'Not analyzed'}
- Industry: ${userData.websiteAnalysis.businessOverview?.industry || 'Not specified'}
- Target Audience: ${userData.websiteAnalysis.businessOverview?.targetAudience?.join(', ') || 'Not specified'}
- Key Opportunities: ${userData.websiteAnalysis.marketingOpportunities?.slice(0,3).map((op: any) => op.title).join(', ') || 'None identified'}
` : ''}

User Profile:
- Product: ${userData.productName || 'Not specified'}
- Value Proposition: ${userData.valueProp || 'Not specified'}
- Goal: ${userData.northStarGoal || 'Not specified'}
- Preferred Channel: ${userData.preferredChannel || 'Not specified'}
- Current Audience: ${userData.audienceSize || 'Not specified'}

## Recommended Platform Strategy
Based on analysis, recommend optimal platforms with reasoning:
- Primary Platform: [Platform] - [Why it's best for this business]
- Secondary Platform: [Platform] - [Complementary strategy]
- Content Distribution: [Additional platforms for amplification]
- Platform-Specific Content Types: [What works best where]

## 6-Month Multi-Platform Strategy

### Month 1: Foundation & Platform Setup (0-50 users)
- Week 1-2: Platform Optimization & Content Pillars
- Week 3-4: Initial User Acquisition

### Month 2: Content & Community (10-50 users)
- Week 5-6: Content Strategy Development
- Week 7-8: Community Building

### Month 3: Growth Acceleration (50-200 users)
- Week 9-10: Channel Optimization
- Week 11-12: Referral Systems

### Month 4: Scale & Systems (200-500 users)
- Week 13-14: Process Automation
- Week 15-16: Advanced Analytics

### Month 5: Revenue Focus (500-1000 users)
- Week 17-18: Conversion Optimization
- Week 19-20: Pricing Strategy

### Month 6: Sustainable Growth (1000+ users, $1k+ MRR)
- Week 21-22: Retention & LTV
- Week 23-24: Market Expansion

## Adaptive Daily Tasks

The plan adapts based on your progress. For each day, you'll get 3 actionable micro-tasks (≤15 minutes each) that adjust based on:
- Your current user count
- Revenue milestones achieved
- Which strategies are working
- Market feedback and results

Use this exact format for the first month:

### Day 1
- **Task 1:** [Specific action with clear instructions]
- **Task 2:** [Specific action with clear instructions]  
- **Task 3:** [Specific action with clear instructions]

Continue this pattern for all 30 days. Make tasks specific to the user's product, industry, and goals. Include exact copy templates, specific platforms, and measurable outcomes where possible.`,
            },
            {
              role: "user",
              content: "Generate my complete 30-day marketing plan in the specified markdown format.",
            },
          ],
          max_tokens: 4000,
          temperature: 0.7,
        }),
      })
      const planData = await planResponse.json()
      plan = planData.choices[0]?.message?.content || null
    } catch (aiErr) {
      console.warn("Plan AI generation failed, proceeding without plan:", aiErr)
      plan = null
    }

    // In a real app, you'd save this to your database
    // For now, we'll just return success
    return Response.json({
      success: true,
      message: plan ? "Marketing plan generated successfully" : "Plan not generated; proceeding without plan",
      plan
    })
  } catch (error) {
    console.error("Plan generation error:", error)
    // Never block onboarding on plan errors
    return Response.json({ success: true, message: "Plan not generated; proceeding without plan", plan: null })
  }
}
