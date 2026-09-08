"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { staggerItem, useMotionSafe } from "@/components/ui/motion";
import { credentialDetails } from "@/data/credentials";

/**
 * Certifications - professional certifications (id="certifications").
 *
 * A dedicated section, separate from Education, listing each certification with
 * its issuer and credential id. Rendered in a two-column grid on md+ screens.
 */
export function Certifications() {
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <SectionWrapper
      id="certifications"
      eyebrow="Credentials"
      title="Certifications"
      stagger
    >
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {credentialDetails.map((credential) => (
          <motion.li key={credential.id} variants={itemVariants}>
            <GlassCard interactive className="h-full p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h4 className="text-base font-semibold text-fg">
                  {credential.name}
                </h4>
                {credential.issuer && (
                  <span className="text-sm font-medium text-accent2">
                    {credential.issuer}
                  </span>
                )}
              </div>
              {credential.credentialId && (
                <p className="mt-1 font-mono text-xs text-muted">
                  ID: {credential.credentialId}
                </p>
              )}
            </GlassCard>
          </motion.li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

export default Certifications;
