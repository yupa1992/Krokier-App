/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fire: {
          red: '#DC2626',
          orange: '#EA580C',
          yellow: '#FACC15'
        }
      }
    },
  },
  plugins: [],
}
