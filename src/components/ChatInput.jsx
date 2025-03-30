"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Send, Mic, MicOff, Smile } from "lucide-react"
import { useChat } from "../contexts/ChatContext"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const EMOJI_LIST = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "👋",
  "🙌",
  "🎉",
  "🔥",
  "✨",
  "🤔",
  "👀",
  "🚀",
  "💯",
  "🤖",
  "👾",
  "🤓",
  "😎",
  "👏",
  "🌟",
  "💡",
]

const ChatInput= () => {
  const [input, setInput] = useState("")
  const { sendMessage, loading } = useChat()
  const textareaRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() && !loading) {
      await sendMessage(input)
      setInput("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    try {
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()

        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInput((prev) => prev + " " + transcript.trim())
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.start()
        setIsListening(true)
      } else {
        console.error("Speech recognition not supported in this browser")
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error)
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-800 bg-helpingai-darkBg p-4 flex justify-center">
      <div className="relative flex items-center max-w-3xl w-full gap-3">
        <div className="relative flex-1 flex items-center">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="min-h-[50px] max-h-[150px] resize-none bg-gray-800/50 border-gray-700 focus-visible:ring-1 focus-visible:ring-helpingai-blue text-gray-100 pr-16"
            disabled={loading}
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full hover:bg-gray-700/70 text-gray-400 hover:text-gray-200"
                >
                  <Smile size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 bg-gray-800 border-gray-700">
                <div className="grid grid-cols-5 gap-2">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="text-xl p-2 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={toggleSpeechRecognition}
              className={`h-8 w-8 rounded-full hover:bg-gray-700/70 ${
                isListening ? "text-helpingai-blue bg-gray-700/50" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          size="icon"
          className="bg-helpingai-blue hover:bg-helpingai-darkBlue h-[50px] w-[50px] rounded-full flex-shrink-0 shadow-md transition-all duration-200"
          disabled={loading || !input.trim()}
        >
          <Send size={20} />
        </Button>
      </div>
    </form>
  )
}

export default ChatInput

