"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Zap, Target, Award, Calendar, TrendingUp, Play, Pause } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Activity data structure
interface ActivityEntry {
  id: string
  date: string
  steps: number
  calories: number
  distance: number // in km
  activeMinutes: number
  workoutType?: string
  duration?: number // in minutes
}

// Daily goals
const DAILY_GOALS = {
  steps: 10000,
  calories: 2500,
  distance: 8, // km
  activeMinutes: 30
}

export default function FitnessPage() {
  const [activityData, setActivityData] = useState<ActivityEntry[]>([
    {
      id: "1",
      date: "2023-05-01",
      steps: 8500,
      calories: 2100,
      distance: 6.2,
      activeMinutes: 25,
      workoutType: "Walking",
      duration: 45
    },
    {
      id: "2",
      date: "2023-05-02",
      steps: 12000,
      calories: 2800,
      distance: 8.5,
      activeMinutes: 40,
      workoutType: "Running",
      duration: 60
    },
    {
      id: "3",
      date: "2023-05-03",
      steps: 9500,
      calories: 2300,
      distance: 7.0,
      activeMinutes: 35,
      workoutType: "Cycling",
      duration: 50
    },
    {
      id: "4",
      date: "2023-05-04",
      steps: 7800,
      calories: 1900,
      distance: 5.8,
      activeMinutes: 20,
      workoutType: "Yoga",
      duration: 30
    },
    {
      id: "5",
      date: "2023-05-05",
      steps: 11000,
      calories: 2600,
      distance: 7.8,
      activeMinutes: 45,
      workoutType: "Gym",
      duration: 75
    },
    {
      id: "6",
      date: "2023-05-06",
      steps: 13500,
      calories: 3100,
      distance: 9.5,
      activeMinutes: 50,
      workoutType: "Hiking",
      duration: 90
    },
    {
      id: "7",
      date: "2023-05-07",
      steps: 9200,
      calories: 2200,
      distance: 6.7,
      activeMinutes: 30,
      workoutType: "Swimming",
      duration: 45
    }
  ])
  
  const [todayActivity, setTodayActivity] = useState<ActivityEntry>({
    id: "today",
    date: new Date().toISOString().split('T')[0],
    steps: 7200,
    calories: 1800,
    distance: 5.2,
    activeMinutes: 22,
    workoutType: "Walking",
    duration: 35
  })
  
  const [workoutInProgress, setWorkoutInProgress] = useState(false)
  const [workoutTime, setWorkoutTime] = useState(0)
  const [badges, setBadges] = useState([
    { id: "1", name: "5K Steps Champion", earned: true, icon: "🏅" },
    { id: "2", name: "Week Warrior", earned: true, icon: "🏆" },
    { id: "3", name: "Calorie Crusher", earned: false, icon: "🔥" },
    { id: "4", name: "Distance Driver", earned: false, icon: "🏃" },
    { id: "5", name: "Active Minutes Master", earned: true, icon: "⏰" },
  ])

  // Timer for workout
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (workoutInProgress) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [workoutInProgress])

  const toggleWorkout = () => {
    if (workoutInProgress) {
      // End workout
      setWorkoutInProgress(false)
      setTodayActivity(prev => ({
        ...prev,
        activeMinutes: prev.activeMinutes + Math.floor(workoutTime / 60),
        duration: (prev.duration || 0) + Math.floor(workoutTime / 60)
      }))
      setWorkoutTime(0)
      
      toast({
        title: "Workout Completed",
        description: `Great job! You exercised for ${Math.floor(workoutTime / 60)} minutes.`,
      })
    } else {
      // Start workout
      setWorkoutInProgress(true)
      
      toast({
        title: "Workout Started",
        description: "Keep going! Your activity is being tracked.",
      })
    }
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Prepare data for charts
  const weeklyActivityData = [...activityData, todayActivity].map(entry => ({
    date: entry.date,
    steps: entry.steps,
    calories: entry.calories,
    distance: entry.distance
  })).reverse()

  // Calculate progress percentages
  const stepsProgress = Math.min(100, (todayActivity.steps / DAILY_GOALS.steps) * 100)
  const caloriesProgress = Math.min(100, (todayActivity.calories / DAILY_GOALS.calories) * 100)
  const distanceProgress = Math.min(100, (todayActivity.distance / DAILY_GOALS.distance) * 100)
  const activeMinutesProgress = Math.min(100, (todayActivity.activeMinutes / DAILY_GOALS.activeMinutes) * 100)

  // Generate AI advice based on activity levels
  const generateAIAdvice = () => {
    const advice = []
    
    if (todayActivity.steps < DAILY_GOALS.steps * 0.7) {
      advice.push("🚶‍♂️ You're below your step goal today. Try taking a 10-minute walk after meals.")
    } else if (todayActivity.steps > DAILY_GOALS.steps * 1.2) {
      advice.push("🏃‍♂️ Excellent step count! You're exceeding your daily goal.")
    } else {
      advice.push("👍 Good job on your steps today! Keep maintaining this level of activity.")
    }
    
    if (todayActivity.activeMinutes < DAILY_GOALS.activeMinutes) {
      advice.push("⚡ Try to get in a few more active minutes. Even 10 minutes of exercise can boost your energy.")
    }
    
    if (todayActivity.calories < DAILY_GOALS.calories * 0.8) {
      advice.push("🍽️ Your calorie burn is lower than usual. Consider adding some physical activity to your day.")
    }
    
    return advice
  }

  // Get earned badges count
  const earnedBadgesCount = badges.filter(badge => badge.earned).length

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Fitness & Activity Tracker</h1>
          <p className="tadashi-tagline">
            Monitor your movement, track workouts, and achieve your fitness goals
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Activity Summary */}
          <Card className="tadashi-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Today's Activity Summary
                </div>
                <Button 
                  className={`flex items-center ${workoutInProgress ? "bg-red-500 hover:bg-red-600" : "tadashi-button"}`}
                  onClick={toggleWorkout}
                >
                  {workoutInProgress ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      End Workout ({formatTime(workoutTime)})
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold">{todayActivity.steps.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Steps</div>
                  <Progress value={stepsProgress} className="mt-2" />
                  <div className="text-xs text-gray-500 mt-1">{DAILY_GOALS.steps.toLocaleString()} goal</div>
                </div>
                <div className="text-center p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold">{todayActivity.calories.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
                  <Progress value={caloriesProgress} className="mt-2" />
                  <div className="text-xs text-gray-500 mt-1">{DAILY_GOALS.calories.toLocaleString()} goal</div>
                </div>
                <div className="text-center p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold">{todayActivity.distance.toFixed(1)} km</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
                  <Progress value={distanceProgress} className="mt-2" />
                  <div className="text-xs text-gray-500 mt-1">{DAILY_GOALS.distance} km goal</div>
                </div>
                <div className="text-center p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold">{todayActivity.activeMinutes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Min</div>
                  <Progress value={activeMinutesProgress} className="mt-2" />
                  <div className="text-xs text-gray-500 mt-1">{DAILY_GOALS.activeMinutes} min goal</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Steps Trend */}
          <Card className="tadashi-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Weekly Steps Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="steps" 
                      stroke="#4A90E2" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                      name="Steps"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Intensity */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Activity Intensity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#8884d8" name="Calories Burned" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Workout Summary */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Recent Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[todayActivity, ...activityData.slice(0, 2)].map((activity, index) => (
                  <div key={index} className="p-3 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {activity.workoutType || "General Activity"}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.duration ? `${activity.duration} min` : "N/A"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.date} • {activity.calories} cal burned
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Fitness Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-tadashi-blue">{earnedBadgesCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`p-3 rounded-lg text-center ${badge.earned ? "bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300" : "bg-gray-100 dark:bg-gray-700 opacity-50"}`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-medium">{badge.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Advice */}
          <Card className="tadashi-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                AI Fitness Insights
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
                  <strong>AI Tip:</strong> Try to take 10,000 steps daily. A 30-minute brisk walk can get you close to that goal!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}