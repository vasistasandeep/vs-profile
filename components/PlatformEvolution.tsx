"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { evolutionItems } from "@/data/evolution";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { toggleView, type EvolutionView } from "@/components/ui/state";

/**
 * PlatformEvolution - Before/After architectural transformations.
 *
 * Each item has its own Before/After control. The two states are now visually
 * differentiated: the card border, the active toggle, and a state badge above
 * the detail all shift between an amber "Before" (the problem) and an emerald
 * "After" (the solution), so it is obvious at a glance which state you are
 * reading. The detail cross-fades on toggle (instant under reduced motion).
 */
export function PlatformEvolution() {
  const [views, setViews] = useState<Record<string, EvolutionView>>({});
  const prefersReducedMotion = useReducedMotion();

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
    <SectionWrapper
      id="platform-evolution"
      eyebrow="Platform Modernization"
      title="Platform Evolution"
      collapsible
    >
      <p className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-muted">
        Toggle each card between the{" "}
        <span className="font-medium text-amber-400">Before</span>{" "}
        (the problem we inherited) and the{" "}
        <span className="font-medium text-accent">After</span> (what we shipped).
      </p>

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
                className={`flex h-full flex-col p-6 transition-colors ${
                  isAfter
                    ? "border-accent/40 bg-accent/5"
                    : "border-amber-500/30 bg-amber-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 id={labelId} className="text-lg font-semibold text-fg">
                    {item.title}
                  </h4>

                  {/* Before/After toggle with clear active states. */}
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
                      className={`px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        !isAfter
                          ? "bg-amber-500/20 text-amber-400"
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
                      className={`px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        isAfter
                          ? "bg-accent/20 text-accent"
                          : "text-muted hover:text-fg"
                      }`}
                    >
                      After
                    </button>
                  </div>
                </div>

                <div className="relative mt-4 flex-1">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={view}
                      id={detailId}
                      aria-live="polite"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={transition}
                    >
                      <span
                        className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide ${
                          isAfter
                            ? "bg-accent/15 text-accent"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 rounded-full ${
                            isAfter ? "bg-accent" : "bg-amber-400"
                          }`}
                        />
                        {isAfter ? "After" : "Before"}
                      </span>
                      <p className="text-sm leading-relaxed text-muted">
                        {detail}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </GlassCard>
            </li>
          );
        })}
      </ul>
    </SectionWrapper>
  );
}

export default PlatformEvolution;
