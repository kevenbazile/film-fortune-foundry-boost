
/**
 * AI Chat Message Types
 */
export type MessageRole = 'user' | 'assistant' | 'system' | 'suggestions' | 'transfer' | 'agent';

export interface Message {
  role: MessageRole;
  content: string;
  suggestions?: string[];
}

export interface AIAssistantResponse {
  messages: Message[];
  isLoading: boolean;
  isInitialized: boolean;
  initializeModel: () => void;
  sendMessage: (input: string) => Promise<void>;
  isAgentChat: boolean;
  currentRoomId: string | null;
}

export interface AIResponseDatabase {
  distribution: {
    general: string;
    steps: string;
    platforms: string;
  };
  revenue: {
    tracking: string;
    commission: string;
    payments: string;
  };
  submission: {
    process: string;
    requirements: string;
    timeline: string;
  };
  investment: {
    options: string;
    application: string;
    criteria: string;
  };
  help: {
    general: string;
    support: string;
    resources: string;
  };
  account: {
    general: string;
    transfer: string;
  };
}

export interface UserContext {
  userTier?: string;
  hasFilms?: boolean;
  applicationsCount?: number;
}
