"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";

import { architectureTabs } from "@/data/architecture";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, useMotionSafe } from "@/components/ui/motion";

/**
 * ArchitectureTabs — the Architectural Playbook & Observability Toolkit (Req 5).
 *
 * Renders the three tabs from `data/architecture.ts` — "System Design
 * Patterns", "Observability & Telemetry (MELT)", and "Video Streaming QoE"
 * (Req 5.1) — each exposing its own item list (Req 5.2-5.4).
 *
 * Built on Radix `Tabs` (`Tabs.Root`, `Tabs.List`, `Tabs.Trigger`,
 * `Tabs.Content`), which gives us a single visible panel with the others
 * hidden (Req 5.5), a distinct `data-state="active"` trigger we style with an
 * emerald/cyan underline + text accent (Req 5.6), and — for free — roving
 * tabindex keyboard navigation plus `aria-selected`/`aria-controls` wiring
 * (Req 5.7, 17.1, 17.2).
 *
 * This is a grouped inner block of the `#architecture` section (rendered
 * alongside `ArchitectureFlowDiagram`), so it intentionally does NOT set a
 * top-level `id="architecture"`; it renders as a titled block and lets page
 * composition own the section anchor. The block reveals once on viewport entry
 * via {@link useMotionSafe}, which swaps in a static variant under
 * `prefers-reduced-motion`.
 */
export function ArchitectureTabs() {
  const variants = useMotionSafe(fadeUp);
  const defaultTab = architectureTabs[0]?.id;

  return (
    <motion.div
      className="scroll-mt-24"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Playbook & Toolkit
        </p>
        <h3 className="mt-2 text-3xl font-semibold text-fg sm:text-4xl">
          Architectural Playbook & Observability Toolkit
        </h3>
      </header>

      <Tabs.Root defaultValue={defaultTab} className="flex flex-col">
        <Tabs.List
          aria-label="Architectural playbook categories"
          className="flex flex-wrap gap-2 border-b border-border"
        >
          {architectureTabs.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="-mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted outline-none transition-colors hover:text-fg focus-visible:text-fg focus-visible:ring-2 focus-visible:ring-accent/60 data-[state=active]:border-accent data-[state=active]:text-accent"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {architectureTabs.map((tab) => (
          <Tabs.Content
            key={tab.id}
            value={tab.id}
            className="mt-6 outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <GlassCard className="p-6">
              <ul className="grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                {tab.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent2"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </motion.div>
  );
}

export default ArchitectureTabs;
