/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008080",  // Teal
        secondary: "#FF6F61", // Coral
        accent: "#D3D3D3",    // Light Gray
        lightAccent: "#F0F0F0", // Very Light Gray
        darkAccent: "#005757", // Dark Teal
        paleAccent: "#FFD8D2",  // Pale Coral
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, #008080, #FF6F61)', // Teal to Coral gradient
      }
    },
  },
  plugins: [],
};
