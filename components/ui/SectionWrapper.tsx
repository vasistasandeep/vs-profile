"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { fadeUp, staggerContainer, useMotionSafe } from "./motion";

/**
 * SectionWrapper — semantic section/article + heading + once-only reveal.
 *
 * Renders a `<section id>` (or `<article>` when `as="article"`) with an
 * optional eyebrow + heading, and a Framer Motion `whileInView` reveal that
 * runs at most once (`viewport={{ once: true }}`) (Req 16.1).
 *
 * The reveal variant is resolved through {@link useMotionSafe}, so when the
 * visitor prefers reduced motion the content renders statically with no
 * transform/opacity animation (Req 17.4). Every content section uses this
 * wrapper to guarantee consistent scroll anchors (`id` matches the nav target,
 * Req 1.6) and consistent reveal/reduced-motion behavior (Req 15.3, 16.1).
 *
 * When `stagger` is enabled, the container uses the stagger variant so children
 * animated with `staggerItem` reveal in sequence.
 */
export interface SectionWrapperProps {
  /** Anchor id — must match the corresponding nav target id (Req 1.6). */
  id: string;
  /** Optional heading text rendered as an `<h2>`. */
  title?: string;
  /** Optional small label rendered above the heading. */
  eyebrow?: string;
  /** Semantic element to render. Defaults to `"section"`. */
  as?: "section" | "article";
  /** Use the stagger container variant for sequenced child reveals. */
  stagger?: boolean;
  /** Extra classes appended to the wrapper element. */
  className?: string;
  children?: ReactNode;
}

/** Join truthy class fragments into a single className string. */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function SectionWrapper({
  id,
  title,
  eyebrow,
  as = "section",
  stagger = false,
  className,
  children,
}: SectionWrapperProps) {
  // Resolve the reveal variant: stagger container when requested, else fadeUp.
  // useMotionSafe swaps in a static no-op variant under reduced motion.
  const variants = useMotionSafe(stagger ? staggerContainer : fadeUp);

  const MotionTag = as === "article" ? motion.article : motion.section;

  return (
    <MotionTag
      id={id}
      className={cx("scroll-mt-24", className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {(eyebrow || title) && (
        <header className="mb-8">
          {eyebrow && (
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-2 text-3xl font-semibold text-fg sm:text-4xl">
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </MotionTag>
  );
}

export default SectionWrapper;
