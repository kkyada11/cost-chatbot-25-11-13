"use client";

import { useChatActions, useChatUI } from "@/stores/chatStore";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
  const { theme } = useChatUI();
  const { toggleThemeAction } = useChatActions();

  return (
    <button
      type="button"
      onClick={toggleThemeAction}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-border ${className}`}
      aria-label="테마 전환"
    >
      <span className="text-xl">{theme === "dark" ? "🌙" : "☀️"}</span>
      {showLabel && <span className="text-sm">{theme === "dark" ? "다크" : "라이트"}</span>}
    </button>
  );
}
