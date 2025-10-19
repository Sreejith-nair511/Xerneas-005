"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function InteractiveCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('interactive')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseOut = () => {
      setIsHovering(false)
    }

    window.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-tadashi-blue/30 dark:bg-tadashi-blue/50 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: position.x - 12,
          y: position.y - 12,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-24 h-24 rounded-full bg-tadashi-blue/10 dark:bg-tadashi-blue/20 pointer-events-none z-40"
        style={{
          x: position.x - 48,
          y: position.y - 48,
        }}
        animate={{
          scale: isHovering ? 1.2 : 1,
          opacity: isHovering ? 0.7 : 0.3,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </>
  )
}