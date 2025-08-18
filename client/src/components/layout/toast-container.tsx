import { createPortal } from "react-dom";
import { useToastSystem } from "@/hooks/use-toast-system";
import ToastNotification from "@/components/ui/toast-notification";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastSystem();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>,
    document.body
  );
}