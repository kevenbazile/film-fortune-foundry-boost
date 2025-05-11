
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChatRoom } from './types';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface RoomItemProps {
  room: ChatRoom;
  isActive: boolean;
  onSelectRoom: (room: ChatRoom) => void;
  onClaimRoom: (room: ChatRoom) => void;
}

export function RoomItem({ room, isActive, onSelectRoom, onClaimRoom }: RoomItemProps) {
  const { user } = useAuth();
  
  const handleClick = () => {
    if (room.staff_id && room.staff_id !== user?.id) {
      toast({
        title: 'Already claimed',
        description: 'This chat is being handled by another agent',
      });
      return;
    }
    
    if (room.staff_id === user?.id) {
      onSelectRoom(room);
    } else {
      onClaimRoom(room);
    }
  };
  
  return (
    <div
      className={`p-3 rounded-md cursor-pointer hover:bg-muted flex items-center justify-between ${
        isActive ? 'bg-muted' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
        <div>
          <div className="text-sm font-medium">{room.room_name}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(room.last_message_at).toLocaleString()}
          </div>
        </div>
      </div>
      
      {!room.staff_id && (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
          New
        </Badge>
      )}
      
      {room.staff_id === user?.id && (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          Yours
        </Badge>
      )}
      
      {room.staff_id && room.staff_id !== user?.id && (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          Claimed
        </Badge>
      )}
    </div>
  );
}
