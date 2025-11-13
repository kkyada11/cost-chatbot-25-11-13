/**
 * Toast Store - 토스트 알림 관리
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { logger } from "@/lib/logger";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  addToastAction: (payload: Omit<Toast, "id">) => void;
  removeToastAction: (payload: { id: string }) => void;
  clearToastsAction: () => void;
}

type ToastStore = ToastState & ToastActions;

export const useToastStore = create<ToastStore>()(
  devtools(
    immer((set) => ({
      // Initial State
      toasts: [],

      // Actions
      addToastAction: (payload) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const toast: Toast = { id, ...payload };

        set((state) => {
          state.toasts.push(toast);
        });

        logger.store(`[toastStore] Toast added: ${toast.type} - ${toast.message}`);

        // Auto remove after duration
        if (toast.duration) {
          setTimeout(() => {
            set((state) => {
              state.toasts = state.toasts.filter((t) => t.id !== id);
            });
            logger.store(`[toastStore] Toast removed: ${id}`);
          }, toast.duration);
        }
      },

      removeToastAction: ({ id }) => {
        set((state) => {
          state.toasts = state.toasts.filter((t) => t.id !== id);
        });
        logger.store(`[toastStore] Toast removed: ${id}`);
      },

      clearToastsAction: () => {
        set((state) => {
          state.toasts = [];
        });
        logger.store("[toastStore] All toasts cleared");
      },
    })),
    { name: "ToastStore" }
  )
);

// Selector hooks
export const useToasts = () => useToastStore((state) => state.toasts);

export const useToastActions = () => useToastStore((state) => ({
  addToastAction: state.addToastAction,
  removeToastAction: state.removeToastAction,
  clearToastsAction: state.clearToastsAction,
}));
