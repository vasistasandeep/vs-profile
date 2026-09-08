// Interaction / component tests for CostCalculator (Task 12.2).
//
// Validates:
// - Req 6.3: changing the slider drives a recompute of derived outputs.
// - Req 6.4: toggling the sampling strategy drives a recompute (savings appear).
//
// The calculator derives every displayed value from computeCost via useMemo, so
// changing an input must change the rendered numbers. Radix Slider responds to
// arrow keys on the focused thumb; Radix ToggleGroup switches strategies.
// Reduced motion is forced so the wrapping motion.div renders statically.

import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return { ...actual, useReducedMotion: () => true };
});

// Radix Slider measures its track via ResizeObserver, which jsdom does not
// implement. Provide a no-op polyfill so the component can mount.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof globalThis.ResizeObserver === "undefined") {
  // @ts-expect-error assigning a stub for the jsdom environment
  globalThis.ResizeObserver = ResizeObserverStub;
}

import { CostCalculator } from "@/components/CostCalculator";

afterEach(() => {
  cleanup();
});

describe("CostCalculator interactions", () => {
  it("recomputes savings when toggling to tail-based sampling (Req 6.4)", async () => {
    const user = userEvent.setup();
    render(<CostCalculator />);

    // Default is Standard 100% Ingestion -> no savings line is shown.
    expect(screen.queryByText(/vs\. standard/)).not.toBeInTheDocument();

    // Toggle to tail-based intelligent sampling.
    const tailOption = screen.getByRole("radio", {
      name: /Tail-Based Intelligent Sampling/i,
    });
    await user.click(tailOption);

    // A savings percentage in the [78, 82] band must now be displayed in the
    // "down $X (NN%) vs. standard" comparison line.
    const savings = await screen.findByText(/\(\d+%\) vs\. standard/);
    const pct = Number(savings.textContent!.match(/\((\d+)%\) vs\. standard/)![1]);
    expect(pct).toBeGreaterThanOrEqual(78);
    expect(pct).toBeLessThanOrEqual(82);
  });

  it("recomputes displayed concurrency when the slider changes (Req 6.3)", async () => {
    const user = userEvent.setup();
    render(<CostCalculator />);

    const slider = screen.getByRole("slider", {
      name: /peak concurrency in users/i,
    });
    // Default slider value is the max (30,000,000).
    expect(slider).toHaveAttribute("aria-valuenow", "30000000");

    // Focus the thumb and press ArrowDown to decrease by one step (1,000,000).
    slider.focus();
    await user.keyboard("{ArrowLeft}");

    expect(slider).toHaveAttribute("aria-valuenow", "29000000");
    // The derived aria-valuetext reflects the new value.
    expect(slider).toHaveAttribute(
      "aria-valuetext",
      expect.stringContaining("29,000,000"),
    );
  });

  it("always shows the 99.9% MTTR fidelity statement across inputs (Req 6.6 wiring)", async () => {
    const user = userEvent.setup();
    render(<CostCalculator />);

    // The "99.9% MTTR fidelity" phrase lives in a <span>; assert it is present
    // both before and after switching strategy.
    expect(
      screen.getByText(/99\.9% MTTR fidelity/),
    ).toBeInTheDocument();

    const tailOption = screen.getByRole("radio", {
      name: /Tail-Based Intelligent Sampling/i,
    });
    await user.click(tailOption);

    // Still present after recompute.
    expect(
      screen.getByText(/99\.9% MTTR fidelity/),
    ).toBeInTheDocument();
  });
});
