/**
 * IndexedDB 관련 타입 정의
 */

import type { Message, Conversation } from "./chat";

export interface DatabaseSchema {
  conversations: Conversation;
  messages: Message;
}

export type DatabaseTable = keyof DatabaseSchema;

export interface DatabaseConfig {
  name: string;
  version: number;
}
