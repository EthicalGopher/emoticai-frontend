"use client"

import React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type User = {
  username: string
}

type AuthContextType = {
  user: User | null
  login: (username: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("helpingai_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Clear localStorage if not logged in
      localStorage.clear()
    }
  }, [])

  const getDisplayName = () => {
    return user ? user.username : "Guest"
  }

  const login = (username: string) => {
    const newUser = { username }
    setUser(newUser)
    localStorage.setItem("helpingai_user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("helpingai_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

