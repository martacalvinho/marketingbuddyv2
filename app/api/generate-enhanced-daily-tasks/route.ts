import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { 
      user, 
      day, 
      month, 
      weekInMonth, 
      monthStrategy,
      focusArea,
      dailyTaskCount,
      websiteAnalysis 
    } = await request.json()

    // Extract website improvement tasks from analysis if focus includes website
    let websiteTasks: any[] = []
    if ((focusArea === 'website' || focusArea === 'both') && websiteAnalysis?.actionableRecommendations) {
      websiteTasks = websiteAnalysis.actionableRecommendations.map((rec: any, index: number) => ({
        id: `website-${day}-${index}`,
        title: rec.title,
        description: rec.description,
        implementation: rec.implementation,
        category: 'website',
        priority: rec.impact === 'High' ? 'high' : rec.impact === 'Medium' ? 'medium' : 'low',
        timeframe: rec.timeframe,
        impact: rec.impact,
        xp: rec.impact === 'High' ? 20 : rec.impact === 'Medium' ? 15 : 10,
        estimatedTime: rec.timeframe === 'This week' ? '30 min' : rec.timeframe === 'Next week' ? '45 min' : '60 min',
        type: 'website-improvement'
      }))
    }

    const taskCount = parseInt(dailyTaskCount) || 3
    const websiteTasksToInclude = Math.min(websiteTasks.length, focusArea === 'website' ? taskCount : Math.ceil(taskCount / 2))
    const marketingTasksNeeded = taskCount - websiteTasksToInclude

    // Generate marketing tasks based on user profile
    const marketingPrompt = `Generate ${marketingTasksNeeded} personalized daily marketing tasks for:

Business: ${user.productName}
Value Proposition: ${user.valueProp}
Target Audience: ${user.targetAudience}
North Star Goal: ${user.northStarGoal}
Experience Level: ${user.experienceLevel}
Preferred Platforms: ${user.preferredPlatforms?.join(', ')}
Current Challenges: ${user.challenges}
Goal: ${user.goalAmount} ${user.goalType} in ${user.goalTimeline} months

Focus Area: ${focusArea}
Day: ${day} of Month ${month}
${monthStrategy ? `Month Strategy Context: ${monthStrategy}` : ''}

Create tasks that are:
1. Specific and actionable
2. Appropriate for ${user.experienceLevel} level
3. Aligned with ${user.northStarGoal} goal
4. Focused on ${user.preferredPlatforms?.join(', ')} platforms
5. Address their challenge: ${user.challenges}

Format each task as:
**Task X: [Title]**
[Detailed description with specific steps]
- Category: [content/analytics/community/strategy/engagement]
- Impact: [How this helps achieve their goal]
- Tips: [2-3 specific tips for success]

Make tasks progressively build on each other and vary in type (content creation, analytics, community building, etc.)`

    let marketingTasks: any[] = []
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a marketing expert who creates personalized daily tasks based on user goals, experience level, and business context.'
            },
            {
              role: 'user',
              content: marketingPrompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const tasksText = data.choices[0]?.message?.content || ''
        marketingTasks = parseMarketingTasks(tasksText, day, marketingTasksNeeded)
      }
    } catch (error) {
      console.error('Marketing task generation failed:', error)
      // Fallback marketing tasks
      marketingTasks = generateFallbackMarketingTasks(user, day, marketingTasksNeeded)
    }

    // Combine and prioritize tasks
    let combinedTasks: any[] = []
    
    if (focusArea === 'website') {
      // Website improvement first, then marketing
      combinedTasks = [
        ...websiteTasks.slice(0, websiteTasksToInclude),
        ...marketingTasks
      ]
    } else if (focusArea === 'growth') {
      // Only marketing tasks
      combinedTasks = marketingTasks
    } else {
      // Mix both - prioritize high-impact website tasks
      const highPriorityWebsiteTasks = websiteTasks
        .filter(task => task.priority === 'high')
        .slice(0, Math.ceil(websiteTasksToInclude / 2))
      
      const remainingWebsiteTasks = websiteTasks
        .filter(task => task.priority !== 'high')
        .slice(0, websiteTasksToInclude - highPriorityWebsiteTasks.length)
      
      combinedTasks = [
        ...highPriorityWebsiteTasks,
        ...marketingTasks.slice(0, Math.ceil(marketingTasksNeeded / 2)),
        ...remainingWebsiteTasks,
        ...marketingTasks.slice(Math.ceil(marketingTasksNeeded / 2))
      ]
    }

    // Limit to requested task count
    const finalTasks = combinedTasks.slice(0, taskCount)

    // Check if all website tasks are completed (for future notification)
    const completedWebsiteTasks = user.completedTasks?.filter((task: any) => task.type === 'website-improvement') || []
    const allWebsiteTasksCompleted = websiteTasks.length > 0 && completedWebsiteTasks.length >= websiteTasks.length

    return NextResponse.json({
      success: true,
      tasks: finalTasks,
      websiteTasksRemaining: Math.max(0, websiteTasks.length - completedWebsiteTasks.length),
      allWebsiteTasksCompleted,
      focusArea,
      totalWebsiteTasks: websiteTasks.length
    })

  } catch (error) {
    console.error('Enhanced daily task generation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate enhanced daily tasks' 
    }, { status: 500 })
  }
}

