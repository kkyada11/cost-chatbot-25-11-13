/**
 * Message Factory - 메시지 객체 생성 담당
 */

import type {
  IMessageFactory,
  CreateUserMessageOptions,
  CreateAssistantMessageOptions,
  CreateOptimisticMessageOptions,
  CreateMessagePairOptions,
} from "@/types/factory";
import type { Message, MessagePair } from "@/types/chat";

class MessageFactory implements IMessageFactory {
  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateOrder(): number {
    return Date.now();
  }

  createUserMessage(options: CreateUserMessageOptions): Message {
    const { conversationId, content } = options;

    return {
      id: this.generateId(),
      conversationId,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      order: this.generateOrder(),
      animationStatus: "complete",
      isOptimistic: false,
    };
  }

  createAssistantMessage(options: CreateAssistantMessageOptions): Message {
    const { conversationId, content, relatedQuestions } = options;

    return {
      id: this.generateId(),
      conversationId,
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      order: this.generateOrder(),
      animationStatus: "idle",
      isOptimistic: false,
      relatedQuestions,
    };
  }

  createOptimisticMessage(options: CreateOptimisticMessageOptions): Message {
    const { conversationId, content, role } = options;

    return {
      id: this.generateId(),
      conversationId,
      role,
      content,
      timestamp: new Date().toISOString(),
      order: this.generateOrder(),
      animationStatus: role === "assistant" ? "typing" : "complete",
      isOptimistic: true,
    };
  }

  createMessagePair(options: CreateMessagePairOptions): MessagePair {
    const { userContent, aiContent, conversationId, relatedQuestions } = options;

    const userMessage = this.createUserMessage({
      conversationId,
      content: userContent,
    });

    const aiMessage = this.createAssistantMessage({
      conversationId,
      content: aiContent,
      relatedQuestions,
    });

    return { userMessage, aiMessage };
  }
}

// Singleton export
export const messageFactory = new MessageFactory();
