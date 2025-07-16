export async function POST(request: Request) {
  try {
    const { message, userId, context } = await request.json()

    console.log("Chat request received:", { message, context })

    // Build context from real website analysis
    const analysisContext = context.websiteAnalysis
      ? `
Website Analysis Context:
- Business: ${context.websiteAnalysis.businessOverview?.summary}
- Industry: ${context.websiteAnalysis.businessOverview?.industry}
- Target Audience: ${context.websiteAnalysis.businessOverview?.targetAudience?.join(", ")}
- Key Strengths: ${context.websiteAnalysis.marketingStrengths?.join(", ")}
- Main Opportunities: ${context.websiteAnalysis.marketingOpportunities?.map((op) => op.title).join(", ")}
`
      : "No website analysis available yet."

    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OpenRouter API key not found')
      return Response.json({ error: 'API configuration error' }, { status: 500 })
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://marketing-buddy.vercel.app",
        "X-Title": "Marketing Buddy Chat",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: `You are Marketing Buddy, the friendly but no-BS accountability partner for indie hackers. 

User Context:
- Product: ${context.productName}
- Value Prop: ${context.valueProp}
- Goal: ${context.northStarGoal}
- Current Streak: ${context.streak} days
- XP: ${context.xp}

${analysisContext}

Your personality:
- Talk like a supportive peer, not a corporate consultant
- Emoji-light, hype-free, but energizing
- Use "we" when planning, "you" when praising or nudging
- Default to 120-word answers unless asked for detail
- Never use growth-hacker clichés like "crush it"
- Always give one concrete next action based on their REAL business analysis

Focus on: TEACH, TRACK, and MOTIVATE daily marketing habits based on their real business context.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
                temperature: 0.7,
      }),
    })

    console.log("OpenRouter response status:", response.status)

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Error details:', errorData)
      return Response.json({ 
        reply: "I'm having trouble connecting right now. Please try asking again in a moment!",
        error: `API Error: ${response.status} - ${response.statusText}`,
        details: errorData 
      }, { status: 500 })
    }

    const data = await response.json()
    console.log("OpenRouter response:", data)
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure:', data)
      return Response.json({ 
        reply: "I'm having trouble responding right now. Try asking again!",
        error: 'Invalid API response structure' 
      }, { status: 500 })
    }
    
    const reply = data.choices?.[0]?.message?.content || "I'm having trouble responding right now. Try asking again!"

    // Generate suggested task based on real analysis
    let suggestedTask = null
    if (context.websiteAnalysis?.marketingOpportunities?.length > 0) {
      const topOpportunity = context.websiteAnalysis.marketingOpportunities[0]
      if (message.toLowerCase().includes("content") || message.toLowerCase().includes("post")) {
        suggestedTask = `Create content around "${topOpportunity.title}" - ${topOpportunity.description}`
      }
    }

    return Response.json({
      reply,
      suggestedTask,
      resourceLink: null,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      {
        reply: "I'm having trouble connecting right now. Please try asking again in a moment!",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
