"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send, Mic, MicOff, Volume2, Lock, Accessibility, Languages, Eye, EyeOff, Type } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePremium } from "@/contexts/premium-context"
import Link from "next/link"
import InteractiveGif from "@/components/interactive-gif"

interface Message {
  role: "user" | "assistant"
  content: string
}

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Indian language options
const indianLanguages = [
  { code: "en-US", name: "English", description: "English (India)" },
  { code: "hi-IN", name: "हिंदी", description: "Hindi" },
  { code: "bn-IN", name: "বাংলা", description: "Bengali" },
  { code: "te-IN", name: "తెలుగు", description: "Telugu" },
  { code: "mr-IN", name: "मराठी", description: "Marathi" },
  { code: "ta-IN", name: "தமிழ்", description: "Tamil" },
  { code: "ur-IN", name: "اردو", description: "Urdu" },
  { code: "gu-IN", name: "ગુજરાતી", description: "Gujarati" },
  { code: "kn-IN", name: "ಕನ್ನಡ", description: "Kannada" },
  { code: "ml-IN", name: "മലയാളം", description: "Malayalam" },
  { code: "pa-IN", name: "ਪੰਜਾਬੀ", description: "Punjabi" },
  { code: "or-IN", name: "ଓଡ଼ିଆ", description: "Odia" },
  { code: "as-IN", name: "অসমীয়া", description: "Assamese" },
];

// Common health phrases for quick access
const commonHealthPhrases = [
  "I have a headache",
  "I feel tired",
  "Stomach pain",
  "Difficulty sleeping",
  "Chest pain",
  "Fever",
  "Cough",
  "Body ache",
  "Need medicine",
  "Doctor appointment"
];

