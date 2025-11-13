/**
 * Message Repository - 메시지 데이터 접근 계층
 */

import { db } from "@/lib/dexie";
import type { Message, AnimationStatus, MessageFeedback } from "@/types/chat";
import type { IRepository, PaginatedResult } from "@/types/repository";
import { RepositoryError } from "@/types/repository";

class MessageRepository implements IRepository<Message> {
  async save(message: Message): Promise<Message> {
    try {
      await db.messages.add(message);
      return message;
    } catch (error) {
      throw new RepositoryError("Failed to save message", "SAVE_ERROR", error);
    }
  }

  async findById(id: string): Promise<Message | null> {
    try {
      const message = await db.messages.get(id);
      return message ?? null;
    } catch (error) {
      throw new RepositoryError("Failed to find message by id", "FIND_ERROR", error);
    }
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    try {
      const messages = await db.messages
        .where("conversationId")
        .equals(conversationId)
        .sortBy("order");
      return messages;
    } catch (error) {
      throw new RepositoryError(
        "Failed to find messages by conversation id",
        "FIND_ERROR",
        error
      );
    }
  }

  async findByConversationIdPaginated(
    conversationId: string,
    cursor?: number,
    limit = 20
  ): Promise<PaginatedResult<Message>> {
    try {
      const query = db.messages.where("[conversationId+order]");

      let messages: Message[];

      if (cursor) {
        // cursor보다 작은 order를 가진 메시지 조회 (이전 메시지)
        messages = await query
          .between([conversationId, 0], [conversationId, cursor], false, false)
          .reverse()
          .limit(limit + 1)
          .toArray();
      } else {
        // 초기 로드: 최신 메시지부터
        messages = await query
          .between([conversationId, 0], [conversationId, Number.MAX_SAFE_INTEGER])
          .reverse()
          .limit(limit + 1)
          .toArray();
      }

      const hasMore = messages.length > limit;
      const data = hasMore ? messages.slice(0, limit) : messages;
      const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].order : undefined;

      // 최신순으로 정렬 (역순 조회했으므로)
      data.reverse();

      return {
        data,
        nextCursor,
        hasMore,
      };
    } catch (error) {
      throw new RepositoryError(
        "Failed to find paginated messages",
        "PAGINATION_ERROR",
        error
      );
    }
  }

  async update(id: string, updates: Partial<Message>): Promise<void> {
    try {
      await db.messages.update(id, updates);
    } catch (error) {
      throw new RepositoryError("Failed to update message", "UPDATE_ERROR", error);
    }
  }

  async updateAnimationStatus(id: string, status: AnimationStatus): Promise<void> {
    try {
      await db.messages.update(id, { animationStatus: status });
    } catch (error) {
      throw new RepositoryError(
        "Failed to update animation status",
        "UPDATE_ERROR",
        error
      );
    }
  }

  async updateFeedback(id: string, feedback: MessageFeedback): Promise<void> {
    try {
      await db.messages.update(id, { feedback });
    } catch (error) {
      throw new RepositoryError("Failed to update feedback", "UPDATE_ERROR", error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.messages.delete(id);
    } catch (error) {
      throw new RepositoryError("Failed to delete message", "DELETE_ERROR", error);
    }
  }

  async removeOptimistic(conversationId: string): Promise<void> {
    try {
      await db.messages
        .where("conversationId")
        .equals(conversationId)
        .and((msg) => msg.isOptimistic === true)
        .delete();
    } catch (error) {
      throw new RepositoryError(
        "Failed to remove optimistic messages",
        "DELETE_ERROR",
        error
      );
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return await db.messages.toArray();
    } catch (error) {
      throw new RepositoryError("Failed to find all messages", "FIND_ERROR", error);
    }
  }
}

// Singleton export
export const messageRepository = new MessageRepository();
