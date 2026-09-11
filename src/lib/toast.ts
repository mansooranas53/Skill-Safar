export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
  duration?: number;
}

type ToastListener = (toasts: ToastMessage[]) => void;

class ToastManager {
  private toasts: ToastMessage[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn([...this.toasts]));
  }

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = 't_' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 4000
    };

    this.toasts = [newToast, ...this.toasts.slice(0, 4)];
    this.notify();

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duration);
    }
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  success(title: string, description?: string) {
    this.show({ type: 'success', title, description });
  }

  info(title: string, description?: string) {
    this.show({ type: 'info', title, description });
  }

  warning(title: string, description?: string) {
    this.show({ type: 'warning', title, description });
  }

  error(title: string, description?: string) {
    this.show({ type: 'error', title, description });
  }
}

export const toast = new ToastManager();
