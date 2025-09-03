/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f1f8',
          100: '#d9def0',
          200: '#b3bee0',
          300: '#8a9cd1',
          400: '#637bc1',
          500: '#4a5db3',
          600: '#3c4b92',
          700: '#2d386e',
          800: '#1e2449',
          900: '#0f1225',
        },
        secondary: {
          50: '#fcf7eb',
          100: '#f7eacc',
          200: '#f0d399',
          300: '#e9bd66',
          400: '#e2a733',
          500: '#d99317',
          600: '#ae7511',
          700: '#83580c',
          800: '#583a08',
          900: '#2c1d04',
        },
        accent: {
          50: '#f7f4f7',
          100: '#ebe0ea',
          200: '#d6c1d4',
          300: '#c1a2bf',
          400: '#ac83a9',
          500: '#966590',
          600: '#785274',
          700: '#5a3e57',
          800: '#3c2939',
          900: '#1e151c',
        },
        success: {
          500: '#10b981',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'elegant-lg': '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};