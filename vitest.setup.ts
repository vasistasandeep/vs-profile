import "@testing-library/jest-dom/vitest";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";

// jsdom does not implement IntersectionObserver, which framer-motion uses for
// `whileInView` reveals (via SectionWrapper). Provide a minimal no-op stub so
// components that render inside a SectionWrapper can mount under test.
if (typeof globalThis.IntersectionObserver === "undefined") {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(
      _callback: IntersectionObserverCallback,
      _options?: IntersectionObserverInit,
    ) {}
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
}

// Register jest-axe's `toHaveNoViolations` matcher. jest-axe ships the matcher
// for Jest's expect API; wrap it so Vitest's expect context (`this`) is passed
// through correctly.
expect.extend({
  toHaveNoViolations(...args) {
    // @ts-expect-error - jest-axe matcher expects a Jest-style `this` context,
    // which Vitest provides at call time.
    return toHaveNoViolations.toHaveNoViolations.call(this, ...args);
  },
});

// Ensure the DOM is reset between tests.
afterEach(() => {
  cleanup();
});
