
import React from 'react';
import { Users } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChatMessagesProps } from './types';

export const ChatMessages = ({ messages, isLoading, messagesEndRef }: ChatMessagesProps) => {
  return (
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
                    onClick={() => window.dispatchEvent(new CustomEvent('set-chat-input', { 
                      detail: { value: suggestion } 
                    }))}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          );
        }
        
        if (message.role === 'transfer') {
          return (
            <div key={index} className="w-full">
              <Alert className="border-amber-500 bg-amber-50">
                <Users className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Transferring to support team</AlertTitle>
                <AlertDescription className="text-amber-600 text-sm">
                  {message.content}
                </AlertDescription>
              </Alert>
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
  );
};
