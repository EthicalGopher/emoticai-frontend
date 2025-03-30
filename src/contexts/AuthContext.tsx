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
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage.  This is redundant with the useState above but kept for completeness
    const storedUser = localStorage.getItem("helpingai_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.clear();
    }
  }, []);

  const getDisplayName = () => {
    return user ? user.name : "Guest"
  }

  const loginAsGuest = () => {
    setIsGuest(true);
    setUser({ name: 'Guest' });
    localStorage.setItem('user', JSON.stringify({name: 'Guest'})); //Store guest user
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

    setIsGuest(false);
    const newUser = { name: username };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setIsGuest(false); // added to reset guest status on logout
  }

  useEffect(() => {
    if (isGuest) {
      window.addEventListener('beforeunload', () => {
        localStorage.clear();
      });
    }
    return () => {
      window.removeEventListener('beforeunload', () => localStorage.clear())
    }
  }, [isGuest]);

  return (
    <AuthContext.Provider value={{ user, login, loginAsGuest, logout, isAuthenticated: !!user, isGuest }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}