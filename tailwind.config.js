/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0A0B0E',
          surface: '#111318',
          elevated: '#161820',
        },
        border: {
          DEFAULT: '#1E2128',
          subtle: '#171A20',
        },
        text: {
          primary: '#E8EAF0',
          secondary: '#9BA3B0',
          muted: '#5A6070',
        },
        accent: {
          blue: '#4A9EFF',
          'blue-bg': '#1A3A5C',
        },
        easy: {
          DEFAULT: '#22C55E',
          bg: '#0F2A1A',
        },
        medium: {
          DEFAULT: '#F59E0B',
          bg: '#2A1F0A',
        },
        hard: {
          DEFAULT: '#EF4444',
          bg: '#2A0F0F',
        },
        review: {
          DEFAULT: '#A855F7',
          bg: '#1E0A2A',
        },
      },
    },
  },
  plugins: [],
}
