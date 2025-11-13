/**
 * Conversation Service - 대화 비즈니스 로직
 */

import type {
  IConversationService,
  ConversationServiceStoreActions,
} from "@/types/service";
import { ServiceError } from "@/types/service";
import type { Conversation } from "@/types/chat";
import { conversationFactory } from "@/factories";
import { conversationRepository } from "@/repositories";
import { logger } from "@/lib/logger";

class ConversationService implements IConversationService {
  private storeActions: ConversationServiceStoreActions | null = null;

  setStoreActions(actions: ConversationServiceStoreActions): void {
    this.storeActions = actions;
    logger.dev("[ConversationService] Store actions set");
  }

  async saveConversationWithSync(conversation: Conversation): Promise<void> {
    try {
      await conversationRepository.save(conversation);

      if (this.storeActions) {
        this.storeActions.addConversationAction({ conversation });
      }

      logger.log(`[ConversationService] Conversation saved: ${conversation.id}`);
    } catch (error) {
      throw new ServiceError(
        "Failed to save conversation with sync",
        "SAVE_ERROR",
        error
      );
    }
  }

  createConversation(firstMessage?: string): Conversation {
    return conversationFactory.createConversation(firstMessage);
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const conversations = await conversationRepository.findAll();
      logger.dev(`[ConversationService] Loaded ${conversations.length} conversations`);
      return conversations;
    } catch (error) {
      throw new ServiceError(
        "Failed to get conversations",
        "LOAD_ERROR",
        error
      );
    }
  }
}

// Singleton export
export const conversationService = new ConversationService();
