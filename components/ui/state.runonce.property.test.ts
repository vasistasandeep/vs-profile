// Feature: executive-portfolio-site, Property 13
//
// Property 13: Entry and counter animations trigger at most once
//
// For any sequence of viewport enter/exit events on a SectionWrapper or
// AnimatedCounter, the reveal/count-up animation is triggered at most one time.
// The run-once latch fires at most once regardless of how many enter/exit
// events occur; likewise, folding the pure runOnce reducer over a sequence
// yields shouldAnimate === true at most once.
//
// Validates: Requirements 2.6, 16.1

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { createRunOnceLatch, runOnce } from "@/components/ui/state";

describe("Property 13: Entry and counter animations trigger at most once", () => {
  it("createRunOnceLatch triggers at most once across any enter/exit sequence (Req 2.6, 16.1)", () => {
    fc.assert(
      // Each boolean is a viewport event: true = enter, false = exit.
      fc.property(fc.array(fc.boolean()), (events) => {
        const latch = createRunOnceLatch();

        let triggerCount = 0;
        for (const isEnter of events) {
          if (isEnter) {
            // Only "enter" events attempt to fire the animation.
            if (latch.trigger()) {
              triggerCount += 1;
            }
          }
        }

        // The animation may fire at most once, never more.
        expect(triggerCount).toBeLessThanOrEqual(1);

        // Any enter event at all latches the run-once state permanently.
        if (events.some((isEnter) => isEnter)) {
          expect(latch.hasRun()).toBe(true);
          expect(triggerCount).toBe(1);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("folding the pure runOnce reducer yields shouldAnimate === true at most once (Req 2.6, 16.1)", () => {
    fc.assert(
      fc.property(fc.array(fc.boolean()), (events) => {
        let hasRun = false;
        let animateCount = 0;

        for (const isEnter of events) {
          if (isEnter) {
            const result = runOnce(hasRun);
            hasRun = result.hasRun;
            if (result.shouldAnimate) {
              animateCount += 1;
            }
          }
        }

        expect(animateCount).toBeLessThanOrEqual(1);
      }),
      { numRuns: 100 },
    );
  });
});
