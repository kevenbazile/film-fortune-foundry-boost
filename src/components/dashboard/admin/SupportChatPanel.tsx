
import React, { useState } from 'react';
import { useChatRooms } from './support/hooks/useChatRooms';
import { useChatMessages } from './support/hooks/useChatMessages';
import { useChatActions } from './support/hooks/useChatActions';
import { RoomList } from './support/RoomList';
import { ChatArea } from './support/ChatArea';
import { ChatRoom } from './support/types';

export default function SupportChatPanel() {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const { activeRooms, closedRooms, fetchChatRooms } = useChatRooms();
  const { messages, input, setInput, isLoading, sendMessage, messagesEndRef } = useChatMessages(currentRoom);
  
  // Function to fetch messages for a specific room ID - pass this to useChatActions
  const fetchMessages = async (roomId: string) => {
    if (!currentRoom || currentRoom.id !== roomId) return;
    // Using the hook's internal function
  };
  
  const { claimRoom, closeRoom } = useChatActions(currentRoom, setCurrentRoom, fetchChatRooms, fetchMessages);

  // Handler for selecting a room
  const handleSelectRoom = (room: ChatRoom) => {
    setCurrentRoom(room);
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] border rounded-lg overflow-hidden">
      {/* Rooms Sidebar */}
      <div className="w-1/4 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Support Chats</h2>
        </div>
        
        <RoomList
          activeRooms={activeRooms}
          closedRooms={closedRooms}
          currentRoom={currentRoom}
          onSelectRoom={handleSelectRoom}
          onClaimRoom={claimRoom}
        />
      </div>

      {/* Chat Area */}
      <ChatArea
        currentRoom={currentRoom}
        messages={messages}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSend={sendMessage}
        onClose={closeRoom}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}
