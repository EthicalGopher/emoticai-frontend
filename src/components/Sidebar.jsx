import { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Moon, Sun, LogOut, X, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {MessageSquare, User} from "lucide-react"


const Sidebar = ({ open, onClose }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { clearChat, messages, chats, currentChatId, switchChat, createNewChat, loading, deleteAllChats } = useChat(); 
  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(null); 


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
    setIsDeleting(chatId); 
    setTimeout(() => {
      clearChat(chatId);
      setIsDeleting(null); 

      if (window.innerWidth < 768) {
        onClose();
      }
    }, 500); 
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r shadow-lg transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">HelpingAI</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* User info and theme toggle */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User size={20} />
              <span className="font-medium">{getDisplayName()}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>

        {/* Chat navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <Button
            onClick={handleCreateNewChat}
            className="mb-2 w-full justify-start"
            variant="outline"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>

          {/* Chat list */}
          <div className="space-y-1">
            {Object.keys(chats)
              .sort(
                (a, b) =>
                  (chats[b].createdAt || 0) - (chats[a].createdAt || 0)
              )
              .map((chatId) => (
                <div
                  key={chatId}
                  onClick={!loading ? () => switchChat(chatId) : null}
                  className={`group flex items-center justify-between rounded px-2 py-1.5 cursor-pointer ${
                    chatId === currentChatId
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  } ${
                    isDeleting === chatId ? "opacity-50" : ""
                  } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  <div className="flex items-center truncate">
                    <MessageSquare
                      size={16}
                      className="mr-2 shrink-0 text-muted-foreground"
                    />
                    <span className="truncate text-sm">
                      {chats[chatId].title || "New Chat"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearChat(chatId);
                    }}
                    disabled={loading}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t p-4">
          <div className="space-y-2">
            <Button
              onClick={deleteAllChats}
              variant="destructive"
              className="w-full justify-start"
              disabled={loading}
            >
              <Trash size={16} className="mr-2" />
              Clear All Chats
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="w-full justify-start"
              disabled={loading}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;