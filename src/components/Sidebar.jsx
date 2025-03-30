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
    const handleBeforeUnload = (e) => {
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

  return (
    <div className={`fixed inset-0 z-50 w-full md:w-64 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:inset-y-0 md:left-0`}>
      <div className="flex h-full flex-col bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4">
          <div className="text-xl font-bold text-blue-400">HelpingAI</div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex items-center p-4 border-b border-gray-800">
          <div className="flex-1">
            <p className="text-sm font-medium">{getDisplayName()}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <Button 
              className="w-full justify-start gap-2" 
              variant="ghost"
              onClick={createNewChat}
            >
              <Plus className="h-5 w-5" />
              New Chat
            </Button>

            {chats.map((chat) => (
              <Button
                key={chat.id}
                className={`w-full justify-start text-left ${chat.id === currentChatId ? 'bg-primary text-primary-foreground' : ''}`}
                variant="ghost"
                onClick={() => switchChat(chat.id)}
              >
                {chat.title.length > 20 ? `${chat.title.substring(0, 20)}...` : chat.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <Button 
            className="w-full justify-start gap-2" 
            variant="ghost"
            onClick={clearChat}
          >
            <Trash2 className="h-5 w-5" />
            Clear Chats
          </Button>
        </div>
        <Button 
          className="absolute top-2 right-2 md:hidden" 
          variant="ghost" 
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;