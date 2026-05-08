/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ansaka: {
          gold: '#B8923B',
          'gold-light': '#D4AC55',
          'gold-dark': '#8B6F2A',
          ink: '#1A1A1A',
          paper: '#FAF8F2',
          muted: '#6B6B6B',
        },
        // Score status colors
        status: {
          critical: '#DC2626', // < 2.0
          weak: '#EA580C',     // 2.0 - 2.7
          stable: '#CA8A04',   // 2.8 - 3.4
          strong: '#16A34A',   // > 3.4
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
