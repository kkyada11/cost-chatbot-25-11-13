"use client";

import type { Message, MessageFeedback } from "@/types/chat";
import { formatTimestamp } from "@/lib/utils";
import { useTypedAnimation } from "@/hooks/useTypedAnimation";
import { useChatActions } from "@/stores/chatStore";
import { messageRepository } from "@/repositories";
import { logger } from "@/lib/logger";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isOptimistic = message.isOptimistic;
  const isAssistant = message.role === "assistant";
  const isTyping = message.animationStatus === "typing";
  const { updateMessageFeedbackAction } = useChatActions();

  // 타이핑 애니메이션 (assistant 메시지 + typing 상태)
  const typedRef = useTypedAnimation({
    messageId: message.id,
    content: isAssistant && isTyping ? message.content : "",
    onComplete: () => {
      // 타이핑 완료 시 추가 작업 (선택사항)
    },
  });

  // 피드백 핸들러
  const handleFeedback = async (feedback: MessageFeedback) => {
    try {
      // 같은 피드백을 다시 클릭하면 null로 설정 (토글)
      const newFeedback = message.feedback === feedback ? null : feedback;

      // Store 업데이트
      updateMessageFeedbackAction({ id: message.id, feedback: newFeedback });

      // IndexedDB 업데이트
      await messageRepository.updateFeedback(message.id, newFeedback);

      logger.log(`[MessageBubble] Feedback updated: ${message.id} -> ${newFeedback}`);
    } catch (error) {
      logger.error("[MessageBubble] Failed to update feedback", error);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-message-user text-white"
            : "bg-message-ai text-foreground border border-border"
        } ${isOptimistic ? "opacity-70" : ""}`}
      >
        {/* 타이핑 애니메이션 또는 일반 텍스트 */}
        {isAssistant && isTyping ? (
          <div ref={typedRef} className="whitespace-pre-wrap text-sm" />
        ) : (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs ${isUser ? "text-blue-100" : "text-text-secondary"}`}>
            {formatTimestamp(message.timestamp)}
          </p>

          {/* AI 메시지에만 피드백 버튼 표시 */}
          {isAssistant && !isOptimistic && !isTyping && (
            <div className="flex gap-1 ml-2">
              <button
                type="button"
                onClick={() => handleFeedback("like")}
                className={`text-sm transition-colors ${
                  message.feedback === "like"
                    ? "text-blue-500 hover:text-blue-600"
                    : "text-text-secondary hover:text-blue-500"
                }`}
                aria-label="좋아요"
              >
                👍
              </button>
              <button
                type="button"
                onClick={() => handleFeedback("dislike")}
                className={`text-sm transition-colors ${
                  message.feedback === "dislike"
                    ? "text-red-500 hover:text-red-600"
                    : "text-text-secondary hover:text-red-500"
                }`}
                aria-label="싫어요"
              >
                👎
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
