"use client"

import React from "react"

interface PlaceholderAvatarProps {
  name: string
  className?: string
  size?: number
}

export default function PlaceholderAvatar({ 
  name, 
  className = "",
  size = 96 
}: PlaceholderAvatarProps) {
  // Get the first letter of the name for the placeholder
  const initial = name.charAt(0).toUpperCase()
  
  // Generate a color based on the name
  const getColor = () => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ]
    
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div 
      className={`rounded-full flex items-center justify-center ${getColor()} ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-3xl font-bold">{initial}</span>
    </div>
  )
}