/**
 * Factory 패턴 관련 타입 정의
 */

import type { Message, Conversation, MessagePair } from "./chat";

export interface CreateUserMessageOptions {
  conversationId: string;
  content: string;
}

export interface CreateAssistantMessageOptions {
  conversationId: string;
  content: string;
  relatedQuestions?: string[];
}

export interface CreateOptimisticMessageOptions {
  conversationId: string;
  content: string;
  role: "user" | "assistant";
}

export interface CreateMessagePairOptions {
  userContent: string;
  aiContent: string;
  conversationId: string;
  relatedQuestions?: string[];
}

export interface IMessageFactory {
  createUserMessage(options: CreateUserMessageOptions): Message;
  createAssistantMessage(options: CreateAssistantMessageOptions): Message;
  createOptimisticMessage(options: CreateOptimisticMessageOptions): Message;
  createMessagePair(options: CreateMessagePairOptions): MessagePair;
}

export interface IConversationFactory {
  createConversation(firstMessage?: string): Conversation;
}
