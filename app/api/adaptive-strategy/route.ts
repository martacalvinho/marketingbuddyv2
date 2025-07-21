export async function POST(request: Request) {
  try {
    const { user, currentMetrics, previousStrategies, monthNumber, currentPlan, multiPlatform } = await request.json()

    // Analyze current performance and adapt strategy
    const adaptiveResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: `You are an expert adaptive marketing strategist. ${multiPlatform ? 'Generate a multi-platform strategy' : 'Generate a focused strategy'} for Month ${monthNumber || 'Next'} based on user progress and performance data.

${multiPlatform ? `
MULTI-PLATFORM FOCUS: Analyze and recommend the best platforms for this business:
- Consider target audience behavior across platforms
- Recommend platform-specific content strategies
- Focus on 2-4 optimal platforms, not just one
- Provide platform-specific daily tasks and metrics
` : ''}

Current Context:
${currentPlan ? `
Existing Strategy Overview:
${currentPlan.substring(0, 500)}...
` : ''}

Current User Metrics:
- Users: ${currentMetrics?.users || 0}
- Revenue: $${currentMetrics?.revenue || 0}
- Streak: ${currentMetrics?.streak || 0} days
- Top Performing Strategy: ${currentMetrics?.topStrategy || 'None identified'}
- Conversion Rate: ${currentMetrics?.conversionRate || 0}%

Previous Strategies Performance:
${previousStrategies?.map((s: any) => `- ${s.strategy}: ${s.performance}`).join('\n') || 'None yet'}

User Profile:
- Product: ${user?.productName || 'Not specified'}
- Value Prop: ${user?.valueProp || 'Not specified'}
- Current Goal: ${user?.northStarGoal || 'Not specified'}
- Preferred Channel: ${user?.preferredChannel || 'Not specified'}

Generate Month ${monthNumber || 'Next'} strategy that:
1. ${multiPlatform ? 'Leverages multiple optimal platforms based on business analysis' : 'Builds on what\'s working'}
2. Pivots away from underperforming tactics
3. Introduces new platform-specific tactics for current growth stage
4. Provides specific daily tasks with platform recommendations
5. ${multiPlatform ? 'Includes cross-platform content amplification strategies' : 'Adapts to their progress level'}

Format as markdown with:
# Adaptive Strategy - Month [X]

## Performance Analysis
[Brief analysis of what's working/not working]

## Strategic Focus
[Main focus for this month based on current metrics]

## Daily Tasks (Next 30 Days)
[Provide 3 tasks per day, adapted to their current stage]

### Day 1
- **Task 1:** [Specific action]
- **Task 2:** [Specific action]
- **Task 3:** [Specific action]

[Continue for 30 days with tasks that evolve based on their stage]`
          },
          {
            role: "user",
            content: `Generate an adaptive marketing strategy for the next month based on my current progress and what's been working/not working.`
          }
        ]
      })
    })

    if (!adaptiveResponse.ok) {
      throw new Error(`OpenRouter API error: ${adaptiveResponse.status}`)
    }

    const data = await adaptiveResponse.json()
    const adaptiveStrategy = data.choices[0]?.message?.content

    return Response.json({ 
      strategy: adaptiveStrategy,
      adaptedAt: new Date().toISOString(),
      basedOnMetrics: currentMetrics
    })

  } catch (error) {
    console.error("Adaptive strategy generation failed:", error)
    return Response.json(
      { error: "Failed to generate adaptive strategy" },
      { status: 500 }
    )
  }
}
