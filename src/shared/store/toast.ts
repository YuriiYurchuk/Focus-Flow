import { create } from "zustand";

type ToastType = "success" | "error";

interface IToast {
  id: number;
  message: string;
  type: ToastType;
}

interface IToastState {
  toasts: IToast[];
  showToast: (message: string, type: ToastType) => void;
  removeToast: (id: number) => void;
}

let idCounter = 0;

export const useToastStore = create<IToastState>((set) => ({
  toasts: [],
  showToast: (message, type) => {
    const id = idCounter++;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
