"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Rocket, Target, Globe, Zap } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: (user: any) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    productName: "",
    valueProp: "",
    website: "",
    audienceSize: "",
    preferredChannel: "",
    northStarGoal: "",
  })
  const [analyzing, setAnalyzing] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setAnalyzing(true)

    // Mark that user has visited
    localStorage.setItem("marketing-buddy-visited", "true")

    // Analyze website if provided
    let websiteAnalysis = null
    if (formData.website) {
      try {
        const response = await fetch("/api/analyze-website", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website: formData.website }),
        })
        websiteAnalysis = await response.json()
      } catch (error) {
        console.error("Website analysis failed:", error)
      }
    }

    // Create user profile
    const userData = {
      ...formData,
      websiteAnalysis,
      createdAt: new Date().toISOString(),
      streak: 0,
      xp: 0,
      completedTasks: [],
    }

    // Save to localStorage (in production, this would be a database)
    localStorage.setItem("marketing-buddy-user", JSON.stringify(userData))

    // Generate initial 30-day plan
    await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    setAnalyzing(false)
    onComplete(userData)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Marketing Buddy</h1>
          </div>
          <CardDescription>
            Your no-BS accountability partner for turning your app into a sustainable business
          </CardDescription>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= step ? "bg-indigo-600" : "bg-gray-300"}`} />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Hey! I'm Marketing Buddy 🎉</h2>
                <p className="text-gray-600">
                  You just shipped—huge congrats! Now let's make sure the right people see it.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">What should I call you?</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label htmlFor="product">Product name</Label>
                  <Input
                    id="product"
                    value={formData.productName}
                    onChange={(e) => updateFormData("productName", e.target.value)}
                    placeholder="What's your app called?"
                  />
                </div>

                <div>
                  <Label htmlFor="valueProp">In one sentence, what does your app do and who is it for?</Label>
                  <Textarea
                    id="valueProp"
                    value={formData.valueProp}
                    onChange={(e) => updateFormData("valueProp", e.target.value)}
                    placeholder="e.g., A task manager for remote teams who struggle with async communication"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-2" />
                <h2 className="text-xl font-semibold mb-2">Let's analyze your current setup</h2>
                <p className="text-gray-600">This helps me understand your starting point</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="website">Website URL (optional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://yourapp.com"
                  />
                </div>

                <div>
                  <Label>Current audience size</Label>
                  <RadioGroup
                    value={formData.audienceSize}
                    onValueChange={(value) => updateFormData("audienceSize", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-10" id="size1" />
                      <Label htmlFor="size1">0-10 people</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10-50" id="size2" />
                      <Label htmlFor="size2">10-50 people</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50-100" id="size3" />
                      <Label htmlFor="size3">50-100 people</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="100+" id="size4" />
                      <Label htmlFor="size4">100+ people</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Target className="h-12 w-12 text-indigo-600 mx-auto mb-2" />
                <h2 className="text-xl font-semibold mb-2">Choose your preferred channel</h2>
                <p className="text-gray-600">Where do you feel most comfortable engaging?</p>
              </div>

              <div>
                <Label>Preferred marketing channel</Label>
                <Select
                  value={formData.preferredChannel}
                  onValueChange={(value) => updateFormData("preferredChannel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="hackernews">Hacker News</SelectItem>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="blog">Content/Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-2" />
                <h2 className="text-xl font-semibold mb-2">Pick your North Star Goal</h2>
                <p className="text-gray-600">What's the one metric that matters most right now?</p>
              </div>

              <div>
                <Label>30-day goal</Label>
                <RadioGroup
                  value={formData.northStarGoal}
                  onValueChange={(value) => updateFormData("northStarGoal", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="waitlist" id="goal1" />
                    <Label htmlFor="goal1">Build email waitlist (100+ subscribers)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mrr" id="goal2" />
                    <Label htmlFor="goal2">Generate first $100 MRR</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feedback" id="goal3" />
                    <Label htmlFor="goal3">Get 50+ user feedback responses</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="launch" id="goal4" />
                    <Label htmlFor="goal4">Successful Product Hunt launch (top 10)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="users" id="goal5" />
                    <Label htmlFor="goal5">Reach 1000 active users</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={analyzing} className="ml-auto">
              {analyzing ? "Analyzing..." : step === 4 ? "Start My Journey" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
