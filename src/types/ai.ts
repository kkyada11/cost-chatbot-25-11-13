/**
 * AI 모델 관련 타입 정의
 */

export type AIModel = "gemini" | "gpt-4" | "claude";

export interface AIModelInfo {
  id: AIModel;
  name: string;
  description: string;
  maxTokens: number;
}

export const AI_MODELS: Record<AIModel, AIModelInfo> = {
  gemini: {
    id: "gemini",
    name: "Gemini",
    description: "Google Gemini AI",
    maxTokens: 8192,
  },
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
    description: "OpenAI GPT-4",
    maxTokens: 8192,
  },
  claude: {
    id: "claude",
    name: "Claude",
    description: "Anthropic Claude",
    maxTokens: 8192,
  },
};
