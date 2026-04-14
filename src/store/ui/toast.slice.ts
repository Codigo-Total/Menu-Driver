import { create } from "zustand";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  nonce: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id" | "nonce">) => void;
  removeToast: (id: string) => void;
}

let toastTimeout: NodeJS.Timeout | null = null;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = "singleton-toast";

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    set(() => ({ toasts: [{ ...toast, id, nonce: Date.now() }] }));

    toastTimeout = setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
