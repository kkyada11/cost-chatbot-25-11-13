"use client";

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useChatStore } from "@/stores/chatStore";
import { db } from "@/lib/dexie";
import { devUtils } from "@/lib/devUtils";
import { logger } from "@/lib/logger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useChatStore((state) => state.ui.theme);
  const initializeAction = useChatStore((state) => state.initializeAction);

  // 테마 적용
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // 앱 초기화
  useEffect(() => {
    const init = async () => {
      try {
        logger.log("[Providers] Initializing app...");

        // Dexie 초기화
        await db.initialize();

        // Store 초기화
        await initializeAction();

        // DevUtils 초기화
        await devUtils.init();

        logger.log("[Providers] App initialized successfully");
      } catch (error) {
        logger.error("[Providers] App initialization failed", error);
      }
    };

    init();
  }, [initializeAction]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
