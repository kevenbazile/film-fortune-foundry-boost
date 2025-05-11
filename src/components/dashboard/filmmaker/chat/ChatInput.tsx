
import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInputProps } from './types';

export const ChatInput = ({ 
  input, 
  setInput, 
  handleSendMessage, 
  isLoading,
  isAgentChat
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isAgentChat ? "Message support agent..." : "Ask me anything..."}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          size="icon"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      {isAgentChat && (
        <p className="text-xs text-muted-foreground mt-2">
          You're now chatting with a support agent. Response times may vary.
        </p>
      )}
    </div>
  );
};
