
import React from "react";
import { useChat } from "@/contexts/ChatContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Plus, Trash2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Sidebar = ({ open, onClose }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { chats, currentChatId, clearChat, createNewChat, switchChat } = useChat();

  return (
    <div className={`w-64 h-screen bg-background border-r flex flex-col ${open ? '' : 'hidden md:flex'}`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-blue-400">HelpingAI</div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        <Button
          onClick={createNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <div key={chat.id} className="flex items-center gap-2 mb-2">
            <button
              onClick={() => switchChat(chat.id)}
              className={`flex-1 text-left p-3 rounded-lg transition-colors ${
                currentChatId === chat.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              {chat.title || "New Chat"}
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this chat? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => clearChat(chat.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
