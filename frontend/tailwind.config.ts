import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0A4D4A",
          dark: "#062E2C",
          mint: "#E7F2EF",
          sand: "#F3EEE3",
          cream: "#FAFBF9",
          gold: "#B8862A",
          charcoal: "#0F1B1B",
          gray: "#5B6868",
          success: "#0E6B4D",
          alert: "#B42318",
        },
      },
      fontFamily: {
        arabic: ["IBM Plex Sans Arabic", "Noto Kufi Arabic", "Arial", "sans-serif"],
        sans: ["Inter", "Arial", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 20px 0 rgba(15, 95, 92, 0.08)",
        card: "0 4px 32px 0 rgba(15, 95, 92, 0.10)",
        modal: "0 16px 64px 0 rgba(7, 59, 58, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
