"use client";

import { useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Button } from "../ui/Button";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInputButton({ onTranscript, disabled }: VoiceInputButtonProps) {
  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } =
    useSpeechRecognition();

  // 트랜스크립트 변경 시 부모 컴포넌트에 전달
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null; // 지원하지 않는 브라우저에서는 표시하지 않음
  }

  return (
    <Button
      type="button"
      variant={isListening ? "danger" : "ghost"}
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className={isListening ? "animate-pulse" : ""}
      aria-label={isListening ? "음성 인식 중지" : "음성 인식 시작"}
    >
      {isListening ? "⏹" : "🎤"}
    </Button>
  );
}
