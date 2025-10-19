"use client"

import { useState, useEffect } from "react"
import InteractiveGif from "@/components/interactive-gif"

export default function EnhancedLoading() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // This simulates the loading animation behavior
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tadashi-lightBlue dark:bg-gray-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-tadashi-blue/10 dark:bg-tadashi-blue/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center z-10">
        <InteractiveGif
          src="/images/tadashi-hello.gif"
          alt="Tadashi AI loading"
          width={128}
          height={128}
          floating={true}
          pulsing={true}
        />
        <div className="mt-6 text-xl font-semibold text-tadashi-darkBlue dark:text-tadashi-blue">
          Tadashi AI is caring for you...
        </div>
        <div className="flex space-x-2 mt-4">
          <div className="w-3 h-3 bg-tadashi-blue rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-tadashi-blue rounded-full animate-bounce animate-bounce-delay-100"></div>
          <div className="w-3 h-3 bg-tadashi-blue rounded-full animate-bounce animate-bounce-delay-200"></div>
        </div>
      </div>
    </div>
  )
}
