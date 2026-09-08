import type { Config } from "tailwindcss";

/**
 * Design tokens for the Executive Portfolio Site.
 *
 * The theme is driven by semantic CSS variables declared in app/globals.css
 * (`:root` = LIGHT default, `.dark` = dark). Each token is an RGB triple so the
 * Tailwind `<utility>-<token>/<opacity>` syntax works (e.g. `bg-surface/85`,
 * `border-accent/40`). Components use the semantic aliases below —
 * `bg-background`, `bg-surface`, `bg-surface2`, `border-border`, `text-fg`,
 * `text-muted`, `text-accent`, `text-accent2` — so a single class set reads
 * correctly in both themes.
 *
 * `tabular-nums` support is kept for metric alignment (Req 16.3).
 */

/** Build a Tailwind color that reads an RGB-triple CSS variable with opacity. */
const tokenColor = (variable: string) =>
  `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic theme tokens (resolve per light/dark via globals.css).
        background: tokenColor("--background"),
        surface: tokenColor("--surface"),
        surface2: tokenColor("--surface-2"),
        border: tokenColor("--border"),
        fg: tokenColor("--text"),
        muted: tokenColor("--text-muted"),
        accent: tokenColor("--accent"),
        accent2: tokenColor("--accent-2"),

        // Obsidian retained for any legacy reference.
        obsidian: "#0a0f1a",
      },
      boxShadow: {
        // Clean, realistic elevation driven by the --shadow-card token (soft
        // and visible on light, subtle on dark). The former neon `glow*`
        // tokens are aliased to `card` so any remaining references degrade to
        // the same tasteful elevation instead of a haze.
        card: "var(--shadow-card)",
        glow: "var(--shadow-card)",
        "glow-emerald": "var(--shadow-card)",
        "glow-cyan": "var(--shadow-card)",
      },
      fontFamily: {
        // Inter is wired via next/font in app/layout.tsx. The CSS variable is
        // referenced here so utility classes resolve correctly.
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
