export async function POST(request: Request) {
  try {
    const { lessonId, lessonTemplate, product, valueProp, websiteAnalysis } = await request.json()

    const businessContext = websiteAnalysis
      ? `
Business Context:
- Product: ${product}
- Value Prop: ${valueProp}
- Industry: ${websiteAnalysis.businessOverview?.industry}
- Target Audience: ${websiteAnalysis.businessOverview?.targetAudience?.join(", ")}
`
      : `Product: ${product}, Value Prop: ${valueProp}`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://marketing-buddy.vercel.app",
        "X-Title": "Marketing Buddy Lesson Application",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: `You are helping a user apply a marketing lesson template to their specific business. Fill in the template with their actual business details to create personalized, ready-to-use content.

${businessContext}

Take the template and replace placeholders with specific, relevant content for their business. Make it authentic and valuable.`,
          },
          {
            role: "user",
            content: `Please customize this template for my business:\n\n${lessonTemplate}`,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "Failed to generate personalized content."

    return Response.json({ content })
  } catch (error) {
    console.error("Lesson application error:", error)
    return Response.json({ error: "Failed to apply lesson" }, { status: 500 })
  }
}
