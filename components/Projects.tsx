"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Github, ExternalLink } from "lucide-react";

import { projects } from "@/data/projects";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Project } from "@/types/content";

/**
 * Projects — real GitHub projects presented case-study style (Feature: Projects).
 *
 * Renders a responsive grid of project cards from `data/projects.ts`. Each card
 * shows the project name, domain, one-line abstract, a row of tag chips, and two
 * links: "Code" (repoUrl) and, when present, "Live" (demoUrl). A "Details" button
 * on each card opens a Radix Dialog modal with the fuller `body` paragraphs plus
 * the same two links.
 *
 * The modal reuses the fixed CaseStudyDrawer approach: an opaque overlay
 * (`bg-black/80 backdrop-blur-sm z-[90]`) plus a solid `bg-background z-[100]`
 * content surface, so background text never bleeds through (no overlap bug).
 * Radix provides the focus trap, Escape-to-close, and focus return to the
 * triggering control. Animations are keyed off `data-state` and are neutralized
 * under prefers-reduced-motion.
 *
 * This component owns its own `SectionWrapper id="projects"`, so the page
 * composition must render it directly (not double-wrap it).
 */

/** Shared duration (ms) for open/close animations — within the 300ms budget. */
const MODAL_ANIMATION_MS = 220;

/** Small tag chip. */
function TagChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface2 px-2.5 py-0.5 text-xs font-medium text-muted">
      {label}
    </span>
  );
}

/** The two external links (Code + optional Live), shared by card and modal. */
function ProjectLinks({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div className={className}>
      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
        aria-label={`View ${project.name} source code on GitHub (opens in a new tab)`}
      >
        <Github className="h-4 w-4" aria-hidden="true" />
        Code
      </a>
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          aria-label={`Open the live demo of ${project.name} (opens in a new tab)`}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Live
        </a>
      )}
    </div>
  );
}

export function Projects() {
  // Per-card modal open state, keyed by project id. `null` means all closed.
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <SectionWrapper id="projects" eyebrow="Selected Work" title="Projects">
      {/* Scoped keyframes for the modal fade + rise. Radix waits for these to
          finish before unmounting on close. */}
      <style>{modalKeyframes}</style>

      <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const titleId = `project-${project.id}-title`;
          const descId = `project-${project.id}-desc`;
          const isOpen = openId === project.id;

          return (
            <li key={project.id}>
              <Dialog.Root
                open={isOpen}
                onOpenChange={(next) => setOpenId(next ? project.id : null)}
              >
                <GlassCard interactive className="flex h-full flex-col p-6">
                  <article className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-fg">
                        {project.name}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-widest text-accent">
                      {project.domain}
                    </p>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {project.abstract}
                    </p>

                    <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <TagChip label={tag} />
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <ProjectLinks
                        project={project}
                        className="flex items-center gap-4"
                      />
                      <Dialog.Trigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface2 px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label={`See details for ${project.name}`}
                        >
                          Details
                          <span aria-hidden="true">&rarr;</span>
                        </button>
                      </Dialog.Trigger>
                    </div>
                  </article>
                </GlassCard>

                <Dialog.Portal>
                  {/* Opaque overlay makes background inert + prevents bleed-through. */}
                  <Dialog.Overlay
                    className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm data-[state=open]:animate-pj-overlay-in data-[state=closed]:animate-pj-overlay-out"
                    style={modalAnimationVars}
                  />

                  {/* Centered modal. Solid bg-background + high z so text never overlaps. */}
                  <Dialog.Content
                    aria-labelledby={titleId}
                    aria-describedby={descId}
                    className="fixed left-1/2 top-1/2 z-[100] flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-border bg-background focus:outline-none data-[state=open]:animate-pj-content-in data-[state=closed]:animate-pj-content-out"
                    style={modalAnimationVars}
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-border p-6">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-accent">
                          {project.domain}
                        </p>
                        <Dialog.Title
                          id={titleId}
                          className="mt-1 text-xl font-semibold text-fg"
                        >
                          {project.name}
                        </Dialog.Title>
                      </div>

                      <Dialog.Close asChild>
                        <button
                          type="button"
                          aria-label={`Close ${project.name} details`}
                          className="flex-shrink-0 rounded-full border border-border p-2 text-muted transition-colors hover:bg-surface2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                      <Dialog.Description
                        id={descId}
                        className="text-sm leading-relaxed text-muted"
                      >
                        {project.abstract}
                      </Dialog.Description>

                      {project.body.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-sm leading-relaxed text-muted"
                        >
                          {paragraph}
                        </p>
                      ))}

                      <ul className="flex list-none flex-wrap gap-2 p-0 pt-1">
                        {project.tags.map((tag) => (
                          <li key={tag}>
                            <TagChip label={tag} />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-border p-6">
                      <ProjectLinks
                        project={project}
                        className="flex items-center gap-6"
                      />
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </li>
          );
        })}
      </ul>
    </SectionWrapper>
  );
}

/** Animation duration passed via CSS custom property, keeping the budget local. */
const modalAnimationVars = {
  animationDuration: `${MODAL_ANIMATION_MS}ms`,
} as const;

/**
 * Scoped keyframes + the `animate-pj-*` utilities. Declared inline so the
 * component is self-contained. Radix suspends unmount until the `-out`
 * animations finish. Reduced motion collapses the durations to ~1ms.
 */
const modalKeyframes = `
@keyframes pj-overlay-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes pj-overlay-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes pj-content-in { from { opacity: 0; transform: translate(-50%, -48%) scale(0.98); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
@keyframes pj-content-out { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -48%) scale(0.98); } }
.animate-pj-overlay-in { animation: pj-overlay-in var(--pj-anim, 220ms) ease-out both; }
.animate-pj-overlay-out { animation: pj-overlay-out var(--pj-anim, 220ms) ease-in both; }
.animate-pj-content-in { animation: pj-content-in var(--pj-anim, 220ms) ease-out both; }
.animate-pj-content-out { animation: pj-content-out var(--pj-anim, 220ms) ease-in both; }
@media (prefers-reduced-motion: reduce) {
  .animate-pj-overlay-in, .animate-pj-overlay-out,
  .animate-pj-content-in, .animate-pj-content-out { animation-duration: 1ms; }
}
`;

export default Projects;
