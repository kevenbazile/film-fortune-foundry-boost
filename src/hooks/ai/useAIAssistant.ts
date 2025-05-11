
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  Message, 
  AIAssistantResponse 
} from './types';
import { 
  generateResponse, 
  generateSuggestions, 
  createOrFindChatRoom 
} from './aiAssistantService';
import { 
  subscribeToRoomChanges, 
  subscribeToRoomMessages, 
  sendMessageToRoom,
  createSupportNotification
} from './realtimeChatService';

export function useAIAssistant(): AIAssistantResponse {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m your AI assistant. How can I help you with your film distribution today?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgentChat, setIsAgentChat] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Setup real-time subscription to chat rooms status changes
  useEffect(() => {
    if (!user?.id) return;
    
    const roomsChannel = subscribeToRoomChanges(user.id, (payload) => {
      console.log('Chat room updated:', payload);
      
      // If a staff member was assigned or status changed
      if (payload.new.staff_id && !payload.old.staff_id) {
        setMessages(prev => [
          ...prev,
          { 
            role: 'system', 
            content: 'A support agent has joined the chat.' 
          }
        ]);
      }
      
      // If room was closed
      if (payload.new.status === 'closed' && payload.old.status === 'active') {
        setMessages(prev => [
          ...prev,
          { 
            role: 'system', 
            content: 'This support conversation has been closed. You can start a new AI chat or request support again if needed.' 
          }
        ]);
        setIsAgentChat(false);
        setCurrentRoomId(null);
      }
    });
    
    return () => {
      supabase.removeChannel(roomsChannel);
    };
  }, [user?.id]);
  
  // Setup real-time subscription to chat messages
  useEffect(() => {
    if (!user?.id || !isAgentChat || !currentRoomId) return;

    // Subscribe to messages in the current room
    const messagesChannel = subscribeToRoomMessages(
      currentRoomId,
      async (payload) => {
        const newMessage = payload.new;
        
        // Skip own messages (already added to state)
        if (newMessage.sender_id === user.id) return;
        
        // Add agent message to chat
        setMessages(prev => [...prev, {
          role: 'agent',
          content: newMessage.content
        }]);
      }
    );

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [isAgentChat, currentRoomId, user?.id]);
  
  const handleTransferToAgent = async (input: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Create notification for staff
      await createSupportNotification(user.id, input);
      
      toast({
        title: "Support Request Sent",
        description: "Our team has been notified and will contact you soon.",
      });
      
      // Create or find chat room
      const roomId = await createOrFindChatRoom(user.id);
      
      if (roomId) {
        setCurrentRoomId(roomId);
        setIsAgentChat(true);
        
        // Add system message about the transition
        setMessages(prev => [
          ...prev, 
          { 
            role: 'system', 
            content: 'You have been connected to our support team. Please wait for an agent to respond.' 
          }
        ]);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error transitioning to agent chat:", error);
      return false;
    }
  };
  
  // Send message to AI assistant or human agent
  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Handle agent chat mode
      if (isAgentChat) {
        if (!currentRoomId || !user?.id) {
          throw new Error("Chat room not initialized");
        }
        
        // Insert message into database
        await sendMessageToRoom(currentRoomId, input, user.id);
        
        setIsLoading(false);
        return;
      }
      
      // AI mode - Generate response using the fallback mechanism
      const responseKey = await generateResponse(input, user?.id);
      let response: string;
      let isTransfer = false;
      
      // Check if we need to transfer to human support
      if (responseKey === "account.transfer") {
        response = "I'll transfer you to our support team who can assist with your account-specific questions. They typically respond within 24 hours.";
        isTransfer = true;
      } else {
        response = responseKey;
      }
      
      // Short delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add assistant response to chat
      const assistantMessage: Message = { 
        role: isTransfer ? 'transfer' : 'assistant', 
        content: response 
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Handle transfer to human agent
      if (isTransfer) {
        await handleTransferToAgent(input);
      } else {
        // Generate and add suggestions if not transferring
        const suggestions = generateSuggestions(input);
        if (suggestions.length > 0) {
          setMessages(prev => [
            ...prev,
            {
              role: 'suggestions',
              content: '',
              suggestions
            }
          ]);
        }
      }
      
    } catch (error) {
      console.error("Error generating response:", error);
      
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Assistant Error",
        description: "There was a problem generating a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    messages,
    isLoading,
    isInitialized: true, // Always return true as we're using the fallback mechanism
    initializeModel: () => {}, // No-op function
    sendMessage,
    isAgentChat,
    currentRoomId
  };
}
