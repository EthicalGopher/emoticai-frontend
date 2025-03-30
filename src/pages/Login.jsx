"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Moon, Sun } from "lucide-react"

const Login = () => {
  const [username, setUsername] = useState("")
  const { login } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      login(username)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-helpingai-darkBg text-gray-900 dark:text-gray-100">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-helpingai-blue">HelpingAI</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to start chatting with our AI assistant</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-1"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-helpingai-blue hover:bg-helpingai-darkBlue"
              disabled={!username.trim()}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

