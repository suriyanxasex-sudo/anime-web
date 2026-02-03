/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bilibili: {
          pink: '#FB7299',
          blue: '#00A1D6',
          dark: '#18191C'
        }
      }
    },
  },
  plugins: [],
}