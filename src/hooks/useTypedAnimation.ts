/**
 * useTypedAnimation - 타이핑 애니메이션 훅
 */

import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { useChatActions } from "@/stores/chatStore";
import { UI_CONFIG } from "@/lib/constants";
import { logger } from "@/lib/logger";

interface UseTypedAnimationOptions {
  messageId: string;
  content: string;
  onComplete?: () => void;
}

export function useTypedAnimation({ messageId, content, onComplete }: UseTypedAnimationOptions) {
  const elementRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<Typed | null>(null);
  const { updateMessageAnimationStatusAction } = useChatActions();

  useEffect(() => {
    if (!elementRef.current || !content) return;

    // 타이핑 시작 상태로 변경
    updateMessageAnimationStatusAction({ id: messageId, status: "typing" });

    typedRef.current = new Typed(elementRef.current, {
      strings: [content],
      typeSpeed: UI_CONFIG.TYPING_SPEED,
      showCursor: false,
      onComplete: () => {
        // 타이핑 완료 상태로 변경
        updateMessageAnimationStatusAction({ id: messageId, status: "complete" });
        logger.log(`[useTypedAnimation] Animation completed for message: ${messageId}`);
        onComplete?.();
      },
    });

    return () => {
      typedRef.current?.destroy();
    };
  }, [messageId, content, onComplete, updateMessageAnimationStatusAction]);

  return elementRef;
}
