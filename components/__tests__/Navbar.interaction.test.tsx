// Interaction / component tests for Navbar (Task 12.2).
//
// Validates:
// - Req 1.6: clicking a center link whose target section exists smooth-scrolls to it.
// - Req 1.7: clicking a link whose target section is absent is a no-op (no scroll).
// - Req 1.8: LinkedIn link opens in a new tab (target=_blank, rel noopener noreferrer).
// - Req 1.10 / 1.11: mobile menu toggle shows/hides links and flips aria-expanded.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Navbar } from "@/components/Navbar";
import { navLinks } from "@/data/navigation";
import { site } from "@/data/site";

describe("Navbar interactions", () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // jsdom does not implement scrollTo; spy so scrollToSection can call it.
    scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("scrolls when clicking a center link whose target exists (Req 1.6)", async () => {
    const user = userEvent.setup();

    // Render a target element with the id the "Contact" link points to.
    const target = document.createElement("section");
    target.id = "contact"; // navLink targetId "#contact" -> element id "contact"
    document.body.appendChild(target);

    render(<Navbar />);

    // Center links are rendered as buttons labelled by the nav link text.
    // "Contact" appears once as a center-list button (mobile panel is hidden
    // markup too, so query all and click the first match).
    const contactButtons = screen.getAllByRole("button", { name: "Contact" });
    await user.click(contactButtons[0]);

    expect(scrollToSpy).toHaveBeenCalled();

    document.body.removeChild(target);
  });

  it("does not scroll when the link's target section is absent (Req 1.7)", async () => {
    const user = userEvent.setup();

    // Ensure no section elements exist for any nav target.
    for (const link of navLinks) {
      const id = link.targetId.replace(/^#/, "");
      expect(document.getElementById(id)).toBeNull();
    }

    render(<Navbar />);

    const overviewButtons = screen.getAllByRole("button", { name: "Overview" });
    await user.click(overviewButtons[0]);

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("renders the LinkedIn link opening in a new tab with safe rel (Req 1.8)", () => {
    render(<Navbar />);

    // Multiple LinkedIn anchors exist (desktop + mobile panel); all must be
    // target=_blank with rel noopener noreferrer to site.linkedInUrl.
    const linkedInLinks = screen.getAllByRole("link", {
      name: /LinkedIn profile/i,
    });
    expect(linkedInLinks.length).toBeGreaterThan(0);
    for (const link of linkedInLinks) {
      expect(link).toHaveAttribute("href", site.linkedInUrl);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("toggles the mobile menu open/closed, flipping aria-expanded (Req 1.10, 1.11)", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggle = screen.getByRole("button", { name: /open navigation menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    // The mobile panel is controlled by aria-controls; it starts hidden.
    const panelId = toggle.getAttribute("aria-controls")!;
    const panel = document.getElementById(panelId)!;
    expect(panel).toBeTruthy();
    expect(panel.hidden).toBe(true);

    // Open the menu: aria-expanded flips true and the panel becomes visible.
    await user.click(toggle);
    const openToggle = screen.getByRole("button", {
      name: /close navigation menu/i,
    });
    expect(openToggle).toHaveAttribute("aria-expanded", "true");
    expect(panel.hidden).toBe(false);
    // The link panel now shows the nav links (e.g. "Governance").
    expect(
      within(panel).getByRole("button", { name: "Governance" }),
    ).toBeInTheDocument();

    // Close again: aria-expanded flips back to false and panel hides.
    await user.click(openToggle);
    const closedToggle = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    expect(closedToggle).toHaveAttribute("aria-expanded", "false");
    expect(panel.hidden).toBe(true);
  });
});
