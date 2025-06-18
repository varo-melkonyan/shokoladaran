/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
