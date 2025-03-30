
import React, { useState, useEffect } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "./ui/button"

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onTranscript(transcript)
        setIsListening(false)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    }
    
    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser')
      return
    }
    
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={`ml-2 ${isListening ? 'text-red-500' : ''}`}
      onClick={toggleListening}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
    </Button>
  )
}

export default VoiceInput
