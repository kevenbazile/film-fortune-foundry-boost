
import { useState, useEffect, useRef } from 'react';
import { useAIAssistant } from '@/hooks/ai/useAIAssistant';

export const useChatLogic = (userId: string, isInitiallyMinimized: boolean = true) => {
  const [isMinimized, setIsMinimized] = useState(isInitiallyMinimized);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    isInitialized,
    initializeModel,
    sendMessage,
    isAgentChat,
    currentRoomId
  } = useAIAssistant();

  // Initialize model when chat is opened
  useEffect(() => {
    if (!isMinimized && !isInitialized) {
      initializeModel();
    }
  }, [isMinimized, isInitialized, initializeModel]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle suggestion clicks
  useEffect(() => {
    const handleSetInput = (e: Event) => {
      const customEvent = e as CustomEvent;
      setInput(customEvent.detail.value);
    };
    
    window.addEventListener('set-chat-input', handleSetInput as EventListener);
    
    return () => {
      window.removeEventListener('set-chat-input', handleSetInput as EventListener);
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return {
    isMinimized,
    setIsMinimized,
    input,
    setInput,
    messages,
    isLoading,
    isInitialized,
    handleSendMessage,
    messagesEndRef,
    isAgentChat,
    currentRoomId
  };
};
