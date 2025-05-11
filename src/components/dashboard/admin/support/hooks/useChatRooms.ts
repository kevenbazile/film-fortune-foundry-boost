
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom } from '../types';
import { toast } from '@/components/ui/use-toast';

export function useChatRooms() {
  const [activeRooms, setActiveRooms] = useState<ChatRoom[]>([]);
  const [closedRooms, setClosedRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch active chat rooms
  const fetchChatRooms = async () => {
    setIsLoading(true);
    try {
      const { data: activeData, error: activeError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('status', 'active')
        .order('last_message_at', { ascending: false });

      const { data: closedData, error: closedError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('status', 'closed')
        .order('last_message_at', { ascending: false })
        .limit(10);

      if (activeError) throw activeError;
      if (closedError) throw closedError;
      
      // Type cast the data to ensure compatibility with our ChatRoom type
      setActiveRooms((activeData || []).map(room => ({
        ...room,
        status: room.status as 'active' | 'closed' // Force the status to be the correct type
      })));
      
      setClosedRooms((closedData || []).map(room => ({
        ...room,
        status: room.status as 'active' | 'closed' // Force the status to be the correct type
      })));
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat rooms',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
    
    // Subscribe to new/updated rooms
    const roomsChannel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_rooms' },
        () => fetchChatRooms()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomsChannel);
    };
  }, []);

  return { activeRooms, closedRooms, fetchChatRooms, isLoading };
}
