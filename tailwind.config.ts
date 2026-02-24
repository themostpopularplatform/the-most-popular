import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        tmp: {
          bg: "#0b0b0f",
          card: "#111111",
          line: "#262626",
          text: "#F5F5F5",
          muted: "#A3A3A3",
          gold: "#B8860B",
          maize: "#FFCB05",
          maizeDark: "#E6B800",
          verified: "#38bdf8",
          certified: "#dc2626",
          legendary: "#FFCB05",
          black: "#000000",
          white: "#FFFFFF",
          graySoft: "#A3A3A3",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 18px 50px rgba(0,0,0,0.65)",
      },
      borderRadius: {
        tmp: "14px",
      },
      letterSpacing: {
        tmp: "-0.02em",
      },
    },
  },
  plugins: [],
} satisfies Config;
