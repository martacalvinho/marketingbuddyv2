export async function POST(request: Request) {
  try {
    const { user, month, weekInMonth, currentDay, monthStrategy } = await request.json()

    // Generate specific daily tasks for the month based on strategy and business analysis
    const tasksResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: `You are an expert marketing strategist creating specific daily tasks for Month ${month} of a 6-month marketing plan.

CONTEXT:
- Current Day: ${currentDay}
- Month: ${month}
- Week in Month: ${weekInMonth}
- Business: ${user.productName || 'Not specified'}
- Value Prop: ${user.valueProp || 'Not specified'}
- Goal: ${user.northStarGoal || 'Not specified'}
- Website Analysis: ${user.websiteAnalysis ? JSON.stringify(user.websiteAnalysis).substring(0, 500) : 'Not available'}

MONTH ${month} STRATEGY CONTEXT:
${monthStrategy || 'General marketing growth strategy'}

TASK REQUIREMENTS:
- Generate 3 specific, actionable daily tasks for Day ${currentDay}
- Each task should take 15 minutes or less
- Tasks must align with Month ${month} strategy and business analysis
- Include platform-specific actions based on business type
- Focus on measurable outcomes that build toward 1000 users
- Consider the user's industry and target audience

FORMAT YOUR RESPONSE EXACTLY AS:
### Day ${currentDay}

- **Task 1:** [Specific actionable task with clear outcome]
- **Task 2:** [Specific actionable task with clear outcome] 
- **Task 3:** [Specific actionable task with clear outcome]

EXAMPLE TASKS (adapt to user's business):
- **Task 1:** Create and optimize LinkedIn Company Page profile with company description, services, and upload 3-4 high-quality graphics related to [business focus].
- **Task 2:** Set up basic Instagram Business Profile and upload 3-4 high-quality graphics related to [business value proposition].
- **Task 3:** Draft initial LinkedIn post announcing [product launch], targeting [specific audience].

Make tasks specific to the user's business, not generic examples.`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    })

    const data = await tasksResponse.json()
    const generatedTasks = data.choices[0]?.message?.content || ""

    return Response.json({ 
      tasks: generatedTasks,
      success: true,
      month: month,
      day: currentDay
    })

  } catch (error) {
    console.error("Error generating daily tasks:", error)
    return Response.json({ 
      error: "Failed to generate daily tasks",
      success: false
    }, { status: 500 })
  }
}
