<template>
  <div :class="{ dark: themeStore.isDarkMode }" class="min-h-screen bg-ico-background text-ico-text font-sans transition-colors duration-300">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"; // <--- ADDED 'watch'
import { useThemeStore } from "@/store/theme";

const themeStore = useThemeStore();

// === CRITICAL FIX: Watch for theme changes ===
// This listener waits for the button click and updates the colors instantly
watch(
  () => themeStore.isDarkMode,
  () => {
    applyThemeVariables();
  }
);

onMounted(() => {
  themeStore.initTheme();
  applyThemeVariables();
});

function applyThemeVariables() {
  const root = document.documentElement;

  if (themeStore.isDarkMode) {
    // === DARK THEME COLORS ===
    root.style.setProperty("--ico-background", "#1a2234");
    root.style.setProperty("--ico-surface", "#232c3d");
    root.style.setProperty("--ico-surface-secondary", "#2d3748");
    root.style.setProperty("--ico-surface-hover", "rgba(59, 130, 246, 0.1)");

    root.style.setProperty("--ico-text", "#ffffff");
    root.style.setProperty("--ico-text-secondary", "#a0aec0");
    root.style.setProperty("--ico-text-tertiary", "#718096");

    root.style.setProperty("--ico-border", "#2d3748");
    root.style.setProperty("--ico-highlight", "#3b82f6");

    root.style.setProperty("--color-input", "#1e293b");
    root.style.setProperty("--color-error", "#ef4444");
    root.style.setProperty("--color-success", "#10b981");

    // Add dark class to html tag for Tailwind utilities
    document.documentElement.classList.add('dark');

  } else {
    // === LIGHT THEME COLORS ===
    root.style.setProperty("--ico-background", "#f8f9fa");
    root.style.setProperty("--ico-surface", "#ffffff");
    root.style.setProperty("--ico-surface-secondary", "#f1f3f5");
    root.style.setProperty("--ico-surface-hover", "rgba(37, 99, 235, 0.05)");

    root.style.setProperty("--ico-text", "#1a202c");
    root.style.setProperty("--ico-text-secondary", "#4b5563");
    root.style.setProperty("--ico-text-tertiary", "#6b7280"); // Added missing tertiary

    root.style.setProperty("--ico-border", "#e2e8f0");
    root.style.setProperty("--ico-highlight", "#2563eb");

    root.style.setProperty("--color-input", "#f8fafc"); // Added missing input color for light mode

    // Remove dark class
    document.documentElement.classList.remove('dark');
  }
}
</script>

<style>
/* CRITICAL: FONT & SPACING DEFINITIONS FROM MAIN APP */
:root {
  /* Font variables */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --font-mono: "JetBrains Mono", Menlo, Monaco, Consolas, "Courier New", monospace;

  /* Spacing & Radius variables */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;
}

/* CRITICAL: Base font size and antialiasing for crisp text */
html {
  font-size: 12px; /* This makes the design look compact using 'rem' units */
}

body {
  background-color: var(--ico-background);
  color: var(--ico-text);
  font-family: var(--font-sans); /* Applies the correct font */
  margin: 0;
  -webkit-font-smoothing: antialiased; /* Makes the text look clean/crisp */
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Include any necessary responsive font sizes */
@media (max-width: 768px) {
  html {
    font-size: 15px;
  }
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}
</style>
