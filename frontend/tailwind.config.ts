/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)"],
        mono: ["var(--font-jetbrains)"],
      },
      colors: {
        bg: {
          DEFAULT: "#0a0b0e",
          2: "#111318",
          3: "#181b22",
        },
        accent: {
          DEFAULT: "#4f8ef7",
          2: "#7c3aed",
        },
        "c-green": "#22d3a0",
        "c-amber": "#fbbf24",
        "c-red": "#f87171",
      },
    },
  },
  plugins: [],
};
