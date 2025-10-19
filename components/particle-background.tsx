"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate initial particles
    const initialParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.1
      })
    }
    setParticles(initialParticles)

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      setParticles(prev => 
        prev.map(particle => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY

          // Bounce off edges
          if (newX <= 0 || newX >= 100) {
            newX = Math.max(0, Math.min(100, newX))
            particle.speedX *= -1
          }
          
          if (newY <= 0 || newY >= 100) {
            newY = Math.max(0, Math.min(100, newY))
            particle.speedY *= -1
          }

          return {
            ...particle,
            x: newX,
            y: newY
          }
        })
      )
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animationFrameId = requestAnimationFrame(animate)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-tadashi-blue/20 dark:bg-tadashi-blue/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          animate={{
            x: [0, Math.sin(particle.id) * 10, 0],
            y: [0, Math.cos(particle.id) * 10, 0],
          }}
          transition={{
            duration: 5 + particle.id * 0.1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}