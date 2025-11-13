import type { Conversation } from "@/types/chat";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ConversationList } from "./ConversationList";

interface SidebarPresentationProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function SidebarPresentation({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: SidebarPresentationProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h1 className="mb-4 text-lg font-bold text-foreground">경비 청구 챗봇</h1>
        <Button onClick={onNewChat} className="w-full" size="sm">
          + 새 대화
        </Button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelect={onSelectConversation}
          onDelete={onDeleteConversation}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <ThemeToggle showLabel className="w-full" />
      </div>
    </aside>
  );
}
