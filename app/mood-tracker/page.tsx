"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Smile, Frown, Meh, Heart, Play, Pause, Volume2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Mood data structure
interface MoodEntry {
  id: string
  date: string
  mood: number // 1-5 scale
  note?: string
}

// Ambient sounds
const ambientSounds = [
  { id: "calm", name: "Calm", icon: "🌿" },
  { id: "focus", name: "Focus", icon: "🎯" },
  { id: "sleep", name: "Sleep", icon: "🌙" },
  { id: "energy", name: "Energy", icon: "⚡" },
]

export default function MoodTrackerPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: "1", date: "2023-05-01", mood: 4, note: "Feeling good today" },
    { id: "2", date: "2023-05-02", mood: 3, note: "A bit tired" },
    { id: "3", date: "2023-05-03", mood: 5, note: "Great day!" },
    { id: "4", date: "2023-05-04", mood: 2, note: "Stressful day at work" },
    { id: "5", date: "2023-05-05", mood: 4, note: "Relaxed evening" },
    { id: "6", date: "2023-05-06", mood: 3, note: "Normal day" },
    { id: "7", date: "2023-05-07", mood: 4, note: "Enjoyed the weekend" },
  ])
  
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodNote, setMoodNote] = useState("")
  const [playingSound, setPlayingSound] = useState<string | null>(null)
  const [wellnessScore, setWellnessScore] = useState(0)

  // Load mood entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('tadashi-mood-entries')
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save mood entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tadashi-mood-entries', JSON.stringify(moodEntries))
    
    // Calculate wellness score
    if (moodEntries.length > 0) {
      const avgMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length
      setWellnessScore(Math.round((avgMood / 5) * 100))
    }
  }, [moodEntries])

  const handleMoodSubmit = () => {
    if (selectedMood === null) {
      toast({
        title: "Select Mood",
        description: "Please select your current mood",
        variant: "destructive",
      })
      return
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      note: moodNote,
    }

    setMoodEntries([...moodEntries, newEntry])
    setSelectedMood(null)
    setMoodNote("")
    
    toast({
      title: "Mood Recorded",
      description: "Your mood has been saved successfully",
    })
  }

  const getMoodIcon = (mood: number) => {
    switch (mood) {
      case 1: return <Frown className="h-8 w-8 text-red-500" />
      case 2: return <Frown className="h-8 w-8 text-orange-500" />
      case 3: return <Meh className="h-8 w-8 text-yellow-500" />
      case 4: return <Smile className="h-8 w-8 text-green-500" />
      case 5: return <Smile className="h-8 w-8 text-green-600" />
      default: return <Meh className="h-8 w-8 text-gray-500" />
    }
  }

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 1: return "Very Sad"
      case 2: return "Sad"
      case 3: return "Neutral"
      case 4: return "Happy"
      case 5: return "Very Happy"
      default: return "Unknown"
    }
  }

  const toggleSound = (soundId: string) => {
    if (playingSound === soundId) {
      setPlayingSound(null)
    } else {
      setPlayingSound(soundId)
    }
  }

  // Prepare data for chart
  const chartData = moodEntries.map(entry => ({
    date: entry.date,
    mood: entry.mood,
  }))

  // Generate AI advice based on mood patterns
  const generateAIAdvice = () => {
    if (moodEntries.length < 3) {
      return "Keep tracking your mood to help Tadashi AI provide personalized insights."
    }

    const recentMoods = moodEntries.slice(-7).map(e => e.mood)
    const avgRecentMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length
    
    if (avgRecentMood < 2.5) {
      return "You've been feeling down recently. Consider talking to a friend, getting some sunlight, or trying relaxation techniques. If these feelings persist, consider speaking with a mental health professional."
    } else if (avgRecentMood < 3.5) {
      return "Your mood seems neutral lately. Try engaging in activities you enjoy and maintaining social connections to boost your well-being."
    } else {
      return "You've been in good spirits recently! Keep up the positive habits that contribute to your mental wellness."
    }
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Mood & Mental Health Tracker</h1>
          <p className="tadashi-tagline">
            Monitor your emotional well-being and discover patterns with AI insights
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Entry Card */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? "default" : "outline"}
                    className={`h-16 flex flex-col ${selectedMood === mood ? "bg-tadashi-blue hover:bg-tadashi-darkBlue" : ""}`}
                    onClick={() => setSelectedMood(mood)}
                  >
                    {getMoodIcon(mood)}
                    <span className="text-xs mt-1">{getMoodLabel(mood)}</span>
                  </Button>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="What's contributing to your mood today?"
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button
                className="tadashi-button w-full"
                onClick={handleMoodSubmit}
              >
                Save Mood Entry
              </Button>
            </CardContent>
          </Card>

          {/* Wellness Score */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Mental Wellness Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4A90E2"
                    strokeWidth="3"
                    strokeDasharray={`${wellnessScore}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fill="#4A90E2" fontSize="8" fontWeight="bold">
                    {wellnessScore}%
                  </text>
                </svg>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Based on your mood entries
              </p>
            </CardContent>
          </Card>

          {/* Ambient Sounds */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle>Ambient Sounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ambientSounds.map((sound) => (
                  <div key={sound.id} className="flex items-center justify-between p-3 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{sound.icon}</span>
                      <span>{sound.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSound(sound.id)}
                    >
                      {playingSound === sound.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Note:</strong> This is a simulation. In a full implementation, these would play actual ambient sounds.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mood Trend Chart */}
          <Card className="tadashi-card lg:col-span-3">
            <CardHeader>
              <CardTitle>Weekly Mood Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {moodEntries.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis 
                        domain={[0, 5]} 
                        ticks={[0, 1, 2, 3, 4, 5]}
                        tickFormatter={(value) => getMoodLabel(value).charAt(0)}
                      />
                      <Tooltip 
                        formatter={(value) => [getMoodLabel(Number(value)), "Mood"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#4A90E2" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <p>No mood data yet. Start tracking your mood to see trends.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Advice */}
          <Card className="tadashi-card lg:col-span-3">
            <CardHeader>
              <CardTitle>AI Mental Health Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200">{generateAIAdvice()}</p>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Disclaimer:</strong> This AI advice is for informational purposes only and is not a substitute for professional mental health care. 
                  If you're experiencing persistent sadness, anxiety, or other concerning emotions, please reach out to a mental health professional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}