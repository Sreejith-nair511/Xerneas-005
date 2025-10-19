"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2, Send, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { findFallbackResponse } from "@/lib/health-fallbacks"
import { usePremium } from "@/contexts/premium-context"
import Link from "next/link"

type Message = {
  role: "user" | "assistant"
  content: string
}

const HealthCheckForm = () => {
  const { isPremium } = usePremium()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sleepHours: 7,
    stressLevel: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages when they update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus on name field when component mounts
  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const callMistralAPI = async (promptText: string): Promise<string> => {
    try {
      const response = await fetch("/api/mistral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptText }),
      })

      const data = await response.json()

      if (!response.ok || data.error || data.needsFallback) {
        console.warn("Using fallback response due to API error:", data.error)
        return findFallbackResponse(promptText)
      }

      return data.response
    } catch (error) {
      console.error("Error calling Mistral API:", error)
      return findFallbackResponse(promptText)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "AI Health Check is a premium feature. Upgrade to access this functionality.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.age) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Create a prompt for Mistral based on the form data
      const prompt = `
        I'm a ${formData.age} year old person named ${formData.name}.
        I sleep about ${formData.sleepHours} hours per night.
        My stress level is ${formData.stressLevel}/10.
        Based on this information, provide me with 3-5 personalized health recommendations.
        Format each recommendation with a title and a brief description.
        Keep the tone friendly and supportive, like a healthcare companion.
      `

      const aiResponse = await callMistralAPI(prompt)

      // Initialize the chat with the AI response
      setMessages([
        {
          role: "assistant",
          content: `Hello ${formData.name}, here are your personalized health recommendations based on your profile:`,
        },
        {
          role: "assistant",
          content: aiResponse,
        },
      ])

      setShowResults(true)
      toast({
        title: "Health check complete!",
        description: "Here are your personalized health recommendations.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to generate health recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "AI-powered follow-up questions are a premium feature. Upgrade to access this functionality.",
        variant: "destructive",
      })
      return
    }

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")
    setIsLoading(true)

    try {
      // Create a context-aware prompt for Mistral
      const contextPrompt = `
        Context: I'm a ${formData.age} year old person named ${formData.name}.
        I sleep about ${formData.sleepHours} hours per night.
        My stress level is ${formData.stressLevel}/10.
        
        I'm asking about: "${userInput}"
        
        Provide a helpful, accurate, and compassionate response as if you're a healthcare companion.
        Keep your answer concise but informative. Focus on general wellness advice, not specific medical diagnoses.
      `

      const aiResponse = await callMistralAPI(contextPrompt)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
        },
      ])
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      sleepHours: 7,
      stressLevel: 5,
    })
    setShowResults(false)
    setMessages([])
    // Focus on name field after reset
    setTimeout(() => {
      nameRef.current?.focus()
    }, 100)
  }

  if (!isPremium) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden p-8 text-center">
        <Lock className="h-16 w-16 mx-auto text-tadashi-blue mb-4" />
        <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          AI-powered health check is a premium feature.
        </p>
        <Link href="/premium">
          <Button className="tadashi-button">
            Upgrade to Premium for ₹49/month
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
      {!showResults ? (
        <form 
          onSubmit={handleSubmit} 
          className="p-6 md:p-8"
          aria-label="Health check form"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-gray-300">
                    Name
                  </Label>
                  <Input
                    ref={nameRef}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="tadashi-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Your name"
                    required
                    aria-describedby="name-help"
                  />
                  <p id="name-help" className="text-xs text-gray-500 dark:text-gray-400">
                    Enter your full name
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="dark:text-gray-300">
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    className="tadashi-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Your age"
                    min="1"
                    max="120"
                    required
                    aria-describedby="age-help"
                  />
                  <p id="age-help" className="text-xs text-gray-500 dark:text-gray-400">
                    Enter your age in years
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Sleep Information</h2>
              <div className="space-y-2">
                <Label htmlFor="sleepHours" className="dark:text-gray-300">
                  Hours of sleep per night: {formData.sleepHours}
                </Label>
                <Slider
                  id="sleepHours"
                  min={4}
                  max={12}
                  step={0.5}
                  value={[formData.sleepHours]}
                  onValueChange={(value) => handleSliderChange("sleepHours", value)}
                  className="py-4"
                  aria-label="Sleep hours slider"
                  aria-describedby="sleep-hours-help"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>4 hours</span>
                  <span>8 hours</span>
                  <span>12 hours</span>
                </div>
                <p id="sleep-hours-help" className="text-xs text-gray-500 dark:text-gray-400">
                  Adjust the slider to indicate your average sleep hours per night
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Stress Level</h2>
              <div className="space-y-2">
                <Label htmlFor="stressLevel" className="dark:text-gray-300">
                  On a scale of 1-10, how would you rate your stress level? {formData.stressLevel}
                </Label>
                <Slider
                  id="stressLevel"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.stressLevel]}
                  onValueChange={(value) => handleSliderChange("stressLevel", value)}
                  className="py-4"
                  aria-label="Stress level slider"
                  aria-describedby="stress-level-help"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>1 (Low)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (High)</span>
                </div>
                <p id="stress-level-help" className="text-xs text-gray-500 dark:text-gray-400">
                  Adjust the slider to indicate your current stress level (1 = very low, 10 = very high)
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="tadashi-button w-full dark:bg-tadashi-blue dark:hover:bg-tadashi-darkBlue"
              disabled={isSubmitting}
              aria-label="Get AI Health Recommendations"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get AI Health Recommendations"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-6 md:p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Your Health Results</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Hello {formData.name}, here are your personalized health recommendations.
            </p>
          </div>

          <div 
            className="mb-8 h-[400px] overflow-y-auto p-4 space-y-4 bg-tadashi-lightBlue dark:bg-gray-800 rounded-xl"
            role="log"
            aria-live="polite"
            aria-label="Health recommendations"
            tabIndex={-1}
          >
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.role === "user"
                      ? "bg-tadashi-blue text-white dark:bg-tadashi-darkBlue"
                      : "bg-white dark:bg-gray-700 shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap" id={`health-message-${index}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-3 bg-white dark:bg-gray-700 shadow-md">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-tadashi-blue" />
                    <p id="ai-thinking">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form 
            onSubmit={handleChatSubmit} 
            className="mb-8"
            aria-label="Follow-up question form"
          >
            <div className="flex items-center space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up question about your health..."
                className="flex-grow tadashi-input dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[60px]"
                disabled={isLoading}
                aria-label="Ask a follow-up question"
                aria-describedby="follow-up-help"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-tadashi-blue text-white hover:bg-tadashi-darkBlue dark:bg-tadashi-darkBlue dark:hover:bg-tadashi-blue h-10 w-10"
                aria-label="Send follow-up question"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
            <p id="follow-up-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ask additional questions about your health recommendations
            </p>
          </form>

          <div className="text-center">
            <Button 
              onClick={resetForm} 
              className="tadashi-button dark:bg-tadashi-blue dark:hover:bg-tadashi-darkBlue"
              aria-label="Start New Health Check"
            >
              Start New Health Check
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthCheckForm