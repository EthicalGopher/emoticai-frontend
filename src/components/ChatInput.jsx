import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "@/components/ui/use-toast";
import VoiceInput from "./VoiceInput"; // Added import for VoiceInput component

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage("");
    } else {
      toast({
        title: "Error",
        description: "Please enter a message",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-center",
        style: {
          minWidth: "200px",
          textAlign: "center"
        }
      });
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setMessage(transcript);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex gap-2 max-w-2xl mx-auto">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <div className="flex flex-col gap-2"> {/* Added div for vertical stacking */}
          <VoiceInput onTranscript={handleVoiceTranscript} /> {/* Added VoiceInput component */}
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;