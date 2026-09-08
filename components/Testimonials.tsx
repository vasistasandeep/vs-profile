"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  staggerContainer,
  staggerItem,
  useMotionSafe,
} from "@/components/ui/motion";
import { testimonials } from "@/data/testimonials";

/**
 * Testimonials — the "What people I've worked with say" section (Req 10).
 *
 * Renders three reflections from `data/testimonials.ts` as semantic
 * `<article>` elements (Req 10.1, 15.3), each showing a role badge built from
 * initials, the quote, and the ROLE-ONLY attribution title (Req 10.2). To keep
 * the section honest, attribution is anonymized by role — there are no
 * fabricated names or personal profile links that could impersonate a real,
 * identifiable person.
 *
 * The grid reveals its cards with a staggered entry animation when it enters the
 * viewport (Req 10.5), running at most once (`viewport={{ once: true }}`,
 * Req 16.1). The reveal variants are resolved through {@link useMotionSafe}, so
 * under `prefers-reduced-motion` the cards render statically with no
 * transform/opacity animation (Req 17.4).
 *
 * The section is anchored `#endorsements` (nav label "Endorsements", Req 1.4)
 * via {@link SectionWrapper}, which supplies the eyebrow + heading and the
 * consistent scroll-anchor / reduced-motion behavior.
 */
export function Testimonials() {
  const containerVariants = useMotionSafe(staggerContainer);
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <SectionWrapper
      id="endorsements"
      eyebrow="In their words"
      title="What people I've worked with say"
    >
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted">
        Reflections gathered from the engineering, product, and delivery leaders
        I&apos;ve partnered with, shared by role to respect their privacy.
      </p>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {testimonials.map((testimonial) => (
          <motion.article key={testimonial.id} variants={itemVariants}>
            <GlassCard className="flex h-full flex-col p-6">
              {/* Profile badge — initials (Req 10.2). */}
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface2 text-sm font-semibold tracking-wide text-accent"
                >
                  {testimonial.initials}
                </span>
                {/* Executive title / attribution (Req 10.1, 10.2). */}
                <h3 className="text-base font-semibold leading-snug text-fg">
                  {testimonial.title}
                </h3>
              </div>

              {/* Endorsement text (Req 10.2). */}
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-muted">
                “{testimonial.quote}”
              </blockquote>

              {/* Role-only attribution (Req 10.1) — anonymized, so no fabricated
                  names or profile links that could impersonate real people. */}
              <p className="mt-6 flex items-center gap-2 text-sm font-medium text-accent2">
                <Users aria-hidden="true" className="h-4 w-4" />
                <span>A leader I&apos;ve partnered with</span>
              </p>
            </GlassCard>
          </motion.article>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

export default Testimonials;
