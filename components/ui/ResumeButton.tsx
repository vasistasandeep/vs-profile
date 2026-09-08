"use client";

import { useCallback, useState } from "react";
import { site } from "@/data/site";

/**
 * ResumeButton — resume download action with graceful fallback (Req 13).
 *
 * Renders a "Download Resume (PDF)" button (Req 13.1). On activation it performs
 * a lightweight availability check — a `fetch(resumePath, { method: "HEAD" })`
 * — before opening the file:
 *
 * - On success (response OK), it opens/downloads `/Vasista_Sandeep_Resume.pdf`
 *   via a hidden `<a download>` click (Req 13.1, 13.2).
 * - On a 404, other non-OK status, or any network error, it opens a simple
 *   fallback modal offering to request the resume by email to
 *   `contact@vasistasandeep.in` (Req 13.3). Network errors are treated as
 *   "unavailable" rather than surfacing a raw error.
 *
 * The modal is a lightweight inline dialog driven by local state (a Radix
 * Dialog would also work); it uses `role="dialog"` + `aria-modal` and closes on
 * the Close button or backdrop click.
 */

export interface ResumeButtonProps {
  /** Extra classes appended to the trigger button. */
  className?: string;
  /** Optional label override; defaults to the required Req 13.1 text. */
  label?: string;
}

/** Exact button label required by Req 13.1. */
export const RESUME_BUTTON_LABEL = "Download Resume (PDF)";

/** Trigger a browser download/open of the resume file via a hidden anchor. */
function openResume(resumePath: string): void {
  const anchor = document.createElement("a");
  anchor.href = resumePath;
  anchor.download = "";
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export function ResumeButton({
  className,
  label = RESUME_BUTTON_LABEL,
}: ResumeButtonProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleClick = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch(site.resumePath, { method: "HEAD" });
      if (res.ok) {
        openResume(site.resumePath);
      } else {
        // 404 or any other non-OK status → graceful fallback (Req 13.3).
        setShowFallback(true);
      }
    } catch {
      // Network error → treat as unavailable and offer the email fallback.
      setShowFallback(true);
    } finally {
      setChecking(false);
    }
  }, []);

  const closeFallback = useCallback(() => setShowFallback(false), []);

  const mailtoHref = `mailto:${site.primaryEmail}?subject=${encodeURIComponent(
    "Resume request",
  )}&body=${encodeURIComponent(
    "Hi Vasista, I'd like to request a copy of your resume.",
  )}`;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={checking}
        aria-busy={checking}
        className={[
          "inline-flex items-center justify-center rounded-full",
          "bg-emerald-600 px-4 py-2 text-sm font-semibold text-white",
          "transition-colors hover:bg-emerald-500 disabled:opacity-70",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </button>

      {showFallback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={closeFallback}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-fallback-title"
            aria-describedby="resume-fallback-desc"
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="resume-fallback-title"
              className="text-lg font-semibold text-fg"
            >
              Resume temporarily unavailable
            </h2>
            <p id="resume-fallback-desc" className="mt-2 text-sm text-muted">
              The resume file could not be loaded right now. You can request a
              copy by email and I&apos;ll send it over.
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeFallback}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface2"
              >
                Close
              </button>
              <a
                href={mailtoHref}
                className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                Email {site.primaryEmail}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResumeButton;
