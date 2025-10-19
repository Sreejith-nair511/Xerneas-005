import { type NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email || !name) {
      return NextResponse.json({ 
        error: "Email and name are required",
        status: "error"
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        status: "error"
      }, { status: 400 })
    }

    const result = await sendWelcomeEmail(email, name)
    
    return NextResponse.json({
      ...result,
      status: "success",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ 
      error: "Failed to send test email",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "error"
    }, { status: 500 })
  }
}