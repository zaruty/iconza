import type { Config } from "tailwindcss";

/**
 * Tokens espelhados de iconza-tokens.css (legacy).
 * Fonte visual única durante a migração.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FFFFFF",
          soft: "#F8F9FB",
          muted: "#F3F4F6",
        },
        ink: {
          DEFAULT: "#0B0D0F",
          strong: "#000000",
          secondary: "#1F2328",
          muted: "#6B7280",
          soft: "#9CA3AF",
          faint: "#D1D5DB",
        },
        side: {
          from: "#0E1013",
          via: "#111315",
          to: "#17191C",
          elevated: "#1E2227",
          ink: "#E5E7EB",
          "ink-muted": "#6B7280",
        },
        accent: {
          DEFAULT: "#5B6CFF",
          soft: "rgba(91, 108, 255, 0.08)",
          hover: "#4F5DE0",
        },
        gold: {
          DEFAULT: "#B89968",
          soft: "rgba(184, 153, 104, 0.10)",
        },
        green: {
          DEFAULT: "#1E4D40",
          soft: "rgba(30, 77, 64, 0.08)",
        },
        line: {
          DEFAULT: "#E5E7EB",
          soft: "#F1F3F5",
          strong: "#D1D5DB",
        },
        nivel: {
          1: "#8B4444",
          2: "#B86847",
          3: "#C8954A",
          4: "#B89968",
          5: "#5C8A6B",
          6: "#3A6B7C",
          7: "#2A4356",
        },
        brand: {
          vm: "#C1272D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        iconza: "0.375rem",
      },
      maxWidth: {
        page: "72rem",
        content: "36rem",
      },
      minHeight: {
        shell: "100dvh",
      },
    },
  },
  plugins: [],
};

export default config;
