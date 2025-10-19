"use client"

import { usePremium } from "@/contexts/premium-context"
import { Button } from "@/components/ui/button"

export default function PremiumTest() {
  const { isPremium, user, login, logout, checkPremiumStatus } = usePremium()

  const handleSetPremium = () => {
    if (user) {
      // In a real app, this would call an API to update the user's premium status
      // For now, we'll just simulate it
      const updatedUser = { ...user, isPremium: true }
      login(updatedUser)
    }
  }

  const handleSetBasic = () => {
    if (user) {
      // In a real app, this would call an API to update the user's premium status
      // For now, we'll just simulate it
      const updatedUser = { ...user, isPremium: false }
      login(updatedUser)
    }
  }

  return (
    <div className="p-4 bg-tadashi-lightBlue rounded-lg dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Premium Status Test</h3>
      <p className="mb-4">Current status: {user ? (isPremium ? "Premium" : "Basic") : "Not logged in"}</p>
      {user && (
        <div className="flex gap-2">
          <Button onClick={handleSetPremium} className="tadashi-button">
            Set Premium
          </Button>
          <Button onClick={handleSetBasic} variant="outline">
            Set Basic
          </Button>
        </div>
      )}
    </div>
  )
}