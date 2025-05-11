
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom } from '../types';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export function useChatActions(
  currentRoom: ChatRoom | null,
  setCurrentRoom: (room: ChatRoom | null) => void,
  fetchChatRooms: () => Promise<void>,
  fetchMessages: (roomId: string) => Promise<void>
) {
  const { user } = useAuth();

  // Claim a chat room for this staff member
  const claimRoom = async (room: ChatRoom) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('chat_rooms')
        .update({ staff_id: user.id })
        .eq('id', room.id)
        .is('staff_id', null);

      if (error) throw error;
      setCurrentRoom({ ...room, staff_id: user.id });
      await fetchMessages(room.id);
      
      // Add system message about staff joining
      await supabase.from('chat_messages').insert({
        room_id: room.id,
        content: "A support agent has joined the chat.",
        message_type: 'system'
      });
      
      toast({
        title: 'Room Claimed',
        description: 'You are now handling this support conversation',
      });
    } catch (error) {
      console.error('Error claiming room:', error);
      toast({
        title: 'Error',
        description: 'Failed to claim chat room',
        variant: 'destructive',
      });
    }
  };

  // Close a chat room
  const closeRoom = async () => {
    if (!currentRoom) return;
    
    try {
      const { error } = await supabase
        .from('chat_rooms')
        .update({ status: 'closed' })
        .eq('id', currentRoom.id);

      if (error) throw error;
      
      // Add system message about closing
      await supabase.from('chat_messages').insert({
        room_id: currentRoom.id,
        content: "This support conversation has been closed.",
        message_type: 'system'
      });
      
      toast({
        title: 'Room Closed',
        description: 'Chat conversation has been closed',
      });
      
      // Refresh rooms and reset current room
      await fetchChatRooms();
      setCurrentRoom(null);
    } catch (error) {
      console.error('Error closing room:', error);
    }
  };

  return { claimRoom, closeRoom };
}
