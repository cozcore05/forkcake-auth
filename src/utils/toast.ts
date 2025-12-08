// utils/toast.ts
// FIX: We removed "import { useToast } from 'vue-toastification'"
// This prevents the heavy library from being bundled into the main chunk.

export const toast = {
  success: (message: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { type: 'success', message } 
      }));
    }
  },
  error: (message: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { type: 'error', message } 
      }));
    }
  },
  info: (message: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { type: 'info', message } 
      }));
    }
  },
  warning: (message: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { type: 'warning', message } 
      }));
    }
  }
};