'use client'

import { ref, watch, onMounted } from 'vue'

// Create a shared state that persists across component instances
const isDarkMode = ref(false)
let isInitialized = false

export function useTheme() {
  // Function to apply theme
  const applyTheme = () => {
    // Save preference to localStorage
    localStorage.setItem('kucoin-theme', isDarkMode.value ? 'dark' : 'light')

    // Apply theme to document
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark-theme')

      // Force a re-render after a short delay to ensure dark mode is applied
      setTimeout(() => {
        document.body.classList.add('dark-theme')
      }, 100)

      console.log('Dark mode applied: Added dark class to HTML and body')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark-theme')

      console.log('Light mode applied: Removed dark class from HTML and body')
    }
  }

  // Function to toggle dark mode
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    console.log('toggleTheme called, new isDarkMode value:', isDarkMode.value)
    applyTheme()
  }

  // Initialize theme only once
  if (!isInitialized) {
    // Watch for theme changes
    watch(isDarkMode, (newValue) => {
      console.log('isDarkMode changed to:', newValue)
      applyTheme()
    })

    onMounted(() => {
      // Check for saved theme preference or system preference
      const savedTheme = localStorage.getItem('kucoin-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      console.log('Saved theme:', savedTheme, 'System prefers dark:', prefersDark)

      // Set initial theme state
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        isDarkMode.value = true
      } else {
        isDarkMode.value = false
      }

      console.log('Initial isDarkMode value:', isDarkMode.value)

      // Apply theme immediately
      applyTheme()

      // Force a re-render after a short delay to ensure dark mode is applied
      setTimeout(() => {
        applyTheme()
      }, 100)
    })

    isInitialized = true
  }

  return {
    isDarkMode,
    toggleTheme,
  }
}
