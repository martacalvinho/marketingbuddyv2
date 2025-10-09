export type ParsedTask = {
  id: string
  title: string
  description: string
  xp: number
  completed: boolean
  estimatedTime: string
  day: number
  month: number
  week: number
  category: 'content' | 'analytics' | 'community' | 'strategy' | 'engagement'
  impact: string
  tips: string[]
}

// Extract tasks from various formats in plan text
export function parseTasks(content: string, day: number, limit: number = 3): ParsedTask[] {
  const taskPatterns = [
    /- \*\*Task \d+:\*\*\s*([\s\S]+?)(?=\n- \*\*Task|###|$)/g, // - **Task X:** format with metadata
    /- \*\*Task \d+:\*\*\s*(.+)/g, // - **Task X:** one-line
    /- (.+?)(?=\n|$)/g, // simple bullets
    /\*\*Task \d+:\*\*\s*(.+)/g, // **Task X:** one-line
    /\d+\.\s*(.+?)(?=\n|$)/g // numbered list
  ]

  let tasks: ParsedTask[] = []

  for (const pattern of taskPatterns) {
    const matches = Array.from(content.matchAll(pattern))
    if (matches.length > 0) {
      tasks = matches.slice(0, limit).map((match, idx) => {
        let taskContent = match[1].trim()

        // Clean up formatting noise
        taskContent = taskContent.replace(/\*\*/g, '').replace(/\*/g, '')

        // Split on first colon to get title vs description
        const colonIndex = taskContent.indexOf(':')
        let title = taskContent
        let description = ''
        if (colonIndex > 0 && colonIndex < 80) {
          title = taskContent.substring(0, colonIndex).trim()
          description = taskContent.substring(colonIndex + 1).trim()
        }

        // Extract metadata if present
        let category: ParsedTask['category'] = 'strategy'
        let impact = 'Builds foundational marketing skills'
        let tips: string[] = []

        const categoryMatch = taskContent.match(/-\s*Category:\s*(\w+)/i)
        if (categoryMatch) {
          const categoryValue = categoryMatch[1].toLowerCase()
          if (['content', 'analytics', 'community', 'strategy', 'engagement'].includes(categoryValue)) {
            category = categoryValue as ParsedTask['category']
          }
        }

        const impactMatch = taskContent.match(/-\s*Impact:\s*(.+?)(?=\n|$)/i)
        if (impactMatch) {
          impact = impactMatch[1].trim()
        }

        const tipsMatch = taskContent.match(/-\s*Tips:\s*(.+?)(?=\n|$)/i)
        if (tipsMatch) {
          tips = tipsMatch[1].split(',').map(t => t.trim()).filter(Boolean)
        }

        // Fallback classification
        if (category === 'strategy') {
          const lower = `${title} ${description}`.toLowerCase()
          if (/(post|content|create|write|publish)/.test(lower)) category = 'content'
          else if (/(analyze|track|metric|data|insight)/.test(lower)) category = 'analytics'
          else if (/(engage|comment|respond|community|follower)/.test(lower)) category = 'community'
          else if (/(optimize|improve|strategy|plan)/.test(lower)) category = 'strategy'
          else if (/(share|like|follow|interact)/.test(lower)) category = 'engagement'
        }

        if (impact === 'Builds foundational marketing skills') {
          const lower = `${title} ${description}`.toLowerCase()
          if (/(growth|increase|boost)/.test(lower)) impact = 'Drives user growth and engagement'
          else if (/(brand|awareness)/.test(lower)) impact = 'Increases brand visibility and recognition'
          else if (/(conversion|revenue)/.test(lower)) impact = 'Improves conversion rates and revenue'
          else if (/(retention|loyalty)/.test(lower)) impact = 'Enhances user retention and loyalty'
        }

        if (tips.length === 0) {
          switch (category) {
            case 'content':
              tips = [
                'Focus on providing value to your audience',
                'Use relevant hashtags to increase discoverability',
                'Include a clear call-to-action to drive engagement'
              ]
              break
            case 'analytics':
              tips = [
                'Look for patterns in your data, not just numbers',
                'Compare metrics to previous periods for context',
                'Use insights to inform your next content strategy'
              ]
              break
            case 'community':
              tips = [
                'Be authentic and genuine in your interactions',
                'Ask questions to encourage responses',
                'Show appreciation for community contributions'
              ]
              break
            case 'strategy':
              tips = [
                'Align tasks with your long-term business goals',
                'Document your learnings for future reference',
                'Be flexible and adapt based on results'
              ]
              break
            case 'engagement':
              tips = [
                'Respond promptly to comments and messages',
                'Personalize your interactions when possible',
                'Share content that sparks conversation'
              ]
              break
          }
        }

        return {
          id: `${day}-${idx + 1}`,
          title,
          description,
          xp: 10,
          completed: false,
          estimatedTime: '15 min',
          day,
          month: Math.ceil(day / 30),
          week: Math.ceil((((day - 1) % 30) + 1) / 7),
          category,
          impact,
          tips,
        }
      })
      break
    }
  }

  const uniqueTasks = tasks.filter((task, index, self) =>
    index === self.findIndex(t => t.title === task.title && t.description === task.description)
  )

  return uniqueTasks
}
