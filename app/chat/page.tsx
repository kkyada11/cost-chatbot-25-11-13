"use client";

import { useEffect } from "react";
import { useConversations } from "@/hooks/useConversations";
import { useChatStore } from "@/stores/chatStore";

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

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">경비 청구 AI 챗봇</h1>
        <p className="mb-8 text-xl text-text-secondary">
          경비 청구 관련 질문에 답변해 드립니다
        </p>
        <div className="rounded-lg border border-border bg-sidebar p-8">
          <p className="text-lg">
            {conversations.length === 0
              ? "대화를 생성하는 중입니다..."
              : "곧 채팅 인터페이스가 표시됩니다"}
          </p>
          {currentConversationId && (
            <p className="mt-4 text-sm text-text-secondary">
              현재 대화 ID: {currentConversationId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
