import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== PRO TIP API CALLED ===')
  try {
    const { taskTitle, taskDescription, category, impact } = await request.json()
    console.log('Request data:', { taskTitle, taskDescription, category, impact })

    if (!taskTitle) {
      console.log('Error: No task title provided')
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    console.log('API key exists:', !!apiKey)
    if (!apiKey) {
      console.log('Error: No OpenRouter API key')
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
    }

    const prompt = `Generate a single, actionable pro tip for this marketing task:

Task: ${taskTitle}
Description: ${taskDescription || 'No description provided'}
Category: ${category || 'general'}
Expected Impact: ${impact || 'Not specified'}

Requirements:
- Provide ONE specific, actionable tip (not a list)
- Keep it under 50 words
- Make it practical and immediately useful
- Focus on execution, not theory
- Be specific to this exact task

Return only the tip text, no formatting or extra words.`

    console.log('Making OpenRouter API call...')
    console.log('Prompt:', prompt)
    
    const requestBody = {
      model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    }
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Marketing Buddy'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('OpenRouter response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, response.statusText, errorText)
      return NextResponse.json({ error: `OpenRouter API error: ${response.status} ${response.statusText}` }, { status: 500 })
    }

    const data = await response.json()
    console.log('OpenRouter response:', JSON.stringify(data, null, 2))
    
    // Check if we have choices array
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('No choices in response:', data)
      return NextResponse.json({ error: 'No response choices from AI' }, { status: 500 })
    }
    
    // Check if we have message content - handle different response formats
    const choice = data.choices[0]
    console.log('Choice structure:', JSON.stringify(choice, null, 2))
    
    let content = null
    
    // Try different possible content locations
    if (choice.message && choice.message.content && choice.message.content.trim()) {
      content = choice.message.content
    } else if (choice.message && choice.message.reasoning) {
      // For DeepSeek R1 model, extract the final answer from reasoning
      content = choice.message.reasoning
      // Try to extract just the final tip if it's clearly marked
      const tipMatch = content.match(/(?:tip|advice|suggestion):\s*(.+?)(?:\n|$)/i)
      if (tipMatch) {
        content = tipMatch[1]
      } else {
        // If no clear tip marker, take the last sentence that looks like advice
        const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim())
        if (sentences.length > 0) {
          content = sentences[sentences.length - 1].trim()
        }
      }
    } else if (choice.text) {
      content = choice.text
    } else if (choice.content) {
      content = choice.content
    } else if (choice.message && choice.message.text) {
      content = choice.message.text
    } else if (typeof choice === 'string') {
      content = choice
    }
    
    if (!content) {
      console.error('No content found in choice:', choice)
      return NextResponse.json({ error: 'No content in AI response' }, { status: 500 })
    }
    
    const proTip = content.trim()
    
    if (!proTip) {
      console.error('Empty content after trim:', choice.message.content)
      return NextResponse.json({ error: 'Empty pro tip generated' }, { status: 500 })
    }

    return NextResponse.json({ proTip })

  } catch (error) {
    console.error('Error generating pro tip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
