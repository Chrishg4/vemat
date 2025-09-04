/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ia-background': 'var(--ia-background)',
        'ia-card': 'var(--ia-card)',
        'ia-card-header': 'var(--ia-card-header)',
        'ia-card-hover': 'var(--ia-card-hover)',
        'ia-text': 'var(--ia-text)',
        'ia-text-secondary': 'var(--ia-text-secondary)',
        'ia-border': 'var(--ia-border)',
        'ia-accent': 'var(--ia-accent)',
        'ia-error': 'var(--ia-error)',
        'ia-error-bg': 'var(--ia-error-bg)',
        'ia-warning': 'var(--ia-warning)',
        'ia-warning-bg': 'var(--ia-warning-bg)',
        'ia-success': 'var(--ia-success)',
        'ia-success-bg': 'var(--ia-success-bg)',
        'ia-info': 'var(--ia-info)',
        'ia-info-bg': 'var(--ia-info-bg)',
      },
      transitionProperty: {
        'theme': 'background-color, color, border-color, box-shadow',
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

