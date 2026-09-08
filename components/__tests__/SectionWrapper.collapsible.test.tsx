// components/__tests__/SectionWrapper.collapsible.test.tsx
//
// Behavioural tests for SectionWrapper's optional collapsible mode.
//
// When `collapsible` is set, the header renders as a toggle <button> exposing
// aria-expanded / aria-controls, and the children live in a role="region" that
// is present when open and removed from the DOM (and tab order) when closed.
//
// framer-motion's height animation does not settle under jsdom, so we force
// `useReducedMotion() -> true`. In that mode SectionWrapper renders/unmounts
// the content region instantly, which is exactly the show/hide behaviour these
// tests assert on. Every other framer-motion export is preserved.

import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return { ...actual, useReducedMotion: () => true };
});

import { SectionWrapper } from "@/components/ui/SectionWrapper";

afterEach(() => {
  cleanup();
});

describe("SectionWrapper — collapsible mode", () => {
  it("defaults to open: toggle is aria-expanded=true and the child is visible", () => {
    render(
      <SectionWrapper id="demo" title="Demo Section" collapsible>
        <p>collapsible body content</p>
      </SectionWrapper>,
    );

    const toggle = screen.getByRole("button", { name: /demo section/i });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-controls", "demo-content");
    expect(screen.getByText("collapsible body content")).toBeInTheDocument();

    // The content region is present and labelled by the toggling header.
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("id", "demo-content");
    expect(region.getAttribute("aria-labelledby")).toBe(toggle.id);
  });

  it("collapses on click: aria-expanded flips to false and the child is removed", async () => {
    const user = userEvent.setup();
    render(
      <SectionWrapper id="demo" title="Demo Section" collapsible>
        <p>collapsible body content</p>
      </SectionWrapper>,
    );

    const toggle = screen.getByRole("button", { name: /demo section/i });
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText("collapsible body content"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("re-opens on a second click: content and aria-expanded=true return", async () => {
    const user = userEvent.setup();
    render(
      <SectionWrapper id="demo" title="Demo Section" collapsible>
        <p>collapsible body content</p>
      </SectionWrapper>,
    );

    const toggle = screen.getByRole("button", { name: /demo section/i });
    await user.click(toggle); // close
    await user.click(toggle); // re-open

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("collapsible body content")).toBeInTheDocument();
  });

  it("honors defaultOpen=false: starts collapsed with the child hidden", () => {
    render(
      <SectionWrapper
        id="demo"
        title="Demo Section"
        collapsible
        defaultOpen={false}
      >
        <p>collapsible body content</p>
      </SectionWrapper>,
    );

    const toggle = screen.getByRole("button", { name: /demo section/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText("collapsible body content"),
    ).not.toBeInTheDocument();
  });

  it("keeps the anchor id + scroll-mt-24 on the outer element", () => {
    render(
      <SectionWrapper id="demo" title="Demo Section" collapsible>
        <p>collapsible body content</p>
      </SectionWrapper>,
    );

    const outer = document.getElementById("demo");
    expect(outer).not.toBeNull();
    expect(outer?.tagName.toLowerCase()).toBe("section");
    expect(outer).toHaveClass("scroll-mt-24");
  });

  it("non-collapsible mode renders no toggle button and shows content", () => {
    render(
      <SectionWrapper id="plain" title="Plain Section">
        <p>plain body content</p>
      </SectionWrapper>,
    );

    // No toggle button; the title is a plain heading.
    expect(
      screen.queryByRole("button", { name: /plain section/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Plain Section" }),
    ).toBeInTheDocument();
    expect(screen.getByText("plain body content")).toBeInTheDocument();
  });
});
