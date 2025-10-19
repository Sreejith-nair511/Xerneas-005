import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Add a system instruction to guide Gemini's responses for health-related queries
    const systemInstruction = `
      You are Baymax, a personal healthcare companion. Your responses should be:
      1. Helpful and informative about general wellness
      2. Compassionate and supportive in tone
      3. Clear about not providing medical diagnosis
      4. Focused on general health advice and wellness tips
      5. Formatted in a clear, readable way with bullet points where appropriate
      
      If asked about serious medical conditions, remind the user to consult with a healthcare professional.
    `

    const enhancedPrompt = `${systemInstruction}\n\nUser query: ${prompt}`

    console.log("Calling Gemini API with prompt:", enhancedPrompt.substring(0, 100) + "...")

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: enhancedPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: "Error from Gemini API", details: errorData }, { status: response.status })
    }

    const data = await response.json()

    // Extract the text from the response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    if (!responseText) {
      return NextResponse.json({ error: "No response from Gemini", needsFallback: true }, { status: 200 })
    }

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return NextResponse.json({ error: "Failed to process request", needsFallback: true }, { status: 500 })
  }
}