function parseMarketingTasks(tasksText: string, day: number, count: number): any[] {
  const taskPattern = /\*\*Task \d+:\s*(.+?)\*\*\n([\s\S]*?)(?=\*\*Task \d+:|$)/g
  const tasks: any[] = []
  let match

  while ((match = taskPattern.exec(tasksText)) !== null && tasks.length < count) {
    const title = match[1].trim()
    const content = match[2].trim()
    
    // Extract category, impact, and tips
    const categoryMatch = content.match(/- Category:\s*(.+)/i)
    const impactMatch = content.match(/- Impact:\s*(.+)/i)
    const tipsMatch = content.match(/- Tips:\s*([\s\S]*?)(?=\n-|\n\*\*|$)/i)
    
    const category = categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'strategy'
    const impact = impactMatch ? impactMatch[1].trim() : 'Builds marketing momentum'
    const tips = tipsMatch ? tipsMatch[1].split('\n').map(tip => tip.replace(/^-\s*/, '').trim()).filter(tip => tip) : []
    
    // Clean description (remove category, impact, tips lines)
    let description = content
      .replace(/- Category:.*$/gm, '')
      .replace(/- Impact:.*$/gm, '')
      .replace(/- Tips:[\s\S]*$/gm, '')
      .trim()

    tasks.push({
      id: `marketing-${day}-${tasks.length + 1}`,
      title,
      description,
      category: ['content', 'analytics', 'community', 'strategy', 'engagement'].includes(category) ? category : 'strategy',
      impact,
      tips: tips.slice(0, 3), // Limit to 3 tips
      xp: 15,
      completed: false,
      estimatedTime: "20 min",
      day,
      type: 'marketing'
    })
  }

  return tasks
}

function generateFallbackMarketingTasks(user: any, day: number, count: number): any[] {
  const fallbackTasks = [
    {
      title: "Create valuable content for your audience",
      description: `Write a helpful post about ${user.valueProp} that addresses your target audience's main challenges.`,
      category: 'content',
      impact: 'Builds audience trust and demonstrates expertise'
    },
    {
      title: "Engage with your community",
      description: `Spend 15 minutes engaging with potential customers on ${user.preferredPlatforms?.[0] || 'social media'}.`,
      category: 'community',
      impact: 'Increases brand visibility and builds relationships'
    },
    {
      title: "Analyze your marketing performance",
      description: "Review your recent marketing activities and identify what's working best.",
      category: 'analytics',
      impact: 'Helps optimize future marketing efforts'
    },
    {
      title: "Optimize your marketing strategy",
      description: `Review and refine your approach to achieving ${user.goalAmount} ${user.goalType}.`,
      category: 'strategy',
      impact: 'Ensures you stay on track toward your goals'
    },
    {
      title: "Build engagement with your audience",
      description: "Respond to comments, messages, and engage with your community.",
      category: 'engagement',
      impact: 'Strengthens relationships and builds loyalty'
    }
  ]

  return fallbackTasks.slice(0, count).map((task, index) => ({
    id: `fallback-${day}-${index + 1}`,
    ...task,
    tips: ['Focus on providing value', 'Be authentic and genuine', 'Track your results'],
    xp: 15,
    completed: false,
    estimatedTime: "20 min",
    day,
    type: 'marketing'
  }))
}
