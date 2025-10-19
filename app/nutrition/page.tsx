"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Plus, Utensils, Apple, Calendar, TrendingUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Meal data structure
interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

// Daily nutrition goals
const NUTRITION_GOALS = {
  calories: 2000,
  protein: 50,
  carbs: 300,
  fat: 70,
}

export default function NutritionPage() {
  const [meals, setMeals] = useState<Meal[]>([
    { id: "1", name: "Oatmeal with fruits", calories: 350, protein: 12, carbs: 60, fat: 8, time: "08:00", type: "breakfast" },
    { id: "2", name: "Salad with grilled chicken", calories: 420, protein: 35, carbs: 20, fat: 22, time: "13:00", type: "lunch" },
    { id: "3", name: "Dal and rice", calories: 480, protein: 18, carbs: 75, fat: 12, time: "19:00", type: "dinner" },
  ])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    time: "08:00",
    type: "breakfast" as 'breakfast' | 'lunch' | 'dinner' | 'snack',
  })

  // Load meals from localStorage on mount
  useEffect(() => {
    const savedMeals = localStorage.getItem('tadashi-meals')
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals))
    }
  }, [])

  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tadashi-meals', JSON.stringify(meals))
  }, [meals])

  const handleAddMeal = () => {
    if (!newMeal.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive",
      })
      return
    }

    const meal: Meal = {
      id: Date.now().toString(),
      ...newMeal,
    }

    setMeals([...meals, meal])
    setNewMeal({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      time: "08:00",
      type: "breakfast",
    })
    setIsDialogOpen(false)
    
    toast({
      title: "Meal Added",
      description: `${meal.name} has been added to your log`,
    })
  }

  const handleDeleteMeal = (id: string) => {
    const meal = meals.find(m => m.id === id)
    if (meal) {
      setMeals(meals.filter(m => m.id !== id))
      toast({
        title: "Meal Removed",
        description: `${meal.name} has been removed from your log`,
      })
    }
  }

  // Calculate daily totals
  const dailyTotals = meals.reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    protein: totals.protein + meal.protein,
    carbs: totals.carbs + meal.carbs,
    fat: totals.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  // Prepare data for charts
  const mealTypeData = [
    { name: 'Breakfast', value: meals.filter(m => m.type === 'breakfast').length },
    { name: 'Lunch', value: meals.filter(m => m.type === 'lunch').length },
    { name: 'Dinner', value: meals.filter(m => m.type === 'dinner').length },
    { name: 'Snacks', value: meals.filter(m => m.type === 'snack').length },
  ]

  const nutritionData = [
    { name: 'Calories', actual: dailyTotals.calories, goal: NUTRITION_GOALS.calories },
    { name: 'Protein (g)', actual: dailyTotals.protein, goal: NUTRITION_GOALS.protein },
    { name: 'Carbs (g)', actual: dailyTotals.carbs, goal: NUTRITION_GOALS.carbs },
    { name: 'Fat (g)', actual: dailyTotals.fat, goal: NUTRITION_GOALS.fat },
  ]

  // Generate AI advice based on nutrition data
  const generateAIAdvice = () => {
    const advice = []
    
    if (dailyTotals.calories < NUTRITION_GOALS.calories * 0.8) {
      advice.push("⚡ Your calorie intake is low. Consider adding nutrient-dense foods like nuts, avocados, or whole grains.")
    } else if (dailyTotals.calories > NUTRITION_GOALS.calories * 1.2) {
      advice.push("⚡ Your calorie intake is high. Focus on portion control and include more vegetables and lean proteins.")
    } else {
      advice.push("⚡ Your calorie intake is within a healthy range. Keep maintaining this balance!")
    }
    
    if (dailyTotals.protein < NUTRITION_GOALS.protein * 0.8) {
      advice.push("🍗 Try to increase your protein intake. Include eggs, lentils, or Greek yogurt in your meals.")
    }
    
    if (dailyTotals.carbs < NUTRITION_GOALS.carbs * 0.8) {
      advice.push("🌾 Your carbohydrate intake could be higher. Add whole grains, fruits, or starchy vegetables.")
    }
    
    if (dailyTotals.fat < NUTRITION_GOALS.fat * 0.8) {
      advice.push("🥑 Include healthy fats in your diet like olive oil, nuts, or fatty fish.")
    }
    
    return advice
  }

  // Get meal type icon
  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🍳'
      case 'lunch': return '🍲'
      case 'dinner': return '🍛'
      case 'snack': return '🍪'
      default: return '🍽️'
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Nutrition & Diet Assistant</h1>
          <p className="tadashi-tagline">
            Track your meals, analyze your nutrition, and get personalized dietary advice
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Meal Button */}
          <Card className="tadashi-card lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Today's Meal Log</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {meals.length} meals logged today
                  </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="tadashi-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Meal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                    <DialogHeader>
                      <DialogTitle>Add New Meal</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Meal Name
                        </Label>
                        <Input
                          id="name"
                          value={newMeal.name}
                          onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                          className="col-span-3"
                          placeholder="e.g., Oatmeal with fruits"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select
                          value={newMeal.type}
                          onValueChange={(value) => setNewMeal({...newMeal, type: value as any})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Time
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={newMeal.time}
                          onChange={(e) => setNewMeal({...newMeal, time: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="calories" className="text-right">
                          Calories
                        </Label>
                        <Input
                          id="calories"
                          type="number"
                          value={newMeal.calories}
                          onChange={(e) => setNewMeal({...newMeal, calories: parseInt(e.target.value) || 0})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="protein" className="text-right">
                          Protein (g)
                        </Label>
                        <Input
                          id="protein"
                          type="number"
                          value={newMeal.protein}
                          onChange={(e) => setNewMeal({...newMeal, protein: parseInt(e.target.value) || 0})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="carbs" className="text-right">
                          Carbs (g)
                        </Label>
                        <Input
                          id="carbs"
                          type="number"
                          value={newMeal.carbs}
                          onChange={(e) => setNewMeal({...newMeal, carbs: parseInt(e.target.value) || 0})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fat" className="text-right">
                          Fat (g)
                        </Label>
                        <Input
                          id="fat"
                          type="number"
                          value={newMeal.fat}
                          onChange={(e) => setNewMeal({...newMeal, fat: parseInt(e.target.value) || 0})}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="tadashi-button"
                        onClick={handleAddMeal}
                      >
                        Add Meal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Daily Summary */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Daily Nutrition Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Calories</span>
                    <span>{dailyTotals.calories} / {NUTRITION_GOALS.calories}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-tadashi-blue h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (dailyTotals.calories / NUTRITION_GOALS.calories) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Protein</span>
                    <span>{dailyTotals.protein}g / {NUTRITION_GOALS.protein}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (dailyTotals.protein / NUTRITION_GOALS.protein) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Carbs</span>
                    <span>{dailyTotals.carbs}g / {NUTRITION_GOALS.carbs}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (dailyTotals.carbs / NUTRITION_GOALS.carbs) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Fat</span>
                    <span>{dailyTotals.fat}g / {NUTRITION_GOALS.fat}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (dailyTotals.fat / NUTRITION_GOALS.fat) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meal Distribution */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle>Meal Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mealTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mealTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Nutrition Chart */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle>Nutrition Goals</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={nutritionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="actual" fill="#8884d8" name="Actual" />
                  <Bar dataKey="goal" fill="#82ca9d" name="Goal" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Meal List */}
          <Card className="tadashi-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="h-5 w-5 mr-2" />
                Today's Meals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {meals.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Apple className="h-12 w-12 mx-auto mb-4" />
                  <p>No meals logged yet today.</p>
                  <Button 
                    className="tadashi-button mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Meal
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4">{getMealTypeIcon(meal.type)}</span>
                        <div>
                          <h3 className="font-semibold">{meal.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {meal.time} • {meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMeal(meal.id)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Advice */}
          <Card className="tadashi-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                AI Nutrition Advice
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
                  <strong>Tip from Tadashi:</strong> Add a fruit to your breakfast for extra vitamins and fiber!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}