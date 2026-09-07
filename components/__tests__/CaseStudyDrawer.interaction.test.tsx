// Interaction / component tests for CaseStudyDrawer (Task 12.2).
//
// Validates:
// - Req 8.2: activating a card opens the right-side drawer (dialog appears).
// - Req 8.6: the open drawer traps focus within itself.
// - Req 8.7: the background is made non-interactive via a modal overlay.
// - Req 8.8: Escape closes the drawer and returns focus to the trigger card.
// - Req 8.9: a visible close control dismisses the drawer.
//
// Built on Radix Dialog, which provides role="dialog", aria-modal, focus trap,
// Escape-to-close, and focus restoration to the trigger.

import { afterEach, describe, expect, it } from "vitest";
import { render, screen, waitFor, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CaseStudyDrawer } from "@/components/CaseStudyDrawer";
import { caseStudies } from "@/data/caseStudies";

afterEach(() => {
  cleanup();
});

describe("CaseStudyDrawer interactions", () => {
  it("opens the drawer when a card is activated (Req 8.2)", async () => {
    const user = userEvent.setup();
    render(<CaseStudyDrawer />);

    const study = caseStudies[0];
    // No dialog before activation.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const trigger = screen.getByRole("button", {
      name: new RegExp(`Read the in-depth case study: ${escapeRe(study.title)}`),
    });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // Expanded body text is present in the drawer.
    expect(within(dialog).getByText(study.body[0])).toBeInTheDocument();
  });

  it("makes the background inert via a modal overlay (Req 8.7)", async () => {
    const user = userEvent.setup();
    render(<CaseStudyDrawer />);

    const study = caseStudies[1];
    const trigger = screen.getByRole("button", {
      name: new RegExp(`Read the in-depth case study: ${escapeRe(study.title)}`),
    });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // A full-viewport overlay is rendered behind the drawer, capturing pointer
    // events so background content is non-interactive (Req 8.7). Radix marks it
    // with data-state="open"; it is the fixed inset-0 layer directly preceding
    // the dialog content.
    const overlay = document.querySelector<HTMLElement>(
      '.fixed.inset-0[data-state="open"]',
    );
    expect(overlay).not.toBeNull();
    // The dialog itself is the top layer above the overlay.
    expect(dialog).toHaveAttribute("data-state", "open");
  });

  it("traps focus within the open drawer (Req 8.6)", async () => {
    const user = userEvent.setup();
    render(<CaseStudyDrawer />);

    const study = caseStudies[0];
    const trigger = screen.getByRole("button", {
      name: new RegExp(`Read the in-depth case study: ${escapeRe(study.title)}`),
    });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");

    // Focus should be inside the dialog after opening.
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    // Tabbing repeatedly keeps focus within the dialog (focus trap).
    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("closes on Escape and returns focus to the triggering card (Req 8.8)", async () => {
    const user = userEvent.setup();
    render(<CaseStudyDrawer />);

    const study = caseStudies[0];
    const trigger = screen.getByRole("button", {
      name: new RegExp(`Read the in-depth case study: ${escapeRe(study.title)}`),
    });
    await user.click(trigger);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    // Focus returns to the trigger that opened the drawer.
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("closes via the visible close control (Req 8.9)", async () => {
    const user = userEvent.setup();
    render(<CaseStudyDrawer />);

    const study = caseStudies[2];
    const trigger = screen.getByRole("button", {
      name: new RegExp(`Read the in-depth case study: ${escapeRe(study.title)}`),
    });
    await user.click(trigger);
    await screen.findByRole("dialog");

    const closeBtn = screen.getByRole("button", { name: /close case study/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

// --- helpers ---------------------------------------------------------------

/** Escape regex-special characters in dynamic title strings. */
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
