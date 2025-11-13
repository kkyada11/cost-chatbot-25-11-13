/**
 * Message Service - 메시지 비즈니스 로직
 */

import type {
  IMessageService,
  MessageServiceStoreActions,
} from "@/types/service";
import { ServiceError } from "@/types/service";
import type { Message, MessagePair } from "@/types/chat";
import type { CreateMessagePairOptions } from "@/types/factory";
import type { PaginatedResult } from "@/types/repository";
import { messageFactory } from "@/factories";
import { messageRepository } from "@/repositories";
import { logger } from "@/lib/logger";

class MessageService implements IMessageService {
  private storeActions: MessageServiceStoreActions | null = null;

  setStoreActions(actions: MessageServiceStoreActions): void {
    this.storeActions = actions;
    logger.dev("[MessageService] Store actions set");
  }

  async saveMessageWithSync(message: Message): Promise<void> {
    try {
      await messageRepository.save(message);
      logger.log(`[MessageService] Message saved: ${message.id}`);
    } catch (error) {
      throw new ServiceError(
        "Failed to save message with sync",
        "SAVE_ERROR",
        error
      );
    }
  }

  createMessagePair(options: CreateMessagePairOptions): MessagePair {
    return messageFactory.createMessagePair(options);
  }

  async loadMessagesPaginated(
    conversationId: string,
    cursor?: number,
    limit = 20
  ): Promise<PaginatedResult<Message>> {
    try {
      const result = await messageRepository.findByConversationIdPaginated(
        conversationId,
        cursor,
        limit
      );
      logger.dev(
        `[MessageService] Loaded ${result.data.length} messages, hasMore: ${result.hasMore}`
      );
      return result;
    } catch (error) {
      throw new ServiceError(
        "Failed to load paginated messages",
        "LOAD_ERROR",
        error
      );
    }
  }

  removeOptimisticMessages(conversationId: string): void {
    if (!this.storeActions) {
      logger.warn(
        "[MessageService] Store actions not set, cannot remove optimistic messages"
      );
      return;
    }

    this.storeActions.removeOptimisticMessagesAction({ conversationId });
    logger.log(`[MessageService] Optimistic messages removed for: ${conversationId}`);
  }
}

// Singleton export
export const messageService = new MessageService();
