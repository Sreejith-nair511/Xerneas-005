"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit3, Droplets, Moon, Coffee, Utensils } from "lucide-react"
import ParticleBackground from "@/components/particle-background"
import ToolNavigationGuide from "@/components/tool-navigation-guide"

// Types for our reminders
type ReminderType = 'medication' | 'hydration' | 'sleep' | 'exercise' | 'meal'

interface Reminder {
  id: string
  type: ReminderType
  name: string
  time: string
  enabled: boolean
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', type: 'medication', name: 'Vitamin D', time: '08:00', enabled: true },
    { id: '2', type: 'hydration', name: 'Drink water', time: '10:00', enabled: true },
    { id: '3', type: 'sleep', name: 'Bedtime', time: '22:30', enabled: true },
  ])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [newReminder, setNewReminder] = useState({
    type: 'medication' as ReminderType,
    name: '',
    time: '08:00',
  })

  // Load reminders from localStorage on mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('tadashi-reminders')
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }
  }, [])

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tadashi-reminders', JSON.stringify(reminders))
  }, [reminders])

  const handleAddReminder = () => {
    if (!newReminder.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the reminder",
        variant: "destructive",
      })
      return
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      type: newReminder.type,
      name: newReminder.name,
      time: newReminder.time,
      enabled: true,
    }

    setReminders([...reminders, reminder])
    setNewReminder({ type: 'medication', name: '', time: '08:00' })
    setIsDialogOpen(false)
    
    toast({
      title: "Reminder Added",
      description: `${reminder.name} has been added successfully`,
    })
  }

  const handleEditReminder = () => {
    if (!editingReminder || !editingReminder.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the reminder",
        variant: "destructive",
      })
      return
    }

    setReminders(reminders.map(r => r.id === editingReminder.id ? editingReminder : r))
    setEditingReminder(null)
    setIsDialogOpen(false)
    
    toast({
      title: "Reminder Updated",
      description: `${editingReminder.name} has been updated successfully`,
    })
  }

  const handleDeleteReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id)
    if (reminder) {
      setReminders(reminders.filter(r => r.id !== id))
      toast({
        title: "Reminder Removed",
        description: `${reminder.name} has been removed`,
      })
    }
  }

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const getIconForType = (type: ReminderType) => {
    switch (type) {
      case 'medication': return <Utensils className="h-4 w-4" />
      case 'hydration': return <Droplets className="h-4 w-4" />
      case 'sleep': return <Moon className="h-4 w-4" />
      case 'exercise': return <Coffee className="h-4 w-4" />
      case 'meal': return <Utensils className="h-4 w-4" />
      default: return <Utensils className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: ReminderType) => {
    switch (type) {
      case 'medication': return 'Medication'
      case 'hydration': return 'Hydration'
      case 'sleep': return 'Sleep'
      case 'exercise': return 'Exercise'
      case 'meal': return 'Meal'
      default: return 'Other'
    }
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Health Reminders & Routine</h1>
          <p className="tadashi-tagline">
            Manage your daily health routines and never miss an important task again
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Reminders</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="tadashi-button"
                  onClick={() => {
                    setEditingReminder(null)
                    setNewReminder({ type: 'medication', name: '', time: '08:00' })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle>
                    {editingReminder ? "Edit Reminder" : "Add New Reminder"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={editingReminder ? editingReminder.type : newReminder.type}
                      onValueChange={(value) => 
                        editingReminder 
                          ? setEditingReminder({...editingReminder, type: value as ReminderType})
                          : setNewReminder({...newReminder, type: value as ReminderType})
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="hydration">Hydration</SelectItem>
                        <SelectItem value="sleep">Sleep</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="meal">Meal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editingReminder ? editingReminder.name : newReminder.name}
                      onChange={(e) => 
                        editingReminder 
                          ? setEditingReminder({...editingReminder, name: e.target.value})
                          : setNewReminder({...newReminder, name: e.target.value})
                      }
                      className="col-span-3"
                      placeholder="e.g., Vitamin D, Drink water"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={editingReminder ? editingReminder.time : newReminder.time}
                      onChange={(e) => 
                        editingReminder 
                          ? setEditingReminder({...editingReminder, time: e.target.value})
                          : setNewReminder({...newReminder, time: e.target.value})
                      }
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
                    onClick={editingReminder ? handleEditReminder : handleAddReminder}
                  >
                    {editingReminder ? "Update" : "Add"} Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {reminders.length === 0 ? (
            <Card className="tadashi-card">
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You don't have any reminders yet.
                </p>
                <Button 
                  className="tadashi-button"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first reminder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reminders.map((reminder) => (
                <Card 
                  key={reminder.id} 
                  className={`tadashi-card ${!reminder.enabled ? 'opacity-60' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-tadashi-blue/10 dark:bg-tadashi-blue/20">
                          {getIconForType(reminder.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {reminder.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getTypeLabel(reminder.type)} • {reminder.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={reminder.enabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleReminder(reminder.id)}
                          className={reminder.enabled ? "bg-tadashi-blue hover:bg-tadashi-darkBlue" : ""}
                        >
                          {reminder.enabled ? "Enabled" : "Disabled"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingReminder(reminder)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <ToolNavigationGuide />
      </div>
    </div>
  )
}