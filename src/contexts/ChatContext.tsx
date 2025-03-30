
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
  loading: boolean
  deleteMessage: (id: string) => void
  createNewChat: () => void
  switchChat: (chatId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [isStorageFull, setIsStorageFull] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedChats = localStorage.getItem("helpingai_chats")
    const storedCurrentChatId = localStorage.getItem("helpingai_current_chat_id")
    
    if (storedChats) {
      try {
        const parsedChats = JSON.parse(storedChats)
        setChats(parsedChats)
        if (storedCurrentChatId && parsedChats.some(chat => chat.id === storedCurrentChatId)) {
          setCurrentChatId(storedCurrentChatId)
        } else if (parsedChats.length > 0) {
          setCurrentChatId(parsedChats[0].id)
        }
      } catch (error) {
        console.error("Failed to parse stored chats:", error)
      }
    } else {
      const initialChat = {
        id: nanoid(),
        title: "New Chat",
        messages: []
      }
      setChats([initialChat])
      setCurrentChatId(initialChat.id)
      localStorage.setItem("helpingai_chats", JSON.stringify([initialChat]))
      localStorage.setItem("helpingai_current_chat_id", initialChat.id)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("helpingai_chats", JSON.stringify(chats))
      setIsStorageFull(false)
    } catch (e) {
      console.warn("LocalStorage is full:", e)
      setIsStorageFull(true)
      toast({
        title: "Storage Full",
        description: "Please delete some chats to continue.",
        variant: "destructive"
      })
    }
  }, [chats])

  const createNewChat = () => {
    const newChat = {
      id: nanoid(),
      title: "New Chat",
      messages: []
    }
    setChats(prev => [...prev, newChat])
    setCurrentChatId(newChat.id)
  }

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId)
    localStorage.setItem("helpingai_current_chat_id", chatId)
  }

  const messages = chats.find(chat => chat.id === currentChatId)?.messages || []

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: nanoid(),
      content,
      isUser: true,
      timestamp: Date.now(),
      chatId: currentChatId
    }

    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ))

    setLoading(true)

    try {
      // Your API call here
      const response = await axios.post("/api/chat", { message: content })
      
      const botMessage: Message = {
        id: nanoid(),
        content: response.data.message,
        isUser: false,
        timestamp: Date.now(),
        chatId: currentChatId
      }

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, botMessage] }
          : chat
      ))

      // Update chat title if it's the first message
      if (messages.length === 0) {
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, title: content.slice(0, 10) + (content.length > 10 ? "..." : "") }
            : chat
        ))
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: nanoid(),
        content: "Sorry, there was an error processing your message.",
        isUser: false,
        timestamp: Date.now(),
        chatId: currentChatId
      }
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      ))
    } finally {
      setLoading(false)
    }
  }

  const clearChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId)
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id)
      } else {
        createNewChat()
      }
    }
    toast({
      title: "Chat deleted",
      description: "The selected chat has been removed.",
    })
  }

  const deleteMessage = (messageId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: chat.messages.filter(msg => msg.id !== messageId) }
        : chat
    ))
  }

  return (
    <ChatContext.Provider 
      value={{ 
        chats, 
        currentChatId, 
        messages, 
        sendMessage, 
        clearChat, 
        loading, 
        deleteMessage,
        createNewChat,
        switchChat
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
