
import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  disabled: boolean;
  onSend: () => void;
  showWarning?: boolean;
  warningText?: string;
}

export function ChatInput({
  input,
  setInput,
  isLoading,
  disabled,
  onSend,
  showWarning = false,
  warningText = 'You must claim this chat before you can respond.'
}: ChatInputProps) {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && onSend()}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isLoading || disabled}
        />
        <Button 
          onClick={onSend} 
          disabled={isLoading || !input.trim() || disabled}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="ml-2">Send</span>
        </Button>
      </div>
      {showWarning && (
        <p className="text-xs text-amber-500 mt-2">
          {warningText}
        </p>
      )}
    </div>
  );
}
