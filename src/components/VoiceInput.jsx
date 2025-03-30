
import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { useToast } from '@/hooks/use-toast'

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const { toast } = useToast()
  const { toast } = useToast()

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        // Only send transcript if it's a final result
        if (event.results[0].isFinal) {
          onTranscript(transcript)

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
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive"
        })
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      })
    }

    // Cleanup
    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [onTranscript, toast])

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
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </Button>
  )
}

export default VoiceInput
