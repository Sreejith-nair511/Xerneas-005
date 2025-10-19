"use client"

import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

const themes = [
  { id: "default", name: "Default", color: "bg-[hsl(199,98%,48%)]" },
  { id: "calm", name: "Calm", color: "bg-[hsl(180,70%,40%)]" },
  { id: "energetic", name: "Energetic", color: "bg-[hsl(20,90%,55%)]" },
  { id: "focus", name: "Focus", color: "bg-[hsl(260,70%,50%)]" },
  { id: "relax", name: "Relax", color: "bg-[hsl(10,70%,70%)]" },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (newTheme: string) => {
    console.log("Setting theme to:", newTheme)
    setTheme(newTheme as any)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <h3 className="text-sm font-medium mb-2">Select Mood Theme</h3>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                  theme === t.id ? "bg-tadashi-blue/20" : "hover:bg-tadashi-gray"
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${t.color}`} />
                <span>{t.name}</span>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}