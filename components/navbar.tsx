"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Menu, X, Home, MessageCircle, Heart, Settings, User, Info, Phone,
  Droplets, Moon, Coffee, Utensils, Activity, FileText, Users, Zap,
  Mic, Stethoscope
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"
import { Moon as MoonIcon, Sun } from "lucide-react"
import ThemeSelector from "@/components/theme-selector"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme: moodTheme, setTheme: setMoodTheme } = useTheme()
  const [darkMode, setDarkMode] = useState(false)
  const [isDialOpen, setIsDialOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleDial = () => {
    setIsDialOpen(!isDialOpen)
  }

  // No authentication in open beta mode

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Organized navigation items grouped by category
  const navCategories = [
    {
      name: "Core",
      items: [
        { name: "Home", href: "/", icon: Home },
        { name: "Chatbot", href: "/chatbot", icon: MessageCircle },
        { name: "Health Check", href: "/health-check", icon: Stethoscope },
        { name: "TTS/STT", href: "/tts-stt", icon: Mic },
        { name: "All Tools", href: "/all-tools", icon: Heart },
      ]
    },
    {
      name: "Trackers",
      items: [
        { name: "Reminders", href: "/reminders", icon: Utensils },
        { name: "Wellness", href: "/wellness-insights", icon: Heart },
        { name: "Mood Tracker", href: "/mood-tracker", icon: Heart },
        { name: "Nutrition", href: "/nutrition", icon: Utensils },
        { name: "Sleep", href: "/sleep", icon: Moon },
        { name: "Fitness", href: "/fitness", icon: Activity },
      ]
    },
    {
      name: "Tools",
      items: [
        { name: "SOS", href: "/sos", icon: Zap },
        { name: "Symptom Checker", href: "/symptom-checker", icon: Stethoscope },
        { name: "Health Records", href: "/health-records", icon: FileText },
        { name: "Community", href: "/community", icon: Users },
        { name: "Insights", href: "/insights", icon: Zap },
      ]
    },
    {
      name: "Settings",
      items: [
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "About", href: "/about", icon: Info },
        { name: "Contact", href: "/contact", icon: Phone },
        { name: "All Tools", href: "/all-tools", icon: Heart },
      ]
    }
  ]

  // Flatten all items for the dial menu
  const allNavItems = navCategories.flatMap(category => category.items)

  return (
    <nav
      className={cn(
        "tadashi-navbar",
        scrolled && "tadashi-navbar-scrolled"
      )}
    >
      <div className="tadashi-container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="tadashi-navbar-brand">Tadashi AI</span>
            </Link>
          </div>

          {/* Desktop - Just show the dial button and essential info */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Open Beta
              </span>
              <span className="tadashi-premium-badge">
                Free Access
              </span>
            </div>

            <ThemeSelector />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>

            {/* Dial button for desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDial} 
              aria-label={isDialOpen ? "Close menu" : "Open menu"}
              className={cn(
                "tadashi-dial-button",
                isDialOpen && "tadashi-dial-button-open"
              )}
            >
              {isDialOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile - Same dial button approach */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeSelector />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>

            {/* Dial button for mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDial} 
              aria-label={isDialOpen ? "Close menu" : "Open menu"}
              className={cn(
                "tadashi-dial-button",
                isDialOpen && "tadashi-dial-button-open"
              )}
            >
              {isDialOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Unified dial menu for both desktop and mobile */}
      {isDialOpen && (
        <div className="tadashi-mobile-menu-overlay">
          <div className="absolute inset-0" onClick={toggleDial}></div>
          <div className="tadashi-mobile-menu-content">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Health Tools</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleDial}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Category-based organization */}
              <div className="space-y-6">
                {navCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {category.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="tadashi-dial-item"
                            onClick={toggleDial}
                          >
                            <Icon className="tadashi-dial-item-icon" />
                            <span className="tadashi-dial-item-text text-xs">{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <span className="tadashi-premium-badge">
                    Free Access - Open Beta
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar