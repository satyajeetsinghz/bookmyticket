/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Apple-inspired color palette
        primary: {
          DEFAULT: '#0A84FF', // Apple System Blue
          light: '#5E8BFF',
          dark: '#0040DD',
        },
        secondary: {
          DEFAULT: '#5E5CE6', // Apple System Indigo
          light: '#7D7AFF',
          dark: '#3634A3',
        },
        background: {
          DEFAULT: '#000000', // True Black
          elevated: '#1C1C1E', // System Gray 6
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#AEAEB2', // System Gray 2
          tertiary: '#7C7C80', // System Gray 3
        },
        border: {
          DEFAULT: '#2C2C2E', // System Gray 5
          light: '#3A3A3C', // System Gray 4
        }
      },
      backgroundImage: {
        'apple-dark': 
          'radial-gradient(at 40% 20%, hsla(240, 100%, 5%, 0.5) 0px, transparent 50%), ' +
          'radial-gradient(at 80% 0%, hsla(0, 0%, 5%, 0.6) 0px, transparent 50%), ' +
          'radial-gradient(at 0% 50%, hsla(0, 0%, 10%, 0.6) 0px, transparent 50%)',
      },
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif'
        ],
      },
      boxShadow: {
        'apple': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'apple-elevated': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'apple': '20px',
        'apple-sm': '12px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}