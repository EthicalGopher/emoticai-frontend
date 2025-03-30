import React, { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Send, Mic, MicOff, Smile } from "lucide-react"
import { useChat } from "../contexts/ChatContext"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const EMOJI_LIST = [
  "😊", "😂", "❤️", "👍", "👋", "🙌", "🎉", "🔥", "✨", "🤔", "👀", "🚀", "💯", "🤖"
]

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("")
  const { sendMessage } = useChat()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(message)
      setMessage("")
    }
  }

  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
    textareaRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" type="button">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 grid grid-cols-7 gap-1 p-2">
            {EMOJI_LIST.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="hover:bg-muted rounded p-1"
              >
                {emoji}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-h-[50px] max-h-[200px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />

        <Button type="submit" disabled={!message.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}

export default ChatInput