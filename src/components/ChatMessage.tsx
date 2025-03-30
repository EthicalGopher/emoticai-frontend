import React from "react"
import { cn } from "../lib/utils"
import type { Message } from "../contexts/ChatContext"
import { Bot, User } from "lucide-react"
import MessageActions from "./MessageActions"

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { isUser, content, id } = message

  return (
    <div className={cn("flex w-full px-4 py-2 gap-4 animate-fade-in group", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex gap-3 max-w-[85%] md:max-w-[75%]", isUser ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0 shadow-lg",
            isUser ? "bg-helpingai-blue text-white shadow-blue-500/30" : "bg-gray-800 text-gray-300 shadow-gray-900/30",
          )}
        >
          <div className="relative">{isUser ? <User size={16} /> : <Bot size={16} />}</div>
        </div>

        <div className="flex flex-col gap-1">
          <div
            className={cn(
              "rounded-2xl p-4 text-sm md:text-base break-words shadow-md backdrop-blur-md relative group",
              isUser
                ? "bg-gradient-to-br from-helpingai-blue/90 to-helpingai-blue/70 text-white rounded-tr-none border border-helpingai-blue/40"
                : "bg-gradient-to-br from-gray-800/90 to-gray-700/70 text-gray-200 rounded-tl-none border border-gray-700/40",
            )}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br rounded-2xl opacity-10 blur-sm -z-10"
              style={{
                background: isUser
                  ? "radial-gradient(circle at top right, rgba(59, 130, 246, 0.3), transparent 70%)"
                  : "radial-gradient(circle at top left, rgba(75, 85, 99, 0.3), transparent 70%)",
              }}
            />

            <div className="relative">{content}</div>

            <div className={cn("absolute top-2", isUser ? "left-2" : "right-2")}>
              <MessageActions messageId={id} content={content} />
            </div>
          </div>

          <div className={cn("text-xs text-gray-400 px-2", isUser ? "text-right" : "text-left")}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
