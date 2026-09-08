"use client";

import { motion } from "framer-motion";

import { eventCategories } from "@/data/events";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { staggerItem } from "@/components/ui/motion";

/**
 * EventsGrid — the High-Concurrency Arena section (Req 3).
 *
 * Renders the four event categories from `data/events.ts` as glassmorphism
 * cards (Req 3.1-3.5). Each card shows the category title, its list of events,
 * and the scale note.
 *
 * The section is anchored at `#tournaments` to match the "Scale & Tournaments"
 * nav link (Req 1.4) via {@link SectionWrapper}, whose `stagger` container
 * variant sequences the child reveals (Req 3.6). Each card is wrapped in a
 * `motion.div` using the shared `staggerItem` variant so the cards reveal one
 * after another on viewport entry; under `prefers-reduced-motion` the wrapper's
 * `useMotionSafe` swaps in a static variant so the cards appear without motion
 * (Req 17.4).
 *
 * Each {@link GlassCard} is marked `interactive`, enabling the pointer-only
 * hover glow (gated behind `@media (hover: hover)`) required by Req 3.7.
 */
export function EventsGrid() {
  return (
    <SectionWrapper
      id="tournaments"
      eyebrow="High-Concurrency Arena"
      title="Scale & Tournaments"
      stagger
    >
      <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
        {eventCategories.map((category) => (
          <motion.li key={category.id} variants={staggerItem}>
            <GlassCard
              interactive
              className="flex h-full flex-col p-6"
            >
              <h3 className="text-xl font-semibold text-white">
                {category.title}
              </h3>

              <ul className="mt-4 flex-1 space-y-2">
                {category.events.map((event) => (
                  <li
                    key={event}
                    className="flex gap-2 text-sm leading-relaxed text-slate-400"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400"
                    />
                    <span>{event}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-white/10 pt-4 text-sm font-medium text-cyan-300">
                {category.note}
              </p>
            </GlassCard>
          </motion.li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

export default EventsGrid;
