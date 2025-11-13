/**
 * Suggestions Store - 추천 질문 관리
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { logger } from "@/lib/logger";

interface SuggestionsState {
  suggestions: string[];
}

interface SuggestionsActions {
  setSuggestionsAction: (payload: { suggestions: string[] }) => void;
  clearSuggestionsAction: () => void;
}

type SuggestionsStore = SuggestionsState & SuggestionsActions;

export const useSuggestionsStore = create<SuggestionsStore>()(
  devtools(
    immer((set) => ({
      // Initial State
      suggestions: [],

      // Actions
      setSuggestionsAction: ({ suggestions }) => {
        set((state) => {
          state.suggestions = suggestions;
        });
        logger.store(`[suggestionsStore] Suggestions set: ${suggestions.length} items`);
      },

      clearSuggestionsAction: () => {
        set((state) => {
          state.suggestions = [];
        });
        logger.store("[suggestionsStore] Suggestions cleared");
      },
    })),
    { name: "SuggestionsStore" }
  )
);

// Selector hooks
export const useSuggestions = () => useSuggestionsStore((state) => state.suggestions);

export const useSuggestionsActions = () => useSuggestionsStore((state) => ({
  setSuggestionsAction: state.setSuggestionsAction,
  clearSuggestionsAction: state.clearSuggestionsAction,
}));
