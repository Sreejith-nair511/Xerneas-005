import { type NextRequest, NextResponse } from "next/server"
import { initDB, findUserByEmail, createUser } from "@/lib/db"

export const dynamic = 'force-dynamic' // Ensure this route is always dynamic

export async function GET(req: NextRequest) {
  try {
    // Initialize database
    initDB()
    
    return NextResponse.json({ 
      status: "success",
      message: "Database initialized successfully",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json({ 
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Initialize database
    initDB()
    
    // Try to create a test user
    const testUser = createUser({
      email: "test@example.com",
      password: "testpassword",
      name: "Test User"
    })
    
    return NextResponse.json({ 
      status: "success",
      message: "Database test completed successfully",
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json({ 
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}