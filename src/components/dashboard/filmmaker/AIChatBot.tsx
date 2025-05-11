
import React, { useState, useEffect, useRef } from 'react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Bot, Minimize2, Maximize2, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface AIChatBotProps {
  userId: string;
  isMinimized?: boolean;
}

export const AIChatBot = ({ userId, isMinimized: initialMinimized = true }: AIChatBotProps) => {
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    isInitialized,
    initializeModel,
    sendMessage
  } = useAIAssistant();

  // Initialize model when chat is opened
  useEffect(() => {
    if (!isMinimized && !isInitialized) {
      initializeModel();
    }
  }, [isMinimized, isInitialized, initializeModel]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[90vw] bg-white rounded-lg shadow-xl overflow-hidden border z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">AI Assistant</span>
        </div>
        <Button
          onClick={() => setIsMinimized(true)}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-primary/20"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          if (message.role === 'system') {
            return (
              <div key={index} className="text-center">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {message.content}
                </span>
              </div>
            );
          }
          
          if (message.role === 'suggestions') {
            return (
              <div key={index} className="w-full space-y-2">
                <p className="text-xs text-muted-foreground">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions?.map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            );
          }
          
          return (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-3 py-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
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
      </div>
    </div>
  );
};
