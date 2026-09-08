// Interaction / component tests for ArchitectureFlowDiagram (Task 12.2).
//
// Validates:
// - Req 21.7: each layer is a focusable, keyboard- and pointer-operable region
//   that applies an active visual state on hover/focus and on Enter/Space.
//
// Active state is exposed via aria-pressed on each layer region (role="button").
// Reduced motion is forced so the staggered reveal renders statically.

import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return { ...actual, useReducedMotion: () => true };
});

import { ArchitectureFlowDiagram } from "@/components/ArchitectureFlowDiagram";
import { flowLayers } from "@/data/flow";

afterEach(() => {
  cleanup();
});

describe("ArchitectureFlowDiagram interactions", () => {
  it("renders each layer as a focusable button region, initially inactive (Req 21.7)", () => {
    render(<ArchitectureFlowDiagram />);

    // The component now renders inside a collapsible SectionWrapper, which adds
    // a header toggle <button> (no aria-pressed). The layer regions are the
    // buttons carrying aria-pressed, so filter to those.
    const regions = layerRegions();
    expect(regions).toHaveLength(flowLayers.length);
    for (const region of regions) {
      expect(region).toHaveAttribute("tabindex", "0");
      expect(region).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("applies active state on pointer hover and clears on leave (Req 21.7)", async () => {
    const user = userEvent.setup();
    render(<ArchitectureFlowDiagram />);

    const first = screen.getByRole("button", { name: new RegExp(escapeRe(flowLayers[0].label)) });

    await user.hover(first);
    expect(first).toHaveAttribute("aria-pressed", "true");

    await user.unhover(first);
    expect(first).toHaveAttribute("aria-pressed", "false");
  });

  it("applies active state on keyboard focus (Req 21.7)", () => {
    render(<ArchitectureFlowDiagram />);

    const first = layerRegions()[0];

    // The region is keyboard-reachable (tabIndex 0) and focusing it activates
    // the layer. fireEvent.focus dispatches React's onFocus deterministically.
    fireEvent.focus(first);
    expect(first).toHaveAttribute("aria-pressed", "true");

    // Blurring clears the active state.
    fireEvent.blur(first);
    expect(first).toHaveAttribute("aria-pressed", "false");
  });

  it("activates via Enter/Space key presses on the focused region (Req 21.7)", () => {
    render(<ArchitectureFlowDiagram />);

    const second = layerRegions()[1];

    // fireEvent gives deterministic key handling without focus side effects.
    fireEvent.keyDown(second, { key: "Enter" });
    expect(second).toHaveAttribute("aria-pressed", "true");

    fireEvent.keyDown(second, { key: " " });
    expect(second).toHaveAttribute("aria-pressed", "true");
  });
});

/** Escape regex-special characters in dynamic label strings. */
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The interactive layer regions only. Excludes the collapsible SectionWrapper
 * header toggle button (which has no aria-pressed attribute).
 */
function layerRegions(): HTMLElement[] {
  return screen
    .getAllByRole("button")
    .filter((el) => el.hasAttribute("aria-pressed"));
}
