"use client";

import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  staggerContainer,
  staggerItem,
  useMotionSafe,
} from "@/components/ui/motion";
import { testimonials } from "@/data/testimonials";

/**
 * Testimonials — the Leadership Endorsements & Peer Validation section (Req 10).
 *
 * Renders the three testimonial cards from `data/testimonials.ts` as semantic
 * `<article>` elements (Req 10.1, 15.3), each showing a profile badge built from
 * the endorser's initials, the endorsement quote, and the executive title
 * (Req 10.2), plus a LinkedIn placeholder link that opens in a new browser tab
 * via `target="_blank"` + `rel="noopener noreferrer"` (Req 10.3, 10.4).
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
      eyebrow="Endorsements"
      title="Leadership Endorsements & Peer Validation"
    >
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

              {/* LinkedIn placeholder link, opens in a new tab (Req 10.3, 10.4). */}
              <a
                href={testimonial.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent2 transition-colors hover:opacity-80"
              >
                <Linkedin aria-hidden="true" className="h-4 w-4" />
                <span>Connect on LinkedIn</span>
                <span className="sr-only"> ({testimonial.title})</span>
              </a>
            </GlassCard>
          </motion.article>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

export default Testimonials;
