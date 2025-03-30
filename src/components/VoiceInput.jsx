
import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        onTranscript(transcript)

        if (event.results[0].isFinal) {
          // Stop listening after final result
          recognitionInstance.stop()
          setIsListening(false)
          
          toast({
            title: "Voice Input Completed",
            description: "Your speech has been converted to text.",
          })
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        
        toast({
          title: "Voice Input Error",
          description: event.error === 'not-allowed' 
            ? "Microphone access denied. Please allow microphone access to use voice input."
            : `Error: ${event.error}`,
          variant: "destructive"
        })
      }

      setRecognition(recognitionInstance)
    } else {
      console.error('Speech recognition not supported')
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please try Chrome or Edge.",
        variant: "destructive"
      })
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
      
      toast({
        title: "Voice Input Stopped",
        description: "Voice recording has been stopped."
      })
    } else {
      recognition.start()
      setIsListening(true)

      toast({
        title: "Voice Input Active",
        description: "Speak now. Recording will stop automatically when you pause."
      })
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`rounded-full p-2 ${isListening ? 'bg-red-200 dark:bg-red-800' : ''}`}
      onClick={toggleListening}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  )
}

export default VoiceInput
