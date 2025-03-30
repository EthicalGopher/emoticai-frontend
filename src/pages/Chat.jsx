
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/ChatContext";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import { useAuth } from "@/contexts/AuthContext";

const Chat = () => {
  const { messages, loading } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className={`${sidebarOpen ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" : "hidden md:block"}`}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      </div>
      <div className="relative flex flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-hidden relative pt-16">
          <ScrollArea className="h-full px-4">
            <div className="max-w-3xl mx-auto py-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {loading && (
                <div className="flex justify-center">
                  <div className="animate-pulse text-muted-foreground">AI is thinking...</div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Chat;
