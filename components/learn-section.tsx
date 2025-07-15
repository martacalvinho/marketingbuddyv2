"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight, CheckCircle, Lightbulb } from "lucide-react"

interface LearnSectionProps {
  user: any
}

const lessons = [
  {
    id: 1,
    title: "Reddit Etiquette for Indie Hackers",
    description: "Master the art of value-first posting on Reddit",
    content: `The key to Reddit success isn't promotion—it's genuine value. Always lead with helping, not selling. Share your struggles, ask for feedback, and contribute to discussions before mentioning your product.

Key principles:
• Be transparent about your role as a founder
• Share lessons learned, not just successes  
• Ask specific questions to get better feedback
• Engage with comments meaningfully
• Follow the 90/10 rule: 90% value, 10% promotion`,
    template: `"I've been struggling with [specific problem]. Built [your product] to solve it for myself, but I'm curious - how do you all handle [problem]? 

What I've learned so far:
• [Insight 1]
• [Insight 2] 
• [Insight 3]

Would love to hear your approaches before I launch this publicly. What am I missing?"`,
    actionTitle: "Create Reddit Post",
    estimatedTime: "10 min",
  },
  {
    id: 2,
    title: "Twitter Thread Hooks That Convert",
    description: "Write opening lines that stop the scroll",
    content: `Your first tweet determines if anyone reads the rest. Great hooks create curiosity, promise value, or challenge assumptions.

Proven hook formulas:
• "I spent [time] doing [thing] so you don't have to. Here's what I learned:"
• "Everyone says [common belief]. Here's why they're wrong:"
• "The [number] mistakes I made building [thing] (and how to avoid them):"
• "I analyzed [big number] of [things]. The patterns were surprising:"
• "[Specific result] in [timeframe]. Here's the exact process:"`,
    template: `I spent 6 months building [your product] and made every mistake possible.

Here are the 5 biggest lessons that could save you months:

🧵 Thread 👇

1/ [First lesson with specific example]

2/ [Second lesson with data/story]

[Continue with valuable insights...]

That's a wrap! If you found this helpful:
• Follow me for more [your niche] insights
• RT the first tweet to help other founders

What's your biggest [relevant] challenge? 👇`,
    actionTitle: "Write Twitter Thread",
    estimatedTime: "15 min",
  },
  {
    id: 3,
    title: "LinkedIn Storytelling for B2B",
    description: "Turn your founder journey into compelling content",
    content: `LinkedIn rewards authentic professional stories. Share your challenges, insights, and lessons learned as a founder. The platform favors vulnerability and genuine experiences over polished marketing.

Story structure that works:
• Hook: Start with a relatable problem or surprising insight
• Context: Brief background on your situation
• Challenge: What obstacle did you face?
• Action: What did you do about it?
• Result: What happened? Include specific outcomes
• Lesson: What would you do differently? What advice do you have?
• CTA: Ask a question to encourage engagement`,
    template: `6 months ago, I thought building the product was the hard part.

I was wrong.

After launching [your product], I realized distribution is where most founders fail (including me).

Here's what I wish I knew:

❌ "Build it and they will come" is a myth
✅ Start marketing before you finish building

❌ Posting randomly on social media
✅ Consistent daily habits in one channel first

❌ Talking about features
✅ Sharing the problem you're solving

The result? [Specific metric/outcome]

To fellow founders: What's your biggest marketing challenge right now?

#BuildInPublic #Entrepreneurship #StartupLife`,
    actionTitle: "Write LinkedIn Post",
    estimatedTime: "12 min",
  },
]

export default function LearnSection({ user }: LearnSectionProps) {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0])
  const [appliedLessons, setAppliedLessons] = useState(new Set())

  const applyLesson = async (lesson: any) => {
    // Mark lesson as applied
    setAppliedLessons((prev) => new Set([...prev, lesson.id]))

    // Generate personalized content based on the lesson
    try {
      const response = await fetch("/api/apply-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          lessonTemplate: lesson.template,
          product: user.productName,
          valueProp: user.valueProp,
          websiteAnalysis: user.websiteAnalysis,
        }),
      })

      const data = await response.json()

      // You could show the generated content in a modal or redirect to content calendar
      alert(`Generated ${lesson.actionTitle}! Check your content calendar.`)
    } catch (error) {
      console.error("Failed to apply lesson:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Marketing Swipe Files</span>
          </CardTitle>
          <CardDescription>Weekly lessons with templates you can apply immediately</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <Card
                key={lesson.id}
                className={`cursor-pointer transition-all ${
                  selectedLesson.id === lesson.id ? "ring-2 ring-indigo-500 bg-indigo-50" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{lesson.title}</h3>
                    {appliedLessons.has(lesson.id) && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{lesson.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {lesson.estimatedTime}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedLesson.title}</span>
            <Button onClick={() => applyLesson(selectedLesson)} disabled={appliedLessons.has(selectedLesson.id)}>
              {appliedLessons.has(selectedLesson.id) ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Applied
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {selectedLesson.actionTitle}
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Lesson Content</h4>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="whitespace-pre-line text-sm text-blue-900">{selectedLesson.content}</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Template</h4>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="whitespace-pre-line text-sm text-gray-700 font-mono">{selectedLesson.template}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Estimated time:</span>
              <Badge variant="outline">{selectedLesson.estimatedTime}</Badge>
            </div>
            <Button onClick={() => applyLesson(selectedLesson)} disabled={appliedLessons.has(selectedLesson.id)}>
              {selectedLesson.actionTitle}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
