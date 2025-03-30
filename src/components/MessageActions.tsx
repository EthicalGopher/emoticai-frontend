"use client"

import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { MoreHorizontal, Trash, Copy, Share } from "lucide-react"
import { useChat } from "../contexts/ChatContext"
import { useToast } from "../hooks/use-toast"

interface MessageActionsProps {
  messageId: string
  content: string
}

const MessageActions: React.FC<MessageActionsProps> = ({ messageId, content }) => {
  const { deleteMessage } = useChat()
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          text: content,
          title: "Shared from HelpingAI",
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      handleCopy()
      toast({
        title: "Shared",
        description: "Message copied to clipboard (share API not available)",
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-700/50">
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 bg-gray-800 border border-gray-700 shadow-lg">
        <div className="flex flex-col py-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <Copy size={14} />
            <span>Copy text</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <Share size={14} />
            <span>Share</span>
          </button>
          <button
            onClick={() => deleteMessage(messageId)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
          >
            <Trash size={14} />
            <span>Delete</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MessageActions

