"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Moon, RefreshCw, TrendingUp, Clock, Zap, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Sleep data structure
interface SleepCycle {
  time: string
  stage: 'awake' | 'light' | 'deep' | 'rem'
}

interface SleepData {
  id: string
  date: string
  bedtime: string
  wakeup: string
  totalSleep: number // in hours
  deepSleep: number // in hours
  lightSleep: number // in hours
  remSleep: number // in hours
  awakeTime: number // in hours
  sleepQuality: number // 1-10 scale
  cycles: SleepCycle[]
}

export default function SleepAnalysisPage() {
  const [sleepData, setSleepData] = useState<SleepData[]>([
    {
      id: "1",
      date: "2023-05-01",
      bedtime: "22:30",
      wakeup: "06:30",
      totalSleep: 7.5,
      deepSleep: 1.8,
      lightSleep: 3.2,
      remSleep: 2.0,
      awakeTime: 0.5,
      sleepQuality: 8,
      cycles: generateMockSleepCycles()
    },
    {
      id: "2",
      date: "2023-05-02",
      bedtime: "23:15",
      wakeup: "07:00",
      totalSleep: 7.25,
      deepSleep: 1.5,
      lightSleep: 3.5,
      remSleep: 1.8,
      awakeTime: 0.45,
      sleepQuality: 7,
      cycles: generateMockSleepCycles()
    },
    {
      id: "3",
      date: "2023-05-03",
      bedtime: "21:45",
      wakeup: "05:45",
      totalSleep: 7.5,
      deepSleep: 2.0,
      lightSleep: 3.0,
      remSleep: 2.1,
      awakeTime: 0.4,
      sleepQuality: 9,
      cycles: generateMockSleepCycles()
    },
    {
      id: "4",
      date: "2023-05-04",
      bedtime: "23:30",
      wakeup: "06:00",
      totalSleep: 6.0,
      deepSleep: 1.2,
      lightSleep: 2.8,
      remSleep: 1.5,
      awakeTime: 0.5,
      sleepQuality: 6,
      cycles: generateMockSleepCycles()
    },
    {
      id: "5",
      date: "2023-05-05",
      bedtime: "22:00",
      wakeup: "06:30",
      totalSleep: 8.0,
      deepSleep: 2.2,
      lightSleep: 3.3,
      remSleep: 2.0,
      awakeTime: 0.5,
      sleepQuality: 9,
      cycles: generateMockSleepCycles()
    },
    {
      id: "6",
      date: "2023-05-06",
      bedtime: "22:45",
      wakeup: "07:15",
      totalSleep: 7.75,
      deepSleep: 1.9,
      lightSleep: 3.4,
      remSleep: 1.9,
      awakeTime: 0.55,
      sleepQuality: 8,
      cycles: generateMockSleepCycles()
    },
    {
      id: "7",
      date: "2023-05-07",
      bedtime: "21:30",
      wakeup: "06:00",
      totalSleep: 8.0,
      deepSleep: 2.3,
      lightSleep: 3.2,
      remSleep: 2.0,
      awakeTime: 0.5,
      sleepQuality: 9,
      cycles: generateMockSleepCycles()
    }
  ])
  
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Initialize with current time
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString())
  }, [])

  // Generate mock sleep cycles for visualization
  function generateMockSleepCycles(): SleepCycle[] {
    const cycles: SleepCycle[] = []
    const stages: ('awake' | 'light' | 'deep' | 'rem')[] = ['awake', 'light', 'deep', 'rem']
    
    for (let i = 0; i < 24; i++) {
      const stage = stages[Math.floor(Math.random() * stages.length)]
      cycles.push({
        time: `${Math.floor(i/2)}:${(i%2)*30}`.padStart(2, '0') + ":00",
        stage
      })
    }
    
    return cycles
  }

  const refreshData = () => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      // Generate new mock data for today
      const today = new Date()
      const newSleepEntry: SleepData = {
        id: Date.now().toString(),
        date: today.toISOString().split('T')[0],
        bedtime: `${Math.floor(Math.random() * 3) + 21}:${Math.random() > 0.5 ? '30' : '00'}`,
        wakeup: `${Math.floor(Math.random() * 4) + 6}:${Math.random() > 0.5 ? '30' : '00'}`,
        totalSleep: parseFloat((Math.random() * 3 + 5).toFixed(1)),
        deepSleep: parseFloat((Math.random() * 1.5 + 1).toFixed(1)),
        lightSleep: parseFloat((Math.random() * 2 + 2).toFixed(1)),
        remSleep: parseFloat((Math.random() * 1.5 + 1.5).toFixed(1)),
        awakeTime: parseFloat((Math.random() * 0.5 + 0.3).toFixed(1)),
        sleepQuality: Math.floor(Math.random() * 4 + 6),
        cycles: generateMockSleepCycles()
      }
      
      setSleepData([newSleepEntry, ...sleepData.slice(0, 6)])
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
      
      toast({
        title: "Sleep Data Updated",
        description: "New sleep analysis generated successfully",
      })
    }, 1500)
  }

  // Get the most recent sleep data
  const latestSleep = sleepData[0]

  // Prepare data for charts
  const weeklySleepData = sleepData.map(entry => ({
    date: entry.date,
    total: entry.totalSleep,
    deep: entry.deepSleep,
    quality: entry.sleepQuality
  })).reverse()

  // Generate AI advice based on sleep patterns
  const generateAIAdvice = () => {
    if (!latestSleep) return []
    
    const advice = []
    
    if (latestSleep.totalSleep < 7) {
      advice.push("🌙 Your sleep duration is below the recommended 7-9 hours. Try going to bed 30 minutes earlier tonight.")
    } else if (latestSleep.totalSleep > 9) {
      advice.push("🌙 You're getting plenty of sleep! Just make sure it's not affecting your morning alertness.")
    } else {
      advice.push("🌙 Your sleep duration is in the healthy range. Keep up the good work!")
    }
    
    if (latestSleep.deepSleep < 1.5) {
      advice.push("💤 Your deep sleep could be improved. Consider reducing caffeine after 2 PM and creating a cooler sleep environment.")
    } else {
      advice.push("💤 Your deep sleep levels look good. This is important for physical recovery!")
    }
    
    if (latestSleep.sleepQuality < 7) {
      advice.push("⭐ Your sleep quality score could be better. Try maintaining a consistent bedtime routine.")
    } else {
      advice.push("⭐ Great sleep quality! Consistency is key to maintaining this.")
    }
    
    // Compare with previous night
    if (sleepData.length > 1) {
      const previousSleep = sleepData[1]
      if (latestSleep.deepSleep > previousSleep.deepSleep * 1.1) {
        advice.push("📈 You're improving! Your deep sleep is up by " + 
          Math.round(((latestSleep.deepSleep / previousSleep.deepSleep) - 1) * 100) + 
          "% this week. Keep it up!")
      }
    }
    
    return advice
  }

  // Get color for sleep stage
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'awake': return '#FF6B6B'
      case 'light': return '#4ECDC4'
      case 'deep': return '#45B7D1'
      case 'rem': return '#96CEB4'
      default: return '#999'
    }
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Sleep Analysis</h1>
          <p className="tadashi-tagline">
            Understand your sleep patterns and improve your rest quality
          </p>
          <div className="mt-4 flex justify-center">
            <Button 
              className="tadashi-button"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzing...' : 'Generate New Sleep Report'}
            </Button>
          </div>
          {lastUpdated && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tadashi-blue"></div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sleep Summary */}
            <Card className="tadashi-card lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Moon className="h-5 w-5 mr-2" />
                  Last Night's Sleep Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestSleep ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                      <Clock className="h-8 w-8 text-tadashi-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">{latestSleep.totalSleep}h</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Sleep</div>
                    </div>
                    <div className="text-center p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                      <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{latestSleep.deepSleep}h</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Deep Sleep</div>
                    </div>
                    <div className="text-center p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{latestSleep.sleepQuality}/10</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Quality</div>
                    </div>
                    <div className="text-center p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                      <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-lg font-bold">{latestSleep.bedtime}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bedtime</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Moon className="h-12 w-12 mx-auto mb-4" />
                    <p>No sleep data available. Wear a sleep tracker to analyze your patterns.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Sleep Trend */}
            <Card className="tadashi-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Sleep Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklySleepData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#4A90E2" 
                        strokeWidth={2}
                        name="Total Sleep (hours)"
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="deep" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Deep Sleep (hours)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Quality */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle>Sleep Quality Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklySleepData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="quality" fill="#FFBB28" name="Quality (1-10)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Stages Visualization */}
            <Card className="tadashi-card lg:col-span-3">
              <CardHeader>
                <CardTitle>Sleep Cycle Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={latestSleep?.cycles || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis 
                        domain={[0, 3]} 
                        tickFormatter={(value) => {
                          const stages = ['Awake', 'Light', 'Deep', 'REM']
                          return stages[value] || ''
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => {
                          const stages = ['Awake', 'Light', 'Deep', 'REM']
                          return [stages[Number(value)], 'Stage']
                        }}
                      />
                      <Area 
                        type="step" 
                        dataKey="stage" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
                    <span className="text-sm">Awake</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-teal-400 rounded mr-2"></div>
                    <span className="text-sm">Light Sleep</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
                    <span className="text-sm">Deep Sleep</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                    <span className="text-sm">REM Sleep</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Advice */}
            <Card className="tadashi-card lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  AI Sleep Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generateAIAdvice().map((advice, index) => (
                    <div key={index} className="p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-800 dark:text-gray-200">{advice}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Tip from Tadashi:</strong> Consistency is key! Try to go to bed and wake up at the same time every day, even on weekends.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}