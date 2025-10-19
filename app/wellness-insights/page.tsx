"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { RefreshCw, Droplets, Moon, Coffee, Heart } from "lucide-react"
import ParticleBackground from "@/components/particle-background"
import ToolNavigationGuide from "@/components/tool-navigation-guide"

// Mock data for charts
const generateMockData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Hydration data
  const hydrationData = days.map(day => ({
    day,
    water: Math.floor(Math.random() * 8) + 2, // 2-10 glasses
  }))
  
  // Sleep data
  const sleepData = days.map(day => ({
    day,
    hours: parseFloat((Math.random() * 4 + 4).toFixed(1)), // 4-8 hours
  }))
  
  // Activity data
  const activityData = days.map(day => ({
    day,
    steps: Math.floor(Math.random() * 8000) + 2000, // 2000-10000 steps
  }))
  
  // Wellness scores
  const wellnessScores = [
    { name: 'Hydration', value: Math.floor(Math.random() * 30) + 70 },
    { name: 'Sleep', value: Math.floor(Math.random() * 30) + 70 },
    { name: 'Activity', value: Math.floor(Math.random() * 30) + 70 },
    { name: 'Nutrition', value: Math.floor(Math.random() * 30) + 70 },
  ]
  
  return { hydrationData, sleepData, activityData, wellnessScores }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function WellnessInsightsPage() {
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Initialize with mock data
  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const newData = generateMockData()
      setData(newData)
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    }, 1000)
  }

  // Generate AI advice based on mock data
  const generateAIAdvice = () => {
    const avgHydration = data.hydrationData?.reduce((sum: number, item: any) => sum + item.water, 0) / 7 || 0
    const avgSleep = data.sleepData?.reduce((sum: number, item: any) => sum + item.hours, 0) / 7 || 0
    const avgSteps = data.activityData?.reduce((sum: number, item: any) => sum + item.steps, 0) / 7 || 0
    
    const advice = []
    
    if (avgHydration < 6) {
      advice.push("💧 Your hydration levels are below optimal. Try to drink at least 8 glasses of water daily.")
    } else {
      advice.push("💧 Great job staying hydrated! Keep maintaining your water intake.")
    }
    
    if (avgSleep < 7) {
      advice.push("😴 Your sleep duration could be improved. Aim for 7-9 hours of quality sleep each night.")
    } else {
      advice.push("😴 Your sleep patterns look healthy. Keep up the good work!")
    }
    
    if (avgSteps < 5000) {
      advice.push("🚶‍♂️ Try to increase your daily activity. A 30-minute walk can boost your energy levels.")
    } else {
      advice.push("🚶‍♂️ Your activity levels are impressive! Regular movement contributes to overall wellness.")
    }
    
    return advice
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">AI Wellness Insights</h1>
          <p className="tadashi-tagline">
            Personalized health analytics powered by artificial intelligence
          </p>
          <div className="mt-4 flex justify-center">
            <Button 
              className="tadashi-button"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzing...' : 'Generate New Report'}
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
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hydration Chart */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                  Hydration Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.hydrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis label={{ value: 'Glasses', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="water" 
                        stroke="#0088FE" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Chart */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                  Sleep Consistency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.sleepData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coffee className="h-5 w-5 mr-2 text-green-500" />
                  Daily Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis label={{ value: 'Steps', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="steps" 
                        stroke="#00C49F" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Score */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Wellness Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex flex-col items-center justify-center">
                  <div className="w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.wellnessScores}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.wellnessScores?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Advice */}
            <Card className="tadashi-card lg:col-span-2">
              <CardHeader>
                <CardTitle>AI-Powered Health Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generateAIAdvice().map((advice, index) => (
                    <div key={index} className="p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-800 dark:text-gray-200">{advice}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <ToolNavigationGuide />
    </div>
  )
}