/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // custom color example (optional)
        primary: "#000000",
      },
    },
  },
  plugins: [],
};
