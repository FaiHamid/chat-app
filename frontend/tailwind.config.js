/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{tsx,js,ts,jsx}'],
  theme: {
    fontFamily: {
      main: ['Inter', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
      sen: ['Sen', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#0f172a',
        'light-blue': '#38bdf8',
        'light-gray': '#475569',
        'semi-gray': '#94a3b8',
      },
    },
  },
  plugins: [],
}
