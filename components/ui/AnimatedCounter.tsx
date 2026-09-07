"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Metric } from "@/types/content";

/**
 * AnimatedCounter — count-up numeric display (Req 2.5–2.7, 16.3).
 *
 * Counts from 0 to `target` over a duration between 1000 and 2500ms the first
 * time the element becomes at least 50% visible in the viewport, detected via
 * `useInView(ref, { amount: 0.5, once: true })`. The `once: true` option plus a
 * local run-once latch guarantee the animation triggers at most one time and
 * never re-runs on subsequent viewport entries (Req 2.6, Property 13).
 *
 * When the user prefers reduced motion (`useReducedMotion()` is true), the final
 * formatted value renders immediately with no tween (Req 2.7).
 *
 * Formatting is driven by prefix/suffix/decimals and always uses
 * `tabular-nums` so the digits do not shift width while counting (Req 16.3).
 *
 * The tween uses `requestAnimationFrame` with an ease-out curve so the count-up
 * feels natural and decelerates toward the target.
 */

/** Fields accepted directly, or supplied via a {@link Metric} object. */
export interface AnimatedCounterFields {
  /** Final value to count up to. */
  target: number;
  /** Text rendered before the number (e.g. "$"). */
  prefix?: string;
  /** Text rendered after the number (e.g. "M+", "%", "+", "K"). */
  suffix?: string;
  /** Number of decimal places to format the value with. Defaults to 0. */
  decimals?: number;
  /** Count-up duration in milliseconds; clamped to [1000, 2500]. */
  durationMs?: number;
  /** Optional accessible label / description of the metric. */
  label?: string;
}

export interface AnimatedCounterProps extends Partial<AnimatedCounterFields> {
  /** A {@link Metric} whose fields populate the counter. */
  metric?: Metric;
  /** Extra classes appended to the counter span. */
  className?: string;
}

/** Minimum and maximum count-up duration in milliseconds (Req 2.5). */
const MIN_DURATION_MS = 1000;
const MAX_DURATION_MS = 2500;

/** Clamp a duration into the required [1000, 2500]ms band. */
function clampDuration(durationMs: number | undefined): number {
  if (durationMs == null || Number.isNaN(durationMs)) return MAX_DURATION_MS;
  return Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, durationMs));
}

/** Ease-out cubic curve for a natural deceleration toward the target. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Format a numeric value with fixed decimals, prefix, and suffix. */
function format(
  value: number,
  decimals: number,
  prefix: string,
  suffix: string,
): string {
  const fixed = value.toFixed(decimals);
  const grouped = Number(fixed).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${grouped}${suffix}`;
}

export function AnimatedCounter({
  metric,
  target,
  prefix,
  suffix,
  decimals,
  durationMs,
  label,
  className,
}: AnimatedCounterProps) {
  // Fields supplied directly take precedence over the metric object.
  const resolvedTarget = target ?? metric?.target ?? 0;
  const resolvedPrefix = prefix ?? metric?.prefix ?? "";
  const resolvedSuffix = suffix ?? metric?.suffix ?? "";
  const resolvedDecimals = decimals ?? metric?.decimals ?? 0;
  const resolvedDuration = clampDuration(durationMs ?? metric?.durationMs);
  const resolvedLabel = label ?? metric?.label;

  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });

  // Start at the final value under reduced motion so the correct number is
  // shown immediately (Req 2.7); otherwise start at zero and count up.
  const [display, setDisplay] = useState<number>(
    prefersReducedMotion ? resolvedTarget : 0,
  );

  // Run-once latch: guarantees the count-up tween starts at most one time even
  // if `inView` briefly re-fires (Req 2.6, Property 13).
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(resolvedTarget);
      return;
    }
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / resolvedDuration);
      const eased = easeOutCubic(progress);
      setDisplay(resolvedTarget * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplay(resolvedTarget);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, prefersReducedMotion, resolvedTarget, resolvedDuration]);

  return (
    <span
      ref={ref}
      className={["tabular-nums", className].filter(Boolean).join(" ")}
      aria-label={resolvedLabel}
    >
      {format(display, resolvedDecimals, resolvedPrefix, resolvedSuffix)}
    </span>
  );
}

export default AnimatedCounter;
