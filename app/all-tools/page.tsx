"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Home, MessageCircle, Heart, Settings, User, Info, Phone,
  Droplets, Moon, Coffee, Utensils, Activity, FileText, Users, Zap,
  Mic, Stethoscope, Bell, Brain, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ParticleBackground from "@/components/particle-background"

export default function AllToolsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // All tools organized by category for low-literacy users
  const toolCategories = [
    {
      name: "Core Features",
      items: [
        { name: "Home", href: "/", icon: Home, description: "Return to main page" },
        { name: "Chatbot", href: "/chatbot", icon: MessageCircle, description: "Talk to Tadashi AI" },
        { name: "Health Check", href: "/health-check", icon: Stethoscope, description: "Quick health assessment" },
        { name: "Voice Assistant", href: "/tts-stt", icon: Mic, description: "Speak to Tadashi AI" },
      ]
    },
    {
      name: "Daily Trackers",
      items: [
        { name: "Reminders", href: "/reminders", icon: Bell, description: "Medicine and health alerts" },
        { name: "Mood Tracker", href: "/mood-tracker", icon: Heart, description: "Track your feelings" },
        { name: "Nutrition", href: "/nutrition", icon: Utensils, description: "Food and diet tracking" },
        { name: "Sleep", href: "/sleep", icon: Moon, description: "Sleep quality monitor" },
        { name: "Fitness", href: "/fitness", icon: Activity, description: "Steps and exercise" },
      ]
    },
    {
      name: "Health Analysis",
      items: [
        { name: "Wellness Insights", href: "/wellness-insights", icon: Brain, description: "Health trends and tips" },
        { name: "Symptom Checker", href: "/symptom-checker", icon: Stethoscope, description: "Check your symptoms" },
        { name: "Health Records", href: "/health-records", icon: FileText, description: "Your medical documents" },
        { name: "AI Reports", href: "/insights", icon: Zap, description: "Detailed health reports" },
      ]
    },
    {
      name: "Community & Help",
      items: [
        { name: "Community", href: "/community", icon: Users, description: "Connect with others" },
        { name: "Emergency SOS", href: "/sos", icon: Zap, description: "Get help quickly" },
        { name: "Settings", href: "/settings", icon: Settings, description: "Language and preferences" },
        { name: "About", href: "/about", icon: Info, description: "Learn about Tadashi AI" },
        { name: "Contact", href: "/contact", icon: Phone, description: "Get support" },
      ]
    }
  ]

  // Flatten all items for search
  const allTools = toolCategories.flatMap(category => category.items)
  
  // Filter tools based on search term
  const filteredTools = searchTerm 
    ? allTools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allTools

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">All Health Tools</h1>
          <p className="tadashi-tagline">
            Everything you need for better health - all in one place
          </p>
        </div>

        {/* Search bar for easier finding */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for tools... (e.g. 'medicine', 'sleep', 'chat')"
              className="w-full p-4 pl-12 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Find any tool by name or description
          </p>
        </div>

        {/* Show search results or all categories */}
        {searchTerm ? (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Search Results for "{searchTerm}"
            </h2>
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredTools.map((tool, index) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={index}
                      href={tool.href}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-tadashi-blue"
                    >
                      <div className="bg-tadashi-blue/10 dark:bg-tadashi-blue/20 p-3 rounded-full mb-3">
                        <Icon className="h-8 w-8 text-tadashi-blue dark:text-tadashi-blue" />
                      </div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-center text-sm mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {tool.description}
                      </p>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No tools found matching "{searchTerm}"
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Show all categories
          <div className="max-w-6xl mx-auto space-y-12">
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  {category.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {category.items.map((tool, toolIndex) => {
                    const Icon = tool.icon
                    return (
                      <Link
                        key={toolIndex}
                        href={tool.href}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-tadashi-blue"
                      >
                        <div className="bg-tadashi-blue/10 dark:bg-tadashi-blue/20 p-3 rounded-full mb-3">
                          <Icon className="h-8 w-8 text-tadashi-blue dark:text-tadashi-blue" />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-center text-sm mb-1">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                          {tool.description}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voice guidance note */}
        <div className="max-w-2xl mx-auto mt-16 p-6 bg-gradient-to-r from-tadashi-blue/10 to-tadashi-darkBlue/10 dark:from-gray-700 dark:to-gray-800 rounded-2xl border border-tadashi-blue/20">
          <div className="flex items-start">
            <Mic className="h-6 w-6 text-tadashi-blue dark:text-tadashi-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Need Help Finding Tools?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Visit the <Link href="/tts-stt" className="text-tadashi-blue dark:text-tadashi-blue font-medium hover:underline">Voice Assistant</Link> page to speak with Tadashi AI. 
                Just say what you're looking for and Tadashi will guide you to the right tool!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple search icon component
function Search({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}