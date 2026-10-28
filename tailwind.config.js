/** @type {import('tailwindcss').Config} */
module.exports = {
  // Dark mode triggered by adding class="dark" to <body> and <html>
  darkMode: 'class',

  // Tailwind scans these files for every class name used (static + runtime)
  content: [
    './index.html',
    './js/**/*.js',
  ],

  theme: {
    extend: {
      // ── My Life, My Eras — Taylor Swift Eras color palette ─────
      colors: {
        // ── Page foundation: pink & lavender ──────────────────────
        'era-bg':        '#FDF0F5', // soft blush page background
        'era-bg-alt':    '#F5EEFF', // lavender page background variant
        'era-surface':   '#FFFFFF', // card white
        'era-text':      '#3D1A3A', // deep plum primary text
        'era-muted':     '#8B6B85', // muted mauve secondary text
        'era-border':    '#E8C8DC', // dusty rose border
        'era-border-alt':'#D4C0EA', // lavender border

        // ── Lover — pink, rose, peach ─────────────────────────────
        'lover-bg':      '#FDE8F0', // soft pink card
        'lover-accent':  '#F6A9C7', // rose pink
        'lover-deep':    '#C96490', // deeper rose for text on light
        'lover-light':   '#FCE4EC', // lightest pink

        // ── Midnights — deep navy, violet ─────────────────────────
        'midnight-bg':   '#1E2456', // deep navy card bg
        'midnight-card': '#252D6B', // slightly lighter navy
        'midnight-accent':'#7884C7', // periwinkle blue
        'midnight-star': '#B8C0FF', // pale lavender star color
        'midnight-glow': '#9BA8FF', // soft violet glow

        // ── Fearless — gold, champagne ────────────────────────────
        'fearless-bg':   '#FFFAE8', // warm cream card
        'fearless-accent':'#F2C75C', // gold
        'fearless-deep': '#C49A28', // deeper gold for text
        'fearless-light':'#FFF0B3', // champagne yellow

        // ── 1989 — sky blue, aqua ─────────────────────────────────
        '1989-bg':       '#E8F7FF', // pale sky card
        '1989-accent':   '#83CBEA', // sky blue
        '1989-deep':     '#2A8BB0', // ocean blue for text
        '1989-light':    '#D8F3FF', // lightest sky

        // ── Speak Now — lavender, lilac ───────────────────────────
        'speaknow-bg':   '#EDE5FF', // soft lavender card
        'speaknow-accent':'#A995DF', // lilac purple
        'speaknow-deep': '#6B4BA8', // deep purple for text
        'speaknow-light':'#E9DFFF', // palest lavender

        // ── Debut — sage green, fresh ─────────────────────────────
        'debut-bg':      '#EBF5E7', // pale sage card
        'debut-accent':  '#B5D6AD', // sage green
        'debut-deep':    '#4A7C41', // deep green for text
        'debut-light':   '#E6F2DF', // lightest sage

        // ── Dark mode ─────────────────────────────────────────────
        'dark-bg':       '#120E1E', // deepest night
        'dark-surface':  '#1E1830', // card background
        'dark-raise':    '#261F3D', // elevated card
        'dark-border':   '#3D3362', // subtle border
        'dark-text':     '#F0E6FF', // primary text
        'dark-muted':    '#9B8EC4', // secondary text
        'dark-accent':   '#8B7BD4', // accent/button
        'dark-lover':    '#FF8FAB', // Lover accent on dark
        'dark-midnight': '#9BA8FF', // Midnights accent on dark
        'dark-fearless': '#FFD166', // Fearless accent on dark
        'dark-1989':     '#72D2F5', // 1989 accent on dark
        'dark-speaknow': '#BBA4FF', // Speak Now accent on dark
        'dark-debut':    '#90D488', // Debut accent on dark
      },

      // ── Typography ──────────────────────────────────────────────
      // Playfair Display: elegant serif for headings / eras feel
      // DM Sans: clean, modern sans for body text
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },

      // ── Border radius ───────────────────────────────────────────
      borderRadius: {
        sm:      '0.5rem',
        DEFAULT: '0.75rem',
        md:      '1rem',
        lg:      '1.25rem',
        xl:      '1.5rem',
        '2xl':   '2rem',
        '3xl':   '2.5rem',
        full:    '9999px',
      },

      // ── Shadows ─────────────────────────────────────────────────
      boxShadow: {
        'card':       '0 2px 16px 0 rgba(61,26,58,0.07), 0 1px 4px 0 rgba(61,26,58,0.05)',
        'card-md':    '0 4px 24px 0 rgba(61,26,58,0.10), 0 2px 8px 0 rgba(61,26,58,0.06)',
        'card-lg':    '0 8px 32px 0 rgba(61,26,58,0.12), 0 4px 12px 0 rgba(61,26,58,0.07)',
        'lover':      '0 4px 20px 0 rgba(246,169,199,0.35)',
        'midnight':   '0 4px 20px 0 rgba(120,132,199,0.35)',
        'fearless':   '0 4px 20px 0 rgba(242,199,92,0.30)',
        '1989':       '0 4px 20px 0 rgba(131,203,234,0.35)',
        'speaknow':   '0 4px 20px 0 rgba(169,149,223,0.30)',
        'debut':      '0 4px 20px 0 rgba(181,214,173,0.35)',
        'dark-glow':  '0 4px 24px 0 rgba(139,123,212,0.25)',
      },

      // ── Custom animations ───────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'check-pop': {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.30' },
        },
        'sparkle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.2) rotate(20deg)' },
        },
        'drift': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-5px) rotate(3deg)' },
          '66%':      { transform: 'translateY(-3px) rotate(-2deg)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%':      { transform: 'rotate(4deg)' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.25s ease-out both',
        'check-pop':  'check-pop 0.25s ease-out',
        'pulse-ring': 'pulse-ring 1.5s ease-in-out infinite',
        'sparkle':    'sparkle 2s ease-in-out infinite',
        'drift':      'drift 4s ease-in-out infinite',
        'wiggle':     'wiggle 0.4s ease-in-out',
      },
    },
  },

  plugins: [],
};
