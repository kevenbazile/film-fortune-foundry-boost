
import { useState } from 'react';
import { pipeline } from '@huggingface/transformers';

type MessageRole = 'user' | 'assistant' | 'system' | 'suggestions';

type Message = {
  role: MessageRole;
  content: string;
  suggestions?: string[];
};

export function useAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m your AI assistant. How can I help you with your film distribution today?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [model, setModel] = useState<any>(null);

  // Initialize the model
  const initializeModel = async () => {
    if (isInitialized) return;
    
    try {
      setIsModelLoading(true);
      console.log("Loading AI model...");
      
      // Create a text-generation pipeline with a small model
      const pipe = await pipeline(
        'text-generation',
        'distilgpt2',
        { 
          // Remove quantized option as it's not supported
        }
      );
      
      setModel(pipe);
      setIsInitialized(true);
      console.log("AI model loaded successfully");
      
      // Add system message after model is loaded
      setMessages(prev => [
        ...prev,
        { 
          role: 'system' as MessageRole, 
          content: 'Model loaded successfully. I can assist with film distribution questions.' 
        }
      ]);
    } catch (error) {
      console.error("Error loading AI model:", error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'system' as MessageRole,
          content: 'Failed to load AI model. Using fallback mode.' 
        }
      ]);
    } finally {
      setIsModelLoading(false);
    }
  };
  
  // Send message to AI assistant
  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      let response: string;
      
      if (isInitialized && model) {
        // Prepare prompt with context
        const recentMessages = messages.slice(-3);
        let prompt = "You are a film distribution assistant. ";
        
        recentMessages.forEach(msg => {
          if (msg.role === 'user') {
            prompt += `User: ${msg.content}\n`;
          } else if (msg.role === 'assistant') {
            prompt += `Assistant: ${msg.content}\n`;
          }
        });
        
        // Add current message
        prompt += `User: ${input}\nAssistant:`;
        
        // Generate response
        const result = await model(prompt, {
          max_length: 150,
          num_return_sequences: 1,
          temperature: 0.7
        });
        
        // Extract assistant response
        response = result[0].generated_text;
        response = response.split("Assistant:").pop() || "";
        response = response.split("User:")[0] || response;
        
      } else {
        // Fallback mode with predefined responses
        response = generateFallbackResponse(input);
      }
      
      // Add assistant response to chat
      const assistantMessage: Message = { role: 'assistant', content: response.trim() };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add suggestions
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
      
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate fallback response when model is not available
  const generateFallbackResponse = (message: string): string => {
    const msg = message.toLowerCase();
    
    if (msg.includes('distribution') || msg.includes('distribute')) {
      return "Distribution is the process of getting your film to audiences through various platforms. Our service helps streamline this process with automated submissions to multiple platforms.";
    }
    
    if (msg.includes('revenue') || msg.includes('money') || msg.includes('earnings')) {
      return "Revenue from your film distribution is tracked in real-time on your dashboard. You can view earnings by platform, time period, and see detailed analytics to optimize your strategy.";
    }
    
    if (msg.includes('platform')) {
      return "We support distribution to various platforms including streaming services, theaters, and digital rental services. Each platform has different requirements which our system helps you meet.";
    }
    
    return "I'm here to help with your film distribution questions. Feel free to ask about specific features, processes, or how to maximize your film's reach and revenue.";
  };

  // Generate suggestions based on user message
  const generateSuggestions = (message: string): string[] => {
    const msg = message.toLowerCase();
    const suggestions: string[] = [];
    
    if (msg.includes('start') || msg.includes('begin') || msg.includes('new')) {
      suggestions.push('How to upload my film?', 'Distribution requirements', 'Platform selection guide');
    }
    
    if (msg.includes('revenue') || msg.includes('money') || msg.includes('earnings')) {
      suggestions.push('View revenue analytics', 'Commission structure', 'Payment schedule');
    }
    
    if (msg.includes('platform') || msg.includes('distribute')) {
      suggestions.push('Compare platforms', 'Platform requirements', 'Distribution timeline');
    }
    
    // Return max 3 suggestions
    return suggestions.length > 0 ? suggestions.slice(0, 3) : [
      'Tell me about distribution', 
      'How does revenue work?', 
      'What platforms do you support?'
    ];
  };
  
  return {
    messages,
    isLoading,
    isModelLoading,
    isInitialized,
    initializeModel,
    sendMessage,
  };
}
