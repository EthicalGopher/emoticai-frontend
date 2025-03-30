"use client"

import  React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Eraser, Plus, MessageSquare, User } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useChat } from "@/contexts/ChatContext"
import { useAuth } from "@/contexts/AuthContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// interface Chat {
//   id: string
//   title: string
//   timestamp: number
// }

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const { clearChat, messages } = useChat()
  const { user, logout } = useAuth()
  const [chats, setChats] = useState([{ id: "1", title: "Current Chat", timestamp: Date.now() }])
  const [activeChat, setActiveChat] = useState("1")

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `New Chat ${chats.length + 1}`,
      timestamp: Date.now(),
    }
    setChats([newChat, ...chats])
    setActiveChat(newChat.id)
    clearChat()
  }

  const selectChat = (chatId) => {
    setActiveChat(chatId)
    // In a real app, you would load the messages for this chat
  }

  return (
    <div className="w-64 h-screen bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4">
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">HelpingAI</div>
        <Button
          onClick={createNewChat}
          className="w-full bg-helpingai-blue hover:bg-helpingai-darkBlue mb-2 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={activeChat === chat.id ? "secondary" : "ghost"}
              className={`w-full justify-start text-left ${
                activeChat === chat.id ? "bg-gray-200 dark:bg-gray-800" : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
              onClick={() => selectChat(chat.id)}
            >
              <MessageSquare size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <Eraser size={16} className="mr-2" />
                <span>Clear Conversations</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900 dark:text-blue-400">Clear Chat History</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                  This will permanently delete all your messages. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={clearChat} className="bg-red-600 hover:bg-red-700">
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" className="w-full justify-start text-left" onClick={toggleTheme}>
            {isDarkMode ? (
              <>
                <Sun size={16} className="mr-2" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={16} className="mr-2" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>

          <Separator className="my-2" />

          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-helpingai-blue flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <div className="flex-1 truncate text-sm font-medium">{user?.username || "User"}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-log-out"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

