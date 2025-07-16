export async function POST(request: Request) {
  try {
    const { product, valueProp, channel, goal, websiteAnalysis } = await request.json()

    // Use the real website analysis to generate more targeted content
    const businessContext = websiteAnalysis
      ? `
Business Analysis Context:
- Industry: ${websiteAnalysis.businessOverview?.industry}
- Target Audience: ${websiteAnalysis.businessOverview?.targetAudience?.join(", ")}
- Key Differentiators: ${websiteAnalysis.competitivePositioning?.differentiators?.join(", ")}
- Current Messaging: ${websiteAnalysis.contentMessagingAnalysis?.currentMessaging}
- Marketing Opportunities: ${websiteAnalysis.marketingOpportunities?.map((op) => op.title).join(", ")}
`
      : ""

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://marketing-buddy.vercel.app",
        "X-Title": "Marketing Buddy Content Generation",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: `You are a content generation assistant for Marketing Buddy. Generate platform-specific marketing content that is:
- Authentic and value-first (not promotional)
- Tailored to the specific business and their actual target audience
- Focused on building relationships, not just selling
- Based on real business analysis data

Product: ${product}
Value Proposition: ${valueProp}
Primary Channel: ${channel}
Goal: ${goal}

${businessContext}

Generate content that reflects their ACTUAL business, target audience, and differentiators. Make it specific to their industry and real value props.

Return ONLY valid JSON in this exact format:
{
  "tweets": [
    "tweet content 1 based on real business",
    "tweet content 2 based on real analysis", 
    "tweet content 3 based on actual differentiators",
    "tweet content 4 based on target audience",
    "tweet content 5 based on marketing opportunities"
  ],
  "linkedIn": {
    "content": "LinkedIn post content based on real business analysis"
  },
  "hnPost": {
    "title": "Show HN: Real title based on actual product",
    "content": "Description for Hacker News based on real value props"
  }
}`,
          },
          {
            role: "user",
            content: `Generate marketing content for my product. Focus on ${goal} as the primary objective. Use the real business analysis to make the content specific and relevant to my actual target audience and differentiators.`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    })

    const data = await response.json()
    let content = data.choices[0]?.message?.content || "{}"

    try {
      // Clean up the response
      content = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      const parsedContent = JSON.parse(content)
      return Response.json(parsedContent)
    } catch (parseError) {
      console.error("Content parsing error:", parseError)
      // Fallback with more generic but still business-focused content
      return Response.json({
        tweets: [
          `Just shipped ${product}! ${valueProp} \n\nLooking for feedback from the community. What do you think? 🤔`,
          `Building in public: The journey of creating ${product}\n\nGoal: ${goal}\nStrategy: Focus on value, not promotion\n\nWhat's your biggest challenge in this space?`,
          `Lesson learned while building ${product}: ${valueProp}\n\nSometimes the best solutions come from solving your own problems first.`,
          `Quick question for my target audience: What's your current approach to [relevant problem]?\n\nWorking on ${product} and would love to hear your experiences!`,
          `${product} update: Just implemented user feedback\n\nThe power of listening to your users can't be overstated. What features do you prioritize based on feedback?`,
        ],
        linkedIn: {
          content: `🚀 Just launched ${product} - ${valueProp}\n\nAs someone working in this space, I've learned that building the product is just the beginning. The real challenge? Getting it in front of the right people.\n\nMy current focus: ${goal}\n\nWhat I'm doing differently:\n• Leading with value, not features\n• Building relationships before pitching\n• Sharing the journey, not just the destination\n\nTo others in this industry: What's been your most effective strategy for ${goal}?\n\n#BuildInPublic #Startup`,
        },
        hnPost: {
          title: `Show HN: ${product} - ${valueProp}`,
          content: `Hi HN! I built ${product} to solve a problem I was facing personally.\n\n${valueProp}\n\nThe idea came from my own experience with [relevant problem]. After using it myself, I decided to share it with the community.\n\nI'd love feedback on:\n- The core concept and execution\n- User experience and interface\n- Potential use cases I might have missed\n\nThanks for checking it out!`,
        },
      })
    }
  } catch (error) {
    console.error("Content generation error:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
