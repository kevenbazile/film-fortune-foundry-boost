
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatRoom } from './types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useAuth } from '@/context/AuthContext';

interface ChatAreaProps {
  currentRoom: ChatRoom | null;
  messages: any[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSend: () => void;
  onClose: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatArea({
  currentRoom,
  messages,
  input,
  setInput,
  isLoading,
  onSend,
  onClose,
  messagesEndRef
}: ChatAreaProps) {
  const { user } = useAuth();
  
  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-4">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">No chat selected</h3>
          <p className="text-muted-foreground mt-1">
            Select a chat from the sidebar to view the conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader currentRoom={currentRoom} onClose={onClose} />
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      
      {currentRoom.status === 'active' ? (
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          disabled={currentRoom.staff_id !== user?.id}
          onSend={onSend}
          showWarning={currentRoom.staff_id !== user?.id}
        />
      ) : (
        <div className="p-4 border-t bg-muted/10">
          <p className="text-center text-muted-foreground">
            This conversation has been closed.
          </p>
        </div>
      )}
    </div>
  );
}
