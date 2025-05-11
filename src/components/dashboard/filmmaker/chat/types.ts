
import { Message } from '@/hooks/ai/types';

export interface AIChatBotProps {
  userId: string;
  isMinimized?: boolean;
}

export interface ChatHeaderProps {
  isAgentChat: boolean;
  onMinimize: () => void;
}

export interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  isAgentChat: boolean;
}