export default function TtsSttChatBox() {
  // For open beta, we'll allow access without authentication
  // const { isPremium, user } = usePremium()
  const isPremium = true; // For open beta, treat everyone as premium
  const user = { id: 'open-beta-user', name: 'Open Beta User', isPremium: true }; // Mock user for open beta
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Tadashi AI with Text-to-Speech and Speech-to-Text capabilities. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(indianLanguages[0]) // Default to English
  const [showQuickPhrases, setShowQuickPhrases] = useState(false)
  const [fontSize, setFontSize] = useState("base") // base, large, xl
  const [showVisualAids, setShowVisualAids] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Speech recognition setup
  const SpeechRecognitionClass = typeof window !== "undefined" 
    ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
    : null
  const recognition = SpeechRecognitionClass ? new SpeechRecognitionClass() : null

  if (recognition) {
    recognition.continuous = false
    recognition.lang = selectedLanguage.code
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsRecording(false)
      toast({
        title: "Voice input received",
        description: `Heard in ${selectedLanguage.name}: ${transcript}`,
      })
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsRecording(false)
      toast({
        title: "Voice recognition error",
        description: `Error: ${event.error}. Please try again or type your message`,
        variant: "destructive",
      })
    }

    recognition.onend = () => {
      setIsRecording(false)
    }
  }

  // Update recognition language when selected language changes
  useEffect(() => {
    if (recognition) {
      recognition.lang = selectedLanguage.code;
    }
  }, [selectedLanguage, recognition]);

  const toggleRecording = () => {
    // Remove premium check for open beta
    /*
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Speech-to-Text is a premium feature. Upgrade to access this functionality.",
        variant: "destructive",
      })
      return
    }
    */

    if (!recognition) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive",
      })
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      try {
        recognition.start()
        setIsRecording(true)
        toast({
          title: "Listening...",
          description: `Speak in ${selectedLanguage.name} (${selectedLanguage.description})`,
        })
      } catch (error) {
        setIsRecording(false)
        toast({
          title: "Voice recognition error",
          description: "Failed to start recording. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Text-to-Speech functionality
  const speak = (text: string) => {
    // Remove premium check for open beta
    /*
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Text-to-Speech is a premium feature. Upgrade to access this functionality.",
        variant: "destructive",
      })
      return
    }
    */

    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9 // Slightly slower for better comprehension
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      // Set language for speech synthesis
      utterance.lang = selectedLanguage.code;
      
      utterance.onstart = () => {
        setIsSpeaking(true)
        toast({
          title: "Speaking...",
          description: `Tadashi AI is reading the response in ${selectedLanguage.name}`,
        })
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        toast({
          title: "Finished speaking",
          description: "Response completed",
        })
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        toast({
          title: "Speech error",
          description: "Failed to read the response",
          variant: "destructive",
        })
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Text-to-Speech not supported",
        description: "Your browser doesn't support Text-to-Speech",
        variant: "destructive",
      })
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      toast({
        title: "Speech stopped",
        description: "Reading has been stopped",
      })
    }
  }

  // Improved scrolling function with better reliability
  const scrollToBottom = () => {
    // Use requestAnimationFrame to ensure DOM is updated before scrolling
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
      }
    })
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus management for accessibility
  useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus()
  }, [])

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
      // Record the question to Google Sheets (during open beta)
      try {
        await fetch("/api/record-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: input,
            language: selectedLanguage.code,
            languageName: selectedLanguage.name,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (recordError) {
        console.error("Failed to record question:", recordError)
        // Don't fail the main request if recording fails
      }

      const response = await fetch("/api/mistral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: input,
          language: selectedLanguage.code,
          languageName: selectedLanguage.name
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ])
      
      toast({
        title: "Response received",
        description: "Mistral AI has responded to your query",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from Mistral. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Accessibility features
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow submitting with Ctrl+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      const form = e.currentTarget.closest('form')
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]')
        if (submitButton) {
          (submitButton as HTMLButtonElement).click()
        }
      }
    }
    
    // Allow focusing the send button with Alt+S
    if (e.key === 's' && e.altKey) {
      const form = e.currentTarget.closest('form')
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]')
        if (submitButton) {
          (submitButton as HTMLButtonElement).focus()
        }
      }
    }
    
    // Allow focusing the mic button with Alt+M
    if (e.key === 'm' && e.altKey) {
      const form = e.currentTarget.closest('form')
      if (form) {
        const micButton = form.querySelector('button[aria-label*="recording"]')
        if (micButton) {
          (micButton as HTMLButtonElement).focus()
        }
      }
    }
  }

  // Add a phrase to the input
  const addPhrase = (phrase: string) => {
    setInput(prev => prev ? `${prev}, ${phrase}` : phrase);
    inputRef.current?.focus();
  }

  // Increase font size for better readability
  const increaseFontSize = () => {
    if (fontSize === "base") setFontSize("large");
    else if (fontSize === "large") setFontSize("xl");
    else setFontSize("base");
  }

  // Remove authentication check for open beta
  /*
  if (!user) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-lg dark:bg-gray-900 border-tadashi-blue dark:border-tadashi-darkBlue">
        <CardHeader className="bg-tadashi-blue dark:bg-tadashi-darkBlue text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            TTS/STT with Mistral AI
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Lock className="h-16 w-16 mx-auto text-tadashi-blue mb-4" />
          <h3 className="text-2xl font-bold mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please log in or sign up to access the Text-to-Speech and Speech-to-Text features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="tadashi-button w-full sm:w-auto">
                Sign Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }
  */

  // Remove premium check for open beta
  /*
  if (!isPremium) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-lg dark:bg-gray-900 border-tadashi-blue dark:border-tadashi-darkBlue">
        <CardHeader className="bg-tadashi-blue dark:bg-tadashi-darkBlue text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            TTS/STT with Mistral AI
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Lock className="h-16 w-16 mx-auto text-tadashi-blue mb-4" />
          <h3 className="text-2xl font-bold mb-2">Premium Feature</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Text-to-Speech and Speech-to-Text capabilities are premium features.
          </p>
          <Link href="/premium">
            <Button className="tadashi-button">
              Upgrade to Premium for ₹49/month
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }
  */

  return (
    <Card 
      className="w-full max-w-3xl mx-auto shadow-lg dark:bg-gray-900 border-tadashi-blue dark:border-tadashi-darkBlue"
      role="region"
      aria-label="TTS/STT Chat Interface"
    >
      <CardHeader className="bg-tadashi-blue dark:bg-tadashi-darkBlue text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          TTS/STT with Mistral AI - Open Beta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Accessibility Toolbar */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={increaseFontSize}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Adjust font size for better readability"
          >
            <Type className="h-4 w-4 mr-1" />
            Font Size
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVisualAids(!showVisualAids)}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            title={showVisualAids ? "Hide visual aids" : "Show visual aids"}
          >
            {showVisualAids ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            Visual Aids
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQuickPhrases(!showQuickPhrases)}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            title={showQuickPhrases ? "Hide quick phrases" : "Show quick phrases"}
          >
            <span className="mr-1">⚡</span>
            Quick Phrases
          </Button>
        </div>
        
        {/* Quick Phrases Panel */}
        {showQuickPhrases && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Common Health Phrases:
            </div>
            <div className="flex flex-wrap gap-2">
              {commonHealthPhrases.map((phrase, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addPhrase(phrase)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 h-auto py-1 px-2 text-xs"
                >
                  {phrase}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Language Selector */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Languages className="h-4 w-4 text-tadashi-blue" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Language:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {indianLanguages.map((language) => (
              <Button
                key={language.code}
                variant={selectedLanguage.code === language.code ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(language)}
                className={
                  selectedLanguage.code === language.code
                    ? "bg-tadashi-blue text-white hover:bg-tadashi-darkBlue"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              >
                {language.name}
              </Button>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Selected: {selectedLanguage.description} ({selectedLanguage.code})
          </div>
        </div>
        
        <div 
          className="h-[400px] overflow-y-auto p-4 space-y-4 bg-tadashi-lightBlue dark:bg-gray-800 relative"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          tabIndex={-1}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-4 left-8 w-1.5 h-1.5 bg-tadashi-blue/20 rounded-full animate-ping"></div>
            <div className="absolute top-12 right-16 w-1 h-1 bg-tadashi-darkBlue/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 left-1/4 w-2 h-2 bg-tadashi-blue/30 rounded-full animate-ping delay-700"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-tadashi-darkBlue/20 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-tadashi-blue/20 rounded-full animate-ping delay-1000"></div>
          </div>
          
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.role === "user"
                    ? "bg-tadashi-blue text-white dark:bg-tadashi-darkBlue"
                    : "bg-white dark:bg-gray-700 shadow-md"
                } ${fontSize === "large" ? "text-lg" : fontSize === "xl" ? "text-xl" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <p className="whitespace-pre-wrap" id={`message-${index}`}>
                    {message.content}
                  </p>
                  {message.role === "assistant" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speak(message.content)}
                      disabled={isSpeaking}
                      className="ml-2 flex-shrink-0 hover:bg-tadashi-blue/20 dark:hover:bg-tadashi-blue/30 relative"
                      aria-label={`Listen to message from Tadashi AI: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`}
                      aria-describedby={`message-${index}`}
                    >
                      <Volume2 className="h-4 w-4" />
                      {/* Pulsing animation when speaking */}
                      {isSpeaking && (
                        <span className="absolute inset-0 rounded-full bg-tadashi-blue/20 animate-ping"></span>
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Visual aids for assistant messages */}
                {showVisualAids && message.role === "assistant" && (
                  <div className="mt-2 flex justify-center">
                    <InteractiveGif
                      src={
                        message.content.toLowerCase().includes("headache") || message.content.toLowerCase().includes("pain") 
                          ? "/images/tadashi-caring.gif" 
                          : message.content.toLowerCase().includes("good") || message.content.toLowerCase().includes("well") 
                          ? "/images/tadashi-thumbs-up.gif" 
                          : "/images/tadashi-hello.gif"
                      }
                      alt="Tadashi AI visual aid"
                      width={60}
                      height={60}
                      floating={true}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] rounded-2xl p-3 bg-white dark:bg-gray-700 shadow-md ${fontSize === "large" ? "text-lg" : fontSize === "xl" ? "text-xl" : ""}`}>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-tadashi-blue" />
                  <p id="ai-thinking">Mistral AI is thinking...</p>
                </div>
                {/* Add a caring GIF while loading */}
                <div className="mt-2 relative h-24 w-full flex justify-center">
                  <InteractiveGif
                    src="/images/tadashi-caring.gif"
                    alt="Tadashi AI caring"
                    width={80}
                    height={80}
                    floating={true}
                  />
                </div>
              </div>
            </div>
          )}
          {isSpeaking && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] rounded-2xl p-3 bg-white dark:bg-gray-700 shadow-md ${fontSize === "large" ? "text-lg" : fontSize === "xl" ? "text-xl" : ""}`}>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-tadashi-blue" />
                  <p id="ai-speaking">Speaking...</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopSpeaking}
                    className="ml-2 h-6 px-2"
                    aria-label="Stop speaking"
                  >
                    Stop
                  </Button>
                </div>
                {/* Add a thumbs up GIF while speaking */}
                <div className="mt-2 relative h-24 w-full flex justify-center">
                  <InteractiveGif
                    src="/images/tadashi-thumbs-up.gif"
                    alt="Tadashi AI thumbs up"
                    width={80}
                    height={80}
                    floating={true}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form 
          onSubmit={handleSubmit} 
          className="p-4 border-t border-gray-200 dark:border-gray-700 relative"
          aria-label="Message input form"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-2 left-1/3 w-1 h-1 bg-tadashi-blue/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 right-1/4 w-1.5 h-1.5 bg-tadashi-darkBlue/20 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-tadashi-blue/20 rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="flex items-center space-x-2 mb-2 relative z-10">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              className={`rounded-full relative ${isRecording ? "text-red-500 animate-pulse bg-red-50 dark:bg-red-900/20" : ""}`}
              title={isRecording ? "Stop recording" : "Start voice recording"}
              aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
              aria-pressed={isRecording}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              {/* Pulsing animation when recording */}
              {isRecording && (
                <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></span>
              )}
            </Button>
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? `Listening in ${selectedLanguage.name}...` : `Type or speak in ${selectedLanguage.name}... (Ctrl+Enter to send, Alt+S to focus send button, Alt+M to focus mic button)`}
              className={`flex-grow tadashi-input dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[60px] ${fontSize === "large" ? "text-lg" : fontSize === "xl" ? "text-xl" : ""}`}
              disabled={isLoading || isRecording}
              aria-label="Type your message"
              aria-describedby="input-help"
              rows={2}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim() || isRecording}
              className="rounded-full bg-tadashi-blue text-white hover:bg-tadashi-darkBlue dark:bg-tadashi-darkBlue dark:hover:bg-tadashi-blue h-10 w-10 relative overflow-hidden"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              {/* Shiny effect on hover */}
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
            </Button>
          </div>
          <div id="input-help" className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send • Use microphone for voice input • Click speaker icon to hear responses • Alt+S to focus send button • Alt+M to focus mic button
          </div>
        </form>
      </CardContent>
    </Card>
  )
}