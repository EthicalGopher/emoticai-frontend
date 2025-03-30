"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Moon, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [username, setUsername] = useState("")
  const { login, loginAsGuest } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim()) {
      login(username)
      navigate("/chat")
    }
  }

  const handleGuestLogin = () => {
    loginAsGuest()
    navigate("/chat")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-gray-900 dark:text-gray-100">
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
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to start chatting with our AI assistant
            </p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-1"
              />
            </div>
            <Button className="w-full mb-2" type="submit">
              Login with Name
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGuestLogin}
              type="button"
            >
              Login as Guest
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login