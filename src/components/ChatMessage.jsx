import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useChat } from "@/contexts/ChatContext";

const ChatMessage = ({ message }) => {
  const { deleteMessage } = useChat();
  const isUser = message.role === "user";
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(!isUser);

  // Typing animation effect for AI messages
  useEffect(() => {
    if (isUser) {
      setDisplayText(message.content);
      return;
    }

    let index = 0;
    setDisplayText("");
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < message.content.length) {
        setDisplayText(prev => prev + message.content.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15); // Adjust speed here

    return () => clearInterval(interval);
  }, [message.content, isUser]);

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isUser ? "bg-muted/50" : "bg-muted"
      )}
    >
      <Avatar className="h-8 w-8">
        {isUser ? (
          <>
            <AvatarImage src="/user-avatar.png" alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/bot-avatar.png" alt="Bot" />
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="font-medium">{isUser ? "You" : "AI Assistant"}</div>
        <div className="whitespace-pre-wrap">
          {displayText}
          {isTyping && <span className="animate-pulse ml-1">▋</span>}
        </div>
      </div>
      {isUser && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-70 hover:opacity-100"
          onClick={() => {
            if (window.confirm("Delete this message?")) {
              deleteMessage(message.id);
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ChatMessage;