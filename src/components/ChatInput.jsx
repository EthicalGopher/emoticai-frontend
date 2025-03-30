import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "@/components/ui/use-toast";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const { sendMessage, loading } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto">
      <div className="flex items-end gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Waiting for response..." : "Type a message..."}
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={!input.trim() || loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      {loading && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          AI is thinking...
        </div>
      )}
    </form>
  );
};

export default ChatInput;