
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Send, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

// This component is for admin use to respond to support requests

interface ChatRoom {
  id: string;
  filmmaker_id: string;
  staff_id?: string | null;
  room_name: string;
  created_at: string;
  last_message_at: string;
  status: 'active' | 'closed';
}

interface ChatMessage {
  id: string;
  room_id: string;
  content: string;
  sender_id?: string | null;
  created_at: string;
  message_type: 'text' | 'system';
  is_read: boolean;
}

export default function SupportChatPanel() {
  const [activeRooms, setActiveRooms] = useState<ChatRoom[]>([]);
  const [closedRooms, setClosedRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Fetch active chat rooms
  const fetchChatRooms = async () => {
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
    }
  };

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
      setMessages([]);
    } catch (error) {
      console.error('Error closing room:', error);
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

  // Initialize and subscribe to real-time updates
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
      supabase.removeChannel(roomsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [currentRoom]);

  return (
    <div className="flex h-[calc(100vh-10rem)] border rounded-lg overflow-hidden">
      {/* Rooms Sidebar */}
      <div className="w-1/4 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Support Chats</h2>
        </div>
        
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
                    <div
                      key={room.id}
                      className={`p-3 rounded-md cursor-pointer hover:bg-muted flex items-center justify-between ${
                        currentRoom?.id === room.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => {
                        if (room.staff_id && room.staff_id !== user?.id) {
                          toast({
                            title: 'Already claimed',
                            description: 'This chat is being handled by another agent',
                          });
                          return;
                        }
                        if (room.staff_id === user?.id) {
                          setCurrentRoom(room);
                          fetchMessages(room.id);
                        } else {
                          claimRoom(room);
                        }
                      }}
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
                    <div
                      key={room.id}
                      className={`p-3 rounded-md cursor-pointer hover:bg-muted ${
                        currentRoom?.id === room.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => {
                        setCurrentRoom(room);
                        fetchMessages(room.id);
                      }}
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
                    </div>
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
      </div>

      {/* Chat Area */}
      {currentRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between bg-muted/10">
            <div>
              <h3 className="font-semibold">{currentRoom.room_name}</h3>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(currentRoom.created_at).toLocaleString()}
              </p>
            </div>
            {currentRoom.status === 'active' && (
              <Button variant="outline" onClick={closeRoom}>
                Close Conversation
              </Button>
            )}
          </div>
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${
                  message.message_type === 'system' 
                    ? 'justify-center' 
                    : message.sender_id === user?.id 
                      ? 'justify-end' 
                      : 'justify-start'
                }`}>
                  {message.message_type === 'system' ? (
                    <div className="bg-muted/50 px-3 py-1 rounded text-xs text-muted-foreground">
                      {message.content}
                    </div>
                  ) : (
                    <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          {currentRoom.status === 'active' ? (
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isLoading || currentRoom.staff_id !== user?.id}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !input.trim() || currentRoom.staff_id !== user?.id}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="ml-2">Send</span>
                </Button>
              </div>
              {currentRoom.staff_id !== user?.id && (
                <p className="text-xs text-amber-500 mt-2">
                  You must claim this chat before you can respond.
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 border-t bg-muted/10">
              <p className="text-center text-muted-foreground">
                This conversation has been closed.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">No chat selected</h3>
            <p className="text-muted-foreground mt-1">
              Select a chat from the sidebar to view the conversation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
