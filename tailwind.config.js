/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidad visual de PírituFood
        primary: '#FF4C29', 
        secondary: '#082032',
      }
    },
  },
  plugins: [],
}