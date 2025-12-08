<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-container bg-ico-card rounded-lg shadow-lg w-full max-w-sm">
      <div class="p-4 border-b border-ico-border">
        <h3 class="text-lg font-semibold text-ico-text">Two-Factor Authentication</h3>
      </div>
      <form @submit.prevent="handleSubmit" class="p-4">
        <p class="text-sm text-ico-text-secondary mb-4">
          Please enter the 6-digit code from your authenticator app.
        </p>
        <div>
          <label for="2fa-code" class="sr-only">2FA Code</label>
          <input
            id="2fa-code"
            v-model="code"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            required
            ref="codeInput"
            class="w-full text-center tracking-[1em] text-2xl font-mono py-2 bg-ico-surface border border-ico-border rounded-md text-ico-text focus:outline-none focus:ring-2 focus:ring-ico-highlight"
            placeholder="------"
          />
        </div>
        <div v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</div>
        <div class="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-ico-surface-secondary text-ico-text rounded-md hover:bg-ico-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-ico-highlight text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center disabled:opacity-50"
          >
            <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Verify
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits(['submit', 'close']);

const code = ref('');
const codeInput = ref<HTMLInputElement | null>(null);

const handleSubmit = () => {
  if (code.value.length === 6 && !props.loading) {
    emit('submit', code.value);
  }
};

onMounted(() => {
  codeInput.value?.focus();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(2px);
}
.modal-container {
  transition: all 0.3s ease;
}
</style>