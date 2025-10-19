import { createUser } from "../lib/db"
import { sendWelcomeEmail } from "../lib/email"

async function createTestUser() {
  try {
    // Check if database exists and initialize if not
    const fs = require('fs')
    const path = require('path')
    
    const dbPath = path.join(process.cwd(), 'data', 'database.json')
    if (!fs.existsSync(dbPath)) {
      const dataDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      
      const initialData = { users: [] }
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2))
      console.log("Database initialized")
    }
    
    // Create test user
    const user = createUser({
      email: "test@example.com",
      password: "password123",
      name: "Test User"
    })
    
    console.log("Test user created:", user)
    
    // Send welcome email
    await sendWelcomeEmail(user.email, user.name)
    console.log("Welcome email sent")
  } catch (error: any) {
    if (error.message === "User with this email already exists") {
      console.log("Test user already exists")
    } else {
      console.error("Error creating test user:", error)
    }
  }
}

createTestUser()