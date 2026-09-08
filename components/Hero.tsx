"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { staggerItem, useMotionSafe } from "@/components/ui/motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { metrics } from "@/data/metrics";
import { site } from "@/data/site";
import { scrollToSection } from "@/lib/scroll";

/**
 * Hero (`components/Hero.tsx`) — Hero_Section (Req 2).
 *
 * Renders the above-the-fold hero: an eyebrow badge (Req 2.1), the headline
 * (Req 2.2), the sub-headline (Req 2.3), the `Metric_Strip` of five
 * {@link AnimatedCounter} instances sourced from `data/metrics.ts` (Req 2.4–2.7),
 * and the two CTAs (Req 2.8):
 *
 * - "Explore Architecture" smooth-scrolls to the architecture section
 *   (`#architecture`) via {@link scrollToSection} (Req 2.9).
 * - "Schedule Advisory Chat" smooth-scrolls to the contact section
 *   (`#contact`) (Req 2.10).
 *
 * The section anchor id is `#overview` so the Navbar "Overview" link targets it
 * (Req 1.4). Counter animation, once-only behavior, reduced-motion fallback, and
 * `tabular-nums` are all handled inside {@link AnimatedCounter} (Req 2.5–2.7,
 * 16.3). Each counter is paired with its metric label so the strip reads as the
 * exact Req 2.4 labels (e.g. "14+" + "Years Technical Leadership").
 */

/** Exact eyebrow badge text (Req 2.1). */
const EYEBROW =
  "Platform Architecture • High-Concurrency Distributed Systems • Observability";

/** Exact headline text (Req 2.2). */
const HEADLINE = "Engineering Resilience & Scale for Global Streaming Platforms.";

/** Exact sub-headline text (Req 2.3). */
const SUBHEADLINE =
  "14+ years architecting distributed platforms, OTT media supply chains, and enterprise data transformations across 30M+ peak concurrent users.";

/** Exact primary CTA label (Req 2.8). */
const PRIMARY_CTA_LABEL = "Explore Architecture";

/** Exact secondary CTA label (Req 2.8). */
const SECONDARY_CTA_LABEL = "Schedule Advisory Chat";

export function Hero() {
  // Stagger children reveal within the hero; useMotionSafe swaps in a static
  // no-op variant under reduced motion (Req 17.4).
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <SectionWrapper
      id="overview"
      stagger
      className="flex flex-col items-center py-24 text-center sm:py-32"
    >
      {/* Professional headshot avatar - first staggered item. Uses next/image
          for optimization; the ring + glow match the site accent system. */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-accent/40 shadow-card sm:h-32 sm:w-32">
          <Image
            src={site.portrait.src}
            alt={site.portrait.alt}
            fill
            priority
            sizes="128px"
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Eyebrow badge (Req 2.1) */}
      <motion.p
        variants={itemVariants}
        className="inline-flex max-w-full items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent sm:text-sm"
      >
        {EYEBROW}
      </motion.p>

      {/* Headline (Req 2.2) — fluid clamp-based size scales smoothly across
          mobile → desktop without hard breakpoint jumps (Req 18.1). */}
      <motion.h1
        variants={itemVariants}
        className="mt-8 max-w-4xl text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-fg"
      >
        {HEADLINE}
      </motion.h1>

      {/* Sub-headline (Req 2.3) */}
      <motion.p
        variants={itemVariants}
        className="mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl"
      >
        {SUBHEADLINE}
      </motion.p>

      {/* Metric_Strip: five AnimatedCounter instances (Req 2.4–2.7).
          Collapses to two columns on mobile and expands progressively; the
          top spacing uses a fluid clamp so the strip scales smoothly with the
          headline (Req 18.1, 18.2). */}
      <motion.dl
        variants={itemVariants}
        className="mt-[clamp(2.5rem,6vw,3.5rem)] grid w-full max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5"
      >
        {metrics.map((metric) => (
          <div key={metric.id} className="flex flex-col items-center">
            <dt className="sr-only">{metric.label}</dt>
            <dd className="flex flex-col items-center">
              <AnimatedCounter
                metric={metric}
                className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-[clamp(1.875rem,4vw,3rem)] font-bold text-transparent"
              />
              <span className="mt-2 text-sm text-muted">
                {metric.label}
              </span>
            </dd>
          </div>
        ))}
      </motion.dl>

      {/* CTAs (Req 2.8–2.10) */}
      <motion.div
        variants={itemVariants}
        className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      >
        <button
          type="button"
          onClick={() => scrollToSection("#architecture")}
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {PRIMARY_CTA_LABEL}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("#contact")}
          className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-fg transition-colors hover:bg-surface2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {SECONDARY_CTA_LABEL}
        </button>
      </motion.div>
    </SectionWrapper>
  );
}

export default Hero;
