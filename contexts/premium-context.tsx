"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { getSession, setSession } from "@/lib/session"

interface PremiumContextType {
  isPremium: boolean
  user: any
  login: (user: any) => void
  logout: () => void
  checkPremiumStatus: () => void
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Initialize from session
  useEffect(() => {
    const sessionUser = getSession()
    if (sessionUser) {
      setUser(sessionUser)
      setIsPremium(sessionUser.isPremium || false)
    }
  }, [])

  const login = (userData: any) => {
    setUser(userData)
    setIsPremium(userData.isPremium || false)
    setSession(userData)
  }

  const logout = () => {
    setUser(null)
    setIsPremium(false)
    setSession(null)
  }

  const checkPremiumStatus = () => {
    // In a client-side context, we can only check the current session
    // For real-time premium status updates, we would need to call an API
    const sessionUser = getSession()
    if (sessionUser) {
      setUser(sessionUser)
      setIsPremium(sessionUser.isPremium || false)
    }
  }

  return (
    <PremiumContext.Provider value={{ isPremium, user, login, logout, checkPremiumStatus }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider")
  }
  return context
}