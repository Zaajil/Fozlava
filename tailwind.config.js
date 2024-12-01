/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A2E",  // Dark Blue
        secondary: "#16213E", // Darker Blue for contrast
        accent: "#FFFFFF",    // White
        lightAccent: "#E0E0E0", // Light Gray
        darkAccent: "#0F0F2E", // Very Dark Blue for emphasis
        paleAccent: "#D1D1D1", // Pale Gray
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, #FFFFFF, #1A1A2E)', // White to Dark Blue gradient
      }
    },
  },
  plugins: [],
};
