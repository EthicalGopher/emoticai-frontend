"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext" // Assuming this context exists
import { useTheme } from "@/contexts/ThemeContext" // Assuming this context exists
import { Moon, Sun } from "lucide-react"

const Login = () => {
  const [username, setUsername] = useState("")
  const { login, logout, isGuest, setIsGuest, currentUser, setCurrentUser } = useAuth() // Added logout and guest handling
  const { isDarkMode, toggleTheme } = useTheme()
  const [chats, setChats] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim()) {
      login(username)
      if(currentUser.name !== username){
        alert("New account created. Previous data will be replaced.")
      }
    }
  }

  const loginAsGuest = () => {
    login("Guest");
    setIsGuest(true);
  }

  const handleCloseChat = (index) => {
    setChats(chats.filter((_, i) => i !== index));
  };

  useEffect(() => {
    //Cleanup on unmount or change of user
    return () => {
      if(isGuest) {
        logout();
      }
    };
  }, [isGuest, logout]);

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
            <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to start chatting with our AI assistant</p>
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
            <Button className="w-full mb-2" onClick={handleLogin}>
              Login with Name
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => loginAsGuest()}
            >
              Login as Guest
            </Button>
          </form>
          <div>
            {/* Simplified chat display */}
            {chats.map((chat, index) => (
              <div key={index} className="p-4 border rounded mb-2">
                <p>{chat}</p>
                <button onClick={() => handleCloseChat(index)}>Close</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login