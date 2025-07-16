export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Request body:', body)
    const { contentType, product, valueProp, goal, websiteAnalysis, remixStyle, originalContent, targetKeywords, threadCount, dailyTask } = body
    
    if (!contentType) {
      return Response.json({ error: 'Content type is required' }, { status: 400 })
    }
    
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OpenRouter API key is missing')
      return Response.json({ error: 'API configuration error' }, { status: 500 })
    }

    const businessContext = websiteAnalysis
      ? `
Business Context:
- Industry: ${websiteAnalysis.businessOverview?.industry}
- Target Audience: ${websiteAnalysis.businessOverview?.targetAudience?.join(", ")}
- Key Differentiators: ${websiteAnalysis.competitivePositioning?.differentiators?.join(", ")}
- Marketing Opportunities: ${websiteAnalysis.marketingOpportunities?.map((op: any) => op.title).join(", ")}
`
      : ""

    const dailyTaskContext = dailyTask
      ? `
Daily Task Context:
- Task: ${dailyTask.title}
- Description: ${dailyTask.description}
- Focus: Create content that helps accomplish or relates to this specific daily marketing task.
`
      : ""

    const contentPrompts = {
      "twitter-thread": `Create a Twitter thread (${threadCount || 5} tweets) about ${product}. Start with a compelling hook, provide actionable value, and end with a clear call-to-action. Use thread format with numbers (1/${threadCount || 5}, 2/${threadCount || 5}, etc.). Write decisively - no suggestions or placeholders.`,
      "linkedin-post": `Write a LinkedIn post sharing a professional insight or lesson learned while building ${product}. Make it story-driven with specific details and valuable for professionals. Include a clear takeaway.`,
      "reddit-post": `Create a Reddit post for a relevant subreddit. Focus on providing genuine value and asking for community feedback. Be authentic and helpful, not promotional. Share specific experiences.`,
      "instagram-post": `Write an Instagram caption for a post about ${product}. Make it engaging with a clear hook, value, and relevant hashtags. Write for visual storytelling. ALSO include a line starting with "IMAGE:" describing the visual content that should accompany this post (be specific about style, colors, objects, mood).`,
      "instagram-story": `Create Instagram story text overlay content (short, punchy phrases) for behind-the-scenes content about building ${product}. Keep each text block under 15 words. ALSO include a line starting with "IMAGE:" describing the background visual that should accompany this story.`,
      "tiktok-script": `Write a 30-second TikTok/Reels script about ${product}. Structure: Hook (0-3s), Value/Story (3-25s), CTA (25-30s). Write specific actions and dialogue, not scene descriptions.`,
      "build-in-public": `Create a "build in public" tweet sharing a specific milestone, challenge, or lesson from building ${product}. Include exact numbers, metrics, or concrete details. Be transparent and relatable.`,
      "seo-blog": `Write a complete SEO-optimized blog post about ${product}. ${targetKeywords ? `Target these keywords naturally: ${targetKeywords}.` : ''} Structure: Title, Introduction (2-3 paragraphs), 3-4 H2 sections with detailed content, and conclusion. Write the FULL blog post, not just an outline. Make it comprehensive (800+ words) and valuable.`,
    }

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
            content: `You are a professional content creator specializing in platform-specific marketing content. Create high-quality content that is:

- Authentic and value-driven (no promotional fluff)
- Platform-optimized for maximum engagement
- Based on real business data and insights
- Actionable with clear takeaways
- Written decisively (no "you could" or "consider" language)
- Free of markdown formatting like ** or [] placeholders
- Specific with real examples, numbers, and details
${dailyTaskContext ? '- Directly related to and supportive of the specified daily marketing task' : ''}

IMPORTANT RULES:
- Never use ** for emphasis or [] for placeholders
- Never use em-dash (—) in your output
- Write definitive statements, not suggestions
- Include specific details, not generic advice
- Make every word count for the platform

Business Context:
Product: ${product}
Value Proposition: ${valueProp}
Goal: ${goal}
${businessContext}

IMPORTANT: After creating the content, you MUST end your response with exactly this format:

MARKETING_STYLE: [Choose the most accurate style from: Storytelling, Problem-Solution, Social Proof, Educational, Behind-the-Scenes, Data-Driven, Emotional Appeal, Community Building, Authority Building, Curiosity Gap, Fear of Missing Out, Transformation, Case Study, Personal Experience]

${remixStyle && originalContent ? `REMIX REQUEST: Create a variation of this content using the "${remixStyle}" style. Original content: "${originalContent.substring(0, 500)}..." Create a fresh take that maintains the same marketing approach but with different angles, examples, or perspectives.` : ''}`,
          },
          {
            role: "user",
            content: `${businessContext}${dailyTaskContext}

${contentPrompts[contentType as keyof typeof contentPrompts] || "Create engaging content for this business."}

MARKETING_STYLE: [Provide a specific, descriptive marketing style for this content (e.g., "Educational Storytelling", "Data-Driven Authority", "Personal Journey", "Problem-Solution Focus", etc.)]`,
          },
        ],
        max_tokens: contentType === 'seo-blog' ? 1500 : 800,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Error details:', errorData)
      return Response.json({ 
        error: `API Error: ${response.status} - ${response.statusText}`,
        details: errorData 
      }, { status: 500 })
    }

    const data = await response.json()
    console.log('OpenRouter response:', data)
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure:', data)
      return Response.json({ error: 'Invalid API response structure' }, { status: 500 })
    }
    
    const rawContent = data.choices[0]?.message?.content || "Failed to generate content. Please try again."
    
    // Extract marketing style from the response using the new format
    const styleMatch = rawContent.match(/MARKETING_STYLE:\s*([^\n]+)/i)
    const marketingStyle = styleMatch ? styleMatch[1].trim() : "General"
    
    // Extract image prompt for Instagram posts/stories
    const imageMatch = rawContent.match(/IMAGE:\s*([^\n]+)/i)
    const imagePrompt = imageMatch ? imageMatch[1].trim() : null
    
    // Clean the content by removing markdown artifacts while preserving paragraph structure
    // Split content to preserve hashtags section and paragraph breaks
    const lines = rawContent.split('\n')
    const cleanedLines = lines.map((line: string) => {
      // Don't clean hashtags from lines that are clearly hashtag sections
      if (line.trim().startsWith('#') && line.includes('#')) {
        // This is likely a hashtags section, preserve it but clean other formatting
        return line
          .replace(/MARKETING_STYLE:\s*[^\n]+/gi, '')
          .replace(/IMAGE:\s*[^\n]+/gi, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\[(.*?)\]/g, '$1')
          .replace(/—/g, '')
          .replace(/\*/g, '')
          .trim()
      } else {
        // Clean everything including hashtags from main content but preserve line structure
        return line
          .replace(/MARKETING_STYLE:\s*[^\n]+/gi, '')
          .replace(/IMAGE:\s*[^\n]+/gi, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\[(.*?)\]/g, '$1')
          .replace(/—/g, '')
          .replace(/\*/g, '')
          .replace(/#/g, '') // Remove hashtags from main content
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space within line
          .trim()
      }
    })
    
    // Join lines back together, preserving empty lines as paragraph breaks
    const cleanedContent = cleanedLines
      .join('\n')
      .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
      .trim()

    return Response.json({ 
      content: cleanedContent,
      marketingStyle,
      contentType,
      imagePrompt,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return Response.json({ 
      error: "Failed to generate content", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
