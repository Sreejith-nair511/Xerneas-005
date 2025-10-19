"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Volume2, Languages, Contrast, Eye, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Indian languages supported
const INDIAN_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "ur", name: "اردو (Urdu)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", name: "മലയാളം (Malayalam)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
  { code: "as", name: "অসমীয়া (Assamese)" },
]

export default function SettingsPage() {
  const [language, setLanguage] = useState("en")
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)
  const [textToSpeech, setTextToSpeech] = useState(false)
  const [simplifiedMode, setSimplifiedMode] = useState(false)
  const [voiceSpeed, setVoiceSpeed] = useState(1)
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("tadashiSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setLanguage(settings.language || "en")
      setFontSize(settings.fontSize || 16)
      setHighContrast(settings.highContrast || false)
      setTextToSpeech(settings.textToSpeech || false)
      setSimplifiedMode(settings.simplifiedMode || false)
      setVoiceSpeed(settings.voiceSpeed || 1)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      language,
      fontSize,
      highContrast,
      textToSpeech,
      simplifiedMode,
      voiceSpeed
    }
    localStorage.setItem("tadashiSettings", JSON.stringify(settings))
  }, [language, fontSize, highContrast, textToSpeech, simplifiedMode, voiceSpeed])

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully!",
    })
  }

  const handleResetSettings = () => {
    setLanguage("en")
    setFontSize(16)
    setHighContrast(false)
    setTextToSpeech(false)
    setSimplifiedMode(false)
    setVoiceSpeed(1)
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
    })
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Language & Accessibility Settings</h1>
          <p className="tadashi-tagline">
            Customize your experience for better accessibility and comfort
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Language Settings */}
          <Card className="tadashi-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Languages className="h-5 w-5 mr-2" />
                Language Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="language-select" className="text-lg font-medium mb-2 block">
                  Select Language
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Choose your preferred language for the application interface
                </p>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language-select" className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-2">Language Features</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Tadashi AI supports voice interaction in all Indian languages listed above
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Tip:</strong> Switch to your native language for a more comfortable experience. 
                    All health data and AI responses will be provided in your selected language.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${highContrast ? 'bg-black text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <h4 className="font-medium mb-2" style={{ fontSize: `${fontSize * 1.1}px` }}>
                  Health Tip of the Day
                </h4>
                <p style={{ fontSize: `${fontSize}px` }}>
                  Drink at least 8 glasses of water daily for optimal hydration. 
                  Add lemon for extra vitamin C and flavor.
                </p>
                <div className="mt-3 flex items-center text-sm">
                  <User className="h-4 w-4 mr-1" />
                  <span>Dr. Tadashi AI</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Contrast className="h-5 w-5 mr-2" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="font-size" className="text-lg font-medium">
                    Font Size
                  </Label>
                  <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {fontSize}px
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Adjust text size for better readability
                </p>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={([value]) => setFontSize(value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast" className="text-lg font-medium">
                    High Contrast Mode
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enhances visibility for visually impaired users
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="text-to-speech" className="text-lg font-medium">
                    Text-to-Speech
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable voice reading of content
                  </p>
                </div>
                <Switch
                  id="text-to-speech"
                  checked={textToSpeech}
                  onCheckedChange={setTextToSpeech}
                />
              </div>

              {textToSpeech && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="voice-speed" className="text-lg font-medium">
                      Voice Speed
                    </Label>
                    <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {voiceSpeed}x
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Adjust how fast the text is read aloud
                  </p>
                  <Slider
                    id="voice-speed"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[voiceSpeed]}
                    onValueChange={([value]) => setVoiceSpeed(value)}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Simplified Mode */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Simplified Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="simplified-mode" className="text-lg font-medium">
                    Simplified Interface
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Large icons and minimal text for low-literacy users
                  </p>
                </div>
                <Switch
                  id="simplified-mode"
                  checked={simplifiedMode}
                  onCheckedChange={setSimplifiedMode}
                />
              </div>

              {simplifiedMode && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Simplified Mode Active
                  </h4>
                  <p className="text-sm">
                    Interface optimized with larger buttons, icons, and reduced text. 
                    Perfect for users with limited reading skills.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-2">Accessibility Features</h3>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Voice commands in 13 Indian languages
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Large touch targets for easy interaction
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Visual icons for all major functions
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Audio feedback for all interactions
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="lg:col-span-3 flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Reset to Default
            </Button>
            <Button
              className="tadashi-button"
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}