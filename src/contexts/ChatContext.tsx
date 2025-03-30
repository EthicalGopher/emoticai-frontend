"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useToast } from "../hooks/use-toast"
import { nanoid } from "nanoid"
import { useAuth } from "./AuthContext"
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
  chatId: string
}

type Chat = {
  id: string
  title: string
  messages: Message[]
}

type ChatContextType = {
  chats: Chat[]
  currentChatId: string
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  clearChat: (chatId: string) => void
  deleteAllChats: () => void
  loading: boolean
  deleteMessage: (id: string) => void
  createNewChat: () => void
  switchChat: (chatId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([]) // Added messages state
  const [loading, setLoading] = useState(false)
  const [isStorageFull, setIsStorageFull] = useState(false)
  const { toast } = useToast()
  const { user, isGuest } = useAuth()

  useEffect(() => {
    if (!user) return

    const storageKey = isGuest ? "guestData" : `userData_${user.name}`
    const savedData = localStorage.getItem(storageKey)

    if (savedData) {
      const parsedData = JSON.parse(savedData)
      if (parsedData.chats) setChats(parsedData.chats)
      if (parsedData.messages) setMessages(parsedData.messages)
      if (parsedData.currentChatId) {
        setCurrentChatId(parsedData.currentChatId)
      } else if (parsedData.chats && parsedData.chats.length > 0) {
        setCurrentChatId(parsedData.chats[0].id)
      }
    } else {
      createNewChat()
    }
  }, [user, isGuest])

  useEffect(() => {
    if (!user) return

    const storageKey = isGuest ? "guestData" : `userData_${user.name}`
    const userData = {
      chats,
      messages,
      currentChatId
    }

    localStorage.setItem(storageKey, JSON.stringify(userData))
  }, [chats, messages, currentChatId, user, isGuest])

  const createNewChat = () => {
    const date = new Date()
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    const newChat = {
      id: nanoid(),
      title: `Chat - ${formattedDate}`,
      messages: [],
    }
    setChats(prev => [...prev, newChat])
    setCurrentChatId(newChat.id)
  }

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const messagesForCurrentChat = chats.find(chat => chat.id === currentChatId)?.messages || []
  setMessages(messagesForCurrentChat); // Update messages state

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: nanoid(),
      content,
      isUser: true,
      timestamp: Date.now(),
      chatId: currentChatId,
    }

    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    )

    setLoading(true)

    try {
      const response = await axios.post("/api/chat", { message: content })

      const botMessage: Message = {
        id: nanoid(),
        content: response.data.message,
        isUser: false,
        timestamp: Date.now(),
        chatId: currentChatId,
      }

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        )
      )

      if (messagesForCurrentChat.length === 0) {
        setChats(prev =>
          prev.map(chat =>
            chat.id === currentChatId
              ? { ...chat, title: content.slice(0, 10) + (content.length > 10 ? "..." : "") }
              : chat
          )
        )
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: nanoid(),
        content: "Sorry, there was an error processing your message.",
        isUser: false,
        timestamp: Date.now(),
        chatId: currentChatId,
      }
      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const clearChat = (chatId: string) => {
    const chatIdToDelete = chatId || currentChatId

    // Remove chat from chats
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatIdToDelete))

    // Update current chat ID if we're deleting the current one
    if (chatIdToDelete === currentChatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatIdToDelete)
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id)
      } else {
        // This was the last chat, create a new one
        createNewChat()
      }
    }
    toast({
      title: "Chat deleted",
      description: "The selected chat has been removed.",
    })
  }

  const deleteAllChats = () => {
    const initialChat = {
      id: nanoid(),
      title: "New Chat",
      messages: [],
    }
    setChats([initialChat])
    setCurrentChatId(initialChat.id)
    setMessages([]); // Clear messages
    toast({
      title: "All chats deleted",
      description: "All chat history has been cleared.",
    })
  }

  const deleteMessage = (messageId: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: chat.messages.filter(msg => msg.id !== messageId) }
          : chat
      )
    )
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        messages,
        sendMessage,
        clearChat,
        deleteAllChats,
        loading,
        deleteMessage,
        createNewChat,
        switchChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}