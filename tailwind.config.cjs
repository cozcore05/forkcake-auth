// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add custom background colors
      backgroundColor: {
        'surface': 'var(--ico-surface)',
        'ico-surface': 'var(--ico-surface)',
        'ico-surface-secondary': 'var(--ico-surface-secondary)',
        'ico-surface-hover': 'var(--ico-surface-hover, rgba(59, 130, 246, 0.1))',
        'ico-highlight': 'var(--ico-highlight)',
      },
      // Add custom text colors
      textColor: {
        'ico-text': 'var(--ico-text)',
        'ico-text-secondary': 'var(--ico-text-secondary)',
        'ico-text-tertiary': 'var(--ico-text-tertiary)',
        'color-error': 'var(--color-error)',
      },
      // Add custom border colors
      borderColor: {
        'ico-border': 'var(--ico-border)',
        'ico-border-light': 'var(--ico-border-light)',
        'ico-highlight': 'var(--ico-highlight)', // <-- ADD THIS LINE
      },
      // Add custom ring colors
      ringColor: {
        'ico-highlight': 'var(--ico-highlight)',
      },
      // Add custom transform for hover effect
      transitionProperty: {
        'transform': 'transform',
      },
      // Add custom spacing if needed
      spacing: {
        // You can add custom spacing values here if needed
      },
      // Add custom border radius if needed
      borderRadius: {
        // You can add custom border radius values here if needed
      },
      // Add custom box shadow if needed
      boxShadow: {
        // You can add custom box shadow values here if needed
      },
      // Add custom z-index values if needed
      zIndex: {
        // You can add custom z-index values here if needed
      },
    },
  },
  // variants: {
  //   extend: {
  //     // Enable hover variant for backgroundColor
  //     backgroundColor: ['hover', 'focus'],
  //     // Enable hover variant for textColor
  //     textColor: ['hover', 'focus'],
  //     // Enable hover variant for borderColor
  //     borderColor: ['hover', 'focus'],
  //     // Enable focus variant for ringColor
  //     ringColor: ['focus'],
  //     // Enable hover variant for transform
  //     transform: ['hover'],
  //   },
  // },
  plugins: [
    // Add custom plugin for hide-scrollbar utility
    function({ addUtilities }) {
      const newUtilities = {
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      addUtilities(newUtilities);
    },
    // Add custom plugin for hover transform effect
    function({ addUtilities }) {
      const newUtilities = {
        '.hover-translate-up': {
          'transition': 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      };
      addUtilities(newUtilities);
    },
    // Add any other custom plugins here
  ],
  // If you're using dark mode, you can configure it here
  darkMode: 'class', // or 'media' if you prefer system settings
}
