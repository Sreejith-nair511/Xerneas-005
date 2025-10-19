import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const apiKey = process.env.MISTRAL_API_KEY
  
  return NextResponse.json({
    apiKeyExists: !!apiKey,
    apiKeyPreview: apiKey ? apiKey.substring(0, 5) + "..." : null,
    apiKeyLength: apiKey ? apiKey.length : 0
  })
}