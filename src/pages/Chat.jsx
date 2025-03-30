"use client"

import React, { useEffect, useRef, useState } from "react"
import { useChat } from "../contexts/ChatContext"
import { Sidebar } from "../components/Sidebar"
import { Header } from "../components/Header"
import ChatInput from "../components/ChatInput"
import ChatMessage from "../components/ChatMessage"
import { ScrollArea } from "../components/ui/scroll-area"

const Chat: React.FC = () => {
  const { messages, loading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
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

        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full py-4 px-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="mb-6">
                  <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-full border border-gray-200 dark:border-gray-700 shadow-md">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-12 w-12 text-helpingai-blue"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                      <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                      <path d="M19 11h2m-1 -1v2" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Welcome to HelpingAI</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md bg-gray-50 dark:bg-gray-800/30 p-5 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-md">
                  Start a conversation by typing a message below. You can also use the microphone button to speak or add
                  emojis to express yourself better.
                </p>
                <div className="mt-6 flex gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/30 rounded-lg p-3 flex gap-2 items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-all shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-5 w-5 text-blue-500 dark:text-blue-400"
                    >
                      <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2"></path>
                      <path d="M9 18a6 6 0 0 1 0 -12a3.5 3.5 0 0 0 0 7a3.5 3.5 0 0 1 0 7"></path>
                      <path d="M13 10.5c-.5 -1 -2.5 -1 -3 0"></path>
                    </svg>
                    <span className="text-sm">Type a message to start</span>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => <ChatMessage key={message.id} message={message} />)
            )}
            {loading && (
              <div className="px-4 py-4 flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-800/80 rounded-full px-5 py-2 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 shadow-md border border-gray-200 dark:border-gray-700/30">
                  <div className="flex space-x-1.5">
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