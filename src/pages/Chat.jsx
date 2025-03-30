import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/ChatContext";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { useAuth } from "@/contexts/AuthContext"; // Added import for authentication context

const Chat = () => {
  const { messages, loading } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth(); // Added user context

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className={`${sidebarOpen ? "fixed inset-0 z-50 bg-background" : "hidden md:block"}`}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} /> {/* Passed user prop */}
      </div>
      <div className="relative flex flex-1 flex-col">
        <div className="absolute top-0 left-0 right-0 z-10 bg-gray-100 dark:bg-gray-900 shadow-md">
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full px-4">
            <div className="max-w-3xl mx-auto py-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {loading && (
                <div className="flex justify-center">
                  <div className="animate-pulse text-gray-400">AI is thinking...</div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;