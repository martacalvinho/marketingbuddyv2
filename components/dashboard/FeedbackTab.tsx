"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { MessageSquare, Bug, Lightbulb, Heart } from "lucide-react"

interface FeedbackTabProps {
  user: any
}

export default function FeedbackTab({ user }: FeedbackTabProps) {
  const [category, setCategory] = useState("general")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("app_feedback").insert({
        user_id: user.id,
        category,
        message,
        rating: 0 // Default, could add a star rating later
      })

      if (error) throw error

      toast.success("Feedback sent! Thank you for helping us improve.")
      setMessage("")
      setCategory("general")
    } catch (error) {
      console.error("Error sending feedback:", error)
      toast.error("Failed to send feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-white">
            <MessageSquare className="text-lime-400" />
            Give Feedback
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Help us shape the future of Marketing Buddy. We read every message!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base text-zinc-200">What kind of feedback is this?</Label>
            <RadioGroup 
              defaultValue="general" 
              value={category} 
              onValueChange={setCategory}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="general" id="general" className="peer sr-only" />
                <Label
                  htmlFor="general"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-900/50 p-4 hover:bg-zinc-800 hover:text-white text-zinc-400 peer-data-[state=checked]:border-lime-400 peer-data-[state=checked]:text-lime-400 cursor-pointer transition-all"
                >
                  <Heart className="mb-3 h-6 w-6" />
                  General
                </Label>
              </div>
              <div>
                <RadioGroupItem value="bug" id="bug" className="peer sr-only" />
                <Label
                  htmlFor="bug"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-900/50 p-4 hover:bg-zinc-800 hover:text-white text-zinc-400 peer-data-[state=checked]:border-red-400 peer-data-[state=checked]:text-red-400 cursor-pointer transition-all"
                >
                  <Bug className="mb-3 h-6 w-6" />
                  Bug Report
                </Label>
              </div>
              <div>
                <RadioGroupItem value="feature" id="feature" className="peer sr-only" />
                <Label
                  htmlFor="feature"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-900/50 p-4 hover:bg-zinc-800 hover:text-white text-zinc-400 peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:text-blue-400 cursor-pointer transition-all"
                >
                  <Lightbulb className="mb-3 h-6 w-6" />
                  Feature Idea
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-base text-zinc-200">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us what's on your mind..."
              className="min-h-[150px] bg-zinc-900/50 border-white/10 resize-none focus:border-lime-400/50 text-white placeholder:text-zinc-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full bg-lime-400 text-black hover:bg-lime-500 font-semibold"
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
