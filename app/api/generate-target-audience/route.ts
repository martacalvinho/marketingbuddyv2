import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { website, productName, valueProp, northStarGoal } = await req.json()

    if (!website) {
      return NextResponse.json({ error: "Website URL is required" }, { status: 400 })
    }

    // 1. SCRAPE CONTENT (Reuse robust Jina logic)
    const jinaHeaders: Record<string, string> = {
      "X-Target-Selector": "body",
      "User-Agent": "Marketing-Buddy-Bot/2.0"
    }
    if (process.env.JINA_API_KEY) {
      jinaHeaders["Authorization"] = `Bearer ${process.env.JINA_API_KEY}`
    }

    const jinaResponse = await fetch(`https://r.jina.ai/${website}`, { headers: jinaHeaders })
    
    let websiteContent = ""
    if (jinaResponse.ok) {
        websiteContent = await jinaResponse.text()
        websiteContent = websiteContent.slice(0, 6000) // Truncate
    }

    // 2. THE PROMPT
    const systemPrompt = `
      You are an expert Market Researcher.
      Based on the website content, define the ideal customer profile (ICP).
      
      CRITICAL RULES:
      1. Focus on WHO they are (Psychographics/Demographics).
      2. OUTPUT ONLY RAW JSON. No markdown.
    `

    const userPrompt = `
      Analyze this business:
      - URL: ${website}
      - Product: ${productName}
      - Value Prop: ${valueProp}
      - Goal: ${northStarGoal}
      - Content: ${websiteContent}

      Return JSON with this structure:
      {
        "demographics": {
          "ageRange": "e.g. 25-40",
          "locations": ["Region 1", "Region 2"],
          "professions": ["Job Title 1", "Job Title 2"],
          "incomeLevel": "e.g. High Disposable Income"
        },
        "psychographics": {
          "values": ["Value 1", "Value 2"],
          "interests": ["Interest 1", "Interest 2"],
          "personality": ["Trait 1", "Trait 2"],
          "lifestyle": "1 sentence summary"
        },
        "painPoints": ["Pain 1", "Pain 2", "Pain 3"],
        "goals": ["Goal 1", "Goal 2"],
        "onlinePresence": ["Platform 1", "Platform 2"],
        "purchasingBehavior": {
          "decisionFactors": ["Factor 1"],
          "researchMethods": ["Method 1"]
        }
      }
    `

    // 3. CALL AI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://marketingbuddy.ai",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Robust & Cheap
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    })

    if (!response.ok) throw new Error("AI Generation Failed")

    const data = await response.json()
    let content = data.choices[0].message.content

    // 4. CLEAN
    content = content.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/```json/g, "").replace(/```/g, "").trim()
    const targetAudience = JSON.parse(content)

    return NextResponse.json({ success: true, targetAudience })

  } catch (error: any) {
    console.error("Audience generation error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}