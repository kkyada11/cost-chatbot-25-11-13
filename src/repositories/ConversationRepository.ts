/**
 * Conversation Repository - 대화 데이터 접근 계층
 */

import { db } from "@/lib/dexie";
import type { Conversation } from "@/types/chat";
import type { IRepository } from "@/types/repository";
import { RepositoryError } from "@/types/repository";

class ConversationRepository implements IRepository<Conversation> {
  async save(conversation: Conversation): Promise<Conversation> {
    try {
      await db.conversations.add(conversation);
      return conversation;
    } catch (error) {
      throw new RepositoryError("Failed to save conversation", "SAVE_ERROR", error);
    }
  }

  async findById(id: string): Promise<Conversation | null> {
    try {
      const conversation = await db.conversations.get(id);
      return conversation ?? null;
    } catch (error) {
      throw new RepositoryError("Failed to find conversation by id", "FIND_ERROR", error);
    }
  }

  async findAll(): Promise<Conversation[]> {
    try {
      const conversations = await db.conversations.orderBy("timestamp").reverse().toArray();
      return conversations;
    } catch (error) {
      throw new RepositoryError("Failed to find all conversations", "FIND_ERROR", error);
    }
  }

  async update(id: string, updates: Partial<Conversation>): Promise<void> {
    try {
      await db.conversations.update(id, updates);
    } catch (error) {
      throw new RepositoryError("Failed to update conversation", "UPDATE_ERROR", error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // 대화 삭제 시 관련 메시지도 모두 삭제
      await db.messages.where("conversationId").equals(id).delete();
      await db.conversations.delete(id);
    } catch (error) {
      throw new RepositoryError("Failed to delete conversation", "DELETE_ERROR", error);
    }
  }
}

// Singleton export
export const conversationRepository = new ConversationRepository();
