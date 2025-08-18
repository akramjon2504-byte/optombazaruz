import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToastSystem() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    options?: {
      message?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      type,
      title,
      message: options?.message,
      duration: options?.duration ?? (type === "error" ? 8000 : 5000),
      action: options?.action,
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, options?: Parameters<typeof addToast>[2]) => 
    addToast("success", title, options), [addToast]);

  const error = useCallback((title: string, options?: Parameters<typeof addToast>[2]) => 
    addToast("error", title, options), [addToast]);

  const info = useCallback((title: string, options?: Parameters<typeof addToast>[2]) => 
    addToast("info", title, options), [addToast]);

  const warning = useCallback((title: string, options?: Parameters<typeof addToast>[2]) => 
    addToast("warning", title, options), [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    info,
    warning,
  };
}