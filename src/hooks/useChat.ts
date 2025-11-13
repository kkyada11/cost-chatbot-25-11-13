/**
 * useChat - 메시지 전송 로직 훅
 */

import { useState, useCallback } from "react";
import { useChatActions, useChatState } from "@/stores/chatStore";
import { useSuggestionsActions } from "@/stores/suggestionsStore";
import { messageFactory } from "@/factories";
import { messageRepository } from "@/repositories";
import { apiClient } from "@/lib/api";
import { logger } from "@/lib/logger";
import { useToast } from "./useToast";
import type { ChatApiRequest, ChatApiResponse } from "@/types/api";
import { API_CONFIG } from "@/lib/constants";

export function useChat() {
  const [isSending, setIsSending] = useState(false);
  const { currentConversationId } = useChatState();
  const {
    addMessageAction,
    removeOptimisticMessagesAction,
    updateMessageAnimationStatusAction,
  } = useChatActions();
  const { setSuggestionsAction } = useSuggestionsActions();
  const { showError } = useToast();

  const sendMessage = useCallback(
    async (content: string, conversationId: string) => {
      if (!content.trim() || isSending) return;

      setIsSending(true);

      try {
        // 1. 낙관적 User 메시지 생성 및 추가
        const optimisticUserMessage = messageFactory.createOptimisticMessage({
          conversationId,
          content,
          role: "user",
        });

        addMessageAction({ message: optimisticUserMessage });
        logger.log("[useChat] Optimistic user message added");

        // 2. 낙관적 AI 메시지 생성 및 추가
        const optimisticAiMessage = messageFactory.createOptimisticMessage({
          conversationId,
          content: "",
          role: "assistant",
        });

        addMessageAction({ message: optimisticAiMessage });
        logger.log("[useChat] Optimistic AI message added");

        // 3. API 요청
        const request: ChatApiRequest = {
          message: content,
          model: API_CONFIG.DEFAULT_MODEL,
          conversation_id: conversationId,
        };

        const response = await apiClient.post<ChatApiResponse>("/chat", request);
        const { content: aiContent, related_questions } = response.data.data;

        logger.log("[useChat] API response received");

        // 4. 낙관적 메시지 제거
        removeOptimisticMessagesAction({ conversationId });

        // 5. 실제 메시지 생성 및 저장
        const userMessage = messageFactory.createUserMessage({
          conversationId,
          content,
        });

        const aiMessage = messageFactory.createAssistantMessage({
          conversationId,
          content: aiContent,
          relatedQuestions: related_questions,
        });

        await messageRepository.save(userMessage);
        await messageRepository.save(aiMessage);

        addMessageAction({ message: userMessage });
        addMessageAction({ message: aiMessage });

        logger.log("[useChat] Real messages saved and added");

        // 6. 타이핑 애니메이션 시작
        updateMessageAnimationStatusAction({ id: aiMessage.id, status: "typing" });

        // 7. 추천 질문 업데이트
        if (related_questions && related_questions.length > 0) {
          setSuggestionsAction({ suggestions: related_questions });
        }
      } catch (error) {
        logger.error("[useChat] Send message failed", error);
        showError("메시지 전송에 실패했습니다.");

        // 에러 시 낙관적 메시지 제거
        removeOptimisticMessagesAction({ conversationId });
      } finally {
        setIsSending(false);
      }
    },
    [
      isSending,
      addMessageAction,
      removeOptimisticMessagesAction,
      updateMessageAnimationStatusAction,
      setSuggestionsAction,
      showError,
    ]
  );

  return {
    sendMessage,
    isSending,
    currentConversationId,
  };
}
