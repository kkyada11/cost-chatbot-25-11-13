import type { Conversation } from "@/types/chat";
import { formatTimestamp } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  currentConversationId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-text-secondary">대화가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto p-2">
      {conversations.map((conversation) => {
        const isActive = conversation.id === currentConversationId;

        return (
          <div
            key={conversation.id}
            className={`group relative cursor-pointer rounded-lg p-3 transition-colors ${
              isActive ? "bg-primary text-white" : "hover:bg-border"
            }`}
            onClick={() => onSelect(conversation.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(conversation.id);
              }
            }}
          >
            <p className={`truncate text-sm font-medium ${isActive ? "text-white" : "text-foreground"}`}>
              {conversation.title}
            </p>
            <p className={`text-xs ${isActive ? "text-blue-100" : "text-text-secondary"}`}>
              {formatTimestamp(conversation.timestamp)}
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conversation.id);
              }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-error opacity-0 transition-opacity hover:bg-red-100 group-hover:opacity-100 ${
                isActive ? "hover:bg-red-600" : ""
              }`}
              aria-label="대화 삭제"
            >
              🗑️
            </button>
          </div>
        );
      })}
    </div>
  );
}
