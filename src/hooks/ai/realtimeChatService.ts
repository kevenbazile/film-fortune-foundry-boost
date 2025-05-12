
import { supabase } from '@/integrations/supabase/client';

// Send a message to the chat room
export const sendMessageToRoom = async (roomId: string, content: string, senderId: string) => {
  return await supabase.from('chat_messages').insert({
    room_id: roomId,
    content,
    sender_id: senderId
  });
};

// Subscribe to room status changes
export const subscribeToRoomChanges = (userId: string, onRoomUpdate: (payload: any) => void) => {
  return supabase
    .channel('rooms-status-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_rooms',
        filter: `filmmaker_id=eq.${userId}`
      },
      onRoomUpdate
    )
    .subscribe();
};

// Subscribe to new messages in a room
export const subscribeToRoomMessages = (roomId: string, onNewMessage: (payload: any) => void) => {
  return supabase
    .channel(`messages-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      },
      onNewMessage
    )
    .subscribe();
};

// Create a notification for staff
export const createSupportNotification = async (userId: string, message: string) => {
  return await supabase.from('notifications').insert({
    user_id: userId,
    title: 'Support Request from AI Chat',
    description: `A user asked: "${message}"`,
    type: 'support_request'
  });
};
