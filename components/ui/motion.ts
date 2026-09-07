"use client";

import { useReducedMotion, type Variants } from "framer-motion";

/**
 * Shared Framer Motion variants and reduced-motion helper.
 *
 * `motion.ts` is a client module because `useMotionSafe` calls the
 * `useReducedMotion` React hook; it is consumed by client components
 * (SectionWrapper, AnimatedCounter, section components, etc.).
 *
 * The pure state reducers/helpers backing the state-driven UI properties live
 * in the DOM-free `state.ts` module so they remain trivially testable.
 */

/** Standard duration (seconds) for entry reveals. */
const REVEAL_DURATION = 0.5;

/** Per-child stagger delay (seconds) for staggered container reveals. */
const STAGGER_DELAY = 0.08;

/**
 * Fade-up reveal: element starts slightly below and transparent, then settles
 * into its final position and opacity. Used for section and item reveals.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: "easeOut" },
  },
};

/**
 * Container variant that staggers the reveal of its children. Pair with
 * {@link staggerItem} on each child.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_DELAY },
  },
};

/**
 * Child variant for use inside a {@link staggerContainer}. Fades and rises into
 * place; timing is orchestrated by the parent container's stagger.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: "easeOut" },
  },
};

/**
 * Static no-op variant representing the final (settled) state with no
 * transform/opacity transition. Every named variant key resolves to the same
 * fully-visible, untransformed state, so switching between animation states
 * produces no visible motion.
 *
 * Implements the reduced-motion contract for Property 14: a fully-defined
 * static variant with no marquee and no transform/opacity animation.
 */
export const noopVariant: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0 } },
  visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0 } },
};

/**
 * Return the given motion variant, or a static no-op variant when the user has
 * requested reduced motion.
 *
 * When `useReducedMotion()` is true, the returned variant represents the final
 * state with no transform/opacity transition and no marquee — satisfying
 * Property 14 (reduced motion disables non-essential motion).
 *
 * @param variant the motion variant to use when motion is allowed
 * @returns `variant` normally, or {@link noopVariant} under reduced motion
 */
export function useMotionSafe(variant: Variants): Variants {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? noopVariant : variant;
}
