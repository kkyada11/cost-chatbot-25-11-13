import type { Message } from "@/types/chat";
import { formatTimestamp } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isOptimistic = message.isOptimistic;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-message-user text-white"
            : "bg-message-ai text-foreground border border-border"
        } ${isOptimistic ? "opacity-70" : ""}`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        <p
          className={`mt-1 text-xs ${isUser ? "text-blue-100" : "text-text-secondary"}`}
        >
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
