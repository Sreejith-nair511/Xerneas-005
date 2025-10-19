import fs from 'fs'
import path from 'path'
import { 
  findUserByEmail as tempFindUserByEmail,
  findUserById as tempFindUserById,
  createUser as tempCreateUser,
  updateUserPremiumStatus as tempUpdateUserPremiumStatus,
  initTempUserStore
} from '@/lib/temp-user-store'

// Check if database is enabled via environment variable
const isDatabaseEnabled = process.env.ENABLE_DATABASE !== 'false'

// Define the User type
export interface User {
  id: string
  email: string
  password: string // In a real app, this should be hashed
  name: string
  isPremium: boolean
  createdAt: string
}

// Define the database structure
interface Database {
  users: User[]
}

// Get the database file path
const getDbPath = () => {
  // This function should only be called on the server side
  if (typeof window !== 'undefined') {
    throw new Error('Database operations are not available in the browser')
  }
  const dbPath = path.join(process.cwd(), 'data', 'database.json')
  console.log('Database path:', dbPath)
  return dbPath
}

// Initialize the database
export const initDB = () => {
  // If database is disabled, use temporary storage
  if (!isDatabaseEnabled) {
    console.log('Database is disabled, initializing temporary user store')
    initTempUserStore()
    return
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    console.warn('initDB called in browser environment, skipping')
    return
  }
  
  try {
    const dbPath = getDbPath()
    const dataDir = path.join(process.cwd(), 'data')
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      console.log('Creating data directory')
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Create database file if it doesn't exist
    if (!fs.existsSync(dbPath)) {
      console.log('Creating initial database file')
      const initialData: Database = { users: [] }
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2))
    }
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw new Error(`Failed to initialize database: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Read the database
const readDB = (): Database => {
  // If database is disabled, return empty database
  if (!isDatabaseEnabled) {
    return { users: [] }
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error('Database operations are not available in the browser')
  }
  
  try {
    const dbPath = getDbPath()
    
    // Initialize database if it doesn't exist
    if (!fs.existsSync(dbPath)) {
      console.log('Database file not found, initializing')
      initDB()
    }
    
    const data = fs.readFileSync(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)
    console.log(`Database read successfully. Found ${parsedData.users.length} users.`)
    return parsedData
  } catch (error) {
    console.error('Error reading database:', error)
    throw new Error(`Failed to read database: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Write to the database
const writeDB = (data: Database) => {
  // If database is disabled, do nothing
  if (!isDatabaseEnabled) {
    return
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error('Database operations are not available in the browser')
  }
  
  try {
    const dbPath = getDbPath()
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
    console.log('Database written successfully')
  } catch (error) {
    console.error('Error writing to database:', error)
    throw new Error(`Failed to write to database: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Find a user by email
export const findUserByEmail = (email: string): User | undefined => {
  // If database is disabled, use temporary storage
  if (!isDatabaseEnabled) {
    return tempFindUserByEmail(email)
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error('Database operations are not available in the browser')
  }
  
  try {
    const db = readDB()
    const user = db.users.find(user => user.email === email)
    if (user) {
      console.log(`User found with email: ${email}`)
    } else {
      console.log(`No user found with email: ${email}`)
    }
    return user
  } catch (error) {
    console.error('Error finding user by email:', error)
    throw new Error(`Failed to find user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Find a user by ID
export const findUserById = (id: string): User | undefined => {
  // If database is disabled, use temporary storage
  if (!isDatabaseEnabled) {
    return tempFindUserById(id)
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error('Database operations are not available in the browser')
  }
  
  try {
    const db = readDB()
    const user = db.users.find(user => user.id === id)
    if (user) {
      console.log(`User found with ID: ${id}`)
    } else {
      console.log(`No user found with ID: ${id}`)
    }
    return user
  } catch (error) {
    console.error('Error finding user by ID:', error)
    throw new Error(`Failed to find user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Create a new user
export const createUser = (userData: Omit<User, 'id' | 'isPremium' | 'createdAt'>): User => {
  // If database is disabled, use temporary storage
  if (!isDatabaseEnabled) {
    return tempCreateUser(userData)
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error('Database operations are not available in the browser')
  }
  
  try {
    const db = readDB()
    
    // Check if user already exists
    if (findUserByEmail(userData.email)) {
      throw new Error('User with this email already exists')
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      email: userData.email,
      password: userData.password, // In a real app, this should be hashed
      name: userData.name,
      isPremium: false,
      createdAt: new Date().toISOString()
    }
    
    db.users.push(newUser)
    writeDB(db)
    
    console.log(`New user created with ID: ${newUser.id}`)
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error // Re-throw to let the caller handle it
  }
}

// Update user premium status
export const updateUserPremiumStatus = (userId: string, isPremium: boolean): User | null => {
  // If database is disabled, use temporary storage
  if (!isDatabaseEnabled) {
    return tempUpdateUserPremiumStatus(userId, isPremium)
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error('Database operations are not available in the browser')
  }
  
  try {
    const db = readDB()
    const userIndex = db.users.findIndex(user => user.id === userId)
    
    if (userIndex === -1) {
      console.log(`No user found with ID: ${userId} for premium status update`)
      return null
    }
    
    db.users[userIndex].isPremium = isPremium
    writeDB(db)
    
    console.log(`User ${userId} premium status updated to: ${isPremium}`)
    return db.users[userIndex]
  } catch (error) {
    console.error('Error updating user premium status:', error)
    throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}