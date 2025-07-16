export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Image prompt is required" }, { status: 400 })
    }

    if (!process.env.TOGETHER_API_KEY) {
      console.error('Together API key not found')
      return Response.json({ error: 'Image generation service not configured' }, { status: 500 })
    }

    const response = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        width: 1024,
        height: 1024,
        steps:4,
        prompt: prompt,
      }),
    })

    if (!response.ok) {
      console.error('Together API error:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Error details:', errorData)
      return Response.json({ 
        error: `Together API Error: ${response.status} - ${response.statusText}`,
        details: errorData 
      }, { status: 500 })
    }

    const data = await response.json()
    console.log('Together API response:', data)
    
    const imageUrl = data.data?.[0]?.url

    if (!imageUrl) {
      console.error('No image URL in response:', data)
      return Response.json({ 
        error: "No image URL returned from Together API",
        details: JSON.stringify(data)
      }, { status: 500 })
    }

    return Response.json({ 
      imageUrl,
      prompt,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return Response.json({ 
      error: "Failed to generate image",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
