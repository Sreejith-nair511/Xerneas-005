"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Heart, Stethoscope } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Body parts and symptoms data
const bodyParts = [
  { value: "head", label: "Head" },
  { value: "chest", label: "Chest" },
  { value: "stomach", label: "Stomach" },
  { value: "limbs", label: "Limbs" },
  { value: "back", label: "Back" },
  { value: "throat", label: "Throat" },
  { value: "general", label: "General" },
]

const symptomsByBodyPart: Record<string, string[]> = {
  head: ["Headache", "Migraine", "Dizziness", "Sinus Pressure", "Eye Strain"],
  chest: ["Chest Pain", "Shortness of Breath", "Heart Palpitations", "Cough", "Tightness"],
  stomach: ["Stomach Pain", "Nausea", "Bloating", "Diarrhea", "Constipation"],
  limbs: ["Joint Pain", "Muscle Ache", "Numbness", "Swelling", "Cramps"],
  back: ["Back Pain", "Sciatica", "Stiffness", "Spasms", "Soreness"],
  throat: ["Sore Throat", "Difficulty Swallowing", "Hoarseness", "Swelling", "Dryness"],
  general: ["Fatigue", "Fever", "Chills", "Weight Loss", "Appetite Changes"],
}

export default function SymptomCheckerPage() {
  const [selectedBodyPart, setSelectedBodyPart] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{ diagnosis: string; advice: string } | null>(null)
  const [history, setHistory] = useState<any[]>([])

  const handleBodyPartChange = (value: string) => {
    setSelectedBodyPart(value)
    setSelectedSymptoms([])
  }

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    )
  }

  const analyzeSymptoms = () => {
    if (!selectedBodyPart || selectedSymptoms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a body part and at least one symptom",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    
    // Simulate AI analysis delay
    setTimeout(() => {
      // Generate mock diagnosis based on symptoms
      const diagnosis = generateMockDiagnosis(selectedBodyPart, selectedSymptoms)
      const advice = generateMockAdvice(selectedBodyPart, selectedSymptoms)
      
      const result = { diagnosis, advice }
      setAnalysisResult(result)
      
      // Add to history
      const newCheck = {
        id: Date.now(),
        bodyPart: selectedBodyPart,
        symptoms: [...selectedSymptoms],
        additionalInfo,
        result,
        timestamp: new Date().toLocaleString(),
      }
      
      setHistory(prev => [newCheck, ...prev.slice(0, 4)]) // Keep only last 5 checks
      setIsAnalyzing(false)
      
      toast({
        title: "Analysis Complete",
        description: "Tadashi AI has analyzed your symptoms",
      })
    }, 2000)
  }

  const generateMockDiagnosis = (bodyPart: string, symptoms: string[]): string => {
    const symptomList = symptoms.join(", ").toLowerCase()
    
    if (bodyPart === "head" && symptomList.includes("headache")) {
      if (symptoms.length > 2) {
        return "Possible Tension Headache with Stress Component"
      }
      return "Mild Tension Headache"
    }
    
    if (bodyPart === "chest" && symptomList.includes("pain")) {
      return "Chest Discomfort - Monitor Closely"
    }
    
    if (bodyPart === "stomach" && symptomList.includes("pain")) {
      if (symptomList.includes("nausea") || symptomList.includes("diarrhea")) {
        return "Possible Gastroenteritis"
      }
      return "Indigestion or Gastric Irritation"
    }
    
    if (bodyPart === "limbs" && symptomList.includes("pain")) {
      if (symptomList.includes("joint")) {
        return "Possible Joint Inflammation"
      }
      return "Muscle Strain or Fatigue"
    }
    
    if (bodyPart === "general" && symptomList.includes("fatigue")) {
      return "General Fatigue - Multiple Possible Causes"
    }
    
    return "Non-specific Symptoms - Further Evaluation Recommended"
  }

  const generateMockAdvice = (bodyPart: string, symptoms: string[]): string => {
    const symptomList = symptoms.join(", ").toLowerCase()
    
    if (bodyPart === "head" && symptomList.includes("headache")) {
      return "Recommendation: Rest in a quiet, dark room. Stay hydrated and consider gentle neck stretches. If pain persists beyond 24 hours or worsens, consult a healthcare provider."
    }
    
    if (bodyPart === "chest" && symptomList.includes("pain")) {
      return "Recommendation: Monitor symptoms closely. If experiencing severe chest pain, shortness of breath, or other concerning symptoms, seek immediate medical attention. For mild discomfort, rest and avoid strenuous activity."
    }
    
    if (bodyPart === "stomach" && (symptomList.includes("pain") || symptomList.includes("nausea"))) {
      return "Recommendation: Stick to bland foods and clear liquids. Avoid spicy or fatty foods. Rest and stay hydrated. If symptoms persist beyond 48 hours or worsen, consult a healthcare provider."
    }
    
    if (bodyPart === "limbs" && symptomList.includes("pain")) {
      return "Recommendation: Apply ice for acute pain or heat for muscle tension. Gentle stretching may help. Avoid overuse of affected limbs. If pain persists or worsens, consider consulting a healthcare provider."
    }
    
    if (bodyPart === "general" && symptomList.includes("fatigue")) {
      return "Recommendation: Ensure adequate sleep (7-9 hours), stay hydrated, and maintain a balanced diet. Consider stress management techniques. If fatigue persists for more than two weeks, consult a healthcare provider."
    }
    
    return "Recommendation: Monitor your symptoms and maintain good general health practices. If symptoms persist, worsen, or you develop new concerning symptoms, consult with a healthcare provider."
  }

  const resetForm = () => {
    setSelectedBodyPart("")
    setSelectedSymptoms([])
    setAdditionalInfo("")
    setAnalysisResult(null)
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">AI Symptom Checker</h1>
          <p className="tadashi-tagline">
            Describe your symptoms and get AI-powered health insights
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptom Input Form */}
          <Card className="tadashi-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Describe Your Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Body Part</label>
                <Select value={selectedBodyPart} onValueChange={handleBodyPartChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body part" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyParts.map(part => (
                      <SelectItem key={part.value} value={part.value}>
                        {part.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBodyPart && (
                <div>
                  <label className="block text-sm font-medium mb-2">Symptoms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {symptomsByBodyPart[selectedBodyPart]?.map(symptom => (
                      <Button
                        key={symptom}
                        variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                        className={`justify-start ${selectedSymptoms.includes(symptom) ? "bg-tadashi-blue hover:bg-tadashi-darkBlue" : ""}`}
                        onClick={() => toggleSymptom(symptom)}
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Additional Information (Optional)</label>
                <Textarea
                  placeholder="Any other details about your symptoms, when they started, what makes them better or worse..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  className="tadashi-button flex-1"
                  onClick={analyzeSymptoms}
                  disabled={isAnalyzing || !selectedBodyPart || selectedSymptoms.length === 0}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    "Analyze Symptoms"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History Panel */}
          <Card className="tadashi-card">
            <CardHeader>
              <CardTitle>Recent Checks</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No symptom checks yet
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map(check => (
                    <div key={check.id} className="p-3 bg-tadashi-blue/5 dark:bg-gray-700 rounded-lg">
                      <div className="font-medium text-sm">
                        {check.bodyPart.charAt(0).toUpperCase() + check.bodyPart.slice(1)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {check.symptoms.slice(0, 2).join(", ")}
                        {check.symptoms.length > 2 ? "..." : ""}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {check.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <Card className="tadashi-card lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Possible Diagnosis</h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-tadashi-blue/5 dark:bg-gray-700 p-4 rounded-lg">
                      {analysisResult.diagnosis}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Care Advice</h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-tadashi-blue/5 dark:bg-gray-700 p-4 rounded-lg">
                      {analysisResult.advice}
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Disclaimer</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This AI analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. 
                    Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}