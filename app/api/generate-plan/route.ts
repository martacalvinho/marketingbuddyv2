export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Generate a 30-day marketing plan based on user data
    const planResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: `Generate a 30-day marketing plan for an indie hacker. Create specific, actionable daily tasks that take ≤15 minutes each.

User Info:
- Product: ${userData.productName}
- Value Prop: ${userData.valueProp}
- Goal: ${userData.northStarGoal}
- Channel: ${userData.preferredChannel}
- Audience Size: ${userData.audienceSize}

Structure the plan as 4 weeks:
Week 1: "Find Your First 10 Users"
Week 2: "Content Cadence" 
Week 3: "Launch Amplify"
Week 4: "Retention & Referral"

For each day, provide 3 micro-tasks with exact copy templates and specific instructions.`,
          },
          {
            role: "user",
            content: "Generate my personalized 30-day marketing plan",
          },
        ],
        max_tokens: 2000,
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
