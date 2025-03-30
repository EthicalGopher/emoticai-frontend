import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Plus, Trash2, Moon, Sun } from "lucide-react";

const Sidebar = ({ open, onClose }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { clearChat, messages } = useChat();
  const [chats, setChats] = useState([{ id: "1", title: "Current Chat", timestamp: Date.now() }]);
  const [activeChat, setActiveChat] = useState("1");

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `New Chat ${chats.length + 1}`,
      timestamp: Date.now(),
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    clearChat();
  };

  const handleClearChat = () => {
    clearChat();
    onClose?.();
  };

  return (
    <div className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-blue-400">HelpingAI</div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        <Button
          onClick={createNewChat}
          className="w-full bg-helpingai-blue hover:bg-helpingai-darkBlue flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
        <Button
          onClick={handleClearChat}
          variant="destructive"
          className="w-full flex items-center gap-2"
        >
          <Trash2 size={16} />
          <span>Clear Chat</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
              activeChat === chat.id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            {chat.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;