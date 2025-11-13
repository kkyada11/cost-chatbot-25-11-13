"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { VoiceInputButton } from "./VoiceInputButton";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "메시지를 입력하세요...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-background p-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1"
          aria-label="메시지 입력"
        />
        <VoiceInputButton onTranscript={handleVoiceTranscript} disabled={disabled} />
        <Button type="submit" disabled={disabled || !message.trim()}>
          전송
        </Button>
      </div>
    </form>
  );
}
