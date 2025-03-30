import { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = ({ open, onClose }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { clearChat, messages, chats, currentChatId, switchChat, createNewChat } = useChat();
  const { user, logout } = useAuth();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="flex h-full flex-col bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4">
          <div className="text-xl font-bold text-blue-400">HelpingAI</div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex items-center p-4 border-b border-gray-800">
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
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
                className={`w-full justify-start ${chat.id === currentChatId ? 'bg-blue-600' : ''}`}
                variant="ghost"
                onClick={() => switchChat(chat.id)}
              >
                {chat.title.substring(0, 10)}...
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
      </div>
    </div>
  );
};

export default Sidebar;