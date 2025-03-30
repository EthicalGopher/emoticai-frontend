import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from "../hooks/use-toast"

interface User {
  name: string
  createdAt: number
  lastActive: number
  isGuest: boolean
}

type AuthContextType = {
  user: User | null
  login: (username: string) => void
  loginAsGuest: () => void
  logout: () => void
  isAuthenticated: boolean
  isGuest: boolean
  setIsGuest: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      // If guest user was saved, but page was refreshed, clear everything
      if (parsedUser.isGuest) {
        localStorage.removeItem('user')
        localStorage.removeItem('guestChats')
        return null
      }
      return parsedUser
    }
    return null
  })
  const [isGuest, setIsGuest] = useState(false)

  // Initialize user state with stored user data (if any)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      // Only save non-guest users to localStorage for persistence
      if (!user.isGuest) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

// Load user from localStorage on initial load
useEffect(() => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user");
    }
  }
}, []);


  // Clean up inactive users (10 days)
  useEffect(() => {
    const cleanupInactiveUsers = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const tenDaysAgo = Date.now() - 10 * 24 * 60 * 60 * 1000
      const activeUsers = users.filter((u: User) => u.lastActive > tenDaysAgo)

      if (users.length !== activeUsers.length) {
        localStorage.setItem('users', JSON.stringify(activeUsers))
        toast({
          title: "Inactive Accounts Removed",
          description: "Accounts inactive for over 10 days have been removed.",
        })
      }
    }

    cleanupInactiveUsers()
  }, [toast])

  // Handle guest user cleanup on page unload
  useEffect(() => {
    if (isGuest) {
      const handleBeforeUnload = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('guestChats')
      }

      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [isGuest])

  const login = (username: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const existingUser = users.find((u: User) => u.name === username)

    if (!existingUser) {
      const newUser = {
        name: username,
        createdAt: Date.now(),
        lastActive: Date.now(),
        isGuest: false
      }
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      setUser(newUser)

      toast({
        title: "New Account Created",
        description: "Welcome! Your account has been created."
      })
    } else {
      existingUser.lastActive = Date.now()
      localStorage.setItem('users', JSON.stringify(users))
      setUser(existingUser)
    }

    setIsGuest(false)
    localStorage.setItem('user', JSON.stringify(existingUser || {
      name: username,
      createdAt: Date.now(),
      lastActive: Date.now(),
      isGuest: false
    }))
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
  }

  const logout = () => {
    if (isGuest) {
      localStorage.removeItem('guestChats')
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
      isGuest,
      setIsGuest
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}