
import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChatLogic } from './useChatLogic';
import { AIChatBotProps } from './types';

// Create the component with both named export and default export for compatibility
export const AIChatBot: React.FC<AIChatBotProps> = ({ userId, isMinimized: initialMinimized = true }) => {
  const { user } = useAuth();
  
  const {
    isMinimized,
    setIsMinimized,
    input,
    setInput,
    messages,
    isLoading,
    handleSendMessage,
    messagesEndRef,
    isAgentChat,
    currentRoomId
  } = useChatLogic(userId, initialMinimized);

  // Real-time subscription to chat messages when in agent chat mode
  React.useEffect(() => {
    if (!isAgentChat || !currentRoomId) return;

    // Subscribe to new messages in the current chat room
    const channel = supabase
      .channel(`room-${currentRoomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${currentRoomId}`
        },
        (payload) => {
          console.log('New chat message received:', payload);
          // The messages will be updated through the hook
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAgentChat, currentRoomId]);

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[90vw] bg-white rounded-lg shadow-xl overflow-hidden border z-50">
      <ChatHeader 
        isAgentChat={isAgentChat} 
        onMinimize={() => setIsMinimized(true)} 
      />
      
      <ChatMessages 
        messages={messages} 
        isLoading={isLoading} 
        messagesEndRef={messagesEndRef} 
      />
      
      <ChatInput 
        input={input} 
        setInput={setInput} 
        handleSendMessage={handleSendMessage} 
        isLoading={isLoading}
        isAgentChat={isAgentChat}
      />
    </div>
  );
};

// Export as default for lazy loading
export default AIChatBot;
