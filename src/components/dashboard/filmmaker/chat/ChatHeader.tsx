
import React from 'react';
import { Bot, Minimize2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeaderProps } from './types';

export const ChatHeader = ({ isAgentChat, onMinimize }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <div className="flex items-center gap-2">
        {isAgentChat ? (
          <>
            <Users className="h-5 w-5" />
            <span className="font-medium">Support Agent</span>
          </>
        ) : (
          <>
            <Bot className="h-5 w-5" />
            <span className="font-medium">AI Assistant</span>
          </>
        )}
      </div>
      <Button
        onClick={onMinimize}
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-primary/20"
      >
        <Minimize2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
