import type { HTMLAttributes } from "react";

/**
 * GlassCard — the shared glassmorphism surface primitive (Req 19.2).
 *
 * Renders a rounded, translucent card (`bg-white/[0.03]`, `backdrop-blur`,
 * `border border-white/10`). It optionally applies a static emerald/cyan accent
 * glow, and — when `interactive` — a hover glow that only fires on true pointer
 * devices (Req 3.7).
 *
 * The hover glow is gated behind `@media (hover: hover)` via the
 * `.hover-glow-emerald` / `.hover-glow-cyan` utility classes declared in
 * `app/globals.css`, so touch devices (which report `hover: none`) never get a
 * sticky hover state.
 *
 * This is a plain component (no `"use client"`): it only renders a styled
 * `<div>` and needs no hooks, so it can be used from server or client
 * components alike.
 */

/** Accent glow color options for {@link GlassCard}. */
export type GlassCardGlow = "emerald" | "cyan" | "none";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Static accent glow color applied at rest. Defaults to `"none"`. */
  glow?: GlassCardGlow;
  /**
   * When `true`, enables a pointer-only hover glow (gated behind
   * `@media (hover: hover)`). The hover glow color follows `glow`, defaulting
   * to emerald when `glow` is `"none"`.
   */
  interactive?: boolean;
  /** Extra classes appended to the base glass surface classes. */
  className?: string;
}

/** Base glassmorphism surface classes shared by every GlassCard (Req 19.2). */
const BASE_CLASSES =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur";

/** Static (at-rest) glow shadow utility per accent color. */
const STATIC_GLOW: Record<GlassCardGlow, string> = {
  emerald: "shadow-glow-emerald",
  cyan: "shadow-glow-cyan",
  none: "",
};

/** Pointer-only hover glow utility (from globals.css) per accent color. */
const HOVER_GLOW: Record<Exclude<GlassCardGlow, "none">, string> = {
  emerald: "hover-glow-emerald",
  cyan: "hover-glow-cyan",
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
  // Hover glow follows the accent color; when no explicit glow is set but the
  // card is interactive, default the hover accent to emerald.
  const hoverAccent: Exclude<GlassCardGlow, "none"> =
    glow === "none" ? "emerald" : glow;

  const classes = cx(
    BASE_CLASSES,
    STATIC_GLOW[glow],
    interactive && HOVER_GLOW[hoverAccent],
    className,
  );

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export default GlassCard;
