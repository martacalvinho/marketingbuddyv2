"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Lightbulb } from "lucide-react"
import ChatKnowledgeBase from "@/components/chat-knowledge-base"

interface Message {
  id: number
  type: string
  content: string
  timestamp: Date
  suggestions?: string[]
  suggestedTask?: string
  resourceLink?: string
}

interface ChatInterfaceProps {
  user: any
  dailyTasks?: any[]
  currentDay?: number
  streak?: number
  xp?: number
}

export default function ChatInterface({ user, dailyTasks = [], currentDay = 1, streak = 0, xp = 0 }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: `Hey ${user.name ?? "there"}! 👋 I’m here to help you with your marketing journey. You can ask me about strategies, get feedback on your content, or just chat about your progress. What’s on your mind?`,
      timestamp: new Date(),
      suggestions: [
        "Help me write a better value proposition",
        "What should I post on Twitter today?",
        "I’m feeling overwhelmed, what should I focus on?",
        "How do I get my first 10 users?",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasSentMessage, setHasSentMessage] = useState(false) // 👈 NEW

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setHasSentMessage(true) // 👈 mark first interaction

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          userId: user.id,
          context: {
            productName: user.productName,
            valueProp: user.valueProp,
            goal: user.northStarGoal,
            streak: streak,
            xp: xp,
            websiteAnalysis: user.websiteAnalysis,
            dailyTasks: dailyTasks,
            currentDay: currentDay,
            completedTasks: dailyTasks.filter(task => task.completed).length,
            totalTasks: dailyTasks.length,
            adaptiveStrategy: true, // Indicates this is using 6+ month adaptive strategies
          },
        }),
      })
      const data = await res.json()

      const botMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        content: data.reply,
        timestamp: new Date(),
        suggestedTask: data.suggestedTask,
        resourceLink: data.resourceLink,
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content: "Sorry, I’m having trouble connecting right now. Try asking me again in a moment!",
          timestamp: new Date(),
        },
      ])
    }
    setIsTyping(false)
  }

  const handleSuggestion = (suggestion: string) => sendMessage(suggestion)

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

        {/* Fixed-height chat body */}
        <CardContent className="flex flex-col h-[500px]">
          {/* Scrollable message list */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${msg.type === "user" ? "order-2" : "order-1"}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.type === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Hard-coded suggestions – only on the very first bot message */}
                  {msg.type === "bot" && !hasSentMessage && msg.suggestions?.length && (
                    <div className="mt-2 space-y-1">
                      {msg.suggestions.map((s, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs mr-2 mb-1 bg-transparent"
                          onClick={() => handleSuggestion(s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Context-aware suggested task */}
                  {msg.type === "bot" && msg.suggestedTask && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Suggested Action</span>
                      </div>
                      <p className="text-sm text-blue-800 mt-1">{msg.suggestedTask}</p>
                    </div>
                  )}

                  <div
                    className={`flex items-center mt-1 space-x-2 ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <User className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input row only (no static suggestions) */}
          <div className="shrink-0 flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about marketing your product..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage(inputValue)}
              disabled={isTyping}
            />
            <Button onClick={() => sendMessage(inputValue)} disabled={isTyping || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optional knowledge-base component */}
      <ChatKnowledgeBase messages={messages} onSuggestAction={() => {}} />
    </div>
  )
}