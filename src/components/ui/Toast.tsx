import type { Toast as ToastType } from "@/stores/toastStore";
import { useToastActions } from "@/stores/toastStore";

interface ToastProps {
  toast: ToastType;
}

export function Toast({ toast }: ToastProps) {
  const { removeToastAction } = useToastActions();

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  const colors = {
    success: "bg-success",
    error: "bg-error",
    info: "bg-info",
    warning: "bg-warning",
  };

  return (
    <div
      className={`${colors[toast.type]} animate-slide-up flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg`}
      role="alert"
    >
      <span className="text-xl">{icons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => removeToastAction({ id: toast.id })}
        className="text-white hover:opacity-80"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}
