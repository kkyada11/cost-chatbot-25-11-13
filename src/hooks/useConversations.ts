/**
 * useConversations - 대화 목록 관리 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatActions, useChatState } from "@/stores/chatStore";
import { conversationFactory } from "@/factories";
import { conversationRepository } from "@/repositories";
import { logger } from "@/lib/logger";
import { useToast } from "./useToast";
import { QUERY_KEYS } from "@/lib/constants";
import type { Conversation } from "@/types/chat";

export function useConversations() {
  const queryClient = useQueryClient();
  const { conversations } = useChatState();
  const {
    setConversationsAction,
    selectConversationAction,
    deleteConversationAction,
    updateConversationAction,
    addConversationAction,
  } = useChatActions();
  const { showSuccess, showError } = useToast();

  // 대화 목록 조회
  const { isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.CONVERSATIONS],
    queryFn: async () => {
      const convs = await conversationRepository.findAll();
      setConversationsAction({ conversations: convs });
      logger.log(`[useConversations] Loaded ${convs.length} conversations`);
      return convs;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 새 대화 생성
  const createConversation = useMutation({
    mutationFn: async (firstMessage?: string) => {
      const conversation = conversationFactory.createConversation(firstMessage);
      await conversationRepository.save(conversation);
      return conversation;
    },
    onSuccess: (conversation) => {
      addConversationAction({ conversation });
      selectConversationAction({ conversationId: conversation.id });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
      logger.log(`[useConversations] Conversation created: ${conversation.id}`);
    },
    onError: (error) => {
      logger.error("[useConversations] Create conversation failed", error);
      showError("대화 생성에 실패했습니다.");
    },
  });

  // 대화 삭제
  const deleteConversation = useMutation({
    mutationFn: async (conversationId: string) => {
      await conversationRepository.delete(conversationId);
      return conversationId;
    },
    onSuccess: (conversationId) => {
      deleteConversationAction({ id: conversationId });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });

      // 삭제 후 첫 번째 대화 선택 또는 새 대화 생성
      const remaining = conversations.filter((conv) => conv.id !== conversationId);
      if (remaining.length > 0) {
        selectConversationAction({ conversationId: remaining[0].id });
      } else {
        // 대화가 없으면 새 대화 생성
        createConversation.mutate();
      }

      showSuccess("대화가 삭제되었습니다.");
      logger.log(`[useConversations] Conversation deleted: ${conversationId}`);
    },
    onError: (error) => {
      logger.error("[useConversations] Delete conversation failed", error);
      showError("대화 삭제에 실패했습니다.");
    },
  });

  // 대화 제목 수정
  const updateConversationTitle = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      await conversationRepository.update(id, { title });
      return { id, title };
    },
    onSuccess: ({ id, title }) => {
      updateConversationAction({ id, updates: { title } });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
      showSuccess("제목이 수정되었습니다.");
      logger.log(`[useConversations] Conversation title updated: ${id}`);
    },
    onError: (error) => {
      logger.error("[useConversations] Update title failed", error);
      showError("제목 수정에 실패했습니다.");
    },
  });

  // 대화 선택
  const selectConversation = (conversationId: string | null) => {
    selectConversationAction({ conversationId });
    logger.log(`[useConversations] Conversation selected: ${conversationId}`);
  };

  return {
    conversations,
    isLoading,
    error,
    refetch,
    createConversation: createConversation.mutate,
    deleteConversation: deleteConversation.mutate,
    updateConversationTitle: updateConversationTitle.mutate,
    selectConversation,
    isCreating: createConversation.isPending,
    isDeleting: deleteConversation.isPending,
    isUpdating: updateConversationTitle.isPending,
  };
}
