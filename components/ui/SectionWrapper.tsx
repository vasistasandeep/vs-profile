"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
 *
 * COLLAPSIBLE MODE
 * When `collapsible` is true the header becomes an interactive toggle: the
 * eyebrow + title render inside a `<button type="button">` that flips an
 * open/closed state, exposes `aria-expanded`, and points `aria-controls` at the
 * collapsible content region (`${id}-content`). The children live in a
 * `role="region"` labelled by the header; when closed they are removed from the
 * DOM (and therefore from the tab order). The open/close height + opacity is
 * animated with framer-motion, collapsing to an instant show/hide under
 * reduced motion. The outer element keeps `id` + `scroll-mt-24` so nav anchors
 * still land correctly even while a section is collapsed.
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
  /** When true, the header toggles an animated collapsible content region. */
  collapsible?: boolean;
  /** Initial open state when `collapsible` is true. Defaults to `true`. */
  defaultOpen?: boolean;
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
  collapsible = false,
  defaultOpen = true,
  className,
  children,
}: SectionWrapperProps) {
  // Resolve the reveal variant: stagger container when requested, else fadeUp.
  // useMotionSafe swaps in a static no-op variant under reduced motion.
  const variants = useMotionSafe(stagger ? staggerContainer : fadeUp);

  const MotionTag = as === "article" ? motion.article : motion.section;

  const [open, setOpen] = useState(defaultOpen);
  // Tracks whether the open animation has fully settled, so we can release the
  // overflow clip and stop tall content from being cut off while open.
  const [fullyOpen, setFullyOpen] = useState(defaultOpen);
  const prefersReducedMotion = useReducedMotion();

  // Stable ids for the region + its labelling header (unique even if the same
  // logical section renders twice, e.g. in tests).
  const uid = useId();
  const contentId = `${id}-content`;
  const headerId = `${id}-header-${uid}`;

  // --- Non-collapsible: render exactly as before. ---
  if (!collapsible) {
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

  // --- Collapsible: header is a toggle button controlling a content region. ---
  //
  // The outer element is rendered STATICALLY (a plain section/article, no
  // variants / initial / whileInView). The collapse open/close is the ONLY
  // animation in this mode, so a one-time `whileInView once` reveal can never
  // gate the children into a stuck opacity:0 state after a collapse/expand.
  //
  // Sections that pass `stagger` render their children as `staggerItem` motion
  // elements with `initial="hidden"`. To guarantee those children resolve to
  // their visible state whenever the region is open (including after re-mount
  // on expand), the open region is a motion container carrying the stagger
  // container variant and pinned to `animate="visible"`. That variant context
  // resolves every `staggerItem` child to visible, so text never "clears off".
  const Tag = as === "article" ? "article" : "section";

  return (
    <Tag id={id} className={cx("scroll-mt-24", className)}>
      <header className="mb-8">
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() =>
            setOpen((prev) => {
              // Re-clip immediately when starting to close so the collapse
              // animation is not visually broken by overflow-visible content.
              if (prev) setFullyOpen(false);
              return !prev;
            })
          }
          className="group flex w-full cursor-pointer items-start justify-between gap-4 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span className="flex flex-col">
            {eyebrow && (
              <span className="text-sm font-medium uppercase tracking-widest text-accent">
                {eyebrow}
              </span>
            )}
            {title && (
              <span className="mt-2 text-3xl font-semibold text-fg transition-colors group-hover:text-accent sm:text-4xl">
                {title}
              </span>
            )}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cx(
              "mt-1 h-6 w-6 flex-shrink-0 text-muted transition-[transform,color] duration-200 group-hover:text-accent",
              open && "rotate-180",
            )}
          />
        </button>
      </header>

      {prefersReducedMotion ? (
        open ? (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            variants={staggerContainer}
            initial="visible"
            animate="visible"
          >
            {children}
          </motion.div>
        ) : null
      ) : (
        <AnimatePresence
          initial={false}
          onExitComplete={() => setFullyOpen(false)}
        >
          {open && (
            <motion.div
              id={contentId}
              role="region"
              aria-labelledby={headerId}
              // Animate only the outer wrapper's height/opacity for the
              // collapse. While animating we clip with overflow-hidden; once the
              // open animation settles (height:auto) we release the clip so tall
              // content (e.g. the Arcade game panel) is never cut off.
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: fullyOpen ? "visible" : "hidden" }}
              onAnimationComplete={() => {
                if (open) setFullyOpen(true);
              }}
            >
              {/* Inner stagger-container context: pins every staggerItem child
                  to its visible variant so children are always fully opaque
                  when open, regardless of prior whileInView firing. */}
              <motion.div
                variants={staggerContainer}
                initial="visible"
                animate="visible"
              >
                {children}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Tag>
  );
}

export default SectionWrapper;
