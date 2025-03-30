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

  return isAuthenticated ? <Chat /> : <Login />
}

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default Index

