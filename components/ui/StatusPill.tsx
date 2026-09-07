import type { HTMLAttributes } from "react";

/**
 * StatusPill — the availability indicator (Req 1.3).
 *
 * Renders a small glassmorphism pill with a pulsing emerald dot and the exact
 * text "Available for Executive & Advisory Roles". This is a plain,
 * presentational component (no `"use client"`): it renders a styled `<span>`
 * with no hooks, so it works in server or client trees alike.
 */

/** The exact availability text required by Req 1.3. */
export const STATUS_PILL_TEXT = "Available for Executive & Advisory Roles";

export type StatusPillProps = HTMLAttributes<HTMLSpanElement>;

/** Join truthy class fragments into a single className string. */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function StatusPill({ className, ...rest }: StatusPillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border border-emerald-400/30",
        "bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="relative flex h-2 w-2"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {STATUS_PILL_TEXT}
    </span>
  );
}

export default StatusPill;
