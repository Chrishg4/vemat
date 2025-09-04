/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'ia-primary': '#10B981',
        'ia-warning': '#F59E0B',
        'ia-danger': '#EF4444',
        'ia-info': '#3B82F6',
        'ia-background': '#F0FDF4',
        'ia-text': '#065F46',
      },
      keyframes: {
        'slide-in-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        'slide-in-up': 'slide-in-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

