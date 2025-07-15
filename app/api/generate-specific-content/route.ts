export async function POST(request: Request) {
  try {
    const { contentType, product, valueProp, goal, websiteAnalysis } = await request.json()

    const businessContext = websiteAnalysis
      ? `
Business Context:
- Industry: ${websiteAnalysis.businessOverview?.industry}
- Target Audience: ${websiteAnalysis.businessOverview?.targetAudience?.join(", ")}
- Key Differentiators: ${websiteAnalysis.competitivePositioning?.differentiators?.join(", ")}
- Marketing Opportunities: ${websiteAnalysis.marketingOpportunities?.map((op) => op.title).join(", ")}
`
      : ""

    const contentPrompts = {
      "twitter-thread": `Create a Twitter thread (5-7 tweets) about ${product}. Start with a hook, provide value, and end with a soft CTA. Use thread format with numbers.`,
      "linkedin-post": `Write a LinkedIn post sharing a professional insight or lesson learned while building ${product}. Make it story-driven and valuable for professionals.`,
      "reddit-post": `Create a Reddit post for a relevant subreddit. Focus on providing value and asking for feedback, not promotion. Be authentic and community-focused.`,
      "instagram-post": `Write an Instagram caption for a post about ${product}. Include relevant hashtags and make it engaging for visual content.`,
      "instagram-story": `Create Instagram story text overlay content (short, punchy text) for behind-the-scenes content about building ${product}.`,
      "tiktok-script": `Write a 30-second TikTok/Reels script about ${product}. Include hook, value, and CTA. Format as [Scene 1], [Scene 2], etc.`,
      "build-in-public": `Create a "build in public" tweet sharing a specific milestone, challenge, or lesson from building ${product}. Be transparent and authentic.`,
      "seo-blog": `Write an SEO-optimized blog post outline and introduction about a topic related to ${product}. Include H2 headings and key points.`,
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://marketing-buddy.vercel.app",
        "X-Title": "Marketing Buddy Content Generation",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: `You are a content creation expert for Marketing Buddy. Create high-quality, platform-specific content that is:
- Authentic and value-first
- Tailored to the specific platform and audience
- Based on real business analysis data
- Engaging and actionable

Product: ${product}
Value Proposition: ${valueProp}
Goal: ${goal}

${businessContext}

Create content that reflects their ACTUAL business and target audience. Make it specific and relevant.`,
          },
          {
            role: "user",
            content: contentPrompts[contentType] || "Create engaging content for this business.",
          },
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "Failed to generate content. Please try again."

    return Response.json({ content })
  } catch (error) {
    console.error("Content generation error:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
