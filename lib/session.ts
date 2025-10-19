// Simple session management using localStorage
// In a real app, you would use cookies or JWT tokens

export const setSession = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const getSession = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
  }
}

export const isAuthenticated = () => {
  const user = getSession()
  return !!user
}