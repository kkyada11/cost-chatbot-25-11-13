/**
 * useInfiniteChatMessages - 무한 스크롤 메시지 로딩 훅
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { useChatActions, useChatState } from "@/stores/chatStore";
import { messageService } from "@/services";
import { logger } from "@/lib/logger";
import { QUERY_KEYS, UI_CONFIG } from "@/lib/constants";
import type { Message } from "@/types/chat";

export function useInfiniteChatMessages(
  conversationId: string | null,
  pageSize: number = UI_CONFIG.PAGINATION_LIMIT
) {
  const { messages } = useChatState();
  const { setMessagesAction } = useChatActions();

  const {
    data,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.INFINITE_MESSAGES, conversationId],
    queryFn: async ({ pageParam }) => {
      if (!conversationId) {
        return { data: [], nextCursor: undefined, hasMore: false };
      }

      const result = await messageService.loadMessagesPaginated(
        conversationId,
        pageParam,
        pageSize
      );

      logger.dev(
        `[useInfiniteChatMessages] Page loaded: ${result.data.length} messages, cursor: ${pageParam}`
      );

      return result;
    },
    initialPageParam: undefined as number | undefined,
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasMore ? firstPage.nextCursor : undefined;
    },
    getNextPageParam: () => undefined, // 역방향 스크롤만 지원
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  // 페이지들을 flat하게 병합
  const flatMessages = useMemo(() => {
    if (!data) return [];

    const allMessages: Message[] = [];

    // 페이지들을 역순으로 순회 (최신 페이지부터)
    for (let i = data.pages.length - 1; i >= 0; i--) {
      allMessages.push(...data.pages[i].data);
    }

    return allMessages;
  }, [data]);

  // Store와 동기화
  useEffect(() => {
    if (flatMessages.length > 0) {
      setMessagesAction({ messages: flatMessages });
      logger.dev(
        `[useInfiniteChatMessages] Synced ${flatMessages.length} messages to store`
      );
    }
  }, [flatMessages, setMessagesAction]);

  // Store의 낙관적 메시지와 병합
  const combinedMessages = useMemo(() => {
    const optimisticMessages = messages.filter(
      (msg) => msg.conversationId === conversationId && msg.isOptimistic
    );

    const nonOptimisticMessages = messages.filter(
      (msg) => msg.conversationId === conversationId && !msg.isOptimistic
    );

    return [...nonOptimisticMessages, ...optimisticMessages];
  }, [messages, conversationId]);

  return {
    messages: combinedMessages,
    hasMoreMessages: hasPreviousPage ?? false,
    isFetchingPreviousPage,
    fetchPreviousPage,
    isLoading,
    isError,
    error,
    refetch,
  };
}
