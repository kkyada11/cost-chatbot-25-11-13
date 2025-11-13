/**
 * 전역 상수 정의
 */

export const API_CONFIG = {
  BASE_URL: "http://localhost:8000",
  TIMEOUT: 30000,
  DEFAULT_MODEL: "gemini",
} as const;

export const CONVERSATION_CONFIG = {
  DEFAULT_TITLE: "새 대화",
  MAX_TITLE_LENGTH: 50,
} as const;

export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  TYPING_SPEED: 30,
  ANIMATION_DELAY: 100,
  PAGINATION_LIMIT: 20,
} as const;

export const STORAGE_KEYS = {
  THEME: "cost-chatbot-theme",
  LAST_CONVERSATION_ID: "cost-chatbot-last-conversation-id",
} as const;

export const QUERY_KEYS = {
  CONVERSATIONS: "conversations",
  MESSAGES: "messages",
  INFINITE_MESSAGES: "infinite-messages",
} as const;
