import { type NextRequest, NextResponse } from "next/server"
import { initDB } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    initDB()
    return NextResponse.json({ 
      message: "Database initialized successfully",
      status: "success",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      { 
        error: "Failed to initialize database",
        message: error instanceof Error ? error.message : "Unknown error",
        status: "error"
      },
      { status: 500 }
    )
  }
}