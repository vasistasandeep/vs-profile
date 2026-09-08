"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { staggerItem, useMotionSafe } from "@/components/ui/motion";
import { education } from "@/data/education";

/**
 * Education - academic history (id="education").
 *
 * A dedicated section listing each degree, institution, and year. Certifications
 * live in their own separate section (components/Certifications.tsx).
 */
export function Education() {
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <SectionWrapper id="education" eyebrow="Academics" title="Education" stagger>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {education.map((item) => (
          <motion.li key={item.id} variants={itemVariants}>
            <GlassCard interactive className="h-full p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h4 className="text-base font-semibold text-fg">
                  {item.degree}
                </h4>
                <span className="text-sm font-medium text-accent">
                  {item.year}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{item.institution}</p>
            </GlassCard>
          </motion.li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

export default Education;
