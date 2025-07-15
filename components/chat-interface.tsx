"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Lightbulb, Target, TrendingUp } from "lucide-react"

interface ChatInterfaceProps {
  user: any
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `Hey ${user.name}! 👋 I'm here to help you with your marketing journey. You can ask me about strategies, get feedback on your content, or just chat about your progress. What's on your mind?`,
      timestamp: new Date(),
      suggestions: [
        "Help me write a better value proposition",
        "What should I post on Twitter today?",
        "I'm feeling overwhelmed, what should I focus on?",
        "How do I get my first 10 users?",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Send to AI chat endpoint with website analysis
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          userId: user.id,
          context: {
            productName: user.productName,
            valueProp: user.valueProp,
            goal: user.northStarGoal,
            streak: user.streak,
            xp: user.xp,
            websiteAnalysis: user.websiteAnalysis, // Include real analysis
          },
        }),
      })

      const data = await response.json()

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: data.reply,
        timestamp: new Date(),
        suggestedTask: data.suggestedTask,
        resourceLink: data.resourceLink,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I'm having trouble connecting right now. Try asking me again in a moment!",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setIsTyping(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  return (
    <div className="space-y-6">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-indigo-600" />
            <span>Marketing Buddy Chat</span>
          </CardTitle>
          <CardDescription>
            Get personalized advice, feedback, and motivation for your marketing journey
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Suggestions for bot messages */}
                  {message.type === "bot" && message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs mr-2 mb-1 bg-transparent"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Suggested task */}
                  {message.type === "bot" && message.suggestedTask && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Suggested Action</span>
                      </div>
                      <p className="text-sm text-blue-800 mt-1">{message.suggestedTask}</p>
                    </div>
                  )}

                  <div
                    className={`flex items-center mt-1 space-x-2 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`flex items-center space-x-1 ${message.type === "user" ? "order-2" : "order-1"}`}>
                      {message.type === "user" ? (
                        <User className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about marketing your product..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage(inputValue)}
              disabled={isTyping}
            />
            <Button onClick={() => sendMessage(inputValue)} disabled={isTyping || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => sendMessage("Help me improve my value proposition")}
        >
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-medium">Refine Value Prop</h3>
            <p className="text-sm text-gray-600">Get feedback on your messaging</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => sendMessage("What content should I create today?")}
        >
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium">Content Ideas</h3>
            <p className="text-sm text-gray-600">Get personalized suggestions</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => sendMessage("How am I doing with my marketing goals?")}
        >
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium">Progress Check</h3>
            <p className="text-sm text-gray-600">Review your journey so far</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
