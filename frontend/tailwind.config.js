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
          light: '#2d5a48',
        },
        paper: {
          DEFAULT: '#f7f4ef',
          dark: '#ebe6dc',
        },
        brass: {
          DEFAULT: '#a67c52',
          dark: '#8b6540',
        },
        surface: '#ffffff',
        line: '#d9d2c6',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
        hero: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        headline: ['Montserrat', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        wordmark: ['Lasiera', '"Lasiera Script"', '"Great Vibes"', 'cursive'],
        editorial: ['"Andada Pro"', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        statement: ['Anton', 'sans-serif'],
        support: ['Lato', 'sans-serif'],
        campaign: ['"Poster Power"', '"Lilita One"', 'sans-serif'],
        roboto: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
