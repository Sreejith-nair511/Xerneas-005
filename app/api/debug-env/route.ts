import { type NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  // Check if .env.local file exists
  const envPath = path.join(process.cwd(), '.env.local')
  const envFileExists = fs.existsSync(envPath)
  
  // Try to read the file content
  let envFileContent = ''
  if (envFileExists) {
    try {
      envFileContent = fs.readFileSync(envPath, 'utf8')
    } catch (error) {
      envFileContent = `Error reading file: ${error}`
    }
  }
  
  // Check environment variables
  const envVars = {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_TEST: process.env.NEXT_PUBLIC_TEST,
  }
  
  return NextResponse.json({
    envFileExists,
    envFileContent,
    envVars,
    cwd: process.cwd(),
  })
}