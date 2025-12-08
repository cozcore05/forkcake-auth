import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: false
  }),

  actions: {
    initTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        // Check user's system preference
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.applyTheme();
    },

    toggleTheme() {
      // Disable transitions during theme switch
      this.disableTransitions();
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
      this.applyTheme();
      // Re-enable transitions after theme is applied
      this.enableTransitions();
    },

    disableTransitions() {
      const css = document.createElement('style');
      css.textContent = '* { transition: none !important; }';
      css.id = 'disable-transitions';
      document.head.appendChild(css);
    },

    enableTransitions() {
      requestAnimationFrame(() => {
        const style = document.getElementById('disable-transitions');
        if (style) {
          style.remove();
        }
      });
    },

    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
});