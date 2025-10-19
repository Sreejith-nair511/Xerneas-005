"use client"

import { useState, useEffect } from "react"
import EnhancedLoading from "@/components/enhanced-loading"

interface LoadingAnimationProps {
  duration?: number
}

const LoadingAnimation = ({ duration = 3000 }: LoadingAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return isVisible ? <EnhancedLoading /> : null
}

export default LoadingAnimation