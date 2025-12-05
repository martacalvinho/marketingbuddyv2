import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { supabase } from "@/lib/supabase"

export const maxDuration = 60

export async function POST(req: Request) {
  let websiteInput: string | null = null
  try {
    const parsed = await req.json()
    const website = parsed?.website as string
    websiteInput = website ?? null

    if (!website) {
      return NextResponse.json({ error: "Website URL is required" }, { status: 400 })
    }

    // 1. SCRAPE CONTENT
    console.log(`Fetching content for: ${website}`)
    
    const jinaHeaders: Record<string, string> = {
      "X-Target-Selector": "body",
      "User-Agent": "Marketing-Buddy-Bot/2.0"
    }
    if (process.env.JINA_API_KEY) {
      jinaHeaders["Authorization"] = `Bearer ${process.env.JINA_API_KEY}`
    }

    const jinaResponse = await fetch(`https://r.jina.ai/${website}`, {
      headers: jinaHeaders,
    })

    if (!jinaResponse.ok) {
      throw new Error(`Jina Extraction Failed: ${jinaResponse.statusText}`)
    }

    const text = await jinaResponse.text()
    const cleanedContent = text.slice(0, 6000);

    // 2. THE PROMPT
    const systemPrompt = `
      You are a cynical, Tier-1 Growth Marketing Strategist.
      Analyze the provided website content critically.
      
      CRITICAL RULES:
      1. NO GENERIC ADVICE. Be specific to the product type.
      2. OUTPUT ONLY RAW JSON.
      3. If using reasoning, keep it internal. output ONLY the JSON object.
    `

    const userPrompt = `
      Analyze this website: "${website}"
      Content:
      """
      ${cleanedContent}
      """

      Return a JSON object with this EXACT structure:
      {
        "businessOverview": {
          "summary": "2 sentence summary of what they actually do",
          "targetAudience": ["Specific Persona 1", "Specific Persona 2"],
          "valueProps": ["Prop 1", "Prop 2"],
          "industry": "Specific Niche (e.g. B2B SaaS, E-com)",
          "businessModel": "How they make money (e.g. Freemium, Ads)"
        },
        "marketingOpportunities": [
          {
            "title": "Specific Growth Tactic",
            "description": "Detailed tactic",
            "priority": "High" | "Medium",
            "effort": "Low" | "Medium" | "High",
            "reasoning": "Why this works",
            "channels": ["Platform 1"]
          },
          {
            "title": "Specific Growth Tactic 2",
            "description": "Detailed tactic",
            "priority": "Medium",
            "effort": "Low",
            "reasoning": "Why",
            "channels": ["Platform 2"]
          },
          {
            "title": "Specific Growth Tactic 3",
            "description": "Detailed tactic",
            "priority": "High",
            "effort": "High",
            "reasoning": "Why",
            "channels": ["Platform 3"]
          }
        ],
        "marketingStrengths": [
          "Specific strength 1",
          "Specific strength 2",
          "Specific strength 3"
        ],
        "contentMessagingAnalysis": {
          "currentMessaging": "Summary of their current headline/hook",
          "toneOfVoice": "Current tone",
          "messagingGaps": [
            "Specific angle they are missing", 
            "Objection they aren't addressing"
          ],
          "improvementSuggestions": [
            "Specific copy change idea"
          ]
        },
        "competitivePositioning": {
          "marketPosition": "Where they sit vs competitors",
          "differentiators": ["Unique feature 1", "Unique feature 2"],
          "improvements": ["Where they are weak vs competitors"]
        },
        "actionableRecommendations": [
          {
            "title": "Immediate Action Item",
            "description": "Specific task",
            "timeframe": "This Week",
            "impact": "High",
            "implementation": "How to execute"
          },
          {
            "title": "Secondary Action Item",
            "description": "Specific task",
            "timeframe": "Next Week",
            "impact": "Medium",
            "implementation": "How to execute"
          }
        ]
      }
    `

    // 3. CALL OPENROUTER
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://marketingbuddy.ai",
        "X-Title": "Marketing Buddy",
      },
      body: JSON.stringify({
        // Updated to the model you requested
        model: "openai/gpt-oss-20b:free", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
        const err = await response.text()
        throw new Error(`OpenRouter Error: ${err}`)
    }

    const data = await response.json()
    let content = data.choices[0].message.content || ""
    
    // 4. ROBUST CLEANING
    content = content.replace(/<think>[\s\S]*?<\/think>/g, "");
    content = content.replace(/```json/g, "").replace(/```/g, "");

    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
        content = content.substring(firstBrace, lastBrace + 1);
    }

    let analysis;
    try {
        analysis = JSON.parse(content)
    } catch (e) {
        console.error("JSON Parse Error. Raw content:", content)
        throw new Error("The AI model failed to generate valid JSON. Please try again.");
    }

    const { data: sessionData } = await supabase.auth.getSession()

    // Store audit success
    try {
      await supabaseServer.from("website_audits").insert({
        user_id: sessionData.session?.user.id ?? null,
        website,
        success: true,
        status: "ok",
        content_length: cleanedContent.length,
        extracted_at: new Date().toISOString(),
        metadata: {
          model: "openai/gpt-oss-20b:free",
        },
      })
    } catch (auditErr) {
      console.warn("Failed to log website audit (success):", auditErr)
    }

    return NextResponse.json({
      success: true,
      url: website,
      contentLength: cleanedContent.length,
      extractedAt: new Date().toISOString(),
      ...analysis,
    })

  } catch (error: any) {
    console.error("Analysis failed:", error)

    // Best-effort failure logging
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      await supabaseServer.from("website_audits").insert({
        user_id: sessionData.session?.user.id ?? null,
        website: websiteInput,
        success: false,
        status: "error",
        error: error?.message || "Unknown error",
        extracted_at: new Date().toISOString(),
      })
    } catch (auditErr) {
      console.warn("Failed to log website audit (error):", auditErr)
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}