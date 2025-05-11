
import { ReactNode } from 'react';

export interface ChatRoom {
  id: string;
  filmmaker_id: string;
  staff_id?: string | null;
  room_name: string;
  created_at: string;
  last_message_at: string;
  status: 'active' | 'closed';
}

export interface ChatMessage {
  id: string;
  room_id: string;
  content: string;
  sender_id?: string | null;
  created_at: string;
  message_type: 'text' | 'system';
  is_read: boolean;
}
