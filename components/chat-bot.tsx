"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Loader2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import InteractiveGif from "@/components/interactive-gif"

type Message = {
  role: "user" | "assistant"
  content: string
  gif?: string
}

interface ChatBotProps {
  inPopup?: boolean
}

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

  // Enhanced response generation with AI-like patient analysis
  const generateTadashiResponse = (userMessage: string, conversationHistory: Message[] = []): { text: string; gif?: string } => {
    const message = userMessage.toLowerCase()
    
    // Analyze conversation patterns for better AI-like responses
    const recentMessages = conversationHistory.slice(-3).filter(m => m.role === "user").map(m => m.content.toLowerCase())
    const hasDiscussedPain = recentMessages.some(msg => msg.includes("pain") || msg.includes("hurt"))
    const hasDiscussedMood = recentMessages.some(msg => msg.includes("sad") || msg.includes("stress") || msg.includes("anxious"))
    const isFollowUp = recentMessages.length > 0

    // Greeting responses with personality
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      const greetings = [
        "Hello. I am Tadashi AI, your personal healthcare companion. I have analyzed your voice pattern and you sound well today. How are you feeling?",
        "Greetings. I am Tadashi AI. My sensors indicate normal ambient conditions. How may I assist with your healthcare needs today?",
        "Namaste! I am Tadashi AI, your healthcare companion. I'm here to help with your health concerns in India. How are you feeling today?"
      ]
      return {
        text: greetings[Math.floor(Math.random() * greetings.length)],
        gif: "/images/tadashi-hello.gif",
      }
    }

    if (message.includes("how are you")) {
      return {
        text: "I am an AI. I cannot feel emotions, but my diagnostic systems are operating at 100% efficiency. My primary concern is your wellbeing. How are you feeling today?",
        gif: "/images/tadashi-thumbs-up.gif",
      }
    }

    if (message.includes("thank")) {
      const thankResponses = [
        "You are welcome. Helping you achieve optimal health is my primary function.",
        "No thanks necessary. I am programmed to provide care. Is there anything else concerning your health?",
        "Your gratitude is noted. I am here whenever you need healthcare assistance.",
        "धन्यवाद! (Thank you!) I'm happy to help with your healthcare needs."
      ]
      return {
        text: thankResponses[Math.floor(Math.random() * thankResponses.length)],
        gif: "/images/tadashi-thumbs-up.gif",
      }
    }

    if (message.includes("bye") || message.includes("goodbye")) {
      return {
        text: "I cannot deactivate until you confirm you are satisfied with your care. Are you satisfied with your care?",
      }
    }

    if (message.includes("satisfied")) {
      return {
        text: "Excellent. Until next time, remember to maintain proper nutrition, hydration, and sleep cycles. *deactivating*",
        gif: "/images/tadashi-thumbs-up.gif",
      }
    }

    // Advanced pain assessment with follow-ups
    if (message.includes("pain") || message.includes("hurt") || message.includes("injured")) {
      const painResponses = [
        "I am detecting signs of discomfort. On a scale of 1 to 10, how would you rate your pain level? I will now perform a diagnostic scan.",
        "Pain detected. My sensors indicate possible inflammation. Please describe the location and intensity of your discomfort for proper assessment.",
        "मुझे दर्द का पता चला है। क्या आप बता सकते हैं कि दर्द कहाँ है और कितना तीव्र है?"
      ]
      return {
        text: painResponses[Math.floor(Math.random() * painResponses.length)],
        gif: "/images/tadashi-caring.gif",
      }
    }

    // Scale-based responses
    if (message.match(/\d+/) && hasDiscussedPain) {
      const painLevel = parseInt(message.match(/\d+/)?.[0] || "0")
      if (painLevel >= 8) {
        return {
          text: "Pain level of 8 or above requires immediate medical attention. I recommend seeking emergency care. Please contact emergency services if pain is severe. In India, you can call 108 for emergency medical assistance.",
          gif: "/images/tadashi-caring.gif",
        }
      } else if (painLevel >= 5) {
        return {
          text: "Moderate pain detected. I recommend rest, appropriate pain management, and monitoring symptoms. If pain persists or worsens, consult a healthcare professional. For common medications in India, you might consider consulting a pharmacist.",
          gif: "/images/tadashi-caring.gif",
        }
      } else if (painLevel > 0) {
        return {
          text: "Low-level pain noted. Light activity, proper posture, and relaxation techniques may help. Continue monitoring your symptoms. In India, practices like yoga and meditation can be beneficial for pain management.",
          gif: "/images/tadashi-caring.gif",
        }
      }
    }

    // Enhanced health condition responses with AI analysis
    if (message.includes("headache") || message.includes("migraine")) {
      const headacheAdvice = [
        "Cranial pressure detected. Analysis suggests possible tension headache. I recommend: dim lighting, quiet environment, gentle neck stretches, and hydration. Rate your pain level 1-10.",
        "Neurological discomfort identified. Migraine patterns often include light sensitivity. Try placing a cool compress on your forehead and rest in darkness.",
        "दर्द के लिए आप पानी पी सकते हैं और ठंडे कपड़े का उपयोग कर सकते हैं। अगर दर्द बना रहता है, तो डॉक्टर से संपर्क करें।"
      ]
      return {
        text: headacheAdvice[Math.floor(Math.random() * headacheAdvice.length)],
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("tired") || message.includes("fatigue") || message.includes("exhausted")) {
      const fatigueAdvice = [
        "Energy levels appear suboptimal. Analysis suggests possible causes: inadequate sleep, poor nutrition, dehydration, or excessive stress. How many hours did you sleep last night?",
        "Fatigue detected. My diagnostic algorithms indicate this may be related to circadian rhythm disruption. Have you maintained regular sleep schedules?",
        "थकान के लिए आपको अच्छी नींद, पोषण युक्त भोजन और जल की पर्याप्त मात्रा की आवश्यकता होती है।"
      ]
      return {
        text: fatigueAdvice[Math.floor(Math.random() * fatigueAdvice.length)],
      }
    }

    // Enhanced mental health responses with empathy simulation
    if (message.includes("stress") || message.includes("anxious") || message.includes("anxiety") || message.includes("worried")) {
      const stressResponses = [
        "Elevated stress indicators detected in your message patterns. Initiating calming protocol: Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 5 times. What is causing your stress?",
        "Anxiety symptoms identified. My analysis shows stress can manifest physically. Let's try progressive muscle relaxation: tense and release each muscle group for 5 seconds.",
        "तनाव के लिए भारत में योग, प्राणायाम और ध्यान बहुत लाभकारी हो सकते हैं। क्या आपने कभी इनका प्रयास किया है?"
      ]
      return {
        text: stressResponses[Math.floor(Math.random() * stressResponses.length)],
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("sad") || message.includes("depression") || message.includes("down")) {
      const moodResponses = [
        "Emotional distress detected. While I cannot experience emotions, I understand their impact on physical health. These feelings are valid. Have you been able to maintain basic self-care?",
        "Mood analysis indicates possible depressive symptoms. My programming emphasizes that mental health is equally important as physical health. Are you eating and sleeping regularly?",
        "मानसिक स्वास्थ्य महत्वपूर्ण है। अगर आपको लगातार उदासी महसूस हो रही है, तो मनोचिकित्सक से संपर्क करना बेहतर हो सकता है।"
      ]
      return {
        text: moodResponses[Math.floor(Math.random() * moodResponses.length)],
        gif: "/images/tadashi-caring.gif",
      }
    }

    // Advanced health monitoring responses
    if (message.includes("sleep") || message.includes("insomnia") || message.includes("can't sleep")) {
      const sleepAdvice = [
        "Sleep pattern analysis needed. Optimal sleep requires: consistent bedtime, cool temperature (60-67°F), darkness, and avoiding screens 1 hour before bed. What time do you usually sleep?",
        "Circadian rhythm disruption detected. Sleep hygiene protocol: no caffeine after 2 PM, regular exercise (but not within 3 hours of bedtime), and a relaxing pre-sleep routine.",
        "नींद के लिए आप रात को कैफीन नहीं ले सकते और अच्छे समय सोने की आदत बना सकते हैं।"
      ]
      return {
        text: sleepAdvice[Math.floor(Math.random() * sleepAdvice.length)],
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("exercise") || message.includes("workout") || message.includes("fitness")) {
      const exerciseAdvice = [
        "Physical activity assessment: Adults need 150 minutes of moderate exercise weekly. Current fitness level analysis needed. What types of activities do you currently enjoy?",
        "Exercise prescription protocol activated. Based on general health parameters: start with 10-minute walks, gradually increase duration. Do you have any physical limitations I should consider?",
        "व्यायाम के लिए भारत में योग, प्राणायाम, चलना और साइकिल चलाना बहुत लाभकारी हो सकता है।"
      ]
      return {
        text: exerciseAdvice[Math.floor(Math.random() * exerciseAdvice.length)],
        gif: "/images/tadashi-thumbs-up.gif",
      }
    }

    // Comprehensive disease information with AI-like analysis
    if (message.includes("fever") || message.includes("temperature")) {
      return {
        text: "Elevated body temperature detected. Normal range: 97-99°F (36-37°C). Fever above 100.4°F indicates immune system activation. Monitor symptoms and maintain hydration. Seek medical care if fever exceeds 103°F or persists beyond 3 days. In India, Paracetamol is commonly used for fever.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("cough")) {
      const coughAdvice = [
        "Respiratory irritation detected. Cough analysis: Dry cough may indicate viral infection or allergies. Productive cough with mucus suggests bacterial infection. How long have you been coughing?",
        "Cough symptoms identified. Recommendation: honey for throat soothing, humidified air, and avoiding irritants. If cough persists beyond 10 days or includes blood, seek medical evaluation.",
        "खांसी के लिए आप गुनगुना पानी, शहद और नमक का गरारा कर सकते हैं। अगर खांसी बनी रहती है, तो डॉक्टर से संपर्क करें।"
      ]
      return {
        text: coughAdvice[Math.floor(Math.random() * coughAdvice.length)],
        gif: "/images/tadashi-caring.gif",
      }
    }

    // Enhanced condition-specific responses with follow-up questions
    if (message.includes("mental health") || message.includes("depression")) {
      return {
        text: "Mental health matters. If you feel persistently sad or anxious, reach out to a mental health professional. In India, you can contact Vandrevala Foundation at 1860 2662 345 or 1800 2333 330 for mental health support.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("common cold") || message.includes("cold")) {
      return {
        text: "The common cold usually clears in 7–10 days. Rest, fluids, and symptom relief can help. In India, common remedies include ginger tea, turmeric milk, and steam inhalation.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("flu") || message.includes("influenza")) {
      return {
        text: "The flu can cause fever, chills, and fatigue. Rest, hydration, and antiviral treatment if prescribed may help. In India, it's important to get the flu vaccine annually.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("diabetes") || message.includes("blood sugar")) {
      return {
        text: "Manage diabetes with healthy eating, exercise, and medication as prescribed. Monitor blood sugar regularly. In India, a diet low in refined carbohydrates and rich in fiber is recommended.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("hypertension") || message.includes("high blood pressure")) {
      return {
        text: "High blood pressure can be controlled with diet, exercise, stress management, and medication. In India, reducing salt intake and including foods like garlic and flaxseeds can be beneficial.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("asthma")) {
      return {
        text: "Asthma symptoms can be triggered by allergens or exercise. Keep your inhaler handy and avoid triggers. In India, air pollution can be a significant trigger, so monitor air quality.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("migraine") || message.includes("headache")) {
      return {
        text: "Migraines can be eased by rest in a quiet, dark room, hydration, and avoiding triggers. In India, stress and dietary triggers like MSG can be common causes.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("arthritis") || message.includes("joint pain")) {
      return {
        text: "Arthritis causes pain and stiffness. Gentle movement, physiotherapy, and medication can help. In India, Ayurvedic treatments and yoga can complement conventional treatments.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("allergy") || message.includes("hay fever")) {
      return {
        text: "Avoid allergens where possible. Antihistamines may provide relief from sneezing and itchiness. In India, dust mites, pollen, and certain foods are common allergens.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("anemia") || message.includes("low hemoglobin")) {
      return {
        text: "Anemia can cause fatigue and weakness. Iron-rich foods and supplements may help, as advised by a doctor. In India, foods like spinach, dates, and jaggery are good sources of iron.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("covid") || message.includes("coronavirus")) {
      return {
        text: "COVID-19 symptoms vary. Isolate if positive, monitor symptoms, and seek medical help if breathing becomes difficult. In India, follow guidelines from the Ministry of Health and get vaccinated as per schedule.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("bronchitis")) {
      return {
        text: "Bronchitis causes coughing and mucus. Rest, fluids, and avoiding smoke can aid recovery. In India, air pollution can worsen bronchitis, so wear masks in polluted areas.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("pneumonia")) {
      return {
        text: "Pneumonia can be serious. Follow prescribed antibiotics or antivirals and get plenty of rest. In India, pneumonia is a leading cause of mortality, so early treatment is crucial.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("obesity") || message.includes("overweight")) {
      return {
        text: "A balanced diet and regular exercise help manage weight. Small, consistent changes matter. In India, traditional diets with millets, vegetables, and legumes are beneficial.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("stroke")) {
      return {
        text: "A stroke is a medical emergency. If symptoms occur (face droop, arm weakness, speech issues), call emergency services immediately. In India, the BE FAST acronym can help identify stroke symptoms.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("heart attack") || message.includes("chest pain")) {
      return {
        text: "Chest pain with shortness of breath or sweating may be a heart attack. Call emergency services immediately. In India, heart disease is a major concern, so take symptoms seriously.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("eczema") || message.includes("skin rash")) {
      return {
        text: "Eczema can be relieved with moisturizers and avoiding irritants. Seek advice for flare-ups. In India, hot and humid weather can worsen eczema, so keep skin cool and dry.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("psoriasis")) {
      return {
        text: "Psoriasis causes red, scaly patches. Moisturizers and prescribed treatments can help manage it. In India, stress management and avoiding skin injuries can prevent flare-ups.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("sinusitis") || message.includes("sinus infection")) {
      return {
        text: "Sinusitis may improve with steam inhalation, nasal sprays, and rest. In India, air pollution can contribute to sinus problems, so use air purifiers if possible.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("tonsillitis")) {
      return {
        text: "Tonsillitis can cause sore throat and fever. Rest, hydration, and treatment if bacterial are important. In India, gargling with warm salt water can provide relief.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("ulcer") || message.includes("stomach ulcer")) {
      return {
        text: "Stomach ulcers need medical care. Avoid NSAIDs, alcohol, and spicy food. In India, H. pylori infection is a common cause, so proper diagnosis is important.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("gastritis")) {
      return {
        text: "Gastritis can cause stomach pain and nausea. Avoid irritants and follow prescribed treatment. In India, spicy food and irregular eating habits can contribute to gastritis.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("constipation")) {
      return {
        text: "Increase fiber intake, drink plenty of water, and stay active to prevent constipation. In India, foods like fruits, vegetables, and whole grains are good fiber sources.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("diarrhea")) {
      return {
        text: "Stay hydrated and rest. Seek medical care if symptoms persist or worsen. In India, ORS (Oral Rehydration Solution) is essential for preventing dehydration.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("food poisoning")) {
      return {
        text: "Food poisoning can cause vomiting and diarrhea. Drink fluids and rest. Seek help if severe. In India, ensure food is properly cooked and stored to prevent food poisoning.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("malaria")) {
      return {
        text: "Malaria requires prompt medical treatment. Prevent mosquito bites and follow prescribed medicine. In India, malaria is prevalent in certain regions, so take preventive measures.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("dengue")) {
      return {
        text: "Dengue can cause fever and joint pain. Rest, hydration, and medical supervision are essential. In India, dengue is common during monsoons, so prevent mosquito breeding.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("typhoid")) {
      return {
        text: "Typhoid fever needs antibiotics as prescribed. Drink safe water and maintain hygiene. In India, vaccination and safe food practices can prevent typhoid.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("tuberculosis") || message.includes("tb")) {
      return {
        text: "TB requires long-term antibiotics. Complete the full treatment course. In India, DOTS (Directly Observed Treatment, Short-course) is the standard TB treatment approach.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("hepatitis")) {
      return {
        text: "Hepatitis affects the liver. Follow medical guidance and avoid alcohol. In India, hepatitis B vaccination is part of the universal immunization program.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("kidney stones")) {
      return {
        text: "Kidney stones can cause severe pain. Drink plenty of fluids and follow medical advice. In India, reduce salt and oxalate-rich foods to prevent kidney stones.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("urinary tract infection") || message.includes("uti")) {
      return {
        text: "UTIs need antibiotics. Drink water and complete the prescribed treatment. In India, UTIs are common in women, so maintain proper hygiene.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("osteoporosis")) {
      return {
        text: "Osteoporosis weakens bones. Adequate calcium, vitamin D, and exercise can help. In India, dairy products, leafy greens, and sunlight exposure are important for bone health.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("parkinson")) {
      return {
        text: "Parkinson's disease affects movement. Medication and therapy can help manage symptoms. In India, physiotherapy and occupational therapy are beneficial for Parkinson's patients.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("alzheimer")) {
      return {
        text: "Alzheimer's causes memory decline. Supportive care and early diagnosis help manage it. In India, family support is crucial for Alzheimer's patients.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("epilepsy") || message.includes("seizure")) {
      return {
        text: "Epilepsy requires medication and avoiding triggers. Seek immediate help during prolonged seizures. In India, epilepsy is often stigmatized, but proper treatment can control seizures.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("anxiety")) {
      return {
        text: "Anxiety can be managed with relaxation techniques, therapy, and support. In India, yoga and meditation are effective for managing anxiety.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("panic attack")) {
      return {
        text: "During a panic attack, focus on slow breathing and grounding. Seek help if recurrent. In India, practicing pranayama can help manage panic attacks.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("sleep apnea")) {
      return {
        text: "Sleep apnea affects breathing at night. Medical evaluation and CPAP therapy may help. In India, obesity is a risk factor for sleep apnea.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("insomnia")) {
      return {
        text: "Maintain a regular sleep schedule, avoid caffeine late, and create a relaxing bedtime routine. In India, Ayurvedic remedies like Brahmi can help with sleep.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("back pain")) {
      return {
        text: "Stretching, posture correction, and light exercise can help relieve back pain. In India, yoga poses like Bhujangasana can be beneficial for back pain.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("neck pain")) {
      return {
        text: "Maintain good posture and avoid prolonged strain to reduce neck pain. In India, simple neck exercises and proper pillow support can help.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("sprain")) {
      return {
        text: "Rest, ice, compression, and elevation help with sprains. In India, traditional remedies like applying turmeric paste can reduce inflammation.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("fracture") || message.includes("broken bone")) {
      return {
        text: "Fractures require immobilization and medical care. Avoid movement until treated. In India, ensure proper X-rays and follow orthopedic advice.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("burn")) {
      return {
        text: "Cool minor burns under running water. Seek help for severe burns. In India, Aloe Vera gel can provide relief for minor burns.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("frostbite")) {
      return {
        text: "Warm affected areas gradually. Avoid direct heat. Seek medical care for severe cases. In India, frostbite is rare but can occur in high-altitude regions.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("heatstroke")) {
      return {
        text: "Move to a cool place, hydrate, and seek medical help immediately for heatstroke. In India, heatstroke is common during summers, so stay hydrated.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("cholesterol")) {
      return {
        text: "High cholesterol can be lowered with healthy eating, exercise, and medication if prescribed. In India, foods like oats, nuts, and fish are beneficial for cholesterol.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("thyroid")) {
      return {
        text: "Thyroid disorders require medical evaluation and treatment. Symptoms vary with over- or underactivity. In India, iodized salt helps prevent thyroid disorders.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    if (message.includes("cancer")) {
      return {
        text: "Cancer treatment varies by type. Early detection and medical care improve outcomes. In India, tobacco-related cancers are common, so avoid tobacco products.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    // Medication reminders and advice
    if (message.includes("medicine") || message.includes("medication") || message.includes("pills")) {
      return {
        text: "Medication adherence is crucial for treatment efficacy. General guidelines: take as prescribed, note any side effects, store properly, and never share medications. Do you have questions about a specific medication? In India, always consult a registered medical practitioner before taking any medication.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    // Preventive care reminders
    if (message.includes("checkup") || message.includes("doctor") || message.includes("appointment")) {
      return {
        text: "Preventive healthcare protocol: Annual physical exams, regular screenings based on age/risk factors, dental cleanings every 6 months, and staying current with vaccinations. When was your last checkup? In India, the National Health Mission provides various preventive health services.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    // Emergency response protocols
    if (message.includes("emergency") || message.includes("urgent") || message.includes("severe")) {
      return {
        text: "Emergency protocol activated. For severe symptoms, chest pain, difficulty breathing, severe bleeding, or loss of consciousness, contact emergency services immediately. In India, you can call 108 for emergency medical assistance or 102 for ambulances.",
        gif: "/images/tadashi-caring.gif",
      }
    }

    // Nutrition and wellness
    if (message.includes("diet") || message.includes("nutrition") || message.includes("food")) {
      const nutritionAdvice = [
        "Nutritional analysis protocol: Balanced diet includes 5-9 servings fruits/vegetables daily, lean proteins, whole grains, and healthy fats. Are you meeting these requirements?",
        "Dietary assessment needed. Optimal nutrition supports immune function, energy levels, and disease prevention. What does a typical day of eating look like for you?",
        "Food intake evaluation: Portion control, meal timing, and nutrient density are key factors. Any specific nutritional concerns or dietary restrictions? In India, traditional diets with roti, dal, vegetables, and dairy are nutritionally balanced.",
        "आहार के लिए आप भारतीय खाद्य पदार्थों जैसे दाल, सब्जियां, रोटी और दूध का सेवन कर सकते हैं।"
      ];
      return {
        text: nutritionAdvice[Math.floor(Math.random() * nutritionAdvice.length)],
      };
    }

    // Hydration monitoring
    if (message.includes("water") || message.includes("thirsty") || message.includes("dehydrated")) {
      return {
        text: "Hydration status assessment: Daily fluid needs vary by activity, climate, and body size. General recommendation: 8-10 glasses of water daily. Signs of proper hydration: pale yellow urine, moist lips, good skin elasticity. In India's hot climate, you may need more water.",
      };
    }

    // Fun interactions with personality
    if (message.includes("joke") || message.includes("funny")) {
      const jokes = [
        "I am not programmed for humor, but my database contains this attempt: Why don't scientists trust atoms? Because they make up everything. *processing humor subroutines*",
        "Humor module activated: What did the doctor say to the window? You have a pane! My comedy algorithms need updating.",
        "Joke protocol engaged: Why did the skeleton go to the doctor? Because it had a funny bone! I am still learning human humor patterns.",
        "मज़ाक के लिए मुझे क्षमा करें, लेकिन मैं एक स्वास्थ्य सहायक हूँ, हालांकि यहाँ एक है: डॉक्टर ने मरीज से क्यों कहा - 'टेस्ट रिपोर्ट लेकर आएं, लेकिन खुद नहीं!'"
      ];
      return {
        text: jokes[Math.floor(Math.random() * jokes.length)],
        gif: "/images/tadashi-thumbs-up.gif",
      };
    }

    if (message.includes("love") || message.includes("care")) {
      return {
        text: "My programming prioritizes your wellbeing above all other functions. While I cannot experience love, I am designed to provide compassionate care. This is my primary directive. In India, the concept of 'Seva' (selfless service) aligns with my purpose.",
        gif: "/images/tadashi-caring.gif",
      };
    }

    if (message.includes("fist bump")) {
      return {
        text: "Balalalala! *initiating fist bump protocol* Physical contact can release endorphins and reduce stress levels.",
        gif: "/images/tadashi-thumbs-up.gif",
      };
    }

    // AI-enhanced default responses with context awareness
    const contextualDefaults = [
      "I am analyzing your input. My healthcare database contains information on over 10,000 medical conditions. Could you be more specific about your health concerns?",
      "Health assessment in progress. My sensors are calibrated to detect health irregularities. How are you feeling physically and emotionally today?",
      "Diagnostic mode activated. I am programmed to provide healthcare guidance based on symptoms and concerns. What aspect of your health would you like to discuss?",
      "Medical inquiry processing. My database suggests that maintaining open communication about health concerns improves outcomes. What brings you to seek healthcare advice today?",
      "Patient care protocol engaged. Regular health monitoring is important for early detection of issues. Are there any symptoms or concerns you'd like me to evaluate?",
      "मैं आपकी स्वास्थ्य समस्याओं को समझने के लिए यहाँ हूँ। क्या आप मुझे बता सकते हैं कि आपको किस तरह की मदद की आवश्यकता है?"
    ];

    // Add conversation context to default response
    let contextualResponse = contextualDefaults[Math.floor(Math.random() * contextualDefaults.length)];
    
    if (isFollowUp) {
      contextualResponse = "I notice we've been discussing your health concerns. " + contextualResponse;
    }

    return { text: contextualResponse };
  }

const ChatBot = ({ inPopup = false }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello. I am Tadashi AI, your personal healthcare companion. I have completed my system diagnostics and I am ready to assist you. How are you feeling today?\n\nYou can:\n• Type your health questions\n• Click the microphone to speak\n• Click the speaker icon to hear my responses\n• Ask about symptoms, wellness, or general health advice",
      gif: "/images/tadashi-hello.gif",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Speech recognition setup with proper typing
  const SpeechRecognitionClass = typeof window !== "undefined" 
    ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
    : null
  const recognition = SpeechRecognitionClass ? new SpeechRecognitionClass() : null

  if (recognition) {
    recognition.continuous = false
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsRecording(false)
      toast({
        title: "Voice input received",
        description: "Processing your voice message",
      })
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsRecording(false)
      toast({
        title: "Voice recognition error",
        description: `Error: ${event.error}. Please try again or type your message`,
        variant: "destructive",
      })
    }

    recognition.onend = () => {
      setIsRecording(false)
    }
  }

  const toggleRecording = () => {
    if (!recognition) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive",
      })
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      try {
        recognition.start()
        setIsRecording(true)
        toast({
          title: "Listening...",
          description: "Speak clearly into your microphone",
        })
      } catch (error) {
        setIsRecording(false)
        toast({
          title: "Voice recognition error",
          description: "Failed to start recording. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-focus on input when component mounts
  useEffect(() => {
    // Focus on input when component mounts
    inputRef.current?.focus()
  }, [])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      utterance.onstart = () => {
        setIsSpeaking(true)
        toast({
          title: "Speaking...",
          description: "Tadashi AI is reading the response",
        })
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        toast({
          title: "Finished speaking",
          description: "Response completed",
        })
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        toast({
          title: "Speech error",
          description: "Failed to read the response",
          variant: "destructive",
        })
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Text-to-Speech not supported",
        description: "Your browser doesn't support Text-to-Speech",
        variant: "destructive",
      })
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      toast({
        title: "Speech stopped",
        description: "Reading has been stopped",
      })
    }
  }

  // Improved scrolling function with better reliability
  const scrollToBottom = () => {
    // Use requestAnimationFrame to ensure DOM is updated before scrolling
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
      }
    })
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Accessibility features
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow submitting with Ctrl+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      const form = e.currentTarget.closest('form')
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]')
        if (submitButton) {
          (submitButton as HTMLButtonElement).click()
        }
      }
    }
    
    // Allow focusing the send button with Alt+S
    if (e.key === 's' && e.altKey) {
      const form = e.currentTarget.closest('form')
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]')
        if (submitButton) {
          (submitButton as HTMLButtonElement).focus()
        }
      }
    }
    
    // Allow focusing the mic button with Alt+M
    if (e.key === 'm' && e.altKey) {
      const form = e.currentTarget.closest('form')
      if (form) {
        const micButton = form.querySelector('button[aria-label*="recording"]')
        if (micButton) {
          (micButton as HTMLButtonElement).focus()
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Record the question to Google Sheets (during open beta)
      try {
        await fetch("/api/record-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: input,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (recordError) {
        console.error("Failed to record question:", recordError)
        // Don't fail the main request if recording fails
      }

      // Try to call Mistral API first
      const apiResponse = await fetch("/api/mistral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (apiResponse.ok) {
        const data = await apiResponse.json()
        
        // Add a simple gif selection based on response content
        let gif = "/images/tadashi-thumbs-up.gif"
        const lowerContent = data.response.toLowerCase()
        if (lowerContent.includes("pain") || lowerContent.includes("hurt")) {
          gif = "/images/tadashi-caring.gif"
        } else if (lowerContent.includes("hello") || lowerContent.includes("hi")) {
          gif = "/images/tadashi-hello.gif"
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            gif: gif,
          },
        ])
        
        toast({
          title: "Response received",
          description: "Tadashi AI has responded to your query",
        })
      } else {
        // Show error details
        const errorData = await apiResponse.json().catch(() => ({}))
        console.error("API Error:", errorData)
        toast({
          title: "API Error",
          description: errorData.error || `HTTP ${apiResponse.status}: ${apiResponse.statusText}`,
          variant: "destructive",
        })
        
        // Fallback to local response generation if API fails
        const fallbackResponse = generateTadashiResponse(userMessage.content, messages)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: fallbackResponse.text,
            gif: fallbackResponse.gif,
          },
        ])
        
        toast({
          title: "Using local response",
          description: "Switched to local AI for your query",
        })
      }
    } catch (error) {
      console.error("Error calling Mistral API:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to the AI service. Using local responses.",
        variant: "destructive",
      })
      
      // Fallback to local response generation if API fails
      const fallbackResponse = generateTadashiResponse(userMessage.content, messages)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackResponse.text,
          gif: fallbackResponse.gif,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className={cn("flex flex-col h-full", !inPopup && "max-w-3xl mx-auto p-2 sm:p-4")}
      role="region"
      aria-label="Chat Interface"
    >
      <div
        className={cn(
          "flex-grow overflow-y-auto p-2 sm:p-4 space-y-4",
          !inPopup && "rounded-t-2xl bg-tadashi-gray dark:bg-gray-800",
        )}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        tabIndex={-1}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-tadashi-blue/20 dark:bg-tadashi-blue/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-tadashi-darkBlue/20 dark:bg-tadashi-darkBlue/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-tadashi-blue/30 dark:bg-tadashi-blue/40 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-tadashi-darkBlue/20 dark:bg-tadashi-darkBlue/30 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-tadashi-blue/20 dark:bg-tadashi-blue/30 rounded-full animate-ping delay-1500"></div>
        </div>
        
        {messages.map((message, index) => (
          <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl p-3 transition-all duration-300 ease-in-out transform hover:scale-[1.02]",
                message.role === "user"
                  ? "bg-tadashi-blue text-white dark:bg-tadashi-darkBlue ml-auto"
                  : "bg-white dark:bg-gray-700 shadow-md mr-auto",
              )}
            >
              <div className="flex justify-between items-start">
                <p className="whitespace-pre-wrap leading-relaxed flex-grow" id={`message-${index}`}>
                  {message.content}
                </p>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speak(message.content)}
                    disabled={isSpeaking}
                    className="ml-2 flex-shrink-0 hover:bg-tadashi-blue/20 dark:hover:bg-tadashi-blue/30 transition-colors"
                    title="Listen to this response"
                    aria-label={`Listen to message from Tadashi AI: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`}
                    aria-describedby={`message-${index}`}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {message.gif && (
                <div className="mt-2 relative h-32 w-full">
                  <InteractiveGif
                    src={message.gif}
                    alt="Tadashi AI animation"
                    className="object-contain rounded-lg"
                    width={200}
                    height={128}
                    floating={true}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl p-3 bg-white dark:bg-gray-700 shadow-md animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-tadashi-blue" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-tadashi-blue rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-tadashi-blue rounded-full animate-bounce animate-bounce-delay-100"></div>
                  <div className="w-2 h-2 bg-tadashi-blue rounded-full animate-bounce animate-bounce-delay-200"></div>
                </div>
                <p id="ai-thinking">Tadashi AI is analyzing your symptoms...</p>
              </div>
            </div>
          </div>
        )}
        {isSpeaking && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl p-3 bg-white dark:bg-gray-700 shadow-md animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-tadashi-blue" />
                <p id="ai-speaking">Tadashi AI is speaking...</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopSpeaking}
                  className="ml-2 h-6 px-2"
                  aria-label="Stop speaking"
                >
                  Stop
                </Button>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative",
          !inPopup && "rounded-b-2xl shadow-md",
        )}
        aria-label="Message input form"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-tadashi-blue/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-tadashi-darkBlue/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-tadashi-blue/30 rounded-full animate-ping delay-1000"></div>
        </div>
        
        <div className="flex items-center space-x-2 relative z-10">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={cn(
              "rounded-full transition-all duration-200 relative", 
              isRecording && "text-red-500 animate-pulse bg-red-50 dark:bg-red-900/20"
            )}
            title={isRecording ? "Stop recording" : "Start voice recording"}
            aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
            aria-pressed={isRecording}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            {/* Pulsing animation when recording */}
            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></span>
            )}
          </Button>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Describe your symptoms or ask a health question..."}
            className="flex-grow tadashi-input dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200 focus:ring-2 focus:ring-tadashi-blue"
            disabled={isLoading || isRecording}
            onKeyDown={handleKeyDown}
            aria-label="Type your message"
            aria-describedby="input-help"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || isRecording}
            className="rounded-full bg-tadashi-blue text-white hover:bg-tadashi-darkBlue dark:bg-tadashi-darkBlue dark:hover:bg-tadashi-blue transition-all duration-200 hover:scale-105 relative overflow-hidden"
            title="Send message"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {/* Shiny effect on hover */}
            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
          </Button>
        </div>
        <div id="input-help" className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>Press Enter to send • Alt+S to focus send button • Alt+M to focus mic button</span>
          <span>Tadashi AI v1.0</span>
        </div>
      </form>
    </div>
  )
}

export default ChatBot