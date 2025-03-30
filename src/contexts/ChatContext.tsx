"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useToast } from "../hooks/use-toast"
import { nanoid } from "nanoid"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"

export type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: number
  chatId?: string // Associate messages with specific chats
}

type ChatContextType = {
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  loading: boolean
  deleteMessage: (id: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Check if localStorage is full
const isLocalStorageFull = () => {
  try {
    const testKey = `test_${Date.now()}`
    localStorage.setItem(testKey, "1")
    localStorage.removeItem(testKey)
    return false
  } catch (e) {
    return true
  }
}

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isStorageFull, setIsStorageFull] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load messages from localStorage
    const storedMessages = localStorage.getItem("helpingai_messages")
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages))
      } catch (error) {
        console.error("Failed to parse stored messages:", error)
        localStorage.removeItem("helpingai_messages")
      }
    }
  }, [])

  useEffect(() => {
    // Save messages to localStorage whenever they change
    try {
      localStorage.setItem("helpingai_messages", JSON.stringify(messages))
      setIsStorageFull(false)
    } catch (e) {
      console.warn("LocalStorage is full or unavailable:", e)
      setIsStorageFull(true)
    }
  }, [messages])

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
    toast({
      title: "Message deleted",
      description: "The message has been removed from your chat history.",
    })
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // Check if localStorage is full before adding new messages
    if (isLocalStorageFull()) {
      setIsStorageFull(true)
      toast({
        title: "Storage Full",
        description: "Please delete some messages to continue chatting.",
        variant: "destructive",
      })
      return
    }

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      content,
      isUser: true,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      // Make API request with proper error handling
      const response = await axios.get(`http://127.0.0.1:9045`, {
        params: { input: content },
        timeout: 10000, // 10-second timeout
      })

      // Add AI response
      const aiMessage: Message = {
        id: nanoid(),
        content: response.data || "I'm not sure how to respond to that.",
        isUser: false,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error fetching AI response:", error)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })

      // Add error message from AI
      const errorMessage: Message = {
        id: nanoid(),
        content: "Sorry, I encountered an error. Please try again later.",
        isUser: false,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem("helpingai_messages")
    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared.",
    })
  }

  return (
    <>
      <ChatContext.Provider value={{ messages, sendMessage, clearChat, loading, deleteMessage }}>
        {children}
      </ChatContext.Provider>
      {isStorageFull && (
        <StorageFullDialog messages={messages} setMessages={setMessages} onClose={() => setIsStorageFull(false)} />
      )}
    </>
  )
}

// Component to handle localStorage full scenario
const StorageFullDialog = ({
  messages,
  setMessages,
  onClose,
}: {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  onClose: () => void
}) => {
  const handleClearOldest = () => {
    // Remove oldest 5 messages
    if (messages.length > 5) {
      setMessages(messages.slice(5))
    } else {
      setMessages([])
    }
    onClose()
  }

  const handleClearAll = () => {
    setMessages([])
    localStorage.removeItem("helpingai_messages")
    onClose()
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-blue-400">Storage Full</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            Your local storage is full. To continue chatting, you need to delete some messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClearOldest} className="bg-blue-600 hover:bg-blue-700">
            Clear Oldest Messages
          </AlertDialogAction>
          <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
            Clear All Messages
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

