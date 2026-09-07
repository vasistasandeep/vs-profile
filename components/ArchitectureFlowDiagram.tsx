"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import {
  staggerContainer,
  staggerItem,
  useMotionSafe,
} from "@/components/ui/motion";
import { flowLayers } from "@/data/flow";

/**
 * ArchitectureFlowDiagram — the interactive 4-layer system flow (Req 21).
 *
 * Renders the four ordered layers from `data/flow.ts` top-to-bottom in
 * client-to-persistence sequence (sorted by `order`), each carrying its
 * explicit `"Layer N:"` prefixed label and its exact element list
 * (Req 21.1-21.6).
 *
 * Each layer is a focusable, keyboard- and pointer-operable region
 * (`tabIndex={0}`, `role="button"`) that applies an active visual state on
 * hover/focus (and on Enter/Space) driven by `activeLayer` state (Req 21.7,
 * 17.1, 17.5). A visible focus ring satisfies the keyboard focus indicator
 * requirement (Req 17.5).
 *
 * This is a grouped inner block of the `#architecture` section (rendered
 * alongside `ArchitectureTabs`), so it intentionally does NOT set a top-level
 * `id="architecture"`; it renders as a titled block and lets page composition
 * own the section anchor.
 *
 * The layers reveal with a staggered entry once on viewport entry via
 * {@link staggerContainer}/{@link staggerItem}, resolved through
 * {@link useMotionSafe} so under `prefers-reduced-motion` they render
 * statically with no transform/opacity animation (Req 21.8, 21.9).
 */
export function ArchitectureFlowDiagram() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const containerVariants = useMotionSafe(staggerContainer);
  const itemVariants = useMotionSafe(staggerItem);

  // Present the layers in client-to-persistence sequence order (Req 21.6).
  const orderedLayers = [...flowLayers].sort((a, b) => a.order - b.order);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveLayer(id);
    }
  };

  return (
    <motion.div
      className="scroll-mt-24"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Architecture Flow
        </p>
        <h3 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          System Flow: Client to Persistence
        </h3>
      </header>

      <ol className="flex list-none flex-col gap-4 p-0">
        {orderedLayers.map((layer) => {
          const isActive = activeLayer === layer.id;

          return (
            <motion.li key={layer.id} variants={itemVariants}>
              <GlassCard
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                interactive
                glow={isActive ? "emerald" : "none"}
                className={`cursor-pointer p-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                  isActive
                    ? "border-emerald-400/60 bg-emerald-400/[0.06]"
                    : ""
                }`}
                onFocus={() => setActiveLayer(layer.id)}
                onBlur={() => setActiveLayer(null)}
                onMouseEnter={() => setActiveLayer(layer.id)}
                onMouseLeave={() => setActiveLayer(null)}
                onKeyDown={(event) => handleKeyDown(event, layer.id)}
              >
                <h4
                  className={`text-lg font-semibold transition-colors ${
                    isActive ? "text-emerald-300" : "text-white"
                  }`}
                >
                  {layer.label}
                </h4>
                <ul className="mt-3 flex flex-wrap gap-2 p-0">
                  {layer.elements.map((element) => (
                    <li
                      key={element}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-slate-300"
                    >
                      {element}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}

export default ArchitectureFlowDiagram;
