<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center p-4 rounded-lg shadow-lg border min-w-[300px] transition-all duration-300"
        :class="{
          'bg-white border-green-500 text-green-700': toast.type === 'success',
          'bg-white border-red-500 text-red-700': toast.type === 'error',
          'bg-white border-blue-500 text-blue-700': toast.type === 'info',
          'bg-white border-yellow-500 text-yellow-700': toast.type === 'warning'
        }"
      >
        <div class="flex-1 text-sm font-medium">{{ toast.message }}</div>
        <button @click="remove(toast.id)" class="ml-4 text-gray-400 hover:text-gray-600">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface ToastItem {
  id: number;
  type: string;
  message: string;
}

const toasts = ref<ToastItem[]>([]);

const remove = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};

const handleToastEvent = (event: any) => {
  const { type, message } = event.detail;
  const id = Date.now();
  toasts.value.push({ id, type, message });

  // Auto-remove after 4 seconds
  setTimeout(() => remove(id), 4000);
};

onMounted(() => {
  window.addEventListener('app-toast', handleToastEvent);
});

onUnmounted(() => {
  window.removeEventListener('app-toast', handleToastEvent);
});
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(30px); }
.toast-leave-to { opacity: 0; transform: scale(0.9); }
</style>
