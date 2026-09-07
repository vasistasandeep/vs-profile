"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { staggerItem, useMotionSafe } from "@/components/ui/motion";
import { labs } from "@/data/labs";

/**
 * Labs — the Labs & Builder Mindset showcase (Req 22).
 *
 * Renders a compact micro-grid from `data/labs.ts` of active generative AI and
 * modern platform prototypes (Req 22.1). Each item surfaces a title and a short
 * descriptor (Req 22.3). The dataset guarantees at least one AI-automated
 * workflow item and at least one full-stack React/Node/Redis item (Req 22.2,
 * enforced in the data module + Property 15).
 *
 * The grid is wrapped in {@link SectionWrapper} with `id="labs"` and
 * `stagger`, so the container reveals its children in sequence when it enters
 * the viewport (Req 22.4), running at most once (`viewport={{ once: true }}`,
 * Req 16.1). Each card animates with {@link staggerItem}, resolved through
 * {@link useMotionSafe} so under `prefers-reduced-motion` the items render
 * statically with no transform/opacity animation (Req 22.5, 17.4).
 *
 * The grid collapses to a single column at the mobile breakpoint via
 * responsive grid classes (Req 18.2).
 */
export function Labs() {
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <SectionWrapper
      id="labs"
      eyebrow="Labs & Builder Mindset"
      title="Prototypes & Experiments"
      stagger
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {labs.map((lab) => (
          <motion.li key={lab.id} variants={itemVariants}>
            <GlassCard
              interactive
              className="flex h-full flex-col gap-2 px-5 py-5"
            >
              <h3 className="text-base font-semibold text-white">
                {lab.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {lab.descriptor}
              </p>
            </GlassCard>
          </motion.li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

export default Labs;
