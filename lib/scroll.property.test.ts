// Feature: executive-portfolio-site, Property 12
//
// Property 12: Activating a nonexistent nav target preserves scroll position
//
// For any navigation label/id whose target section element does not exist in
// the document, invoking scrollToSection performs no scroll navigation and
// leaves the current scroll position unchanged.
//
// Validates: Requirements 1.7

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fc from "fast-check";
import { scrollToSection } from "@/lib/scroll";

describe("Property 12: Activating a nonexistent nav target preserves scroll position", () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Ensure no elements exist to match any generated id: clear the body and
    // force getElementById to report absence regardless of the id string.
    document.body.innerHTML = "";
    vi.spyOn(document, "getElementById").mockReturnValue(null);
    // Spy on the scroll API; jsdom does not implement scrollTo natively.
    scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("performs no scroll for any id whose target element is absent (Req 1.7)", () => {
    fc.assert(
      fc.property(fc.string(), (id) => {
        // Reset call history between runs so each run is evaluated in isolation.
        scrollToSpy.mockClear();

        // Preserve the initial scroll position for comparison.
        const initialX = window.scrollX;
        const initialY = window.scrollY;

        scrollToSection(id);

        // No scroll navigation should have been requested.
        expect(scrollToSpy).not.toHaveBeenCalled();

        // Scroll position must remain unchanged.
        expect(window.scrollX).toBe(initialX);
        expect(window.scrollY).toBe(initialY);
      }),
      { numRuns: 100 },
    );
  });

  it("also holds for ids passed with a leading '#' (Req 1.7)", () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        scrollToSpy.mockClear();

        const id = `#${raw}`;
        scrollToSection(id);

        expect(scrollToSpy).not.toHaveBeenCalled();
      }),
      { numRuns: 100 },
    );
  });
});
