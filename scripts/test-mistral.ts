// Simple test to verify Mistral API is working
const apiKey = "L1Jnjozk76gUwpy2ZPqZgH8wXuK5biZr";

async function testMistralAPI() {
  try {
    console.log('Testing Mistral API with key:', apiKey.substring(0, 5) + '...')
    
    const systemInstruction = `
      You are Tadashi AI, a personal healthcare companion. Your responses should be:
      1. Helpful and informative about general wellness
      2. Compassionate and supportive in tone
      3. Clear about not providing medical diagnosis
      4. Focused on general health advice and wellness tips
      5. Formatted in a clear, readable way with bullet points where appropriate
      
      If asked about serious medical conditions, remind the user to consult with a healthcare professional.
    `
    
    const response = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-tiny",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: "Hello, how are you?" }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    )
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Mistral API error:', errorText)
      return
    }
    
    const data = await response.json()
    console.log('Success! Response:', data.choices?.[0]?.message?.content)
  } catch (error) {
    console.error('Error testing Mistral API:', error)
  }
}

testMistralAPI()