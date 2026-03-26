/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hextech-gold': '#cdbe91',
        'hextech-dark': '#010a13',
        'hextech-blue': '#005a82',
        'hextech-border': '#785a28'
      }
    },
  },
  plugins: [],
}
