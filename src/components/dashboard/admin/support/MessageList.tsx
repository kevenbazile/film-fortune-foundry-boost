
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './types';
import { useAuth } from '@/context/AuthContext';

interface MessageListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  const { user } = useAuth();
  
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${
            message.message_type === 'system' 
              ? 'justify-center' 
              : message.sender_id === user?.id 
                ? 'justify-end' 
                : 'justify-start'
          }`}>
            {message.message_type === 'system' ? (
              <div className="bg-muted/50 px-3 py-1 rounded text-xs text-muted-foreground">
                {message.content}
              </div>
            ) : (
              <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                message.sender_id === user?.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
