// Feature: executive-portfolio-site — Contact submission integration tests
//
// These tests exercise the full Contact form submit flow (components/Contact.tsx)
// against a mocked `global.fetch`, covering:
//   - Case 1 success: 200 → pending shown in-flight, then success feedback (Req 11.4, 11.8)
//   - Case 2 error:   non-OK (500) → error feedback + mailto fallback (Req 11.5)
//   - Case 3 timeout/abort: fetch rejects with an AbortError (the 30s timeout
//     path) → exits pending, shows error + fallback (Req 11.9)
//
// The 30s abort in Contact.tsx is driven by an AbortController whose signal is
// passed to fetch; when it fires, fetch rejects. To keep the fake-timer /
// user-event interplay robust, Case 3 simulates that outcome directly by having
// the mocked fetch reject with a DOMException('Aborted', 'AbortError'), which
// is exactly what the browser fetch does when the controller aborts.
//
// Validates: Requirements 11.4, 11.5, 11.8, 11.9

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Contact from "@/components/Contact";
import { site } from "@/data/site";

// Guard against intermittent 5s-default timeouts under parallel machine
// load (long userEvent.type + async fetch flow). Environment timing only.
vi.setConfig({ testTimeout: 15000 });

/** Fill the three required fields with valid values so validation passes. */
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Priya Executive");
  await user.type(screen.getByLabelText(/work email/i), "priya@example.com");
  await user.type(
    screen.getByLabelText(/message/i),
    "I would love to discuss an advisory engagement for our platform team.",
  );
}

function submit(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole("button", { name: /send message/i }));
}

describe("Contact form submission (mocked Formspree)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Case 1: shows the pending state in-flight and a success state on 200 (Req 11.4, 11.8)", async () => {
    const user = userEvent.setup();

    // A fetch that stays pending until we resolve it, so we can observe the
    // in-flight pending UI before the success state.
    let resolveFetch!: (value: { ok: boolean; status: number }) => void;
    const fetchPromise = new Promise<{ ok: boolean; status: number }>(
      (resolve) => {
        resolveFetch = resolve;
      },
    );
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockReturnValue(fetchPromise as unknown as Promise<Response>);

    render(<Contact />);
    await fillValidForm(user);
    await submit(user);

    // In-flight: pending announced via aria-live and the button label flips.
    expect(fetchMock).toHaveBeenCalledWith(
      site.formspreeEndpoint,
      expect.objectContaining({ method: "POST" }),
    );
    const status = screen.getByRole("status");
    await waitFor(() => {
      expect(within(status).getByText(/sending your message/i)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: /sending/i }),
    ).toBeDisabled();

    // Resolve with a successful response.
    resolveFetch({ ok: true, status: 200 });

    // Success feedback appears; button returns to its idle label.
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /send message/i }),
      ).toBeEnabled();
    });
  });

  it("Case 2: shows an error state with the mailto fallback on a non-OK response (Req 11.5)", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<Contact />);
    await fillValidForm(user);
    await submit(user);

    // Error feedback surfaces in the aria-live status region. Scope to that
    // region so we don't match the direct-channels mailto button, which also
    // links to the primary email.
    const status = screen.getByRole("status");
    await waitFor(() => {
      expect(
        within(status).getByText(/something went wrong/i),
      ).toBeInTheDocument();
    });

    // The error state exposes the primary mailto fallback link (with the
    // fallback address surfaced both as a cc and as inline text).
    const fallbackLink = within(status).getByRole("link", {
      name: new RegExp(site.primaryEmail, "i"),
    });
    expect(fallbackLink.getAttribute("href")).toContain(
      `mailto:${site.primaryEmail}`,
    );
    expect(fallbackLink.getAttribute("href")).toContain(site.fallbackEmail);
    expect(
      within(status).getByText(new RegExp(site.fallbackEmail, "i")),
    ).toBeInTheDocument();
  });

  it("Case 3: exits pending and shows error + fallback when the request aborts on timeout (Req 11.9)", async () => {
    const user = userEvent.setup();
    // Simulate the 30s AbortController timeout: the browser fetch rejects with
    // an AbortError when the signal aborts. Rejecting with that exact error
    // exercises the same catch → error path as the real timeout.
    vi.spyOn(global, "fetch").mockRejectedValue(
      new DOMException("Aborted", "AbortError"),
    );

    render(<Contact />);
    await fillValidForm(user);
    await submit(user);

    // The abort exits pending and surfaces the error feedback.
    const status = screen.getByRole("status");
    await waitFor(() => {
      expect(
        within(status).getByText(/something went wrong/i),
      ).toBeInTheDocument();
    });

    // Exited pending: the button reverts to its idle "Send Message" label
    // (the in-flight "Sending…" label is gone) and is enabled again.
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: /sending/i }),
    ).not.toBeInTheDocument();

    // Mailto fallback (primary + fallback address) is presented.
    const fallbackLink = within(status).getByRole("link", {
      name: new RegExp(site.primaryEmail, "i"),
    });
    expect(fallbackLink.getAttribute("href")).toContain(
      `mailto:${site.primaryEmail}`,
    );
    expect(
      within(status).getByText(new RegExp(site.fallbackEmail, "i")),
    ).toBeInTheDocument();
  });
});
