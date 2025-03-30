"use client"
import React from "react"
import { useState, useEffect } from "react"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "../hooks/use-toast"

import { SpeechRecognition } from "react-speech-recognition"



const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const { toast } = useToast()
  const recognitionRef = React.useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if Web Speech API is supported
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsSupported(false)
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser does not support voice input.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    // Cleanup recognition instance on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    setIsListening(true)

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      const current = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")

      setTranscript(current)
    }

    recognition.onerror = (event) => {
      toast({
        title: "Error",
        description: `Voice recognition error: ${event.error}`,
        variant: "destructive",
      })
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (transcript) {
        onTranscript(transcript)
        setTranscript("")
      }
    }

    recognition.start()
    recognitionRef.current = recognition

    toast({
      title: "Listening",
      description: "Speak now...",
    })
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      if (transcript) {
        onTranscript(transcript)
        setTranscript("")
      }
    }
    setIsListening(false)
  }

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-full transition-all ${
        isListening
          ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
      }`}
      disabled={!isSupported}
      title={isSupported ? "Voice input" : "Voice input not supported"}
      aria-label={isSupported ? "Voice input" : "Voice input not supported"}
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

