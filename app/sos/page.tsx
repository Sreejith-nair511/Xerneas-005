"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Phone, MapPin, User, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"
import ToolNavigationGuide from "@/components/tool-navigation-guide"

export default function SOSPage() {
  const [isTriggered, setIsTriggered] = useState(false)
  const [triggerTime, setTriggerTime] = useState<string | null>(null)

  const triggerSOS = () => {
    setIsTriggered(true)
    const now = new Date()
    setTriggerTime(now.toLocaleTimeString())
    
    // Simulate sending emergency alert
    toast({
      title: "SOS Alert Sent",
      description: "Emergency alert sent to registered contacts ✅",
      duration: 5000,
    })
    
    // Log to console for demonstration
    console.log("SOS triggered at:", now.toISOString())
    console.log("Simulated emergency contacts notified: Family, Doctor, Emergency Services")
  }

  const resetSOS = () => {
    setIsTriggered(false)
    setTriggerTime(null)
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Emergency SOS</h1>
          <p className="tadashi-tagline">
            Immediate assistance when you need it most
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="tadashi-card border-2 border-red-500">
            <CardHeader className="text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-red-500">Emergency Alert System</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Press the button below to send an immediate emergency alert to your registered contacts
              </p>
            </CardHeader>
            <CardContent className="text-center">
              {!isTriggered ? (
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={triggerSOS}
                >
                  <AlertTriangle className="h-8 w-8 mr-2" />
                  Trigger SOS Emergency
                </Button>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-red-500/10 rounded-lg">
                    <h3 className="text-xl font-bold text-red-500 mb-2">Emergency Alert Sent!</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Your emergency contacts have been notified.
                    </p>
                    {triggerTime && (
                      <div className="flex items-center justify-center mt-2 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Sent at {triggerTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card className="tadashi-card">
                      <CardContent className="p-4 text-center">
                        <Phone className="h-8 w-8 text-tadashi-blue mx-auto mb-2" />
                        <h4 className="font-semibold">Emergency Services</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">108</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="tadashi-card">
                      <CardContent className="p-4 text-center">
                        <User className="h-8 w-8 text-tadashi-blue mx-auto mb-2" />
                        <h4 className="font-semibold">Family Contact</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Notified</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="tadashi-card">
                      <CardContent className="p-4 text-center">
                        <MapPin className="h-8 w-8 text-tadashi-blue mx-auto mb-2" />
                        <h4 className="font-semibold">Location Shared</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current GPS</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={resetSOS}
                  >
                    Reset Emergency System
                  </Button>
                </div>
              )}
              
              <div className="mt-8 p-4 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold mb-2">Important Information</h4>
                <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• This is a simulation for demonstration purposes</li>
                  <li>• In a real emergency, always call local emergency services</li>
                  <li>• In India, dial 108 for emergency medical assistance</li>
                  <li>• Keep your emergency contacts updated in settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigationGuide />
    </div>
  )
}