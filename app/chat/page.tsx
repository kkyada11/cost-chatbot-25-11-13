"use client";

import { useEffect } from "react";
import { useConversations } from "@/hooks/useConversations";
import { useChatStore } from "@/stores/chatStore";
import { ChatContainer } from "@/containers/ChatContainer";

export default function ChatPage() {
  const { conversations, createConversation } = useConversations();
  const currentConversationId = useChatStore((state) => state.currentConversationId);
  const selectConversationAction = useChatStore((state) => state.selectConversationAction);

  // 초기 대화 생성 및 선택
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation(undefined);
    } else if (!currentConversationId) {
      selectConversationAction({ conversationId: conversations[0].id });
    }
  }, [conversations, currentConversationId, createConversation, selectConversationAction]);

  return <ChatContainer />;
}
