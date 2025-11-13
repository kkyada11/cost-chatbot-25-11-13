/**
 * 채팅 관련 타입 정의
 */

export type Theme = "light" | "dark";

export type AnimationStatus = "idle" | "typing" | "complete";

export type MessageRole = "user" | "assistant";

export type MessageFeedback = "like" | "dislike" | null;

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  order: number;
  animationStatus?: AnimationStatus;
  feedback?: MessageFeedback;
  isOptimistic?: boolean;
  relatedQuestions?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  firstMessage?: string;
}

export interface ChatState {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string | null;
  ui: {
    isSidebarOpen: boolean;
    isLoading: boolean;
    theme: Theme;
    resolvedTheme: Theme;
    isConversationIdMutated: boolean;
  };
}

export interface MessagePair {
  userMessage: Message;
  aiMessage: Message;
}
