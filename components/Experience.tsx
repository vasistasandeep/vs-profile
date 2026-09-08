"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { staggerItem, useMotionSafe } from "@/components/ui/motion";
import { experience } from "@/data/experience";

/**
 * Experience — the career-timeline section (id="experience").
 *
 * Renders the resume's `ExperienceGroup[]` as a vertical timeline: one solid
 * surface card per company (company + domain), each listing its roles (title,
 * period, optional summary) and achievement highlights. Highlights show an
 * optional bold `lead` in `text-fg` followed by the `text` in `text-muted`.
 *
 * Uses the shared SectionWrapper (stagger container + once-only reveal) and the
 * `staggerItem` variant on each company card. All colors use the semantic theme
 * tokens so the section stays legible in both light and dark themes.
 */
export function Experience() {
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <SectionWrapper
      id="experience"
      eyebrow="Career"
      title="Experience"
      stagger
      collapsible
    >
      <ol className="flex flex-col gap-6">
        {experience.map((group) => (
          <motion.li key={group.id} variants={itemVariants}>
            <GlassCard className="p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-xl font-semibold text-fg">
                  {group.company}
                </h3>
                {group.domain && (
                  <span className="text-sm font-medium uppercase tracking-wide text-accent2">
                    {group.domain}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-8">
                {group.roles.map((role) => (
                  <div
                    key={role.id}
                    className="border-l border-border pl-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="text-base font-semibold text-fg">
                        {role.role}
                      </h4>
                      <span className="text-sm font-medium text-accent">
                        {role.period}
                      </span>
                    </div>

                    {role.summary && (
                      <p className="mt-2 text-sm text-muted">{role.summary}</p>
                    )}

                    <ul className="mt-4 flex flex-col gap-3">
                      {role.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="text-sm leading-relaxed text-muted"
                        >
                          {highlight.lead && (
                            <span className="font-semibold text-fg">
                              {highlight.lead}{" "}
                            </span>
                          )}
                          {highlight.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.li>
        ))}
      </ol>
    </SectionWrapper>
  );
}

export default Experience;
