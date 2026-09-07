// Feature: executive-portfolio-site, Property 11
//
// Property 11: Architecture tabs enforce single-panel mutual exclusion
//
// For any set of tab ids and any selected id (chosen from the set), exactly one
// panel is visible (the selected one) and all others are hidden.
//
// Validates: Requirements 5.5

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { selectTab } from "@/components/ui/state";

describe("Property 11: Architecture tabs enforce single-panel mutual exclusion", () => {
  it("shows exactly one panel — the selected one — for any tab set (Req 5.5)", () => {
    fc.assert(
      fc.property(
        // A non-empty array of unique tab id strings.
        fc.uniqueArray(fc.string(), { minLength: 1 }).chain((ids) =>
          // Pick the selected id from within that same set.
          fc.record({
            ids: fc.constant(ids),
            selectedId: fc.constantFrom(...ids),
          }),
        ),
        ({ ids, selectedId }) => {
          const visibility = selectTab(ids, selectedId);

          // Exactly one entry is visible.
          const visibleKeys = Object.keys(visibility).filter(
            (id) => visibility[id],
          );
          expect(visibleKeys).toHaveLength(1);

          // The single visible entry is the selected one.
          expect(visibleKeys[0]).toBe(selectedId);

          // Every other panel is hidden.
          for (const id of ids) {
            if (id !== selectedId) {
              expect(visibility[id]).toBe(false);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
