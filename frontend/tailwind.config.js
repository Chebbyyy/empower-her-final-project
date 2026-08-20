/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1714',
          muted: '#5c564e',
        },
        forest: {
          DEFAULT: '#1b3a2f',
          light: '#1b3a2f',
        },
        paper: {
          DEFAULT: '#f7f4ef',
          dark: '#ebe6dc',
        },
        brass: {
          DEFAULT: '#a67c52',
          dark: '#5c564e',
        },
        surface: '#ffffff',
        line: '#d9d2c6',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
        hero: ['"Open Sans"', 'system-ui', 'sans-serif'],
        headline: ['"Open Sans"', 'system-ui', 'sans-serif'],
        display: ['"Open Sans"', 'system-ui', 'sans-serif'],
        wordmark: ['"Open Sans"', 'system-ui', 'sans-serif'],
        editorial: ['"Open Sans"', 'system-ui', 'sans-serif'],
        inter: ['"Open Sans"', 'system-ui', 'sans-serif'],
        statement: ['"Open Sans"', 'system-ui', 'sans-serif'],
        support: ['"Open Sans"', 'system-ui', 'sans-serif'],
        campaign: ['"Open Sans"', 'system-ui', 'sans-serif'],
        roboto: ['"Open Sans"', 'system-ui', 'sans-serif'],
      },
      spacing: {
        token: 'var(--space-4)',
      },
    },
  },
  plugins: [],
}
