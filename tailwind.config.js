/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          '0%': { maxHeight: '0px', opacity: '0' },
          '100%': { maxHeight: '1000px', opacity: '1' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.4s ease-out forwards',
      },
      colors: {
        chocolate: "#7B3F00",
        brown: {
          700: "#5A2E0F",
        },
      },
    },
  },
  plugins: [],
}
