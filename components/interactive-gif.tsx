"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface InteractiveGifProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  floating?: boolean
  pulsing?: boolean
}

export default function InteractiveGif({
  src,
  alt,
  className = "",
  width = 256,
  height = 256,
  floating = false,
  pulsing = false
}: InteractiveGifProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  // Handle click animation
  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width, height }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      animate={{
        y: floating ? [0, -10, 0] : 0,
        scale: isClicked ? [1, 0.9, 1] : 1,
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.3
        }
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain ${pulsing ? 'animate-pulse' : ''}`}
        priority
      />
      
      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full bg-tadashi-blue/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Floating particles around the GIF when hovered */}
      {isHovered && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-tadashi-blue/30"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 15, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}