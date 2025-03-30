// c:\Users\sankh\Downloads\emoticaimain\src\pages\Index.tsx
"use client"

import React from "react"
import { AuthProvider, useAuth } from "../contexts/AuthContext"
import { ThemeProvider } from "../contexts/ThemeContext"
import { ChatProvider } from "../contexts/ChatContext"
import Login from "./Login"
import Chat from "./Chat"

// App component that uses auth context to determine what to render
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <ThemeProvider> {/* Wrap Chat or Login in ThemeProvider */}
      {isAuthenticated ? <Chat /> : <Login />}
    </ThemeProvider>
  )
}

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  )
}

export default Index
