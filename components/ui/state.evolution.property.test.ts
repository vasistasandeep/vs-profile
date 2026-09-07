// Feature: executive-portfolio-site, Property 10
//
// Property 10: Platform evolution Before and After toggle is an involution
//
// For any initial view and any number N of toggle activations, one activation
// shows the opposite state and two consecutive activations restore the
// originally displayed state. Equivalently, folding toggleView over N
// activations yields the initial view when N is even and the opposite view
// when N is odd.
//
// Validates: Requirements 4.8

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { toggleView, type EvolutionView } from "@/components/ui/state";

/** The opposite of a given evolution view. */
function opposite(view: EvolutionView): EvolutionView {
  return view === "before" ? "after" : "before";
}

describe("Property 10: Platform evolution Before/After toggle is an involution", () => {
  it("one activation flips and N activations restore per parity (Req 4.8)", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<EvolutionView>("before", "after"),
        // Cap the number of activations to keep the fold bounded.
        fc.nat({ max: 1000 }),
        (initial, n) => {
          // A single activation always shows the opposite state.
          expect(toggleView(initial)).not.toBe(initial);
          expect(toggleView(initial)).toBe(opposite(initial));

          // Fold toggleView N times over the initial view.
          let view = initial;
          for (let i = 0; i < n; i++) {
            view = toggleView(view);
          }

          // Even count restores the original; odd count yields the opposite.
          const expected = n % 2 === 0 ? initial : opposite(initial);
          expect(view).toBe(expected);
        },
      ),
      { numRuns: 100 },
    );
  });
});
