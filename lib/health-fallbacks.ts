type HealthFallback = {
  keywords: string[]
  response: string
}

// Define fallback responses for common health-related keywords
export const healthFallbacks: HealthFallback[] = [
  {
    keywords: ["stress", "anxiety", "worried", "nervous", "tension"],
    response: `Here are some stress management techniques that might help:

• Deep breathing: Try the 4-7-8 technique (inhale for 4 seconds, hold for 7, exhale for 8)
• Regular physical activity: Even a 10-minute walk can reduce stress
• Mindfulness meditation: Focus on the present moment without judgment
• Adequate sleep: Aim for 7-9 hours of quality sleep each night
• Limit caffeine and alcohol: These can worsen anxiety and affect sleep
• Connect with others: Social support is crucial for mental wellbeing

Remember that persistent stress may benefit from professional support. Consider speaking with a healthcare provider if your stress is significantly affecting your daily life.`,
  },
  {
    keywords: ["sleep", "insomnia", "tired", "fatigue", "exhausted", "rest"],
    response: `Here are some tips to improve your sleep quality:

• Maintain a consistent sleep schedule, even on weekends
• Create a relaxing bedtime routine (reading, warm bath, gentle stretching)
• Make your bedroom cool, dark, and quiet
• Avoid screens 1-2 hours before bedtime (blue light can disrupt melatonin)
• Limit caffeine after noon and avoid large meals before bedtime
• Regular exercise can help, but try to finish workouts at least 3 hours before sleep
• Consider relaxation techniques like deep breathing or progressive muscle relaxation

If sleep problems persist for more than a few weeks, consider consulting with a healthcare provider.`,
  },
  {
    keywords: ["headache", "migraine", "head pain", "head ache"],
    response: `For headache management, consider these approaches:

• Stay hydrated: Dehydration is a common headache trigger
• Take breaks from screens and check if you need vision correction
• Practice stress reduction techniques like deep breathing or gentle stretching
• Ensure you're getting adequate sleep on a regular schedule
• Over-the-counter pain relievers may help (follow package instructions)
• Apply a cold or warm compress to your head or neck
• Consider tracking potential triggers (certain foods, stress, sleep changes)

If headaches are severe, persistent, or accompanied by other symptoms, please consult a healthcare professional.`,
  },
  {
    keywords: ["diet", "nutrition", "eating", "food", "weight", "healthy eating"],
    response: `Here are some general healthy eating guidelines:

• Emphasize whole foods: fruits, vegetables, whole grains, lean proteins
• Stay hydrated: aim for 8 glasses of water daily
• Limit processed foods, added sugars, and excessive salt
• Practice portion awareness rather than strict calorie counting
• Include a variety of colorful fruits and vegetables daily
• Consider the 80/20 approach: nutritious choices 80% of the time, flexibility 20%
• Eat mindfully: slow down and pay attention to hunger and fullness cues

Remember that nutrition needs vary by individual. Consider consulting with a registered dietitian for personalized advice.`,
  },
  {
    keywords: ["exercise", "workout", "fitness", "active", "physical activity"],
    response: `Here are some exercise recommendations for overall health:

• Aim for at least 150 minutes of moderate activity weekly (or 75 minutes vigorous)
• Include strength training 2-3 times per week for major muscle groups
• Find activities you enjoy - this increases consistency
• Start gradually if you're new to exercise (even 5-10 minutes counts)
• Include flexibility and balance exercises, especially as you age
• Break up sitting time with short movement breaks throughout the day
• Remember that consistency matters more than intensity

Always check with your healthcare provider before starting a new exercise program, especially if you have existing health conditions.`,
  },
  {
    keywords: ["cold", "flu", "fever", "cough", "congestion", "sick"],
    response: `For managing cold and flu symptoms:

• Rest and get plenty of sleep to help your immune system
• Stay hydrated with water, clear broths, or warm liquids
• Use a humidifier or take steamy showers to ease congestion
• Over-the-counter medications may help relieve symptoms (follow package instructions)
• Gargle with salt water to soothe a sore throat
• Wash hands frequently to prevent spreading illness
• Consider wearing a mask around others if you're coughing or sneezing

See a healthcare provider if you have a very high fever, difficulty breathing, symptoms that worsen after improving, or symptoms that don't improve after 10 days.`,
  },
  {
    keywords: ["back pain", "neck pain", "muscle pain", "joint pain", "ache"],
    response: `For managing muscle and joint pain:

• Apply ice for acute pain (first 48-72 hours) and heat for chronic pain
• Gentle stretching and movement (avoid prolonged bed rest)
• Maintain good posture, especially when sitting for long periods
• Consider ergonomic adjustments to your workspace
• Over-the-counter pain relievers may provide temporary relief
• Gentle strengthening exercises can help prevent future pain
• Low-impact activities like walking, swimming, or cycling are often well-tolerated

If pain is severe, worsening, or accompanied by other symptoms like numbness or weakness, please consult a healthcare professional.`,
  },
  {
    keywords: ["mental health", "depression", "mood", "sad", "emotional"],
    response: `For supporting mental wellbeing:

• Establish daily routines that include activities you enjoy
• Stay connected with supportive friends and family
• Regular physical activity can significantly improve mood
• Practice mindfulness or meditation to stay present
• Ensure adequate sleep and nutrition
• Limit alcohol and avoid recreational drugs
• Consider journaling to process thoughts and feelings

Remember that mental health is just as important as physical health. If you're experiencing persistent low mood, loss of interest, or thoughts of harming yourself, please reach out to a mental health professional or crisis support line immediately.`,
  },
]

// Function to find the best matching fallback response based on keywords
export function findFallbackResponse(prompt: string): string {
  prompt = prompt.toLowerCase()

  // Default response if no keywords match
  const defaultResponse = `I'm here to help with your health concerns. To provide better guidance, could you share more specific details about:

• Your symptoms or health concerns
• How long you've been experiencing them
• Any factors that seem to make them better or worse
• Your general health habits (sleep, exercise, nutrition)

Remember that while I can offer general wellness information, I'm not a replacement for professional medical care. Please consult a healthcare provider for proper diagnosis and treatment.`

  // Find the fallback with the most keyword matches
  let bestMatch: HealthFallback | null = null
  let highestMatchCount = 0

  for (const fallback of healthFallbacks) {
    const matchCount = fallback.keywords.filter((keyword) => prompt.includes(keyword.toLowerCase())).length
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount
      bestMatch = fallback
    }
  }

  return bestMatch ? bestMatch.response : defaultResponse
}
