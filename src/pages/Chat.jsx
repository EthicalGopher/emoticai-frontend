"use client"

import React, { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/contexts/ChatContext"
import ChatInput from "@/components/ChatInput"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"

const Chat = () => {
  const { messages, loading } = useChat()
  const messagesEndRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-white dark:bg-helpingai-darkBg text-gray-900 dark:text-gray-100">
      <div
        className={`fixed inset-y-0 left-0 z-50 md:relative md:z-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center px-4 py-3">
            <Header toggleSidebar={toggleSidebar} />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {messages.map((message, index) => (
              <div key={index} className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-4">
                  <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-[pulse_1.5s_ease-in-out_0s_infinite]"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-[pulse_1.5s_ease-in-out_0.2s_infinite]"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-[pulse_1.5s_ease-in-out_0.4s_infinite]"></div>
                  </div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>
        <ChatInput />
      </div>
    </div>
  )
}

export default Chat