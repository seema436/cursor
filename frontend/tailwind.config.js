/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for mental health theme
        'mental-primary': '#6366f1', // Indigo
        'mental-secondary': '#8b5cf6', // Purple
        'mental-accent': '#06b6d4', // Cyan
        'mental-success': '#10b981', // Emerald
        'mental-warning': '#f59e0b', // Amber
        'mental-danger': '#ef4444', // Red
        'mental-light': '#f8fafc', // Slate 50
        'mental-dark': '#1e293b', // Slate 800
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}