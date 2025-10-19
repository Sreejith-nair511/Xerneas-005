"use client"

import type { ReactNode } from "react"
import { PremiumProvider } from "@/contexts/premium-context"
import { ThemeProvider } from "@/contexts/theme-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PremiumProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </PremiumProvider>
  )
}