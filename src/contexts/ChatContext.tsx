"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { toast } from "@/components/ui/use-toast"

export type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: number
  chatId: string
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}

export interface ChatContextType {
  chats: Chat[]
  activeChat: Chat | null
  createChat: () => void
  setActiveChat: (chat: Chat | null) => void
  addMessage: (message: Message) => void
  updateChatTitle: (id: string, title: string) => void
  deleteChat: (id: string) => void
  clearChats: () => void
  deleteMessage: (messageId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isGuest } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [currentChatId, setCurrentChatId] = useState<string>("")

  // Load chats from localStorage based on current user
  useEffect(() => {
    if (user) {
      const storageKey = isGuest ? 'guestChats' : `chats_${user.name}`
      const savedChats = localStorage.getItem(storageKey)
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats)
        setChats(parsedChats)

        // Set the most recent chat as active if it exists
        if (parsedChats.length > 0) {
          setActiveChat(parsedChats[0])
        } else {
          setActiveChat(null)
        }
      } else {
        setChats([])
        setActiveChat(null)
      }
    } else {
      setChats([])
      setActiveChat(null)
    }
  }, [user, isGuest])

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (user) {
      const storageKey = isGuest ? 'guestChats' : `chats_${user.name}`
      localStorage.setItem(storageKey, JSON.stringify(chats))
    }
  }, [chats, user, isGuest])

  const createChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now()
    }

    setChats(prevChats => [newChat, ...prevChats])
    setActiveChat(newChat)
  }

  const addMessage = (message: Message) => {
    if (!activeChat) return

    // Update messages in active chat
    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, message]
    }

    // Update title after first user message if still default
    let chatWithTitle = updatedChat
    if (updatedChat.title === 'New Chat' && message.isUser) {
      // Use first 25 chars of message as title or full message if shorter
      const newTitle = message.content.length > 25 
        ? `${message.content.substring(0, 25)}...`
        : message.content

      chatWithTitle = {
        ...updatedChat,
        title: newTitle
      }
    }

    // Update active chat
    setActiveChat(chatWithTitle)

    // Update chats array
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat.id ? chatWithTitle : chat
      )
    )
  }

  const updateChatTitle = (id: string, title: string) => {
    const updatedChats = chats.map(chat => 
      chat.id === id ? { ...chat, title } : chat
    )

    setChats(updatedChats)

    if (activeChat && activeChat.id === id) {
      setActiveChat({ ...activeChat, title })
    }
  }

  const deleteChat = (id: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== id)
    setChats(updatedChats)

    // Save updated chats to localStorage
    if (user) {
      const storageKey = isGuest ? 'guestChats' : `chats_${user.name}`
      localStorage.setItem(storageKey, JSON.stringify(updatedChats))
    }

    // Update active chat if the deleted chat was active
    if (activeChat && activeChat.id === id) {
      setActiveChat(updatedChats.length > 0 ? updatedChats[0] : null)
    }

    // Confirm deletion with toast
    toast({
      title: "Chat deleted",
      description: "The chat has been permanently removed.",
      variant: "destructive"
    });
  }

  const clearChats = () => {
    setChats([])
    setActiveChat(null)

    if (user) {
      const storageKey = isGuest ? 'guestChats' : `chats_${user.name}`
      localStorage.removeItem(storageKey)
    }
  }

  const deleteMessage = (messageId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: chat.messages.filter((msg) => msg.id !== messageId) }
          : chat
      )
    )
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        createChat,
        setActiveChat,
        addMessage,
        updateChatTitle,
        deleteChat,
        clearChats,
        deleteMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}