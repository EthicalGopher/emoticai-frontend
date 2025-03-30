
import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  name: string
  createdAt: number
  lastActive: number
  isGuest?: boolean
}

interface AuthContextType {
  user: User | null
  login: (username: string) => void
  loginAsGuest: () => void
  logout: () => void
  isAuthenticated: boolean
  isGuest: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      if (parsedUser.isGuest) {
        // Don't restore guest users on page load
        return null
      }
      return parsedUser
    }
    return null
  })
  const [isGuest, setIsGuest] = useState(false)

  // Clean up inactive users (10 days)
  useEffect(() => {
    const cleanupInactiveUsers = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const tenDaysAgo = Date.now() - (10 * 24 * 60 * 60 * 1000)
      const activeUsers = users.filter((u: User) => u.lastActive > tenDaysAgo)
      localStorage.setItem('users', JSON.stringify(activeUsers))
    }
    cleanupInactiveUsers()
  }, [])

  // Handle guest user cleanup on refresh or navigation
  useEffect(() => {
    if (isGuest) {
      const handleBeforeUnload = () => {
        localStorage.removeItem('guestData')
        localStorage.removeItem('user')
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isGuest])

  const login = (username: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const existingUser = users.find((u: User) => u.name === username)
    
    let currentUser: User
    
    if (!existingUser) {
      alert('You have created a new account!')
      currentUser = {
        name: username,
        createdAt: Date.now(),
        lastActive: Date.now(),
        isGuest: false
      }
      users.push(currentUser)
      localStorage.setItem('users', JSON.stringify(users))
    } else {
      existingUser.lastActive = Date.now()
      currentUser = existingUser
      localStorage.setItem('users', JSON.stringify(users))
    }

    setIsGuest(false)
    setUser(currentUser)
    localStorage.setItem('user', JSON.stringify(currentUser))
  }

  const loginAsGuest = () => {
    const guestUser = { 
      name: 'Guest',
      createdAt: Date.now(),
      lastActive: Date.now(),
      isGuest: true
    }
    setUser(guestUser)
    setIsGuest(true)
    localStorage.setItem('user', JSON.stringify(guestUser))
    // Clear any existing guest data
    localStorage.removeItem('guestData')
  }

  const logout = () => {
    if (isGuest) {
      localStorage.removeItem('guestData')
    }
    localStorage.removeItem('user')
    setUser(null)
    setIsGuest(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginAsGuest, 
      logout, 
      isAuthenticated: !!user,
      isGuest 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
