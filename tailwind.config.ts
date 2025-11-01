import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          900: 'var(--color-brown-900)',
          600: 'var(--color-brown-600)'
        },
        // flat aliases for convenience
        brown900: 'var(--color-brown-900)',
        brown600: 'var(--color-brown-600)',
        yellow: {
          200: 'var(--color-yellow-200)'
        },
        yellow200: 'var(--color-yellow-200)',
        teal: {
          700: 'var(--color-teal-700)'
        },
        peach: {
          300: 'var(--color-peach-300)'
        }
        ,peach300: 'var(--color-peach-300)'
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px'
      }
    }
  },
  plugins: [],
} satisfies Config

