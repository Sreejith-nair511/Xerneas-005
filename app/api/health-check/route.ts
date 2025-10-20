import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Check if required environment variables are present
    const hasMistralKey = !!process.env.MISTRAL_API_KEY
    const hasEmailHost = !!process.env.EMAIL_HOST
    const hasEmailUser = !!process.env.EMAIL_USER
    
    // Get the base URL
    const baseUrl = req.nextUrl.origin
    
    return NextResponse.json({ 
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV || "development",
        hasMistralKey,
        hasEmailHost,
        hasEmailUser,
      },
      endpoints: {
        mistral: `${baseUrl}/api/mistral`,
        initDb: `${baseUrl}/api/init-db`,
        testEnv: `${baseUrl}/api/test-env`,
      }
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json({ 
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}