import { useToastStore } from "@/shared/store/toast";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastItemProps {
  toast: {
    id: number;
    message: string;
    type: "success" | "error";
  };
  onRemove: (id: number) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    const autoRemoveTimer = setTimeout(() => {
      handleRemove();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoRemoveTimer);
    };
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 150);
  };

  const getToastStyles = () => {
    const baseStyles = `
      relative overflow-hidden backdrop-blur-sm border transition-all duration-300 ease-out
      ${
        isVisible && !isRemoving
          ? "transform translate-x-0 opacity-100 scale-100"
          : "transform translate-x-full opacity-0 scale-95"
      }
    `;

    if (toast.type === "success") {
      return `${baseStyles} bg-emerald-500/90 border-emerald-400/50 shadow-lg shadow-emerald-500/25`;
    } else {
      return `${baseStyles} bg-red-500/90 border-red-400/50 shadow-lg shadow-red-500/25`;
    }
  };

  const getIconStyles = () => {
    if (toast.type === "success") {
      return "text-emerald-100";
    } else {
      return "text-red-100";
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`${getToastStyles()} px-4 py-3 rounded-xl text-white text-sm max-w-sm`}
    >
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
        <div
          className="h-full bg-white/60 transition-all duration-[4000ms] ease-linear"
          style={{
            width: isRemoving ? "0%" : "100%",
            transform: isVisible && !isRemoving ? "scaleX(0)" : "scaleX(1)",
            transformOrigin: "left",
          }}
        />
      </div>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${getIconStyles()}`}>
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 pt-0.5">
          <p className="font-medium leading-5">{toast.message}</p>
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-1 -m-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Toaster = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-2 left-2 sm:right-4 sm:left-auto z-50 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto overflow-hidden">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};
