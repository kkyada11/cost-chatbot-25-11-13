/**
 * Conversation Factory - 대화 객체 생성 담당
 */

import type { IConversationFactory } from "@/types/factory";
import type { Conversation } from "@/types/chat";
import { CONVERSATION_CONFIG } from "@/lib/constants";

class ConversationFactory implements IConversationFactory {
  private generateId(): string {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTitle(firstMessage?: string): string {
    if (firstMessage) {
      const truncated = firstMessage.slice(0, CONVERSATION_CONFIG.MAX_TITLE_LENGTH);
      return truncated.length < firstMessage.length ? `${truncated}...` : truncated;
    }
    return CONVERSATION_CONFIG.DEFAULT_TITLE;
  }

  createConversation(firstMessage?: string): Conversation {
    return {
      id: this.generateId(),
      title: this.generateTitle(firstMessage),
      timestamp: new Date().toISOString(),
      firstMessage,
    };
  }
}

// Singleton export
export const conversationFactory = new ConversationFactory();
