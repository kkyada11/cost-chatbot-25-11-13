/**
 * useToast - 토스트 알림 관리 훅
 */

import { useCallback } from "react";
import { useToastActions } from "@/stores/toastStore";
import type { ToastType } from "@/stores/toastStore";
import { UI_CONFIG } from "@/lib/constants";

export function useToast() {
  const { addToastAction } = useToastActions();

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration?: number) => {
      addToastAction({
        message,
        type,
        duration: duration ?? UI_CONFIG.TOAST_DURATION,
      });
    },
    [addToastAction]
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "success", duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "error", duration);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "info", duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "warning", duration);
    },
    [showToast]
  );

  return {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
