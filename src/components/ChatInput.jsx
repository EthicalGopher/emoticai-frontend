
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import VoiceInput from './VoiceInput'

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Handle voice transcript
  const handleVoiceTranscript = (transcript) => {
    if (transcript && transcript.trim()) {
      setMessage(prev => {
        // If there's existing text, add a space before the transcript
        const prefix = prev && prev.trim() ? prev.trim() + ' ' : '';
        return prefix + transcript.trim();
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t bg-background dark:border-gray-800">
      <div className="relative flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] w-full resize-none rounded-md border border-input bg-background p-3 pr-12"
          disabled={isLoading}
        />
        <div className="absolute right-3 bottom-3">
          <VoiceInput onTranscript={handleVoiceTranscript} />
        </div>
      </div>
      <Button 
        type="submit" 
        size="icon" 
        className="h-[60px] w-[60px] rounded-full"
        disabled={!message.trim() || isLoading}
      >
        <Send size={20} />
      </Button>
    </form>
  )
}

export default ChatInput
