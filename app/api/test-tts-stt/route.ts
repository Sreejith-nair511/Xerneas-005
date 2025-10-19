import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = findUserByEmail(email)
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error("Error testing TTS/STT:", error)
    return NextResponse.json({ error: "Failed to test TTS/STT" }, { status: 500 })
  }
}