/**
 * API 요청/응답 타입 정의
 */

export interface ChatApiRequest {
  message: string;
  model: string;
  conversation_id: string;
}

export interface ChatApiResponseData {
  content: string;
  related_questions: string[];
  is_final: boolean;
  format: string;
}

export interface ChatApiResponse {
  data: ChatApiResponseData;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
