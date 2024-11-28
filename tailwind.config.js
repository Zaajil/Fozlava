/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e57ca0",  // Main pink
        secondary: "#856494", // Violet
        accent: "#fffbeb",   // Gold
        lightAccent: "#fae4ab", // Light cream
        darkAccent: "#40105e", // Dark purple
        paleAccent: "#fae4a",  // Pale cream
        },
    },
  },
  plugins: [],
};
