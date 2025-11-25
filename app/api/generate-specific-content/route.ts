export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Request body:', body)
    const { contentType, product, valueProp, goal, websiteAnalysis, remixStyle, originalContent, targetKeywords, threadCount, dailyTask, targetAudience, preferredPlatforms } = body
    
    if (!contentType) {
      return Response.json({ error: 'Content type is required' }, { status: 400 })
    }
    
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OpenRouter API key is missing')
      return Response.json({ error: 'API configuration error' }, { status: 500 })
    }

    const audienceSummary = targetAudience
      ? (typeof targetAudience === 'string'
          ? targetAudience
          : [
              ...(targetAudience?.demographics?.professions || []),
              ...(targetAudience?.demographics?.locations || []),
              targetAudience?.demographics?.ageRange,
              targetAudience?.demographics?.incomeLevel
            ].filter(Boolean).join(', '))
      : ''

    const platformSummary = Array.isArray(preferredPlatforms) && preferredPlatforms.length > 0
      ? preferredPlatforms.join(', ')
      : ''

    const businessContext = websiteAnalysis
      ? `
Business Context (use only these facts; never invent metrics or timelines):
- Website: ${websiteAnalysis.url || 'n/a'}
- Summary: ${websiteAnalysis.businessOverview?.summary || 'n/a'}
- Industry: ${websiteAnalysis.businessOverview?.industry || 'n/a'}
- Value Props: ${(websiteAnalysis.businessOverview?.valueProps || []).slice(0, 3).join('; ') || 'n/a'}
- Differentiators: ${(websiteAnalysis.competitivePositioning?.differentiators || []).slice(0, 3).join('; ') || 'n/a'}
- Marketing Strengths: ${(websiteAnalysis.marketingStrengths || []).slice(0, 3).join('; ') || 'n/a'}
- Opportunities: ${(websiteAnalysis.marketingOpportunities || []).slice(0, 3).map((op: any) => op.title).join('; ') || 'n/a'}
- Messaging Gaps: ${(websiteAnalysis.contentMessagingAnalysis?.messagingGaps || []).slice(0, 2).join('; ') || 'n/a'}
- Target Audience (site): ${(websiteAnalysis.businessOverview?.targetAudience || []).join(', ') || 'n/a'}
${audienceSummary ? `- User-Selected Target Audience: ${audienceSummary}` : ''}
${platformSummary ? `- Preferred Platforms: ${platformSummary}` : ''}
`
      : `
Business Context:
- Website: n/a
- Summary: n/a
${audienceSummary ? `- User-Selected Target Audience: ${audienceSummary}` : ''}
${platformSummary ? `- Preferred Platforms: ${platformSummary}` : ''}
`

    const dailyTaskContext = dailyTask
      ? `
Daily Task Context:
- Task: ${dailyTask.title}
- Description: ${dailyTask.description}
- Focus: Create content that helps accomplish or relates to this specific daily marketing task.
`
      : ""

    const contentPrompts = {
      "twitter-thread": `Create an X thread (${threadCount || 5} posts) about ${product}. Start with a compelling hook, provide actionable value, and end with a clear CTA. Use thread format with numbers (1/${threadCount || 5}, 2/${threadCount || 5}, etc.). Minimum 220 words across the thread. Write decisively - no suggestions or placeholders.`,
      "x-post": `Write a single X/Twitter post (under 280 characters) from the founder of ${product}.

CRITICAL: Write ONLY the actual post content. Do NOT include any instructions, labels, or meta-commentary like "Quick take on..." or "Here's what to post:". Just write the post itself as if you're the founder typing directly into X.

Best practices for X posts:
- Start with a hook that stops the scroll (question, bold statement, or surprising fact)
- Be conversational and authentic - write like you're texting a friend
- Share ONE specific insight, tip, or observation
- Use line breaks for readability
- End with engagement bait (question, hot take, or soft CTA)
- No hashtags unless absolutely necessary
- Avoid corporate speak - be human

Write as the actual founder sharing their experience building ${product}. Use details from the business context but never invent metrics. Output ONLY the post text, nothing else.`,
      "linkedin-post": `Write a LinkedIn post from the founder of ${product}. 

Best practices for LinkedIn:
- Start with a hook in the first line (this shows in preview)
- Use short paragraphs (1-2 sentences each)
- Include line breaks for readability
- Share a specific story, lesson, or insight from building ${product}
- Be vulnerable - share failures and learnings, not just wins
- End with a question or call for discussion
- No hashtags in the main text (can add 3-5 at the very end if relevant)
- Aim for 150-250 words

Write as the actual founder sharing professional insights. Use details from the business context but never invent metrics.`,
      "reddit-post": `Write a Reddit post from the perspective of the founder/creator of ${product}. You ARE the person who built this product - write in first person as if you're sharing your own journey and experience building it. 

Key requirements:
- Write as the actual product creator sharing their story (not as a user reviewing someone else's product)
- Be authentic and vulnerable - share struggles, learnings, and real experiences from building ${product}
- Mention specific details from the business context but never invent metrics
- Use casual Reddit tone - conversational, slightly self-deprecating, genuine
- Do NOT include labels like "Title:" or "Body:"
- Start with a hook about a problem you faced or a milestone you hit
- Include 2-3 short paragraphs with real details
- End with a genuine question asking for community feedback or advice
- Length: 180-260 words

Example tone: "I've been working on this for 6 months and finally..." or "After failing at X three times, I tried..." or "Built this because I was frustrated with..."`,
      "instagram-post": `Write an Instagram caption from the founder of ${product}.

Best practices for Instagram captions:
- Start with a hook that makes people want to read more
- Use short sentences and line breaks
- Tell a mini-story or share a specific moment
- Be personal and relatable - Instagram rewards authenticity
- Include a clear CTA (save this, share with a friend, comment below)
- Keep it 100-200 words (Instagram truncates after ~125 characters)
- Add relevant emojis sparingly to break up text

At the end, include:
- "Hashtags:" line with 8-12 relevant hashtags (mix of popular and niche)
- "IMAGE:" line describing the ideal visual (style, colors, composition, mood)

Write as the actual founder sharing their journey with ${product}. Use details from the business context but never invent metrics.`,
      "instagram-carousel": `Create an Instagram carousel (5-7 slides) for ${product}.

Best practices for Instagram carousels:
- Carousels get 3x more engagement than single posts
- First slide: Bold hook that makes people swipe (question, surprising stat, or bold claim)
- Slides 2-5: Educational value - teach something useful, one point per slide
- Keep text minimal (max 20 words per slide) - visuals do the heavy lifting
- Use consistent design language across slides
- Second-to-last slide: Summary or key takeaway
- Last slide: Clear CTA (follow for more, save this, share with someone who needs it)

Format your response as:
SLIDE 1: [Hook text]
IMAGE 1: [Visual description]

SLIDE 2: [Content]
IMAGE 2: [Visual description]

...continue for all slides...

CAPTION: [Instagram caption to accompany the carousel - 50-100 words]
Hashtags: [8-12 relevant hashtags]

Topics that work well for carousels:
- "X mistakes to avoid when..."
- "How to [achieve result] in [timeframe]"
- "The truth about [common misconception]"
- "Before vs After [using your product/method]"
- Step-by-step tutorials

Write as the founder of ${product} sharing valuable insights. Use details from the business context but never invent metrics.`,
      "instagram-story": `Create Instagram story text overlay content (short, punchy phrases) for behind-the-scenes content about building ${product}. Keep each text block under 15 words. Include a "Hashtags:" line with 4-8 hashtags. ALSO include a line starting with "IMAGE:" describing the background visual that should accompany this story.`,
      "tiktok-script": `Write a 30-second TikTok/Reels script about ${product}. Structure: Hook (0-3s), Value/Story (3-25s), CTA (25-30s). Write specific actions and dialogue, not scene descriptions.`,
      "build-in-public": `Create a "build in public" X post sharing a specific milestone, challenge, or lesson from building ${product}. Include exact numbers, metrics, or concrete details without inventing. 180-260 characters, transparent and relatable, with a CTA.`,
      "seo-blog": `Write a complete SEO-optimized blog post about ${product}. ${targetKeywords ? `Target these keywords naturally: ${targetKeywords}.` : ''} Structure: Title, Introduction (2-3 paragraphs), 3-4 H2 sections with detailed content, and conclusion. Write the FULL blog post, not just an outline. Make it comprehensive (800+ words) and valuable.`,
      "product-hunt-post": `Write a Product Hunt launch post for ${product}. Include: a clear one-line value prop, 3-5 bullet highlights, founder story in 2-3 lines, and a friendly call to check it out and share feedback. Keep it authentic and specific.`,
      "indie-hackers-post": `Write an Indie Hackers post sharing a learning or milestone about ${product}. Tone: transparent, numbers-driven, helpful. Include specific metrics (even small ones), what worked/failed, and one actionable takeaway for fellow indie makers.`,
    }

    const fallbackContent = () => {
      const base = `Quick take on ${product || 'your product'}: ${valueProp || 'share a specific outcome you create'}`
      switch (contentType) {
        case 'twitter-thread':
          return `Hook: One painful problem we solved.\n1/ Problem: ${valueProp || 'specify the pain'}\n2/ How we fixed it: one concrete step.\n3/ Proof: a tiny metric or story.\n4/ CTA: DM for the template.\n\nMARKETING_STYLE: Problem-Solution`
        case 'x-post':
          return `${base}. One proof point from the site context, one CTA.\n\nMARKETING_STYLE: Problem-Solution`
        case 'linkedin-post':
          return `${base}. One lesson learned, one mistake, one next step. Close with a single CTA.\n\nMARKETING_STYLE: Educational`
        case 'reddit-post':
          return `Title: How we tackled ${goal || 'a content bottleneck'} with ${product || 'our tool'}\nBody: Share the problem, the exact steps taken, and one metric (even small). Ask a genuine question at the end.\n\nMARKETING_STYLE: Community Building`
        case 'instagram-post':
          return `Caption: Before → After using ${product || 'our tool'} to ${goal || 'ship weekly content'}. List 3 bullets of what changed.\nIMAGE: A clean before/after split-screen of your dashboard.\n\nMARKETING_STYLE: Transformation`
        case 'tiktok-script':
          return `Hook (0-3s): “If you struggle with ${goal || 'consistent content'}, watch this.”\nMiddle (3-25s): Show the 2 steps we use in ${product || 'our tool'} to fix it.\nCTA (25-30s): “Comment ‘template’ for the checklist.”\n\nMARKETING_STYLE: Problem-Solution`
        default:
          return `${base}. Add one proof point and one CTA.\n\nMARKETING_STYLE: General`
      }
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
        model: "openai/gpt-oss-20b:free",
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
- Use ONLY facts provided in the Business Context. If a metric or detail is not provided, say "not available" instead of inventing numbers or timelines.
- Do NOT invent team sizes, user counts, revenue, or timeframes.
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
        max_tokens: contentType === 'seo-blog' ? 2000 : 1200,
        temperature: 0.65,
      }),
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Error details:', errorData)
      if (response.status === 429) {
        const fallback = fallbackContent()
        return Response.json({
          content: fallback,
          marketingStyle: 'Fallback',
          contentType,
          imagePrompt: null,
          timestamp: new Date().toISOString(),
          warning: 'LLM rate limited; returned fallback content.'
        })
      }
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
    
    const normalizeHashtags = (text: string) => {
      const lines = text.split('\n')
      return lines.map((line) => {
        const match = line.match(/Hashtags?:\s*(.+)/i)
        if (!match) return line
        const tags = match[1]
          .split(/[, ]+/)
          .map(t => t.trim().replace(/^#/, '').replace(/[^a-z0-9]/gi, ''))
          .filter(Boolean)
          .slice(0, 12)
          .map(t => `#${t.toLowerCase()}`)
          .join(' ')
        return tags ? `Hashtags: ${tags}` : line
      }).join('\n')
    }

    const contentWithHashtags = (contentType === 'instagram-post' || contentType === 'instagram-story')
      ? normalizeHashtags(rawContent)
      : rawContent

    const styleMatch = contentWithHashtags.match(/MARKETING_STYLE:\s*([^\n]+)/i)
    const marketingStyle = styleMatch ? styleMatch[1].trim() : "General"
    
    const imageMatch = contentWithHashtags.match(/IMAGE:\s*([^\n]+)/i)
    const imagePrompt = imageMatch ? imageMatch[1].trim() : null
    
    // Clean the content by removing markdown artifacts while preserving paragraph structure
    // Split content to preserve hashtags section and paragraph breaks
    const lines = contentWithHashtags.split('\n')
    const cleanedLines = lines.map((line: string) => {
      // Remove markdown headings (# Title) but preserve hashtags
      const strippedHeading = line.replace(/^#+\s+/, '')
      return strippedHeading
        .replace(/MARKETING_STYLE:\s*[^\n]+/gi, '')
        .replace(/IMAGE:\s*[^\n]+/gi, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\[(.*?)\]/g, '$1')
        .replace(/—/g, '')
        .replace(/\*/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    })
    
    // Join lines back together, preserving empty lines as paragraph breaks
    const cleanedContent = cleanedLines
      .join('\n')
      .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
      .replace(/^title:\s*/i, '')
      .replace(/^body:\s*/i, '')
      .replace(/^\s*MARKETING_STYLE:\s*[^\n]+$/gmi, '')
      .trim()

    const llmTruncated = data.choices?.[0]?.finish_reason === 'length' || data.choices?.[0]?.native_finish_reason === 'length'
    
    // If content is empty or too short after cleaning, use fallback
    const minContentLength = 50
    const hasValidContent = cleanedContent && cleanedContent.length >= minContentLength
    
    // For truncated responses, still show partial content if it's meaningful
    let finalContent = hasValidContent 
      ? cleanedContent 
      : (contentWithHashtags && contentWithHashtags.length >= minContentLength 
          ? contentWithHashtags 
          : fallbackContent())

    // Final cleanup - ensure no MARKETING_STYLE or IMAGE tags remain in output
    finalContent = finalContent
      .replace(/MARKETING_STYLE:\s*[^\n]*/gi, '')
      .replace(/IMAGE:\s*[^\n]*/gi, '')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()

    return Response.json({ 
      content: finalContent,
      marketingStyle,
      contentType,
      imagePrompt,
      timestamp: new Date().toISOString(),
      warning: llmTruncated ? 'Content may be incomplete due to model limits. Try regenerating.' : undefined,
      truncated: llmTruncated
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return Response.json({ 
      error: "Failed to generate content", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
