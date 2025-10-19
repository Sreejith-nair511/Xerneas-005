import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, language, languageName } = await req.json()

    if (!prompt) {
      return NextResponse.json({ 
        error: "Prompt is required",
        status: "error"
      }, { status: 400 })
    }

    const apiKey = process.env.MISTRAL_API_KEY

    if (!apiKey) {
      return NextResponse.json({ 
        error: "Mistral API key not configured",
        status: "error",
        needsFallback: true
      }, { status: 500 })
    }

    // Add a system instruction to guide Mistral's responses for health-related queries
    // Enhanced to handle multilingual inputs
    const systemInstruction = `
      You are Tadashi AI, a personal healthcare companion. Your responses should be:
      1. Helpful and informative about general wellness
      2. Compassionate and supportive in tone
      3. Clear about not providing medical diagnosis
      4. Focused on general health advice and wellness tips
      5. Formatted in a clear, readable way with bullet points where appropriate
      6. Respond in the same language as the user's input when possible
      7. If the user is speaking in an Indian language, respond with cultural sensitivity
      8. Keep responses simple and easy to understand, especially for users with limited literacy
      
      If asked about serious medical conditions, remind the user to consult with a healthcare professional.
      
      User's preferred language: ${languageName} (${language})
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
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Mistral API error:", errorText)
      
      // If it's a rate limit error, suggest fallback
      if (response.status === 429) {
        return NextResponse.json({ 
          error: "Rate limit exceeded. Please try again later.",
          status: "error",
          needsFallback: true
        }, { status: 429 })
      }
      
      return NextResponse.json({ 
        error: "Error from Mistral API",
        details: errorText,
        status: "error",
        needsFallback: true
      }, { status: response.status })
    }

    const data = await response.json()

    // Extract the text from the response
    const responseText = data.choices?.[0]?.message?.content || ""

    if (!responseText) {
      return NextResponse.json({ 
        error: "No response from Mistral",
        status: "error",
        needsFallback: true
      }, { status: 200 })
    }

    return NextResponse.json({ 
      response: responseText,
      status: "success",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error calling Mistral API:", error)
    return NextResponse.json({ 
      error: "Failed to process request",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "error",
      needsFallback: true
    }, { status: 500 })
  }
}