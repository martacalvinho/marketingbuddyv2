export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Generate a 30-day marketing plan based on user data
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
            content: `You are a marketing expert creating a personalized 30-day marketing plan. Generate a structured markdown document with the following format:

# 30-Day Marketing Plan

## Business Analysis Summary
${userData.websiteAnalysis ? `
Based on website analysis:
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

## 4-Week Structure

### Week 1: Find Your First 10 Users
### Week 2: Content Cadence
### Week 3: Launch Amplify  
### Week 4: Retention & Referral

## Daily Tasks

For each day, provide exactly 3 actionable micro-tasks (≤15 minutes each). Use this exact format:

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
    const plan = planData.choices[0]?.message?.content || "Plan generation in progress..."

    // In a real app, you'd save this to your database
    // For now, we'll just return success
    return Response.json({
      success: true,
      message: "Marketing plan generated successfully",
      plan: plan,
    })
  } catch (error) {
    console.error("Plan generation error:", error)
    return Response.json({ error: "Failed to generate marketing plan" }, { status: 500 })
  }
}
