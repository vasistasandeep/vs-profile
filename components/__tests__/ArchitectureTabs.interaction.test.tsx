// Interaction / component tests for ArchitectureTabs (Task 12.2).
//
// Validates:
// - Req 5.5: exactly one tab panel is visible (mutual exclusion) at a time.
// - Req 5.6: pointer click selects a tab (its panel content becomes visible).
// - Req 5.7: keyboard arrow navigation moves selection; Enter/Space activate.
//
// Radix Tabs provides role="tab"/"tabpanel" and roving-tabindex keyboard
// semantics. Under prefers-reduced-motion the wrapping motion.div resolves to a
// static (fully visible) variant, so we force reduced motion in jsdom.

import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Force reduced motion so useMotionSafe returns the static no-op variant and the
// block renders immediately (framer-motion whileInView does not fire in jsdom).
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return { ...actual, useReducedMotion: () => true };
});

import { ArchitectureTabs } from "@/components/ArchitectureTabs";
import { architectureTabs } from "@/data/architecture";

afterEach(() => {
  cleanup();
});

describe("ArchitectureTabs interactions", () => {
  it("shows exactly one panel; pointer click selects a tab (Req 5.5, 5.6)", async () => {
    const user = userEvent.setup();
    render(<ArchitectureTabs />);

    const [first, second, third] = architectureTabs;

    const firstTab = screen.getByRole("tab", { name: first.label });
    const secondTab = screen.getByRole("tab", { name: second.label });

    // Default: first tab selected, its panel content visible.
    expect(firstTab).toHaveAttribute("aria-selected", "true");
    expect(secondTab).toHaveAttribute("aria-selected", "false");

    // Only one tabpanel is rendered/visible at a time (mutual exclusion).
    const panels = screen.getAllByRole("tabpanel");
    expect(panels).toHaveLength(1);
    expect(screen.getByText(first.items[0])).toBeInTheDocument();
    expect(screen.queryByText(second.items[0])).not.toBeInTheDocument();

    // Click the second tab: its content shows, the first hides.
    await user.click(secondTab);
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(firstTab).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText(second.items[0])).toBeInTheDocument();
    expect(screen.queryByText(first.items[0])).not.toBeInTheDocument();

    // Still exactly one visible panel.
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    // Third tab remains unselected.
    expect(screen.getByRole("tab", { name: third.label })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("supports keyboard arrow + Enter/Space navigation (Req 5.7)", async () => {
    const user = userEvent.setup();
    render(<ArchitectureTabs />);

    const [first, second] = architectureTabs;
    const firstTab = screen.getByRole("tab", { name: first.label });

    // Focus the first (selected) tab, then arrow-right to move selection.
    firstTab.focus();
    expect(firstTab).toHaveFocus();

    // Radix Tabs default automatic activation: ArrowRight moves + selects.
    await user.keyboard("{ArrowRight}");
    const secondTab = screen.getByRole("tab", { name: second.label });
    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(second.items[0])).toBeInTheDocument();

    // ArrowLeft returns to the first tab and reselects it.
    await user.keyboard("{ArrowLeft}");
    expect(firstTab).toHaveFocus();
    expect(firstTab).toHaveAttribute("aria-selected", "true");

    // Enter/Space keep the focused tab selected (activation semantics).
    await user.keyboard("{ArrowRight}");
    await user.keyboard(" ");
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Enter}");
    expect(secondTab).toHaveAttribute("aria-selected", "true");
  });
});
