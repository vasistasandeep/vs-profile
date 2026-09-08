"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import { staggerContainer, staggerItem, useMotionSafe } from "@/components/ui/motion";
import { credentials } from "@/data/credentials";

/**
 * Credentials — the certifications & governance badge bar (Req 9).
 *
 * Renders the nine certification badges from `data/credentials.ts` (Req 9.1)
 * in a responsive badge grid (Req 9.2). The grid reveals its badges with a
 * staggered entry animation when it enters the viewport (Req 9.3), running at
 * most once (`viewport={{ once: true }}`, Req 16.1).
 *
 * The reveal variants are resolved through {@link useMotionSafe}, so under
 * `prefers-reduced-motion` the badges render statically with no
 * transform/opacity animation (Req 9.4, 17.4). We use a plain static grid
 * (no marquee) — the safest reduced-motion posture, since there is no
 * continuous motion element to disable.
 *
 * NOTE: This component is part of the grouped `#governance` section (with
 * Manifesto). It intentionally renders WITHOUT a top-level section id — the
 * page composition (task 10.2) wraps Manifesto + Credentials inside a single
 * `<section id="governance">`. Here it renders as a titled inner block so it
 * can be grouped without introducing a duplicate/competing anchor.
 */
export function Credentials() {
  const containerVariants = useMotionSafe(staggerContainer);
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <div className="mt-16 scroll-mt-24">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Credentials &amp; Governance
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-fg sm:text-4xl">
          Certifications
        </h2>
      </header>

      <motion.ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {credentials.map((credential) => (
          <motion.li key={credential.id} variants={itemVariants}>
            <GlassCard className="flex h-full items-center px-5 py-4">
              <span className="text-sm font-medium text-fg">
                {credential.name}
              </span>
            </GlassCard>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default Credentials;
