import type { Config } from "tailwindcss";

/**
 * Design tokens for the Executive Portfolio Site.
 *
 * Dark-mode-first theme (Req 19.1): obsidian / slate-950 background.
 * Glassmorphism cards with white/10 borders (Req 19.2).
 * Emerald + cyan accent glows, white headings, slate-400 body (Req 19.3).
 * Subtle grid texture surfaces (Req 19.4) — the `.bg-grid` utility lives in globals.css.
 * `tabular-nums` support for metric alignment (Req 16.3).
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian / slate-950 page background (Req 19.1)
        obsidian: "#0a0f1a",
        bg: "var(--bg)",
      },
      backgroundColor: {
        bg: "var(--bg)",
      },
      boxShadow: {
        // Soft, subtle accent glows reserved mainly for hover / active states
        // (Req 3.7, 19.3). Low spread + low opacity keeps surfaces readable
        // and uncluttered rather than hazy.
        glow: "0 0 20px -8px rgba(16, 185, 129, 0.22)",
        "glow-emerald": "0 0 20px -8px rgba(16, 185, 129, 0.22)",
        "glow-cyan": "0 0 20px -8px rgba(34, 211, 238, 0.22)",
      },
      fontFamily: {
        // Geist Sans (fallback Inter) is wired via next/font in app/layout.tsx.
        // The CSS variable is referenced here so utility classes resolve correctly.
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      fontVariantNumeric: {
        // Enables `tabular-nums` utility for aligned numeric metrics (Req 16.3)
        "tabular-nums": "tabular-nums",
      },
    },
  },
  plugins: [],
};

export default config;
