import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/ChatContext";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";

const Chat = () => {
  const { messages, loading } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen relative bg-gradient-to-b from-gray-900 to-gray-800">
      <div className={`${sidebarOpen ? 'fixed inset-0 z-50 bg-background' : 'hidden md:block'}`}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </Header>
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