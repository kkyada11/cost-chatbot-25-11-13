/**
 * Chat Store - 메인 상태 관리 (Flux 패턴)
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Message, Conversation, ChatState, Theme, AnimationStatus, MessageFeedback } from "@/types/chat";
import { messageService, conversationService } from "@/services";
import { logger } from "@/lib/logger";
import { STORAGE_KEYS } from "@/lib/constants";

interface ChatActions {
  // Message Actions
  addMessageAction: (payload: { message: Message }) => void;
  setMessagesAction: (payload: { messages: Message[] }) => void;
  updateMessageAction: (payload: { id: string; updates: Partial<Message> }) => void;
  updateMessageAnimationStatusAction: (payload: { id: string; status: AnimationStatus }) => void;
  updateMessageFeedbackAction: (payload: { id: string; feedback: MessageFeedback }) => void;
  removeOptimisticMessagesAction: (payload: { conversationId: string }) => void;
  clearMessagesAction: () => void;

  // Conversation Actions
  addConversationAction: (payload: { conversation: Conversation }) => void;
  setConversationsAction: (payload: { conversations: Conversation[] }) => void;
  updateConversationAction: (payload: { id: string; updates: Partial<Conversation> }) => void;
  deleteConversationAction: (payload: { id: string }) => void;
  selectConversationAction: (payload: { conversationId: string | null }) => void;
  clearConversationsAction: () => void;

  // UI Actions
  toggleSidebarAction: () => void;
  setSidebarOpenAction: (payload: { isOpen: boolean }) => void;
  setLoadingAction: (payload: { isLoading: boolean }) => void;
  setThemeAction: (payload: { theme: Theme }) => void;
  toggleThemeAction: () => void;
  setConversationIdMutatedAction: (payload: { isConversationIdMutated: boolean }) => void;

  // Initialization
  initializeAction: () => Promise<void>;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      messages: [],
      conversations: [],
      currentConversationId: null,
      ui: {
        isSidebarOpen: true,
        isLoading: false,
        theme: "light",
        resolvedTheme: "light",
        isConversationIdMutated: false,
      },

      // Message Actions
      addMessageAction: ({ message }) => {
        set((state) => {
          state.messages.push(message);
        });
        logger.store(`[chatStore] Message added: ${message.id}`);
      },

      setMessagesAction: ({ messages }) => {
        set((state) => {
          // 기존 낙관적 메시지 보존
          const optimisticMessages = state.messages.filter((msg) => msg.isOptimistic);

          // 새 메시지와 병합
          const allMessages = [...messages, ...optimisticMessages];

          // 중복 제거 (id 기준)
          const uniqueMessages = Array.from(
            new Map(allMessages.map((msg) => [msg.id, msg])).values()
          );

          // order 기준 정렬, 동일 order는 role 순서 (user → assistant)
          uniqueMessages.sort((a, b) => {
            if (a.order !== b.order) {
              return a.order - b.order;
            }
            return a.role === "user" ? -1 : 1;
          });

          state.messages = uniqueMessages;
        });
        logger.store(`[chatStore] Messages set: ${messages.length} messages`);
      },

      updateMessageAction: ({ id, updates }) => {
        set((state) => {
          const message = state.messages.find((msg) => msg.id === id);
          if (message) {
            Object.assign(message, updates);
          }
        });
        logger.store(`[chatStore] Message updated: ${id}`);
      },

      updateMessageAnimationStatusAction: ({ id, status }) => {
        set((state) => {
          const message = state.messages.find((msg) => msg.id === id);
          if (message) {
            message.animationStatus = status;
          }
        });
        logger.store(`[chatStore] Animation status updated: ${id} -> ${status}`);
      },

      updateMessageFeedbackAction: ({ id, feedback }) => {
        set((state) => {
          const message = state.messages.find((msg) => msg.id === id);
          if (message) {
            message.feedback = feedback;
          }
        });
        logger.store(`[chatStore] Feedback updated: ${id} -> ${feedback}`);
      },

      removeOptimisticMessagesAction: ({ conversationId }) => {
        set((state) => {
          state.messages = state.messages.filter(
            (msg) => !(msg.conversationId === conversationId && msg.isOptimistic)
          );
        });
        logger.store(`[chatStore] Optimistic messages removed for: ${conversationId}`);
      },

      clearMessagesAction: () => {
        set((state) => {
          state.messages = [];
        });
        logger.store("[chatStore] Messages cleared");
      },

      // Conversation Actions
      addConversationAction: ({ conversation }) => {
        set((state) => {
          // 중복 방지
          const exists = state.conversations.some((conv) => conv.id === conversation.id);
          if (!exists) {
            state.conversations.unshift(conversation);
          }
        });
        logger.store(`[chatStore] Conversation added: ${conversation.id}`);
      },

      setConversationsAction: ({ conversations }) => {
        set((state) => {
          state.conversations = conversations;
        });
        logger.store(`[chatStore] Conversations set: ${conversations.length} conversations`);
      },

      updateConversationAction: ({ id, updates }) => {
        set((state) => {
          const conversation = state.conversations.find((conv) => conv.id === id);
          if (conversation) {
            Object.assign(conversation, updates);
          }
        });
        logger.store(`[chatStore] Conversation updated: ${id}`);
      },

      deleteConversationAction: ({ id }) => {
        set((state) => {
          state.conversations = state.conversations.filter((conv) => conv.id !== id);

          // 현재 선택된 대화가 삭제된 경우
          if (state.currentConversationId === id) {
            state.currentConversationId = null;
          }

          // 해당 대화의 메시지도 제거
          state.messages = state.messages.filter((msg) => msg.conversationId !== id);
        });
        logger.store(`[chatStore] Conversation deleted: ${id}`);
      },

      selectConversationAction: ({ conversationId }) => {
        set((state) => {
          state.currentConversationId = conversationId;
          state.ui.isConversationIdMutated = true;
        });
        logger.store(`[chatStore] Conversation selected: ${conversationId}`);
      },

      clearConversationsAction: () => {
        set((state) => {
          state.conversations = [];
          state.currentConversationId = null;
        });
        logger.store("[chatStore] Conversations cleared");
      },

      // UI Actions
      toggleSidebarAction: () => {
        set((state) => {
          state.ui.isSidebarOpen = !state.ui.isSidebarOpen;
        });
        logger.store(`[chatStore] Sidebar toggled: ${get().ui.isSidebarOpen}`);
      },

      setSidebarOpenAction: ({ isOpen }) => {
        set((state) => {
          state.ui.isSidebarOpen = isOpen;
        });
        logger.store(`[chatStore] Sidebar set: ${isOpen}`);
      },

      setLoadingAction: ({ isLoading }) => {
        set((state) => {
          state.ui.isLoading = isLoading;
        });
      },

      setThemeAction: ({ theme }) => {
        set((state) => {
          state.ui.theme = theme;
          state.ui.resolvedTheme = theme;
        });

        // localStorage에 저장
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.THEME, theme);
        }

        logger.store(`[chatStore] Theme set: ${theme}`);
      },

      toggleThemeAction: () => {
        const currentTheme = get().ui.theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        get().setThemeAction({ theme: newTheme });
      },

      setConversationIdMutatedAction: ({ isConversationIdMutated }) => {
        set((state) => {
          state.ui.isConversationIdMutated = isConversationIdMutated;
        });
      },

      // Initialization
      initializeAction: async () => {
        try {
          logger.log("[chatStore] Initializing...");

          // localStorage에서 테마 복원
          if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
            if (savedTheme === "light" || savedTheme === "dark") {
              get().setThemeAction({ theme: savedTheme });
            }
          }

          // Service Layer에 Store Actions 주입
          messageService.setStoreActions({
            removeOptimisticMessagesAction: get().removeOptimisticMessagesAction,
          });

          conversationService.setStoreActions({
            addConversationAction: get().addConversationAction,
            setConversationsAction: get().setConversationsAction,
          });

          logger.log("[chatStore] Initialized successfully");
        } catch (error) {
          logger.error("[chatStore] Initialization failed", error);
        }
      },
    })),
    { name: "ChatStore" }
  )
);

// Selector hooks
export const useChatState = () => useChatStore((state) => ({
  messages: state.messages,
  conversations: state.conversations,
  currentConversationId: state.currentConversationId,
}));

export const useChatUI = () => useChatStore((state) => state.ui);

export const useChatActions = () => useChatStore((state) => ({
  addMessageAction: state.addMessageAction,
  setMessagesAction: state.setMessagesAction,
  updateMessageAction: state.updateMessageAction,
  updateMessageAnimationStatusAction: state.updateMessageAnimationStatusAction,
  updateMessageFeedbackAction: state.updateMessageFeedbackAction,
  removeOptimisticMessagesAction: state.removeOptimisticMessagesAction,
  clearMessagesAction: state.clearMessagesAction,
  addConversationAction: state.addConversationAction,
  setConversationsAction: state.setConversationsAction,
  updateConversationAction: state.updateConversationAction,
  deleteConversationAction: state.deleteConversationAction,
  selectConversationAction: state.selectConversationAction,
  clearConversationsAction: state.clearConversationsAction,
  toggleSidebarAction: state.toggleSidebarAction,
  setSidebarOpenAction: state.setSidebarOpenAction,
  setLoadingAction: state.setLoadingAction,
  setThemeAction: state.setThemeAction,
  toggleThemeAction: state.toggleThemeAction,
  setConversationIdMutatedAction: state.setConversationIdMutatedAction,
  initializeAction: state.initializeAction,
}));
