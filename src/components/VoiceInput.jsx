"use client"
import React, { useState, useEffect } from "react"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "../hooks/use-toast"

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        onTranscript(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive"
        })
      }

      setRecognition(recognition)
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      })
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
    setIsListening(!isListening)
  }

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-full transition-all ${
        isListening
          ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
      }`}
      title="Voice input"
    >
      {isListening ? (
        <div className="relative">
          <MicOff size={20} className="animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
      ) : (
        <Mic size={20} />
      )}
    </button>
  )
}

export default VoiceInput