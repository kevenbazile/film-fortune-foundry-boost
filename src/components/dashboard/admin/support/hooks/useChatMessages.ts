
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatRoom } from '../types';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export function useChatMessages(currentRoom: ChatRoom | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Fetch messages for the currently selected room
  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Type cast the data to ensure compatibility with our ChatMessage type
      setMessages((data || []).map(message => ({
        ...message,
        message_type: message.message_type as 'text' | 'system' // Force the message_type to be the correct type
      })));
      
      // Mark messages as read
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('room_id', roomId)
        .not('sender_id', 'eq', user?.id);
        
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!input.trim() || !currentRoom || !user?.id) return;
    
    setIsLoading(true);
    try {
      // Add message to database
      const { error } = await supabase.from('chat_messages').insert({
        room_id: currentRoom.id,
        content: input,
        sender_id: user.id,
        message_type: 'text' // Explicitly set the message type
      });

      if (error) throw error;
      
      // Update last message time
      await supabase
        .from('chat_rooms')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentRoom.id);
      
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription to messages
  useEffect(() => {
    if (!currentRoom) {
      setMessages([]);
      return;
    }

    fetchMessages(currentRoom.id);

    // Subscribe to messages when a current room is selected
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages' },
        (payload) => {
          // Safely check if the payload has a room_id and if it matches the current room
          const payloadNew = payload.new as { room_id?: string } | null;
          if (currentRoom && payloadNew && payloadNew.room_id === currentRoom.id) {
            fetchMessages(currentRoom.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [currentRoom, user?.id]);

  return { messages, input, setInput, isLoading, sendMessage, messagesEndRef };
}
