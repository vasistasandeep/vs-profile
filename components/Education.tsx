"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { staggerItem, useMotionSafe } from "@/components/ui/motion";
import { education } from "@/data/education";
import { credentialDetails } from "@/data/credentials";

/**
 * Education — academic history + detailed certifications (id="education").
 *
 * Renders two blocks inside a single section:
 *  - Education: degree, institution, and year for each `EducationItem`.
 *  - Certifications: the resume-accurate `CredentialDetail[]`, showing each
 *    certification name plus its issuer and credential id in a muted mono style.
 *
 * Uses the shared SectionWrapper (stagger + once-only reveal) with the
 * `staggerItem` variant on each card, and semantic theme tokens throughout so
 * both light and dark themes stay readable.
 */
export function Education() {
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <SectionWrapper
      id="education"
      eyebrow="Education"
      title="Education & Credentials"
      stagger
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 md:divide-x md:divide-border">
        {/* Education column */}
        <div className="md:pr-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Education
          </h3>
          <ul className="flex flex-col gap-4">
            {education.map((item) => (
              <motion.li key={item.id} variants={itemVariants}>
                <GlassCard className="p-5">
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
        </div>

        {/* Certifications column */}
        <div className="md:pl-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent2">
            Certifications
          </h3>
          <ul className="flex flex-col gap-4">
            {credentialDetails.map((credential) => (
              <motion.li key={credential.id} variants={itemVariants}>
                <GlassCard className="p-5">
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
        </div>
      </div>
    </SectionWrapper>
  );
}

export default Education;
