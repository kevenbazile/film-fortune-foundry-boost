
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RoomItem } from './RoomItem';
import { ChatRoom } from './types';

interface RoomListProps {
  activeRooms: ChatRoom[];
  closedRooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  onSelectRoom: (room: ChatRoom) => void;
  onClaimRoom: (room: ChatRoom) => void;
}

export function RoomList({ 
  activeRooms, 
  closedRooms, 
  currentRoom,
  onSelectRoom, 
  onClaimRoom 
}: RoomListProps) {
  return (
    <Tabs defaultValue="active" className="w-full">
      <div className="px-4 pt-2">
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            Active
            {activeRooms.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeRooms.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex-1">Closed</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="active" className="mt-0">
        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-1 p-2">
            {activeRooms.length > 0 ? (
              activeRooms.map(room => (
                <RoomItem
                  key={room.id}
                  room={room}
                  isActive={currentRoom?.id === room.id}
                  onSelectRoom={onSelectRoom}
                  onClaimRoom={onClaimRoom}
                />
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No active chats
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="closed" className="mt-0">
        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-1 p-2">
            {closedRooms.length > 0 ? (
              closedRooms.map(room => (
                <RoomItem
                  key={room.id}
                  room={room}
                  isActive={currentRoom?.id === room.id}
                  onSelectRoom={onSelectRoom}
                  onClaimRoom={() => {}} // Closed rooms can't be claimed
                />
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No closed chats
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
