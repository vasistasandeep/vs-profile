"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { caseStudies } from "@/data/caseStudies";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * CaseStudyDrawer — expanded case study cards + slide-over drawer (Req 8).
 *
 * Renders three trigger cards from `data/caseStudies.ts` as `<article>`
 * elements showing each case study's title and summary (Req 8.1, 15.3).
 * Activating a card opens a right-side slide-over drawer (the "Sheet" pattern)
 * built on a Radix `Dialog`, displaying that case study's expanded `body`
 * paragraphs (Req 8.2-8.5). The Walmart wording (streaming ML audit pipeline
 * consuming Kafka event streams) is sourced from the data (Req 8.5).
 *
 * Each card owns its own `Dialog.Root` with a `Dialog.Trigger` wrapping the
 * card. Delegating open/close to `Dialog.Trigger` means Radix returns focus to
 * the exact triggering card when the drawer closes (Req 8.8, 8.9). Radix also
 * provides the focus trap while open (Req 8.6), a pointer-blocking overlay that
 * makes background content inert (Req 8.7), and Escape-to-close (Req 8.8).
 *
 * Open/close animation:
 * Radix suspends the unmount of the Portal children until any CSS animation on
 * them completes, so the drawer uses CSS keyframe animations keyed off the
 * `data-state` attribute (`open` / `closed`). Both the slide/fade in and the
 * slide/fade out complete in 260ms — comfortably within the 300ms budget
 * (Req 8.2, 8.9). The keyframes are declared once in a scoped `<style>` block
 * below so this component is self-contained.
 *
 * NOTE: This component is part of the grouped `#case-studies` section (rendered
 * alongside `PlatformEvolution` by the page composition). It therefore does NOT
 * declare a top-level `id="case-studies"`; it renders as a titled inner block
 * ("In-Depth Case Studies") so the page composition can own the section id.
 */

/** Shared duration (ms) for open/close animations — within the 300ms budget. */
const DRAWER_ANIMATION_MS = 260;

export function CaseStudyDrawer() {
  // Per-card open state, keyed by case study id. `null` means all closed.
  // (Req 14.2 — interactive state managed with React state.)
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      {/* Scoped keyframes for the overlay fade and the drawer slide-over.
          Radix waits for these to finish before unmounting on close. */}
      <style>{drawerKeyframes}</style>

      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Deep Dives
        </p>
        <h3 className="mt-2 text-3xl font-semibold text-fg sm:text-4xl">
          In-Depth Case Studies
        </h3>
      </header>

      <ul className="grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3">
        {caseStudies.map((study) => {
          const titleId = `case-study-${study.id}-title`;
          const descId = `case-study-${study.id}-desc`;
          const isOpen = openId === study.id;

          return (
            <li key={study.id}>
              <Dialog.Root
                open={isOpen}
                onOpenChange={(next) => setOpenId(next ? study.id : null)}
              >
                {/* The whole card is the trigger, so Radix restores focus to
                    it on close (Req 8.8, 8.9). `asChild` lets the trigger be a
                    real, keyboard-reachable <button> wrapping the article. */}
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                    aria-label={`Read the in-depth case study: ${study.title}`}
                  >
                    <GlassCard
                      interactive
                      className="flex h-full flex-col p-6"
                    >
                      <article className="flex h-full flex-col">
                        <h4 className="text-lg font-semibold text-fg">
                          {study.title}
                        </h4>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                          {study.summary}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-opacity group-hover:opacity-80">
                          Read case study
                          <span aria-hidden="true">&rarr;</span>
                        </span>
                      </article>
                    </GlassCard>
                  </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                  {/* Pointer-blocking overlay makes background inert (Req 8.7). */}
                  <Dialog.Overlay
                    className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm data-[state=open]:animate-cs-overlay-in data-[state=closed]:animate-cs-overlay-out"
                    style={overlayAnimationVars}
                  />

                  {/* Right-side slide-over. Radix traps focus within it
                      (Req 8.6) and returns focus to the trigger on close. */}
                  <Dialog.Content
                    aria-labelledby={titleId}
                    aria-describedby={descId}
                    className="fixed inset-y-0 right-0 z-[100] flex h-full w-full max-w-md flex-col border-l border-border bg-background focus:outline-none data-[state=open]:animate-cs-drawer-in data-[state=closed]:animate-cs-drawer-out sm:max-w-lg"
                    style={drawerAnimationVars}
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-border p-6">
                      <Dialog.Title
                        id={titleId}
                        className="text-xl font-semibold text-fg"
                      >
                        {study.title}
                      </Dialog.Title>

                      {/* Visible close control (Req 8.9). */}
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          aria-label="Close case study"
                          className="flex-shrink-0 rounded-full border border-border p-2 text-muted transition-colors hover:bg-surface2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                      <Dialog.Description
                        id={descId}
                        className="text-sm leading-relaxed text-muted"
                      >
                        {study.summary}
                      </Dialog.Description>

                      {study.body.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-sm leading-relaxed text-muted"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Animation duration passed to the keyframe utilities via CSS custom
 * properties, keeping the 260ms budget in one place (Req 8.2, 8.9).
 */
const overlayAnimationVars = {
  animationDuration: `${DRAWER_ANIMATION_MS}ms`,
} as const;

const drawerAnimationVars = {
  animationDuration: `${DRAWER_ANIMATION_MS}ms`,
} as const;

/**
 * Scoped keyframes + the `animate-cs-*` utilities they back. Declared inline so
 * the component is self-contained and does not depend on Tailwind config or
 * global CSS. Radix suspends unmount until the `-out` animations finish, giving
 * the drawer a proper close transition within the 300ms budget.
 */
const drawerKeyframes = `
@keyframes cs-overlay-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes cs-overlay-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes cs-drawer-in { from { transform: translateX(100%); opacity: 0.6; } to { transform: translateX(0); opacity: 1; } }
@keyframes cs-drawer-out { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0.6; } }
.animate-cs-overlay-in { animation: cs-overlay-in var(--cs-anim, 260ms) ease-out both; }
.animate-cs-overlay-out { animation: cs-overlay-out var(--cs-anim, 260ms) ease-in both; }
.animate-cs-drawer-in { animation: cs-drawer-in var(--cs-anim, 260ms) ease-out both; }
.animate-cs-drawer-out { animation: cs-drawer-out var(--cs-anim, 260ms) ease-in both; }
@media (prefers-reduced-motion: reduce) {
  .animate-cs-overlay-in, .animate-cs-overlay-out,
  .animate-cs-drawer-in, .animate-cs-drawer-out { animation-duration: 1ms; }
}
`;

export default CaseStudyDrawer;
