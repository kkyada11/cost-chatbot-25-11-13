"use client";

import { useChatState, useChatActions } from "@/stores/chatStore";
import { useConversations } from "@/hooks/useConversations";
import { SidebarPresentation } from "@/components/layout/SidebarPresentation";

export function SidebarContainer() {
  const { conversations, currentConversationId } = useChatState();
  const { selectConversationAction } = useChatActions();
  const { createConversation, deleteConversation } = useConversations();

  const handleNewChat = () => {
    createConversation(undefined);
  };

  const handleSelectConversation = (id: string) => {
    selectConversationAction({ conversationId: id });
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
  };

  return (
    <SidebarPresentation
      conversations={conversations}
      currentConversationId={currentConversationId}
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      onDeleteConversation={handleDeleteConversation}
    />
  );
}
