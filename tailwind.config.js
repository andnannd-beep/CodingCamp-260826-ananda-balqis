/** @type {import('tailwindcss').Config} */
module.exports = {
  // Dark mode is triggered by adding the 'dark' class to <body>
  darkMode: 'class',

  // Tailwind scans these files for class names to include in the build.
  // index.html   → static utility classes on HTML elements
  // js/**/*.js   → class names injected at runtime (todo items, link chips, etc.)
  content: [
    './index.html',
    './js/**/*.js',
  ],

  theme: {
    extend: {
      // ── TTPD color palette ──────────────────────────────────────
      colors: {
        ivory:     '#F3EEE5',
        parchment: '#D9CCB9',
        taupe:     '#A99A8A',
        muted:     '#655B55',
        charcoal:  '#373431',
        ash:       '#B9B8B1',
        // Dark mode surface variants
        'dark-bg':      '#1E1C1A',
        'dark-surface': '#2A2724',
        'dark-border':  '#3D3833',
        'dark-text':    '#E8E0D3',
        'dark-muted':   '#8C8278',
      },

      // ── Typography ──────────────────────────────────────────────
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },

      // ── Shadows ─────────────────────────────────────────────────
      boxShadow: {
        'paper':    '0 1px 3px 0 rgba(55,52,49,0.08), 0 1px 2px -1px rgba(55,52,49,0.06)',
        'paper-md': '0 4px 6px -1px rgba(55,52,49,0.08), 0 2px 4px -2px rgba(55,52,49,0.06)',
        'paper-lg': '0 10px 15px -3px rgba(55,52,49,0.08), 0 4px 6px -4px rgba(55,52,49,0.06)',
      },

      // ── Border radius ───────────────────────────────────────────
      borderRadius: {
        sm:      '0.25rem',
        DEFAULT: '0.375rem',
        md:      '0.5rem',
        lg:      '0.75rem',
      },

      // ── Custom animations ───────────────────────────────────────
      // These are referenced in src/input.css via @layer utilities.
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'check-pop': {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.2s ease-out both',
        'check-pop':  'check-pop 0.2s ease-out',
        'pulse-ring': 'pulse-ring 1.5s ease-in-out infinite',
      },
    },
  },

  plugins: [],
};
