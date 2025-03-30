
import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  name: string
  createdAt: number
  lastActive: number
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
    return savedUser ? JSON.parse(savedUser) : null
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

  // Handle guest user cleanup on refresh
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

  const loginAsGuest = () => {
    const guestUser = { 
      name: 'Guest',
      createdAt: Date.now(),
      lastActive: Date.now()
    }
    setUser(guestUser)
    setIsGuest(true)
    localStorage.setItem('user', JSON.stringify(guestUser))
  }

  const login = (username: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const existingUser = users.find((u: User) => u.name === username)
    
    if (!existingUser) {
      const newUser = {
        name: username,
        createdAt: Date.now(),
        lastActive: Date.now()
      }
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      toast({
        title: "New Account Created",
        description: "Welcome! Your account has been created.",
      })
    } else {
      existingUser.lastActive = Date.now()
      localStorage.setItem('users', JSON.stringify(users))
    }

    setIsGuest(false)
    setUser(existingUser || { name: username, createdAt: Date.now(), lastActive: Date.now() })
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    setIsGuest(false)
    localStorage.removeItem('user')
    if (isGuest) {
      localStorage.removeItem('guestData')
    }
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
