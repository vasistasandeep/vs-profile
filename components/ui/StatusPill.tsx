import type { HTMLAttributes } from "react";

/**
 * StatusPill — the availability indicator (Req 1.3).
 *
 * Renders a small glassmorphism pill with a pulsing emerald dot and a warm,
 * brand-voice status line ("Building platforms that scale"). This is a plain,
 * presentational component (no `"use client"`): it renders a styled `<span>`
 * with no hooks, so it works in server or client trees alike.
 */

/** Brand-voice status line (Req 1.3) — confident, not a job-seeking pitch. */
export const STATUS_PILL_TEXT = "Building platforms that scale";

export type StatusPillProps = HTMLAttributes<HTMLSpanElement>;

/** Join truthy class fragments into a single className string. */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function StatusPill({ className, ...rest }: StatusPillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border border-accent/30",
        "bg-accent/10 px-3 py-1 text-xs font-medium text-accent",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="relative flex h-2 w-2"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      {STATUS_PILL_TEXT}
    </span>
  );
}

export default StatusPill;
