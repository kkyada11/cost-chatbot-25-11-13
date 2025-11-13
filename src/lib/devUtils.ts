/**
 * 개발 환경 유틸리티
 */

import { db } from "./dexie";
import { logger } from "./logger";

class DevUtils {
  private isDev = process.env.NODE_ENV === "development";

  /**
   * 개발 환경 초기화
   */
  async init(): Promise<void> {
    if (!this.isDev) return;

    logger.dev("DevUtils initialized");

    // 전역 객체에 개발 도구 등록
    if (typeof window !== "undefined") {
      (window as unknown as { devUtils: DevUtils }).devUtils = this;
      logger.dev("DevUtils available at window.devUtils");
    }
  }

  /**
   * 전체 데이터베이스 초기화
   */
  async clearDatabase(): Promise<void> {
    if (!this.isDev) {
      logger.warn("clearDatabase is only available in development mode");
      return;
    }

    await db.clearAll();
    logger.log("Database cleared");
  }

  /**
   * 데이터베이스 상태 출력
   */
  async printDatabaseState(): Promise<void> {
    if (!this.isDev) return;

    const conversations = await db.conversations.toArray();
    const messages = await db.messages.toArray();

    logger.log("=== Database State ===");
    logger.log(`Conversations: ${conversations.length}`);
    logger.log(`Messages: ${messages.length}`);
    logger.log("Conversations:", conversations);
    logger.log("Messages:", messages);
  }

  /**
   * 로컬 스토리지 초기화
   */
  clearLocalStorage(): void {
    if (!this.isDev) {
      logger.warn("clearLocalStorage is only available in development mode");
      return;
    }

    if (typeof window === "undefined") return;

    localStorage.clear();
    logger.log("LocalStorage cleared");
  }

  /**
   * 전체 초기화 (DB + LocalStorage)
   */
  async resetAll(): Promise<void> {
    if (!this.isDev) {
      logger.warn("resetAll is only available in development mode");
      return;
    }

    await this.clearDatabase();
    this.clearLocalStorage();
    logger.log("All data cleared (DB + LocalStorage)");
    logger.log("Please refresh the page");
  }
}

export const devUtils = new DevUtils();
