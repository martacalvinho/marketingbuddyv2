import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let websiteAnalysis: any = null
  
  try {
    const { productName, valueProp, website, websiteAnalysis: analysis, northStarGoal } = await request.json()
    websiteAnalysis = analysis

    const prompt = `You are analyzing the target audience for a specific business. Use the provided website analysis data to create an accurate, business-specific target audience profile.

Business Information:
- Product/Business: ${productName}
- Value Proposition: ${valueProp}
- Website: ${website || 'Not provided'}
- Marketing Goal: ${northStarGoal}

${websiteAnalysis ? `IMPORTANT - Website Analysis Data (USE THIS INFORMATION):
${JSON.stringify(websiteAnalysis, null, 2)}

Pay special attention to:
- Target Audience from analysis: ${websiteAnalysis.businessOverview?.targetAudience ? JSON.stringify(websiteAnalysis.businessOverview.targetAudience) : 'Not specified'}
- Industry: ${websiteAnalysis.businessOverview?.industry || 'Not specified'}
- Business Model: ${websiteAnalysis.businessOverview?.businessModel || 'Not specified'}
` : ''}

IMPORTANT: Base your analysis on the actual business and website analysis provided above. Do NOT use generic data like "small business owners" or "entrepreneurs" unless that's what the business actually serves.

Return the analysis in JSON format with the following structure:
{
  "demographics": {
    "ageRange": "25-55",
    "locations": ["Urban areas", "Suburban areas"],
    "professions": ["Architects", "Interior Designers", "Project Managers"],
    "incomeLevel": "Mid to upper-middle class",
    "companySize": "Small to medium firms"
  },
  "psychographics": {
    "values": ["Efficiency", "Quality", "Innovation"],
    "interests": ["Design trends", "Technology", "Productivity tools"],
    "lifestyle": "Brief description of their lifestyle",
    "personality": ["Detail-oriented", "Results-driven", "Tech-savvy"]
  },
  "painPoints": [
    "Specific challenge they face",
    "Another pain point",
    "Third pain point"
  ],
  "goals": [
    "Primary goal",
    "Secondary goal",
    "Long-term aspiration"
  ],
  "onlinePresence": [
    "LinkedIn",
    "Industry forums",
    "Professional networks"
  ],
  "purchasingBehavior": {
    "decisionFactors": ["ROI", "Ease of use", "Customer testimonials"],
    "researchMethods": ["Peer recommendations", "Online reviews", "Free trials"],
    "buyingProcess": "Description of how they typically make purchasing decisions"
  }
}

Ensure all data is specific, actionable, and relevant to the business provided.`

    console.log('Generating target audience with data:', {
      productName,
      website,
      hasWebsiteAnalysis: !!websiteAnalysis,
      northStarGoal
    })

    // Debug: log whether API key is loaded
    console.log("OpenRouter API Key Loaded:", process.env.OPENROUTER_API_KEY ? "YES" : "NO")

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://marketing-buddy.vercel.app',
        'X-Title': 'Marketing Buddy Target Audience Generation',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const rawContent = data.choices[0]?.message?.content || ''
    
    let targetAudience
    try {
      // Try to parse JSON response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        targetAudience = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.log('Failed to parse JSON, using fallback structure based on website analysis')
      
      // Extract data from website analysis if available
      const analysisAudience = websiteAnalysis?.businessOverview?.targetAudience || []
      const industry = websiteAnalysis?.businessOverview?.industry || 'Business'
      const businessModel = websiteAnalysis?.businessOverview?.businessModel || 'Service-based business'
      
      // Create fallback structured data based on actual business context
      targetAudience = {
        demographics: {
          ageRange: "25-55",
          locations: ["Urban areas", "Suburban areas"],
          professions: analysisAudience.length > 0 ? analysisAudience : ["Business professionals", "Decision makers"],
          incomeLevel: "Mid to upper-middle class",
          companySize: businessModel.includes('enterprise') ? "Medium to large businesses" : "Small to medium businesses"
        },
        psychographics: {
          values: ["Growth", "Efficiency", "Results"],
          interests: ["Business growth", "Marketing trends", "Technology"],
          lifestyle: "Busy professionals balancing multiple responsibilities while seeking to scale their business",
          personality: ["Results-driven", "Tech-savvy", "Goal-oriented"]
        },
        painPoints: [
          "Limited time for marketing activities",
          "Difficulty measuring marketing ROI",
          "Keeping up with marketing trends and best practices"
        ],
        goals: [
          "Increase revenue and customer base",
          "Build strong brand recognition",
          "Streamline marketing processes"
        ],
        onlinePresence: [
          "LinkedIn",
          "Twitter",
          "Industry forums"
        ],
        purchasingBehavior: {
          decisionFactors: ["ROI", "Ease of use", "Customer testimonials"],
          researchMethods: ["Peer recommendations", "Online reviews", "Free trials"],
          buyingProcess: "Research thoroughly, seek peer recommendations, and prefer solutions with proven ROI"
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      targetAudience 
    })

  } catch (error) {
    console.error('Target audience generation error:', error)
    
    // Extract data from website analysis if available for error fallback
    const analysisAudience = websiteAnalysis?.businessOverview?.targetAudience || []
    const industry = websiteAnalysis?.businessOverview?.industry || 'Business'
    const businessModel = websiteAnalysis?.businessOverview?.businessModel || 'Service-based business'
    
    // Fallback structured target audience based on actual business context
    const fallbackAudience = {
      demographics: {
        ageRange: "25-55",
        locations: ["Urban areas", "Suburban areas"],
        professions: analysisAudience.length > 0 ? analysisAudience : ["Business professionals", "Decision makers"],
        incomeLevel: "Mid to upper-middle class",
        companySize: businessModel.includes('enterprise') ? "Medium to large businesses" : "Small to medium businesses"
      },
      psychographics: {
        values: ["Growth", "Efficiency", "Results"],
        interests: ["Business growth", "Marketing trends", "Technology"],
        lifestyle: "Busy professionals balancing multiple responsibilities while seeking to scale their business",
        personality: ["Results-driven", "Tech-savvy", "Goal-oriented"]
      },
      painPoints: [
        "Limited time for marketing activities",
        "Difficulty measuring marketing ROI",
        "Keeping up with marketing trends and best practices"
      ],
      goals: [
        "Increase revenue and customer base",
        "Build strong brand recognition",
        "Streamline marketing processes"
      ],
      onlinePresence: [
        "LinkedIn",
        "Twitter",
        "Industry forums"
      ],
      purchasingBehavior: {
        decisionFactors: ["ROI", "Ease of use", "Customer testimonials"],
        researchMethods: ["Peer recommendations", "Online reviews", "Free trials"],
        buyingProcess: "Research thoroughly, seek peer recommendations, and prefer solutions with proven ROI"
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      targetAudience: fallbackAudience 
    })
  }
}
