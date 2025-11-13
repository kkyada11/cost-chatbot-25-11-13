/**
 * Dexie IndexedDB 설정
 */

import Dexie, { type EntityTable } from "dexie";
import type { Message, Conversation } from "@/types/chat";

export class CostChatbotDatabase extends Dexie {
  conversations!: EntityTable<Conversation, "id">;
  messages!: EntityTable<Message, "id">;

  constructor() {
    super("CostChatbotDB");

    // Version 5: order 필드 및 복합 인덱스 추가
    this.version(5).stores({
      conversations: "id, timestamp",
      messages: "id, conversationId, timestamp, order, [conversationId+order]",
    });

    // Version 4: feedback 필드 추가
    this.version(4).stores({
      conversations: "id, timestamp",
      messages: "id, conversationId, timestamp",
    });

    // Version 3: isOptimistic 필드 추가
    this.version(3).stores({
      conversations: "id, timestamp",
      messages: "id, conversationId, timestamp",
    });

    // Version 2: animationStatus 필드 추가
    this.version(2).stores({
      conversations: "id, timestamp",
      messages: "id, conversationId, timestamp",
    });

    // Version 1: 초기 스키마
    this.version(1).stores({
      conversations: "id, timestamp",
      messages: "id, conversationId, timestamp",
    });
  }

  /**
   * 데이터베이스 초기화 및 중복 제거
   */
  async initialize(): Promise<void> {
    try {
      await this.open();
      console.log("[Dexie] Database initialized successfully");
    } catch (error) {
      console.error("[Dexie] Failed to initialize database:", error);
      throw error;
    }
  }

  /**
   * 데이터베이스 완전 삭제 (개발용)
   */
  async clearAll(): Promise<void> {
    await this.conversations.clear();
    await this.messages.clear();
    console.log("[Dexie] All data cleared");
  }
}

// Singleton instance
export const db = new CostChatbotDatabase();
