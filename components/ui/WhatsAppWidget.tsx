"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

import { useMotionSafe, fadeUp } from "@/components/ui/motion";

/**
 * WhatsAppWidget — floating WhatsApp chat widget (Feature: WhatsApp).
 *
 * A fixed bottom-right floating action button (FAB) that toggles a small,
 * on-brand chat popup with scripted quick-reply prompts. Selecting a prompt
 * deep-links to WhatsApp (wa.me) with a prefilled message via `window.open` in
 * a new tab. There is no backend and no API key — every action is a plain
 * wa.me link.
 *
 * Z-index: the FAB and popup sit at `z-40`, deliberately below any open Radix
 * Dialog (which uses `z-[90]`+), so an open modal always covers the widget.
 *
 * Accessibility: the toggle exposes `aria-expanded` + `aria-controls`; the
 * popup is keyboard reachable; Escape closes it; an outside click closes it.
 * Open/close motion is routed through `useMotionSafe` so it collapses to a
 * static swap under prefers-reduced-motion. All `window` usage is guarded and
 * only runs in event handlers (client-only).
 */

/** WhatsApp number in wa.me format (+91 9986988057). */
const WHATSAPP_NUMBER = "919986988057";

/** Scripted quick replies: a label plus a prefilled message. */
interface QuickReply {
  id: string;
  label: string;
  message: string;
}

const QUICK_REPLIES: QuickReply[] = [
  {
    id: "opportunity",
    label: "Discuss a role / opportunity",
    message:
      "Hi Vasista, I came across your site and would like to discuss an opportunity.",
  },
  {
    id: "scaling",
    label: "Ask about scaling SonyLIV / OTT",
    message: "Hi Vasista, I have a question about scaling OTT platforms.",
  },
  {
    id: "leadership",
    label: "Program / product leadership advice",
    message:
      "Hi Vasista, I would love your perspective on program/product leadership.",
  },
  {
    id: "hi",
    label: "Just saying hi",
    message: "Hi Vasista!",
  },
];

/** Build a wa.me deep link, optionally with a prefilled message. */
function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupId = useId();

  const motionVariant = useMotionSafe(fadeUp);

  // Close on outside click and on Escape while the popup is open.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const node = containerRef.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /** Open a wa.me link in a new tab (guarded for client-only). */
  function openWhatsApp(message?: string) {
    if (typeof window === "undefined") return;
    window.open(waLink(message), "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="whatsapp-popup"
            id={popupId}
            role="dialog"
            aria-label="Chat with Vasista on WhatsApp"
            variants={motionVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-80 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border p-4">
              <div>
                <p className="text-sm font-semibold text-fg">
                  Chat with Vasista
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Pick a topic &mdash; it opens WhatsApp with a note ready to
                  send.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close WhatsApp chat"
                onClick={() => setOpen(false)}
                className="flex-shrink-0 rounded-full border border-border p-1.5 text-muted transition-colors hover:bg-surface2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-2 p-4">
              {QUICK_REPLIES.map((reply) => (
                <a
                  key={reply.id}
                  href={waLink(reply.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    // Prefer window.open for a consistent new-tab experience;
                    // the href keeps it a real, accessible link as a fallback.
                    event.preventDefault();
                    openWhatsApp(reply.message);
                  }}
                  className="rounded-lg border border-border bg-surface2 px-3 py-2 text-left text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  {reply.label}
                </a>
              ))}

              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-center text-xs font-medium text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
              >
                Open WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Chat on WhatsApp"
        aria-expanded={open}
        aria-controls={popupId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export default WhatsAppWidget;
