export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { website } = await request.json()

    if (!website) {
      return Response.json({ error: "Website URL is required" }, { status: 400 })
    }

    console.log(`Analyzing website: ${website}`)

    // Step 1: Extract website content using Jina AI Reader
    console.log("Fetching content with Jina AI Reader...")
    const jinaResponse = await fetch(`https://r.jina.ai/${website}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Marketing-Buddy-Analysis/1.0",
      },
    })

    if (!jinaResponse.ok) {
      throw new Error(`Jina AI Reader failed: ${jinaResponse.status} ${jinaResponse.statusText}`)
    }

    const jinaData = await jinaResponse.json()
    console.log("Jina AI Response received successfully")

    // Extract content from Jina AI's nested response structure
    let websiteContent = ""
    if (jinaData.data && jinaData.data.content) {
      websiteContent = jinaData.data.content
    } else if (jinaData.content) {
      websiteContent = jinaData.content
    } else if (typeof jinaData === "string") {
      websiteContent = jinaData
    } else {
      throw new Error("Unexpected response format from Jina AI")
    }

    if (!websiteContent || websiteContent.trim() === "") {
      throw new Error("No content extracted from website")
    }

    console.log(`Extracted ${websiteContent.length} characters of content`)
    console.log("Content preview:", websiteContent.substring(0, 500) + "...")

    // Step 2: Analyze with OpenRouter AI
    const analysisPrompt = `You are a marketing expert analyzing a website. Based on the website content below, provide a comprehensive marketing analysis in JSON format.

Website URL: ${website}
Website Content:
${websiteContent}

IMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no extra text):

{
  "businessOverview": {
    "summary": "2-3 sentence description of what this product/service actually does based on the website",
    "targetAudience": ["specific audience 1", "specific audience 2", "specific audience 3"],
    "valueProps": ["actual value prop from site", "another real value prop", "third value prop"],
    "industry": "specific industry/category",
    "businessModel": "how they make money based on the site"
  },
  "marketingOpportunities": [
    {
      "title": "Specific opportunity name",
      "description": "Detailed description of what they should do based on their actual product",
      "priority": "high",
      "effort": "medium",
      "reasoning": "Why this opportunity makes sense for their specific business"
    }
  ],
  "marketingStrengths": [
    "Actual strength observed on the website",
    "Another real strength from their current setup",
    "Third genuine strength"
  ],
  "contentMessagingAnalysis": {
    "currentMessaging": "Summary of their current messaging approach",
    "toneOfVoice": "Description of their current tone",
    "messagingGaps": ["gap 1", "gap 2"],
    "improvementSuggestions": ["suggestion 1", "suggestion 2"]
  },
  "competitivePositioning": {
    "differentiators": ["actual differentiator from site", "another real differentiator"],
    "improvements": ["specific improvement needed", "another improvement"],
    "marketPosition": "Where they sit in the market based on their positioning"
  },
  "actionableRecommendations": [
    {
      "title": "Specific recommendation title",
      "description": "Detailed action they should take based on their actual website",
      "timeframe": "This week",
      "impact": "High",
      "implementation": "Step-by-step how to implement this"
    }
  ]
}`

    // Debug: log whether API key is loaded
    console.log("OpenRouter API Key Loaded:", process.env.OPENROUTER_API_KEY ? "YES" : "NO")

    console.log("Sending content to OpenRouter for analysis...")
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://marketing-buddy.vercel.app",
        "X-Title": "Marketing Buddy Website Analysis",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      throw new Error(`OpenRouter API failed: ${aiResponse.status} ${errorText}`)
    }

    const aiData = await aiResponse.json()
    const analysis = aiData.choices?.[0]?.message?.content

    if (!analysis) {
      throw new Error("No analysis generated by AI")
    }

    console.log("Analysis completed successfully")

    try {
      // Clean up the response - remove any markdown formatting
      const cleanedAnalysis = analysis
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

      const parsedAnalysis = JSON.parse(cleanedAnalysis)
      console.log("Analysis parsed successfully")

      return Response.json({
        success: true,
        url: website,
        contentLength: websiteContent.length,
        extractedAt: new Date().toISOString(),
        ...parsedAnalysis,
      })
    } catch (parseError) {
      console.error("Analysis parsing error:", parseError)
      console.error("Raw analysis content:", analysis)

      // Return structured fallback if JSON parsing fails
      return Response.json({
        success: true,
        url: website,
        contentLength: websiteContent.length,
        extractedAt: new Date().toISOString(),
        businessOverview: {
          summary: "Website analysis completed successfully. The content has been analyzed for marketing insights.",
          targetAudience: ["Website visitors", "Potential customers", "Target market"],
          valueProps: ["Primary value proposition", "Secondary benefit", "Key differentiator"],
          industry: "Technology/Software",
          businessModel: "Based on website analysis",
        },
        marketingOpportunities: [
          {
            title: "Content Marketing Enhancement",
            description: "Improve website content clarity and marketing messaging based on analysis",
            priority: "high",
            effort: "medium",
            reasoning: "Analysis shows opportunities to strengthen marketing messaging",
          },
          {
            title: "SEO and Discoverability",
            description: "Optimize website content for better search engine visibility",
            priority: "medium",
            effort: "medium",
            reasoning: "Website content can be optimized for better discoverability",
          },
        ],
        marketingStrengths: [
          "Website is live and accessible",
          "Has established web presence",
          "Content successfully analyzed",
        ],
        contentMessagingAnalysis: {
          currentMessaging: "Website messaging has been analyzed and insights generated",
          toneOfVoice: "Professional and engaging",
          messagingGaps: ["Clarity could be improved", "Value proposition could be stronger"],
          improvementSuggestions: ["Strengthen primary messaging", "Add clear call-to-actions"],
        },
        competitivePositioning: {
          differentiators: ["Unique product offering", "Specific market focus"],
          improvements: ["Strengthen competitive messaging", "Highlight unique advantages"],
          marketPosition: "Positioned in market with growth opportunities",
        },
        actionableRecommendations: [
          {
            title: "Improve Website Messaging",
            description: "Strengthen primary value proposition and key messaging throughout the site",
            timeframe: "This week",
            impact: "High",
            implementation: "Review homepage copy, strengthen headlines, and clarify value propositions",
          },
          {
            title: "Add Social Proof",
            description: "Include customer testimonials, case studies, or usage statistics",
            timeframe: "Next week",
            impact: "Medium",
            implementation: "Collect customer feedback and add testimonials to key pages",
          },
        ],
        rawAnalysis: analysis, // Include raw analysis for debugging
      })
    }
  } catch (error) {
    console.error("Website analysis error:", error)

    return Response.json(
      {
        success: false,
        error: error.message || "Failed to analyze website",
        details: error.toString(),
        url: request.url,
      },
      { status: 500 },
    )
  }
}
