"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

type Theme = "default" | "calm" | "energetic" | "focus" | "relax"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("default")

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("tadashi-theme") as Theme | null
    if (savedTheme) {
      console.log("Loading saved theme:", savedTheme)
      setThemeState(savedTheme)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    console.log("Setting theme to:", newTheme)
    setThemeState(newTheme)
  }

  // Save theme to localStorage when it changes and apply globally
  useEffect(() => {
    console.log("Theme changed, applying to DOM:", theme)
    localStorage.setItem("tadashi-theme", theme)
    
    // Apply theme classes globally
    if (typeof document !== 'undefined') {
      // Remove existing theme classes from html and body
      document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "")
      document.body.className = document.body.className.replace(/theme-\w+/g, "")
      
      // Add new theme class to html and body
      document.documentElement.classList.add(`theme-${theme}`)
      document.body.classList.add(`theme-${theme}`)
      
      // Apply theme to all tadashi components
      const themeElements = document.querySelectorAll('.tadashi-button, .tadashi-card, .tadashi-input, .tadashi-heading, .tadashi-subheading, .tadashi-text')
      console.log("Found theme elements:", themeElements.length)
      themeElements.forEach((element, index) => {
        if (element instanceof HTMLElement || element instanceof SVGElement) {
          const classList = element.classList;
          // Remove any existing theme classes
          const themeClasses = Array.from(classList).filter(cls => cls.startsWith('theme-'));
          themeClasses.forEach(cls => classList.remove(cls));
          // Add new theme class
          classList.add(`theme-${theme}`);
          console.log(`Applied theme-${theme} to element ${index}`)
        }
      });
    }
    
    console.log("Theme application completed for:", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}