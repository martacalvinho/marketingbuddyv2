export async function POST(request: Request) {
  try {
    const { product, valueProp, goal, websiteAnalysis } = await request.json()

    const businessContext = websiteAnalysis
      ? `
Business Analysis:
- Industry: ${websiteAnalysis.industry}
- Target Audience: ${websiteAnalysis.targetAudience}
- Key Services: ${websiteAnalysis.services?.join(", ")}
- Unique Value: ${websiteAnalysis.uniqueValue}
- Pain Points: ${websiteAnalysis.painPoints?.join(", ")}
`
      : ""

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://marketing-buddy.vercel.app",
        "X-Title": "Marketing Buddy SEO Keywords",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: `You are an SEO expert. Generate 8-12 target keywords for a blog post about this business.

Business Context:
Product: ${product}
Value Proposition: ${valueProp}
Goal: ${goal}
${businessContext}

Return ONLY a comma-separated list of keywords, no explanations or formatting. Focus on:
- Primary keywords (2-3 words)
- Long-tail keywords (3-5 words)
- Industry-specific terms
- Problem-solving keywords
- Commercial intent keywords

Example format: keyword one, keyword two, longer keyword phrase, another phrase`,
          },
          {
            role: "user",
            content: "Generate target keywords for an SEO blog post about this business.",
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const keywords = data.choices[0]?.message?.content || "business automation, productivity tools, workflow optimization"
    
    return Response.json({ keywords: keywords.trim() })
  } catch (error) {
    console.error("SEO keywords generation failed:", error)
    return Response.json({ error: "Failed to generate keywords" }, { status: 500 })
  }
}
