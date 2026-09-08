// app/__tests__/smoke.test.tsx
//
// Smoke / static checks (Task 12.5).
//
// These are coarse-grained guardrails rather than behavioral tests:
//   - The exported App Router `metadata` exposes the SEO essentials
//     (title, description, and a fully-populated OpenGraph block). (Req 15.1)
//   - The home page renders exactly one <main> and one <section> per content
//     area, with the section ids matching the navigation targets. (Req 15.3)
//   - No server-side API routes exist under app/api, so the only network egress
//     is the client-side Formspree submission. (Req 20.2)
//
// The page composes many client section components that use Framer Motion's
// `whileInView` reveal. To keep the render deterministic and free of viewport
// timing, we force reduced motion (`useReducedMotion` -> true) — the
// SectionWrapper still renders its `motion.section` (with the id) regardless of
// inView, so the semantic structure is always present. We also stub
// `window.scrollTo` since jsdom does not implement it.

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// next/font/google is a build-time loader that is not callable under Vitest;
// stub it so importing app/layout (for its exported `metadata`) works. The
// returned object mirrors the shape next/font produces (className + variable).
vi.mock("next/font/google", () => ({
  Inter: () => ({
    className: "font-inter",
    variable: "--font-sans",
    style: { fontFamily: "Inter" },
  }),
}));

// Force reduced motion for the whole suite so motion helpers resolve to their
// static no-op variants, while preserving the rest of framer-motion (motion.*,
// useInView, etc.) so components render normally.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

import HomePage from "@/app/page";
import { metadata } from "@/app/layout";
import { site } from "@/data/site";

// Repo root (this file lives at <root>/app/__tests__/smoke.test.tsx).
const REPO_ROOT = path.resolve(__dirname, "..", "..");

describe("smoke: exported metadata (Req 15.1)", () => {
  it("exposes a title and description", () => {
    expect(metadata.title).toBeDefined();
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeDefined();
    expect(metadata.description).toBeTruthy();
  });

  it("exposes an OpenGraph block with title, description, url, and images", () => {
    const og = metadata.openGraph;
    expect(og).toBeDefined();

    expect(og?.title).toBeDefined();
    expect(og?.title).toBeTruthy();
    expect(og?.description).toBeDefined();
    expect(og?.description).toBeTruthy();
    expect(og?.url).toBeDefined();
    expect(og?.url).toBeTruthy();

    // At least one OpenGraph image with a usable url.
    const images = og?.images;
    expect(images).toBeDefined();
    const imageList = Array.isArray(images) ? images : [images];
    expect(imageList.length).toBeGreaterThan(0);
    const first = imageList[0] as { url?: unknown } | string | undefined;
    const firstUrl = typeof first === "string" ? first : first?.url;
    expect(firstUrl).toBeTruthy();
  });
});

describe("smoke: semantic page structure (Req 15.3)", () => {
  const originalScrollTo = window.scrollTo;
  const originalResizeObserver = (globalThis as { ResizeObserver?: unknown })
    .ResizeObserver;

  beforeAll(() => {
    // jsdom does not implement scrollTo; several components/handlers may call
    // it, so provide a no-op stub for the render.
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

    // jsdom lacks ResizeObserver, which the Radix Slider (CostCalculator) uses
    // via @radix-ui/react-use-size. Provide a minimal no-op stub so the page
    // mounts without throwing.
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterAll(() => {
    window.scrollTo = originalScrollTo;
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
      originalResizeObserver;
  });

  it("renders exactly one <main>", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelectorAll("main")).toHaveLength(1);
  });

  it("renders a section for every navigation content area", () => {
    const { container } = render(<HomePage />);

    // Section ids expected on the page. Some come from child components that
    // own their SectionWrapper (overview/tournaments/endorsements/contact/labs),
    // others from grouped wrappers in app/page.tsx
    // (architecture/case-studies/governance).
    const expectedIds = [
      "overview",
      "experience",
      "tournaments",
      "architecture",
      "case-studies",
      "projects",
      "governance",
      "education",
      "certifications",
      "endorsements",
      "contact",
      "labs",
      "arcade",
    ];

    for (const id of expectedIds) {
      const el = container.querySelector(`#${id}`);
      expect(el, `expected an element with id "#${id}"`).not.toBeNull();
      // Each content anchor should be a <section> element.
      expect(el?.tagName.toLowerCase()).toBe("section");
    }
  });
});

describe("smoke: no server API routes with secrets (Req 20.2)", () => {
  it("has no app/api directory (only client-side Formspree fetch)", () => {
    const apiDir = path.join(REPO_ROOT, "app", "api");
    const missingOrEmpty =
      !existsSync(apiDir) || readdirSync(apiDir).length === 0;
    expect(
      missingOrEmpty,
      "app/api should not exist (or be empty) — no server routes/secrets",
    ).toBe(true);
  });

  it("submits via a public Formspree endpoint (no backend secret)", () => {
    expect(typeof site.formspreeEndpoint).toBe("string");
    expect(site.formspreeEndpoint).toContain("formspree.io");
  });
});
