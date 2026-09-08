"use client";

import { useCallback, useEffect, useState } from "react";
import { Linkedin, Menu, X } from "lucide-react";

import { navLinks } from "@/data/navigation";
import { site } from "@/data/site";
import { scrollToSection } from "@/lib/scroll";
import { toggleMenu } from "@/components/ui/state";
import { ResumeButton } from "@/components/ui/ResumeButton";

/**
 * Navbar (`components/Navbar.tsx`) — Req 1, 9, 13.
 *
 * Sticky (`fixed top-0`), full-width, token-based translucent header with a
 * `border-border` bottom edge. Structure:
 *
 * - Left: monogram "Vasista Sandeep" (from `site.monogram`) + `StatusPill`
 *   (Req 1.2, 1.3).
 * - Center (visible `md+`): the seven nav links from `data/navigation.ts` in the
 *   required order. Clicking calls `scrollToSection(targetId)`, which smooth-
 *   scrolls to an existing section or no-ops (preserving scroll position) when
 *   the target is absent (Req 1.4, 1.6, 1.7).
 * - Right: `ResumeButton` + a LinkedIn `<a target="_blank" rel="noopener noreferrer">`
 *   opening `site.linkedInUrl` in a new tab (Req 1.5, 1.8).
 * - `≤768px` (hidden `md+`): a `Mobile_Menu` toggle button with `aria-expanded`
 *   and `aria-controls` shows/hides a link panel; selecting a link closes the
 *   menu and scrolls (Req 1.9–1.11).
 * - Layout stability relies on the root `scrollbar-gutter: stable` declared in
 *   `globals.css` so modal scroll-lock does not shift the fixed navbar (Req 1.12).
 * - Optional progressive-enhancement scroll-spy via `IntersectionObserver`
 *   highlights the active link; it degrades silently when unsupported.
 */

/** DOM id of the collapsible mobile link panel (for `aria-controls`). */
const MOBILE_MENU_ID = "navbar-mobile-menu";

/** Strip a leading "#" from a nav target id to get the section element id. */
function sectionId(targetId: string): string {
  return targetId.startsWith("#") ? targetId.slice(1) : targetId;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Optional scroll-spy: the id (without "#") of the section currently in view.
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleNavigate = useCallback((targetId: string) => {
    // scrollToSection is a no-op when the target section is absent (Req 1.7).
    scrollToSection(targetId);
  }, []);

  const handleMobileNavigate = useCallback((targetId: string) => {
    // Selecting a link closes the menu and scrolls (Req 1.11).
    setMobileOpen(false);
    scrollToSection(targetId);
  }, []);

  const handleToggle = useCallback(() => {
    setMobileOpen((open) => toggleMenu(open));
  }, []);

  // Progressive-enhancement scroll-spy. Observes each section and marks the
  // most-visible one active for link styling. Silently disabled where
  // IntersectionObserver is unavailable.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const sections = navLinks
      .map((link) => document.getElementById(sectionId(link.targetId)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Left: monogram + availability pill */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavigate(navLinks[0].targetId)}
            className="truncate text-base font-semibold tracking-tight text-fg transition-colors hover:text-accent"
          >
            {site.monogram}
          </button>
        </div>

        {/* Center: nav links (md+) */}
        <ul className="hidden items-center gap-0.5 md:flex lg:gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === sectionId(link.targetId);
            return (
              <li key={link.targetId}>
                <button
                  type="button"
                  onClick={() => handleNavigate(link.targetId)}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-muted hover:text-fg",
                  ].join(" ")}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right: theme toggle + resume + LinkedIn (md+) and mobile toggle (≤768px) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ResumeButton className="hidden md:inline-flex" />
          <a
            href={site.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent md:inline-flex"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </a>

          {/* Mobile menu toggle (hidden md+) */}
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile link panel: shown only when toggled open (≤768px) */}
      <div
        id={MOBILE_MENU_ID}
        hidden={!mobileOpen}
        className="border-t border-border bg-background/95 backdrop-blur md:hidden"
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => {
            const isActive = activeSection === sectionId(link.targetId);
            return (
              <li key={link.targetId}>
                <button
                  type="button"
                  onClick={() => handleMobileNavigate(link.targetId)}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    isActive
                      ? "bg-surface2 text-accent"
                      : "text-muted hover:bg-surface2 hover:text-fg",
                  ].join(" ")}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
          <li className="mt-3 flex items-center gap-3">
            <ResumeButton />
            <a
              href={site.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
