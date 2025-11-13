/**
 * useAnimationCallbacks - 애니메이션 콜백 훅
 */

import { useCallback } from "react";
import { useChatActions } from "@/stores/chatStore";
import { messageRepository } from "@/repositories";
import { logger } from "@/lib/logger";
import type { AnimationStatus } from "@/types/chat";

export function useAnimationCallbacks() {
  const { updateMessageAnimationStatusAction } = useChatActions();

  const updateAnimationStatus = useCallback(
    async (messageId: string, status: AnimationStatus) => {
      try {
        // Store 업데이트
        updateMessageAnimationStatusAction({ id: messageId, status });

        // IndexedDB 업데이트
        await messageRepository.updateAnimationStatus(messageId, status);

        logger.log(`[useAnimationCallbacks] Animation status updated: ${messageId} -> ${status}`);
      } catch (error) {
        logger.error("[useAnimationCallbacks] Failed to update animation status", error);
      }
    },
    [updateMessageAnimationStatusAction]
  );

  const startTyping = useCallback(
    (messageId: string) => {
      updateAnimationStatus(messageId, "typing");
    },
    [updateAnimationStatus]
  );

  const completeAnimation = useCallback(
    (messageId: string) => {
      updateAnimationStatus(messageId, "complete");
    },
    [updateAnimationStatus]
  );

  return {
    updateAnimationStatus,
    startTyping,
    completeAnimation,
  };
}
