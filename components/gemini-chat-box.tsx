"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function GeminiChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Gemini, an AI assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini")
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ])
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to get response from Gemini. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg dark:bg-gray-900 border-baymax-blue dark:border-baymax-darkBlue">
      <CardHeader className="bg-baymax-blue dark:bg-baymax-darkBlue text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold">Gemini AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-baymax-lightBlue dark:bg-gray-800">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.role === "user"
                    ? "bg-baymax-blue text-white dark:bg-baymax-darkBlue"
                    : "bg-white dark:bg-gray-700 shadow-md"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-3 bg-white dark:bg-gray-700 shadow-md">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-baymax-blue" />
                  <p>Gemini is thinking...</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini something..."
              className="flex-grow baymax-input dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[60px]"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-baymax-blue text-white hover:bg-baymax-darkBlue dark:bg-baymax-darkBlue dark:hover:bg-baymax-blue h-10 w-10"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
