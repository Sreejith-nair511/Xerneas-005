import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { question, language, languageName, timestamp } = await req.json()

    if (!question) {
      return NextResponse.json({ 
        error: "Question is required",
        status: "error"
      }, { status: 400 })
    }

    // Only record questions during open beta
    const isBeta = process.env.OPEN_BETA === "true"
    if (!isBeta) {
      return NextResponse.json({ 
        message: "Question recording only active during open beta",
        status: "success"
      })
    }

    // Log the question for now - Google Sheets integration can be added later
    console.log("User question recorded:", {
      timestamp: timestamp || new Date().toISOString(),
      question,
      language: language || "en-US",
      languageName: languageName || "English",
      userAgent: req.headers.get("user-agent") || "Unknown",
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown"
    })

    // In a future implementation, we would integrate with Google Sheets here
    // For now, we'll just log the question

    return NextResponse.json({ 
      message: "Question recorded successfully",
      status: "success"
    })
  } catch (error) {
    console.error("Error recording question:", error)
    return NextResponse.json({ 
      error: "Failed to record question",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "error"
    }, { status: 500 })
  }
}