// Feature: executive-portfolio-site, Property 14
//
// Property 14: Reduced motion disables non-essential motion
//
// For any variant, when reduced-motion is enabled, useMotionSafe returns the
// static no-op variant (final state, no transform/opacity transition, no
// marquee).
//
// Validates: Requirements 2.7, 4.9, 9.4, 17.4, 21.9, 22.5

import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import fc from "fast-check";
import type { Variants } from "framer-motion";

// Force the reduced-motion signal on for the whole file while preserving every
// other framer-motion export (variants, motion components, etc.).
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

import {
  fadeUp,
  noopVariant,
  staggerContainer,
  staggerItem,
  useMotionSafe,
} from "@/components/ui/motion";

/**
 * Arbitrary that produces "variant-like" objects: a mix of the real named
 * variants used across the site and freely-generated variant maps. This
 * exercises the invariant that the *input* variant never leaks through when
 * reduced motion is on.
 */
const variantArb = (): fc.Arbitrary<Variants> => {
  // A single variant state (e.g. the object under a "hidden"/"visible" key)
  // with arbitrary transform/opacity values and an optional transition.
  const variantStateArb = fc.record(
    {
      opacity: fc.double({ min: 0, max: 1, noNaN: true }),
      x: fc.integer({ min: -200, max: 200 }),
      y: fc.integer({ min: -200, max: 200 }),
      scale: fc.double({ min: 0, max: 3, noNaN: true }),
      transition: fc.record({
        duration: fc.double({ min: 0, max: 2, noNaN: true }),
      }),
    },
    { requiredKeys: [] },
  );

  const generatedVariant = fc.dictionary(
    fc.constantFrom("hidden", "visible", "exit", "active"),
    variantStateArb,
    { minKeys: 1, maxKeys: 4 },
  ) as fc.Arbitrary<Variants>;

  // Blend the real named variants with generated ones.
  return fc.oneof(
    fc.constantFrom<Variants>(fadeUp, staggerContainer, staggerItem),
    generatedVariant,
  );
};

describe("Property 14: Reduced motion disables non-essential motion", () => {
  it("returns the static no-op variant for any input variant when reduced motion is enabled", () => {
    fc.assert(
      fc.property(variantArb(), (variant) => {
        const { result } = renderHook(() => useMotionSafe(variant));

        // Under reduced motion, the applied variant must be exactly the static
        // no-op variant — regardless of what was passed in.
        expect(result.current).toEqual(noopVariant);
      }),
      { numRuns: 100 },
    );
  });

  it("no-op variant is a settled state with no transform/opacity transition (no marquee)", () => {
    // The no-op variant every reduced-motion caller receives must describe the
    // final, fully-visible, untransformed state with zero-duration transitions.
    for (const state of [noopVariant.hidden, noopVariant.visible]) {
      expect(state).toMatchObject({
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0 },
      });
    }
  });
});
