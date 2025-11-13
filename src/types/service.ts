/**
 * Service Layer 관련 타입 정의
 */

import type { Message, Conversation, MessagePair } from "./chat";
import type { CreateMessagePairOptions } from "./factory";
import type { PaginatedResult } from "./repository";

export interface IMessageService {
  saveMessageWithSync(message: Message): Promise<void>;
  createMessagePair(options: CreateMessagePairOptions): MessagePair;
  loadMessagesPaginated(
    conversationId: string,
    cursor?: number,
    limit?: number
  ): Promise<PaginatedResult<Message>>;
  removeOptimisticMessages(conversationId: string): void;
  setStoreActions(actions: MessageServiceStoreActions): void;
}

export interface IConversationService {
  saveConversationWithSync(conversation: Conversation): Promise<void>;
  createConversation(firstMessage?: string): Conversation;
  getConversations(): Promise<Conversation[]>;
  setStoreActions(actions: ConversationServiceStoreActions): void;
}

export interface MessageServiceStoreActions {
  removeOptimisticMessagesAction: (payload: { conversationId: string }) => void;
}

export interface ConversationServiceStoreActions {
  addConversationAction: (payload: { conversation: Conversation }) => void;
  setConversationsAction: (payload: { conversations: Conversation[] }) => void;
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
