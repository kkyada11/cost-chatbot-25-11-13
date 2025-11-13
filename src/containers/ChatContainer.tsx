"use client";

import { useChatState } from "@/stores/chatStore";
import { useChat } from "@/hooks/useChat";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";

export function ChatContainer() {
  const { messages, currentConversationId } = useChatState();
  const { sendMessage, isSending } = useChat();

  const currentMessages = messages.filter(
    (msg) => msg.conversationId === currentConversationId
  );

  const handleSendMessage = (content: string) => {
    if (currentConversationId) {
      sendMessage(content, currentConversationId);
    }
  };

  if (!currentConversationId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-text-secondary">대화를 선택하거나 새 대화를 시작하세요</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <MessageList messages={currentMessages} isLoading={isSending} />
      <MessageInput
        onSend={handleSendMessage}
        disabled={isSending}
        placeholder="메시지를 입력하세요..."
      />
    </div>
  );
}
