
import { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Moon, Sun, LogOut, X } from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = ({ open, onClose }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { clearChat, messages, chats, currentChatId, switchChat, createNewChat } = useChat();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!user) {
        localStorage.clear();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [user]);

  const getDisplayName = () => {
    return user?.name || 'Guest';
  };

  const handleCreateNewChat = () => {
    createNewChat();
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleClearChat = (chatId) => {
    clearChat(chatId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background border-r">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-primary">HelpingAI</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center p-4 border-y">
        <div className="flex-1">
          <p className="text-sm font-medium">{getDisplayName()}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        <Button
          className="w-full justify-start gap-2"
          variant="outline"
          onClick={handleCreateNewChat}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
              chat.id === currentChatId
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted"
            }`}
            onClick={() => switchChat(chat.id)}
          >
            <span className="flex-1 truncate">{chat.title || "New Chat"}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (window.confirm('Are you sure you want to delete this chat?')) {
                  clearChat(chat.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
