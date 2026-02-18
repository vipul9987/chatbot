
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ServiceItem {
  title: string;
  description: string;
  priceRange?: string;
  features: string[];
}

export enum ChatState {
  IDLE = 'IDLE',
  TYPING = 'TYPING',
  ERROR = 'ERROR'
}
