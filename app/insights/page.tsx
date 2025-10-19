"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { Download, RefreshCw, Brain, Heart, Droplets, Moon, Coffee, Apple, Zap, Activity } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Mock data generators for different health metrics
const generateHealthScores = () => {
  return [
    { name: 'Sleep Efficiency', value: Math.floor(Math.random() * 30) + 70 },
    { name: 'Activity Level', value: Math.floor(Math.random() * 30) + 70 },
    { name: 'Mental Balance', value: Math.floor(Math.random() * 30) + 70 },
    { name: 'Nutrition', value: Math.floor(Math.random() * 30) + 70 },
  ]
}

const generateSleepEfficiency = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    day,
    efficiency: Math.floor(Math.random() * 40) + 60, // 60-100%
    deepSleep: Math.floor(Math.random() * 30) + 20, // 20-50%
    remSleep: Math.floor(Math.random() * 20) + 15, // 15-35%
  }))
}

const generateActivityLevel = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    day,
    steps: Math.floor(Math.random() * 8000) + 2000, // 2000-10000 steps
    calories: Math.floor(Math.random() * 800) + 200, // 200-1000 calories
    activeMinutes: Math.floor(Math.random() * 90) + 30, // 30-120 minutes
  }))
}

const generateMentalBalance = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    day,
    mood: Math.floor(Math.random() * 4) + 1, // 1-5 scale
    stress: Math.floor(Math.random() * 70) + 30, // 30-100%
    mindfulness: Math.floor(Math.random() * 60) + 40, // 40-100%
  }))
}

const generateComprehensiveReport = () => {
  return {
    healthScores: generateHealthScores(),
    sleepEfficiency: generateSleepEfficiency(),
    activityLevel: generateActivityLevel(),
    mentalBalance: generateMentalBalance(),
    overallScore: Math.floor(Math.random() * 20) + 80, // 80-100
    generatedAt: new Date().toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function InsightsReportsPage() {
  const [report, setReport] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [lastGenerated, setLastGenerated] = useState<string>('')

  // Initialize with mock data
  useEffect(() => {
    generateReport()
  }, [])

  const generateReport = () => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const newReport = generateComprehensiveReport()
      setReport(newReport)
      setLastGenerated(newReport.generatedAt)
      setLoading(false)
      
      toast({
        title: "Report Generated",
        description: "Your AI health insights report is ready!",
      })
    }, 1500)
  }

  const downloadPDF = () => {
    toast({
      title: "Downloading PDF",
      description: "Simulated PDF generated and download started ✅",
    })
  }

  // Generate AI insights based on the report data
  const generateAIInsights = () => {
    const insights = []
    
    // Overall health insight
    if (report.overallScore >= 90) {
      insights.push("🌟 Excellent overall health! You're maintaining a balanced lifestyle. Keep up the great work!")
    } else if (report.overallScore >= 80) {
      insights.push("👍 Good health status! You're doing well, but there's room for improvement in some areas.")
    } else {
      insights.push("💪 Your health is on the right track! Focus on consistent habits to see improvements.")
    }
    
    // Sleep insights
    const avgSleepEfficiency = report.sleepEfficiency?.reduce((sum: number, day: any) => sum + day.efficiency, 0) / 7 || 0
    if (avgSleepEfficiency < 75) {
      insights.push("😴 Your sleep efficiency could be improved. Try maintaining consistent bedtimes and reducing screen time before bed.")
    } else {
      insights.push("😴 Your sleep patterns are healthy! Consistent sleep schedules contribute to better overall wellness.")
    }
    
    // Activity insights
    const avgSteps = report.activityLevel?.reduce((sum: number, day: any) => sum + day.steps, 0) / 7 || 0
    if (avgSteps < 5000) {
      insights.push("🚶‍♂️ Increase your daily activity. Even a 20-minute walk can boost your energy and mood.")
    } else {
      insights.push("🚶‍♂️ Great job staying active! Regular movement is essential for physical and mental health.")
    }
    
    // Mental balance insights
    const avgMood = report.mentalBalance?.reduce((sum: number, day: any) => sum + day.mood, 0) / 7 || 0
    if (avgMood < 3) {
      insights.push("🧘 Your mood scores suggest focusing on stress management. Try mindfulness exercises or talking to someone you trust.")
    } else {
      insights.push("🧘 Your mental wellness looks positive! Continue practicing activities that bring you joy and relaxation.")
    }
    
    return insights
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">AI Insights & Reports</h1>
          <p className="tadashi-tagline">
            Comprehensive health analysis powered by artificial intelligence
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="tadashi-button"
              onClick={generateReport}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generating Report...' : 'Generate New Report'}
            </Button>
            <Button 
              variant="outline" 
              onClick={downloadPDF}
              disabled={loading}
              className="border-tadashi-blue text-tadashi-blue hover:bg-tadashi-blue/10 dark:border-tadashi-blue dark:text-tadashi-blue dark:hover:bg-tadashi-blue/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
          {lastGenerated && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Last generated: {lastGenerated}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-tadashi-blue mx-auto mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300">Analyzing your health data...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Overall Health Score */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-2xl">
                  <Brain className="h-6 w-6 mr-2 text-purple-500" />
                  Overall Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative">
                    <div className="text-8xl font-bold text-tadashi-blue">{report.overallScore}</div>
                    <div className="absolute -bottom-2 right-0 text-xl text-gray-500">/100</div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-md text-center">
                    Based on your sleep patterns, activity levels, nutrition habits, and mental wellness
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Health Scores Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="tadashi-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Health Dimensions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={report.healthScores}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Health Score"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Sleep Efficiency */}
              <Card className="tadashi-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                    Sleep Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.sleepEfficiency}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency" />
                        <Bar dataKey="deepSleep" fill="#82ca9d" name="Deep Sleep" />
                        <Bar dataKey="remSleep" fill="#ffc658" name="REM Sleep" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Level */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coffee className="h-5 w-5 mr-2 text-green-500" />
                  Activity Level Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={report.activityLevel}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="steps" 
                        stroke="#0088FE" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                        name="Steps"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="calories" 
                        stroke="#00C49F" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                        name="Calories Burned"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Mental Balance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="tadashi-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Mental Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={report.mentalBalance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 5]} label={{ value: 'Mood Score', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="mood" 
                          stroke="#ff6b6b" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                          name="Mood"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="stress" 
                          stroke="#4ecdc4" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                          name="Stress Level"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="tadashi-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generateAIInsights().map((insight, index) => (
                      <div key={index} className="p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg border-l-4 border-tadashi-blue">
                        <p className="text-gray-800 dark:text-gray-200">{insight}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-tadashi-blue to-tadashi-darkBlue rounded-lg text-white">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      Pro Tip
                    </h3>
                    <p>
                      Consistency is key to health improvements. Small daily changes compound over time for significant results.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}