/**
 * useSpeechRecognition - Web Speech API 음성 인식 훅
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { logger } from "@/lib/logger";
import { useToast } from "./useToast";
import type { SpeechRecognitionState } from "@/types/voice";

// Web Speech API 타입 확장
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: Event) => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: Event) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechRecognitionState>({
    status: "idle",
    transcript: "",
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { showError } = useToast();

  // Web Speech API 초기화
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as Window & typeof globalThis & { SpeechRecognition?: SpeechRecognitionConstructor })
        .SpeechRecognition ||
      (window as Window & typeof globalThis & { webkitSpeechRecognition?: SpeechRecognitionConstructor })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      logger.warn("[useSpeechRecognition] Web Speech API not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = false;

    // 음성 인식 결과
    recognition.onresult = (event: Event) => {
      const speechEvent = event as SpeechRecognitionEvent;
      const transcript = Array.from(speechEvent.results)
        .map((result) => result[0].transcript)
        .join("");

      setState({
        status: "idle",
        transcript,
        error: null,
      });

      logger.log(`[useSpeechRecognition] Transcript: ${transcript}`);
    };

    // 음성 인식 시작
    recognition.onstart = () => {
      setState((prev) => ({ ...prev, status: "listening" }));
      logger.log("[useSpeechRecognition] Started listening");
    };

    // 음성 인식 종료
    recognition.onend = () => {
      setState((prev) => ({ ...prev, status: "idle" }));
      logger.log("[useSpeechRecognition] Stopped listening");
    };

    // 에러 처리
    recognition.onerror = (event: Event) => {
      const errorEvent = event as SpeechRecognitionErrorEvent;
      const errorMessage = errorEvent.error || "음성 인식 중 오류가 발생했습니다.";

      setState({
        status: "error",
        transcript: "",
        error: errorMessage,
      });

      logger.error("[useSpeechRecognition] Error:", errorMessage);
      showError(errorMessage);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [showError]);

  // 음성 인식 시작
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      showError("음성 인식을 지원하지 않는 브라우저입니다.");
      return;
    }

    try {
      recognitionRef.current.start();
      setState((prev) => ({ ...prev, transcript: "", error: null }));
    } catch (error) {
      logger.error("[useSpeechRecognition] Failed to start:", error);
      showError("음성 인식을 시작할 수 없습니다.");
    }
  }, [showError]);

  // 음성 인식 중지
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // 트랜스크립트 초기화
  const resetTranscript = useCallback(() => {
    setState((prev) => ({ ...prev, transcript: "", error: null }));
  }, []);

  return {
    transcript: state.transcript,
    isListening: state.status === "listening",
    error: state.error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: typeof window !== "undefined" && "webkitSpeechRecognition" in window,
  };
}
