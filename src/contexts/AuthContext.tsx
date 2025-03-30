"use client"

import React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from 'react-hot-toast';

type User = {
  name: string
}

type AuthContextType = {
  user: User | null
  login: (username: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    // Check if user is logged in from localStorage.  This is redundant with the useState above but kept for completeness
    const storedUser = localStorage.getItem("helpingai_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getDisplayName = () => {
    return user ? user.name : ""
  }

  const login = async (username: string) => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const oldUser = JSON.parse(savedUser);
      if (oldUser.name !== username) {
        toast({
          title: "New Account Created",
          description: "Your data has been reset for the new account.",
        });
        localStorage.clear();
      }
    }

    const newUser = { name: username };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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