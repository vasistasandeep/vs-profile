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
 * Hero (`components/Hero.tsx`) — the above-the-fold cover.
 *
 * An image-free, animated cover built on the `.hero-aurora` mesh-gradient
 * backdrop (no photographic hero image required). It renders a circular
 * headshot avatar, an eyebrow, an <h1> headline whose emphasis phrase uses the
 * animated `.text-gradient` shimmer, a brand-voice sub-headline, the five-metric
 * strip (via {@link AnimatedCounter}), and two CTAs wired to
 * {@link scrollToSection}.
 *
 * The section anchor id is `#overview` so the Navbar "Overview" link and the
 * smoke test resolve. Staggered reveal is gated through {@link useMotionSafe},
 * and the shimmer auto-disables under reduced motion via globals.css.
 */

/** Exact eyebrow text. Uses a middot HTML entity, not a raw bullet. */
const EYEBROW = "Program & Product Leadership \u00b7 OTT \u00b7 FinTech \u00b7 Retail";

/** Headline lead + gradient emphasis phrase (period lives inside the span so
 *  the accessible name has no stray whitespace before the full stop). */
const HEADLINE_LEAD = "Building platforms that scale to ";
const HEADLINE_EMPHASIS = "30M+ users.";

/** Brand-voice sub-headline (not a resume line). */
const SUBHEADLINE =
  "I turn ambitious roadmaps into resilient, high-concurrency products, aligning engineering, product, and delivery so the platform stays fast when the audience shows up all at once.";

/** Exact primary CTA label. */
const PRIMARY_CTA_LABEL = "Explore my work";

/** Exact secondary CTA label. */
const SECONDARY_CTA_LABEL = "Get in touch";

export function Hero() {
  // Stagger children reveal within the hero; useMotionSafe swaps in a static
  // no-op variant under reduced motion.
  const itemVariants = useMotionSafe(staggerItem);

  return (
    <SectionWrapper
      id="overview"
      stagger
      className="relative isolate overflow-hidden py-14 sm:py-20"
    >
      {/* Aurora backdrop: soft radial mesh-gradient, image-free and GPU-cheap.
          Absolutely positioned behind the content, non-interactive. */}
      <div
        aria-hidden="true"
        className="hero-aurora pointer-events-none absolute inset-0 -z-10 rounded-3xl"
      />

      <div className="flex flex-col items-center text-center">
        {/* Circular headshot avatar. next/image with fill + priority; a plain
            accent ring (no glow shadow, per the dark-only token system). */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-accent/40 sm:h-32 sm:w-32">
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

        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="inline-flex max-w-full items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent sm:text-sm"
        >
          {EYEBROW}
        </motion.p>

        {/* Headline — the emphasis phrase shimmers via .text-gradient. */}
        <motion.h1
          variants={itemVariants}
          className="mt-6 max-w-4xl text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-fg"
        >
          {HEADLINE_LEAD}
          <span className="text-gradient">{HEADLINE_EMPHASIS}</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          {SUBHEADLINE}
        </motion.p>

        {/* Metric strip: five AnimatedCounter instances. Two columns on mobile,
            expanding to five on desktop. */}
        <motion.dl
          variants={itemVariants}
          className="mt-10 grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5"
        >
          {metrics.map((metric) => (
            <div key={metric.id} className="flex flex-col items-center">
              <dt className="sr-only">{metric.label}</dt>
              <dd className="flex flex-col items-center">
                <AnimatedCounter
                  metric={metric}
                  className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-[clamp(1.875rem,4vw,3rem)] font-bold tabular-nums text-transparent"
                />
                <span className="mt-2 text-sm text-muted">{metric.label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <button
            type="button"
            onClick={() => scrollToSection("#experience")}
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
      </div>
    </SectionWrapper>
  );
}

export default Hero;
