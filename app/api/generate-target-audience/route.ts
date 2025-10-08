import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { productName, valueProp, website, websiteAnalysis, northStarGoal } = await request.json()

    if (!website) {
      return NextResponse.json({ 
        success: false, 
        error: 'Website URL is required for target audience analysis' 
      }, { status: 400 })
    }

    console.log(`Analyzing target audience for: ${website}`)

    // Step 1: Extract website content using Jina AI Reader (same as website analysis)
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

    // Step 2: Analyze target audience with AI using the actual website content
    const audiencePrompt = `You are a marketing expert analyzing a website to understand WHO the target customers are (not what the business does).

Website URL: ${website}
Business Name: ${productName}
Value Proposition: ${valueProp}
Marketing Goal: ${northStarGoal}

Website Content:
${websiteContent}

Based on the website content above, analyze WHO the ideal customers/clients are for this business. Focus on understanding the PEOPLE who would buy from or hire this business.

IMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no extra text):

{
  "demographics": {
    "ageRange": "Estimated age range of typical customers (e.g., '30-55', '25-45')",
    "locations": ["Geographic areas where customers are located"],
    "professions": ["Job titles or roles of typical customers - WHO would hire/buy from this business"],
    "incomeLevel": "Income bracket of typical customers (e.g., 'Upper-middle class', '$75k-150k')",
    "companySize": "If B2B: size of companies that would be customers (e.g., 'Small to medium businesses', 'Enterprise')"
  },
  "psychographics": {
    "values": ["What do these customers value? (e.g., 'Quality', 'Innovation', 'Reliability')"],
    "interests": ["What are these customers interested in? (e.g., 'Modern design', 'Sustainability', 'Technology')"],
    "lifestyle": "Describe the lifestyle of typical customers in 1-2 sentences",
    "personality": ["Personality traits of typical customers (e.g., 'Detail-oriented', 'Ambitious', 'Quality-focused')"]
  },
  "painPoints": [
    "What problems do these customers face that this business solves?",
    "What challenges or frustrations do they experience?",
    "What keeps them up at night?"
  ],
  "goals": [
    "What are these customers trying to achieve?",
    "What outcomes are they seeking?",
    "What success looks like for them?"
  ],
  "onlinePresence": [
    "Where do these customers spend time online? (e.g., 'LinkedIn', 'Instagram', 'Industry forums')",
    "What platforms would they use to find this type of business?"
  ],
  "purchasingBehavior": {
    "decisionFactors": ["What factors influence their buying decision? (e.g., 'Portfolio quality', 'Price', 'Reputation')"],
    "researchMethods": ["How do they research before buying? (e.g., 'Referrals', 'Online reviews', 'Case studies')"],
    "buyingProcess": "Describe their typical buying journey in 1-2 sentences"
  }
}

Focus on analyzing WHO the customers ARE, not what the business does. Be specific based on the website content.`

    console.log("Sending content to OpenRouter for target audience analysis...")
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://marketing-buddy.vercel.app",
        "X-Title": "Marketing Buddy Target Audience Analysis",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "user",
            content: audiencePrompt,
          },
        ],
        max_tokens: 2000,
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

    console.log("Target audience analysis completed successfully")
    console.log("Raw AI response (first 500 chars):", analysis.substring(0, 500))

    try {
      // Clean up the response - remove any markdown formatting
      const cleanedAnalysis = analysis
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

      const targetAudience = JSON.parse(cleanedAnalysis)
      console.log("✅ Target audience parsed successfully")

      return NextResponse.json({
        success: true,
        targetAudience,
        source: 'ai_analysis'
      })
    } catch (parseError) {
      console.error("❌ Target audience parsing error:", parseError)
      console.error("Raw analysis content:", analysis)

      // Return a helpful error instead of generic fallback
      return NextResponse.json({
        success: false,
        error: "Failed to parse AI response",
        details: parseError instanceof Error ? parseError.message : String(parseError),
        rawResponse: analysis.substring(0, 1000)
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Target audience generation error:", error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate target audience",
      details: error instanceof Error ? error.stack : String(error)
    }, { status: 500 })
  }
}
