import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--brand)",
          soft: "var(--brand-soft)",
          dark: "var(--brand-dark)",
        },
        background: {
          DEFAULT: "var(--bg)",
          elevated: "var(--bg-elevated)",
        },
        foreground: "var(--text)",
        muted: "var(--muted)",
        border: "var(--line)",
      },
      boxShadow: {
        glass: "0 12px 40px rgba(0,0,0,0.22)",
        "glass-light": "0 14px 34px rgba(7, 23, 40, 0.09)",
        "glow": "0 0 20px rgba(68, 175, 255, 0.5)",
      },
      animation: {
        "blob": "blob 7s infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "aurora": "aurora 60s linear infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
