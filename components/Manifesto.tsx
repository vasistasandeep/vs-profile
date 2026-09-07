"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import { staggerContainer, staggerItem, useMotionSafe } from "@/components/ui/motion";
import { manifesto } from "@/data/manifesto";

/**
 * Manifesto — the Platform Leadership Manifesto four-card grid (Req 7).
 *
 * Renders the four manifesto cards from `data/manifesto.ts`, each showing its
 * title (Req 7.1) and principle text (Req 7.2-7.5), inside a {@link GlassCard}.
 *
 * The grid reveals its cards with a staggered entry animation when it enters
 * the viewport (Req 7.6), running at most once (`viewport={{ once: true }}`,
 * Req 16.1). The reveal variants are resolved through {@link useMotionSafe}, so
 * under `prefers-reduced-motion` the cards render statically with no
 * transform/opacity animation (Req 17.4).
 *
 * NOTE: This component is part of the grouped `#governance` section (with
 * Credentials). It intentionally renders WITHOUT a top-level section id — the
 * page composition (task 10.2) wraps Manifesto + Credentials inside a single
 * `<section id="governance">`. Here it renders as a titled block so it can be
 * grouped without introducing a duplicate/competing anchor.
 */
export function Manifesto() {
  const containerVariants = useMotionSafe(staggerContainer);
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <div className="scroll-mt-24">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Governance
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          Platform Leadership Manifesto
        </h2>
      </header>

      <motion.ul
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {manifesto.map((card) => (
          <motion.li key={card.id} variants={itemVariants}>
            <GlassCard className="h-full p-6">
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {card.principle}
              </p>
            </GlassCard>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default Manifesto;
