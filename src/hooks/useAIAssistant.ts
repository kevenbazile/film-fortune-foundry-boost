
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getUserData } from '@/components/dashboard/filmmaker/revenue/services/userDataService';
import { fetchUserApplications } from '@/components/dashboard/filmmaker/investment/services/investmentService';

export type MessageRole = 'user' | 'assistant' | 'system' | 'suggestions' | 'transfer';

export type Message = {
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
  const { user } = useAuth();

  // Film distribution responses database
  const responses = {
    distribution: {
      general: "Film distribution is the process of making your film available to audiences through various platforms. I can help you navigate this process.",
      steps: "The key steps in film distribution are: encoding your film, preparing metadata, submitting to platforms, and tracking performance and revenue.",
      platforms: "We support distribution to major streaming platforms, theaters, and digital rental services. Each platform has different requirements which our system helps you meet."
    },
    revenue: {
      tracking: "Revenue from your film distribution is tracked in real-time on your dashboard. You can view earnings by platform, time period, and see detailed analytics.",
      commission: "Our commission structure is transparent, with different rates depending on your subscription tier. You can view your specific rates in the commission breakdown section.",
      payments: "Payments are processed on a monthly basis. You can request payouts once your balance reaches the minimum threshold set in your account settings."
    },
    submission: {
      process: "To submit a film, navigate to the Project Submission tab and follow the step-by-step process including film upload, cover art, and metadata.",
      requirements: "For submission, you'll need your completed film, poster artwork, promotional materials, and complete metadata including cast, crew, and synopsis.",
      timeline: "Once submitted, your film goes through encoding, quality checks, and platform submission. This typically takes 1-3 weeks depending on the platforms selected."
    },
    investment: {
      options: "Our investment center offers opportunities to secure funding for your film projects through our community fund and partner investors.",
      application: "To apply for investment, visit the Investment tab and complete the detailed application form with your project details, budget, and market research.",
      criteria: "Investment decisions are based on commercial potential, creative quality, team experience, and market readiness. The review process typically takes 3-4 weeks."
    },
    help: {
      general: "I'm here to help with your film distribution questions. Feel free to ask about specific features, processes, or how to maximize your film's reach and revenue.",
      support: "For additional support, you can contact our team via the help center or schedule a consultation with a distribution specialist.",
      resources: "Check out our Knowledge Base for tutorials, guides, and best practices for effective film distribution strategies."
    },
    account: {
      general: "For specific account inquiries, I'll need to connect you with a member of our support team who can access your account details.",
      transfer: "I'll transfer you to our support team who can assist with your account-specific questions. They typically respond within 24 hours."
    }
  };

  // Check if the query is related to personal account data
  const needsHumanSupport = (query: string): boolean => {
    const accountTerms = [
      'my account', 'my film', 'my revenue', 'my earnings', 'my payment', 'my payout', 'my balance',
      'my profile', 'my subscription', 'my tier', 'my application', 'specific details', 'account details',
      'account access'
    ];
    
    const lowercaseQuery = query.toLowerCase();
    return accountTerms.some(term => lowercaseQuery.includes(term));
  };

  // Fetch user-specific data from Supabase to enhance responses
  const fetchUserContext = async (): Promise<any> => {
    if (!user) return null;
    
    try {
      // Get basic user data including subscription tier
      const userData = await getUserData();
      
      // Get user's investment applications if they exist
      let applications = [];
      try {
        if (userData.userId) {
          applications = await fetchUserApplications(userData.userId);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
      
      return {
        userTier: userData.userTier,
        hasFilms: userData.filmId !== null,
        applicationsCount: applications.length,
      };
    } catch (error) {
      console.error("Error fetching user context:", error);
      return null;
    }
  };

  // Generate fallback response based on message content and user context
  const generateResponse = async (message: string): Promise<string> => {
    const msg = message.toLowerCase();
    const userContext = await fetchUserContext();
    
    // Check if query needs human support
    if (needsHumanSupport(message)) {
      // Log the query to the database for later follow-up by staff
      if (user?.id) {
        try {
          await supabase.from('ai_conversations').insert({
            user_id: user.id,
            user_message: message,
            ai_response: "Transferred to human support",
            context: userContext
          });
        } catch (error) {
          console.error("Error logging conversation:", error);
        }
      }
      
      return "account.transfer";
    }
    
    // Generate response based on message content
    if (msg.includes('distribute') || msg.includes('distribution')) {
      if (msg.includes('step') || msg.includes('process')) {
        return responses.distribution.steps;
      } else if (msg.includes('platform')) {
        return responses.distribution.platforms;
      }
      return responses.distribution.general;
    }
    
    if (msg.includes('revenue') || msg.includes('money') || msg.includes('earnings')) {
      if (msg.includes('track') || msg.includes('analytic')) {
        return responses.revenue.tracking;
      } else if (msg.includes('commission') || msg.includes('rate')) {
        return responses.revenue.commission;
      } else if (msg.includes('payment') || msg.includes('payout')) {
        return responses.revenue.payments;
      }
      return responses.revenue.tracking;
    }
    
    if (msg.includes('submit') || msg.includes('submission') || msg.includes('upload')) {
      if (msg.includes('require') || msg.includes('need')) {
        return responses.submission.requirements;
      } else if (msg.includes('time') || msg.includes('long')) {
        return responses.submission.timeline;
      }
      return responses.submission.process;
    }
    
    if (msg.includes('invest') || msg.includes('funding') || msg.includes('fund')) {
      if (msg.includes('apply') || msg.includes('application')) {
        return responses.investment.application;
      } else if (msg.includes('criteria') || msg.includes('decision')) {
        return responses.investment.criteria;
      }
      return responses.investment.options;
    }
    
    // Default fallback
    return responses.help.general;
  };

  // Generate suggestions based on user message and context
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
    
    // Return max 3 suggestions or default suggestions if none matched
    return suggestions.length > 0 ? suggestions.slice(0, 3) : [
      'Tell me about distribution', 
      'How does revenue work?', 
      'What platforms do you support?'
    ];
  };
  
  // Send message to AI assistant
  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Generate response using the fallback mechanism
      const responseKey = await generateResponse(input);
      let response: string;
      let isTransfer = false;
      
      // Check if we need to transfer to human support
      if (responseKey === "account.transfer") {
        response = responses.account.transfer;
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
      setMessages(prev => [...prev, assistantMessage as Message]);
      
      // Create notification for transfer requests
      if (isTransfer && user?.id) {
        try {
          await supabase.from('notifications').insert({
            user_id: user.id,
            title: 'Support Request from AI Chat',
            description: `A user asked: "${input}"`,
            type: 'support_request'
          });
          
          toast({
            title: "Support Request Sent",
            description: "Our team has been notified and will contact you soon.",
          });
        } catch (error) {
          console.error("Error creating notification:", error);
        }
      }
      
      // Generate and add suggestions if not transferring
      if (!isTransfer) {
        const suggestions = generateSuggestions(input);
        if (suggestions.length > 0) {
          setMessages(prev => [
            ...prev,
            {
              role: 'suggestions',
              content: '',
              suggestions
            } as Message
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
  };
}
