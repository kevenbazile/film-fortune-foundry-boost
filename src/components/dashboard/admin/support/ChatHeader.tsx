
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatRoom } from './types';

interface ChatHeaderProps {
  currentRoom: ChatRoom;
  onClose: () => void;
}

export function ChatHeader({ currentRoom, onClose }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-muted/10">
      <div>
        <h3 className="font-semibold">{currentRoom.room_name}</h3>
        <p className="text-sm text-muted-foreground">
          Created: {new Date(currentRoom.created_at).toLocaleString()}
        </p>
      </div>
      {currentRoom.status === 'active' && (
        <Button variant="outline" onClick={onClose}>
          Close Conversation
        </Button>
      )}
    </div>
  );
}
