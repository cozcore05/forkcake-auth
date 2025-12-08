import { ref } from 'vue'

export function useToggle(initialState = false) {
  const isOpen = ref(initialState)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    toggle,
  }
}
