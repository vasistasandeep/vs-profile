// Feature: executive-portfolio-site, Property 9
//
// Property 9: Mobile menu toggle is an involution
//
// For any initial mobile-menu open/closed state and for any toggle count N
// (>= 0), applying toggleMenu N times equals the initial state when N is even
// and the opposite state when N is odd.
//
// Validates: Requirements 1.10, 1.11

import { describe, expect, it } from "vitest";
import fc from "fast-check";

import { toggleMenu } from "@/components/ui/state";

describe("Property 9: Mobile menu toggle is an involution", () => {
  it("folding toggleMenu N times yields initial when N even, opposite when N odd", () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.nat({ max: 1000 }),
        (initial, n) => {
          let state = initial;
          for (let i = 0; i < n; i++) {
            state = toggleMenu(state);
          }

          const expected = n % 2 === 0 ? initial : !initial;
          expect(state).toBe(expected);
        },
      ),
      { numRuns: 100 },
    );
  });
});
