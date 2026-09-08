import type { HTMLAttributes } from "react";

/**
 * GlassCard — the shared surface primitive.
 *
 * Renders a clean, readable card: a solid `bg-surface` with a real
 * `border-border` and a soft, realistic `shadow-card` elevation. This replaces
 * the former murky glassmorphism (translucent `bg-white/[0.03]` + heavy neon
 * glow), which read as "too shadowy" and hurt legibility.
 *
 * The `glow` and `interactive` props are retained for API compatibility, but
 * they now express tasteful state rather than neon haze:
 * - `glow="emerald" | "cyan"` gives the card a subtle accent-tinted border.
 * - `interactive` adds a gentle hover elevation + accent border on pointer
 *   devices (the transition is neutralized under prefers-reduced-motion by the
 *   global backstop in globals.css).
 *
 * This is a plain component (no `"use client"`): it only renders a styled
 * `<div>` and needs no hooks, so it can be used from server or client
 * components alike.
 */

/** Accent tint options for {@link GlassCard}. */
export type GlassCardGlow = "emerald" | "cyan" | "none";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Subtle accent-tinted border applied at rest. Defaults to `"none"`. */
  glow?: GlassCardGlow;
  /**
   * When `true`, enables a subtle hover elevation + accent border change
   * (pointer-friendly, non-neon).
   */
  interactive?: boolean;
  /** Extra classes appended to the base surface classes. */
  className?: string;
}

/** Base surface classes shared by every GlassCard — solid + readable. */
const BASE_CLASSES =
  "rounded-2xl border border-border bg-surface shadow-card transition-shadow";

/** Static (at-rest) accent border tint per color. */
const STATIC_TINT: Record<GlassCardGlow, string> = {
  emerald: "border-accent/40",
  cyan: "border-accent2/40",
  none: "",
};

/** Subtle hover elevation + accent border per accent color. */
const HOVER_TINT: Record<Exclude<GlassCardGlow, "none">, string> = {
  emerald: "hover:border-accent/50 hover:shadow-md",
  cyan: "hover:border-accent2/50 hover:shadow-md",
};

/** Join truthy class fragments into a single className string. */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function GlassCard({
  glow = "none",
  interactive = false,
  className,
  children,
  ...rest
}: GlassCardProps) {
  // Hover accent follows the glow color; when no explicit glow is set but the
  // card is interactive, default the hover accent to emerald.
  const hoverAccent: Exclude<GlassCardGlow, "none"> =
    glow === "none" ? "emerald" : glow;

  const classes = cx(
    BASE_CLASSES,
    STATIC_TINT[glow],
    interactive && HOVER_TINT[hoverAccent],
    className,
  );

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export default GlassCard;
