/**
 * Smooth-scroll-to-section helper.
 *
 * Backs the Navbar center links and Hero CTAs. Requirements:
 * - 1.6 / 2.9 / 2.10: activating a link/CTA whose target section exists smooth-scrolls
 *   the viewport so the section top aligns with the Navbar bottom edge (within 1000ms).
 * - 1.7: activating a link whose target section does not exist is a no-op that preserves
 *   the current scroll position.
 */

/**
 * Height of the sticky Navbar in pixels. The scroll target is offset by this amount
 * so the section top lands just below the fixed navbar rather than underneath it.
 */
export const NAVBAR_HEIGHT = 72;

/**
 * Smooth-scrolls the viewport so the section identified by `id` aligns its top edge
 * with the bottom edge of the sticky Navbar.
 *
 * The `id` may be passed with or without a leading "#" (e.g. "#contact" or "contact");
 * a leading "#" is stripped before lookup.
 *
 * If the target element does not exist in the document, the function returns without
 * scrolling, preserving the current scroll position (Req 1.7).
 *
 * @param id - The target section id, with or without a leading "#".
 */
export function scrollToSection(id: string): void {
  // Guard for non-browser environments (e.g. SSR / tests without a DOM).
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const normalizedId = id.startsWith("#") ? id.slice(1) : id;

  const target = document.getElementById(normalizedId);
  if (!target) {
    // No matching section: no-op, preserve current scroll position (Req 1.7).
    return;
  }

  const top =
    target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

  window.scrollTo({ top, behavior: "smooth" });
}
