"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import InteractiveGif from "@/components/interactive-gif"
import ParticleBackground from "@/components/particle-background"
import { Button } from "@/components/ui/button"
import { Heart, Menu } from "lucide-react"

export default function Home() {
  const [isVisible, setIsVisible] = useState(true)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This simulates the loading animation behavior
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Track cursor position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCursorPosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!isVisible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tadashi-lightBlue dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-tadashi-blue border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tadashi-lightBlue to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 overflow-hidden relative"
    >
      <ParticleBackground />
      
      {/* Interactive cursor effect */}
      <motion.div
        className="absolute rounded-full bg-tadashi-blue/20 dark:bg-tadashi-blue/30 pointer-events-none"
        style={{
          left: `${cursorPosition.x}%`,
          top: `${cursorPosition.y}%`,
          width: "300px",
          height: "300px",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl z-10 relative"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-64 h-64 mb-8"
          >
            <InteractiveGif
              src="/images/tadashi-hello.gif"
              alt="Tadashi AI saying hello"
              floating={true}
              pulsing={true}
            />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="tadashi-hero"
          >
            Tadashi AI - Open Beta
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="tadashi-tagline"
          >
            India's First AI Healthcare Companion - Now in Open Beta
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="/chatbot">
              <Button className="tadashi-button w-full sm:w-auto text-lg px-8 py-4">
                Start Chatting
              </Button>
            </Link>
            <Link href="/tts-stt">
              <Button className="tadashi-button-secondary w-full sm:w-auto text-lg px-8 py-4">
                Try Voice Features
              </Button>
            </Link>
          </motion.div>
          
          {/* India-specific features */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <Link href="/reminders">
              <Button className="tadashi-button w-full sm:w-auto text-lg px-8 py-4 bg-gradient-to-r from-tadashi-blue to-tadashi-darkBlue hover:from-tadashi-darkBlue hover:to-tadashi-blue">
                All Health Tools
              </Button>
            </Link>
          </motion.div>
          
          {/* India-specific features */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8 w-full max-w-3xl"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-2 text-tadashi-darkBlue dark:text-tadashi-blue">13 Indian Languages</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Support for Hindi, Tamil, Telugu, Bengali, Marathi, and more</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-2 text-tadashi-darkBlue dark:text-tadashi-blue">Low Literacy Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Voice-first interface with visual aids for all users</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-2 text-tadashi-darkBlue dark:text-tadashi-blue">Free During Beta</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">All premium features unlocked for beta testers</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 1 }}
            className="h-1 bg-tadashi-blue w-32 mt-8 rounded-full"
          />
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-sm text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto"
          >
            <p className="mb-4">Help us make healthcare accessible to all Indians - Join our open beta today!</p>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                <Heart className="h-5 w-5 text-tadashi-blue mr-2" />
                How to Access All Health Tools
              </h3>
              <p className="mb-3">We have 18+ health tools to help you stay healthy:</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">💊 Reminders</span>
                <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">😴 Sleep Tracker</span>
                <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">🥗 Nutrition</span>
                <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">🏃 Fitness</span>
                <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">🧠 Mood Tracker</span>
                <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">+12 more!</span>
              </div>
              <p>
                Click the <span className="font-bold">"All Health Tools"</span> button above or look for the 
                <Menu className="inline h-4 w-4 mx-1 text-tadashi-blue" /> menu icon in the top right corner.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}