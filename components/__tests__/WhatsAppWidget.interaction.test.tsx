// Interaction tests for the floating WhatsApp chat widget.
//
// Verifies the FAB toggles the popup, the scripted quick replies render, and
// selecting a quick reply opens a wa.me deep link with the encoded message.
// Reduced motion is forced so the popup renders/removes without animation
// timing in jsdom.

import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return { ...actual, useReducedMotion: () => true };
});

import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("WhatsAppWidget", () => {
  it("renders a FAB that is collapsed by default", () => {
    render(<WhatsAppWidget />);
    const fab = screen.getByRole("button", { name: /chat on whatsapp/i });
    expect(fab).toHaveAttribute("aria-expanded", "false");
    // Quick replies are not visible until the popup is opened.
    expect(
      screen.queryByRole("link", { name: /discuss a role/i }),
    ).not.toBeInTheDocument();
  });

  it("opens the popup and reveals the quick-reply prompts on click", async () => {
    const user = userEvent.setup();
    render(<WhatsAppWidget />);

    await user.click(screen.getByRole("button", { name: /chat on whatsapp/i }));

    expect(
      screen.getByRole("button", { name: /chat on whatsapp/i }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("link", { name: /discuss a role/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /just saying hi/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /^open whatsapp$/i }),
    ).toBeInTheDocument();
  });

  it("builds a wa.me deep link with the encoded prefilled message", async () => {
    const user = userEvent.setup();
    render(<WhatsAppWidget />);

    await user.click(screen.getByRole("button", { name: /chat on whatsapp/i }));

    const reply = screen.getByRole("link", { name: /just saying hi/i });
    const href = reply.getAttribute("href") ?? "";
    expect(href).toContain("wa.me/919986988057");
    expect(href).toContain(encodeURIComponent("Hi Vasista!"));
  });

  it("opens WhatsApp in a new tab via window.open when a quick reply is chosen", async () => {
    const openSpy = vi
      .spyOn(window, "open")
      .mockReturnValue(null as unknown as Window);
    const user = userEvent.setup();
    render(<WhatsAppWidget />);

    await user.click(screen.getByRole("button", { name: /chat on whatsapp/i }));
    await user.click(screen.getByRole("link", { name: /just saying hi/i }));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url, target] = openSpy.mock.calls[0];
    expect(String(url)).toContain("wa.me/919986988057");
    expect(String(url)).toContain(encodeURIComponent("Hi Vasista!"));
    expect(target).toBe("_blank");
  });
});
