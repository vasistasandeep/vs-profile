"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { evolutionItems } from "@/data/evolution";
import { GlassCard } from "@/components/ui/GlassCard";
import { toggleView, type EvolutionView } from "@/components/ui/state";

/**
 * PlatformEvolution — Before/After architectural transformations (Req 4).
 *
 * Renders the six evolution items from `data/evolution.ts`. Each item carries
 * its own Before/After control; the displayed detail cross-fades between the
 * `before` and `after` text when toggled (Req 4.1, 4.8).
 *
 * Per-item view is tracked as a `Record<string, EvolutionView>` keyed by item
 * id. Items default to the "before" view; toggling flips a single item via the
 * pure {@link toggleView} helper (Req 14.2 — interactive state managed with
 * React state).
 *
 * The detail cross-fades using Framer Motion `AnimatePresence`. When the
 * visitor prefers reduced motion (`useReducedMotion`), the transition duration
 * collapses to zero so content swaps instantly with no motion (Req 4.9, 17.4).
 *
 * NOTE: This component is part of the grouped `#case-studies` section (rendered
 * alongside `CaseStudyDrawer` by the page composition). It therefore does NOT
 * declare a top-level `id="case-studies"` / `SectionWrapper`; it renders as a
 * titled inner block ("Platform Evolution") so the page can own the section id.
 */
export function PlatformEvolution() {
  // Per-item Before/After view. Absent entries default to "before".
  const [views, setViews] = useState<Record<string, EvolutionView>>({});

  const prefersReducedMotion = useReducedMotion();

  // Instant swap under reduced motion; short cross-fade otherwise (Req 4.9).
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: "easeOut" as const };

  const currentView = (id: string): EvolutionView => views[id] ?? "before";

  const flip = (id: string): void => {
    setViews((prev) => ({
      ...prev,
      [id]: toggleView(prev[id] ?? "before"),
    }));
  };

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Platform Modernization
        </p>
        <h3 className="mt-2 text-3xl font-semibold text-fg sm:text-4xl">
          Platform Evolution
        </h3>
      </header>

      <ul className="grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2">
        {evolutionItems.map((item) => {
          const view = currentView(item.id);
          const isAfter = view === "after";
          const detail = isAfter ? item.after : item.before;
          const labelId = `evolution-${item.id}-title`;
          const detailId = `evolution-${item.id}-detail`;

          return (
            <li key={item.id}>
              <GlassCard
                glow={isAfter ? "emerald" : "none"}
                className="flex h-full flex-col p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4
                    id={labelId}
                    className="text-lg font-semibold text-fg"
                  >
                    {item.title}
                  </h4>

                  {/* Before/After toggle. Two buttons form a labelled group so
                      the current state is announced and both states are
                      keyboard reachable (Req 4.8, 17.1, 17.2). */}
                  <div
                    role="group"
                    aria-labelledby={labelId}
                    className="inline-flex flex-shrink-0 overflow-hidden rounded-full border border-border"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isAfter) flip(item.id);
                      }}
                      aria-pressed={!isAfter}
                      aria-label={`Show the before state of ${item.title}`}
                      className={`px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        !isAfter
                          ? "bg-surface2 text-fg"
                          : "text-muted hover:text-fg"
                      }`}
                    >
                      Before
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAfter) flip(item.id);
                      }}
                      aria-pressed={isAfter}
                      aria-label={`Show the after state of ${item.title}`}
                      className={`px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        isAfter
                          ? "bg-accent/15 text-accent"
                          : "text-muted hover:text-fg"
                      }`}
                    >
                      After
                    </button>
                  </div>
                </div>

                <div className="relative mt-4 flex-1">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={view}
                      id={detailId}
                      aria-live="polite"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={transition}
                      className="text-sm leading-relaxed text-muted"
                    >
                      {detail}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </GlassCard>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PlatformEvolution;
