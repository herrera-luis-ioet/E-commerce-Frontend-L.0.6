/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0078d4',
          dark: '#004c8c',
        },
        secondary: {
          light: '#8c8c8c',
          DEFAULT: '#505050',
          dark: '#282828',
        },
        success: {
          light: '#4caf50',
          DEFAULT: '#2e7d32',
          dark: '#1b5e20',
        },
        warning: {
          light: '#ffb74d',
          DEFAULT: '#ff9800',
          dark: '#f57c00',
        },
        error: {
          light: '#ef5350',
          DEFAULT: '#d32f2f',
          dark: '#c62828',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}