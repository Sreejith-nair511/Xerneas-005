// Temporary in-memory user storage for when database is disabled
// This is for development/testing purposes only

interface User {
  id: string;
  email: string;
  password: string; // In a real app, this should be hashed
  name: string;
  isPremium: boolean;
  createdAt: string;
}

// In-memory user storage
let users: User[] = [];

// Initialize with some test users if needed
export const initTempUserStore = () => {
  console.log('Initializing temporary user store');
  // Optionally add a default test user
  if (users.length === 0) {
    users = [
      {
        id: 'test-user-1',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        isPremium: false,
        createdAt: new Date().toISOString()
      }
    ];
    console.log('Added default test user');
  }
};

// Find a user by email
export const findUserByEmail = (email: string): User | undefined => {
  console.log(`Searching for user with email: ${email}`);
  const user = users.find(user => user.email === email);
  if (user) {
    console.log(`User found with email: ${email}`);
  } else {
    console.log(`No user found with email: ${email}`);
  }
  return user;
};

// Find a user by ID
export const findUserById = (id: string): User | undefined => {
  console.log(`Searching for user with ID: ${id}`);
  const user = users.find(user => user.id === id);
  if (user) {
    console.log(`User found with ID: ${id}`);
  } else {
    console.log(`No user found with ID: ${id}`);
  }
  return user;
};

// Create a new user
export const createUser = (userData: Omit<User, 'id' | 'isPremium' | 'createdAt'>): User => {
  console.log(`Creating new user with email: ${userData.email}`);
  
  // Check if user already exists
  if (findUserByEmail(userData.email)) {
    throw new Error('User with this email already exists');
  }
  
  const newUser: User = {
    id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    email: userData.email,
    password: userData.password, // In a real app, this should be hashed
    name: userData.name,
    isPremium: false,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  console.log(`New user created with ID: ${newUser.id}`);
  return newUser;
};

// Update user premium status
export const updateUserPremiumStatus = (userId: string, isPremium: boolean): User | null => {
  console.log(`Updating premium status for user ${userId} to: ${isPremium}`);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    console.log(`No user found with ID: ${userId} for premium status update`);
    return null;
  }
  
  users[userIndex].isPremium = isPremium;
  console.log(`User ${userId} premium status updated to: ${isPremium}`);
  return users[userIndex];
};

// Clear all users (for testing purposes)
export const clearAllUsers = () => {
  users = [];
  console.log('All users cleared from temporary store');
};

// Get all users (for debugging purposes)
export const getAllUsers = (): User[] => {
  return [...users]; // Return a copy to prevent direct modification
};