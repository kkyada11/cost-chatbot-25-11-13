/**
 * 음성 인식 관련 타입 정의
 */

export interface SpeechRecognitionConfig {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export type SpeechRecognitionStatus = "idle" | "listening" | "processing" | "error";

export interface SpeechRecognitionState {
  status: SpeechRecognitionStatus;
  transcript: string;
  error: string | null;
}
