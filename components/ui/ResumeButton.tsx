"use client";

import { useCallback, useState } from "react";
import { Download } from "lucide-react";
import { site } from "@/data/site";

/**
 * ProfileButton — "Download Profile" action with a graceful fallback.
 *
 * On activation it does a lightweight availability check (HEAD) on the profile
 * PDF before opening it:
 * - On success it downloads the PDF via a hidden <a download>.
 * - On 404 / non-OK / network error it opens a small dialog offering to
 *   request the profile by email.
 *
 * (File/exports keep the ResumeButton name for import stability across the
 * codebase and tests; the user-facing label is "Download Profile".)
 */

export interface ResumeButtonProps {
  /** Extra classes appended to the trigger button. */
  className?: string;
  /** Optional label override. */
  label?: string;
}

/** User-facing button label. */
export const RESUME_BUTTON_LABEL = "Download Profile";

/** Trigger a browser download/open of the profile file via a hidden anchor. */
function openProfile(path: string): void {
  const anchor = document.createElement("a");
  anchor.href = path;
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
        openProfile(site.resumePath);
      } else {
        setShowFallback(true);
      }
    } catch {
      setShowFallback(true);
    } finally {
      setChecking(false);
    }
  }, []);

  const closeFallback = useCallback(() => setShowFallback(false), []);

  const mailtoHref = `mailto:${site.primaryEmail}?subject=${encodeURIComponent(
    "Profile request",
  )}&body=${encodeURIComponent(
    "Hi Vasista, I'd like a copy of your profile.",
  )}`;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={checking}
        aria-busy={checking}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-full",
          "bg-emerald-600 px-4 py-2 text-sm font-semibold text-white",
          "transition-colors hover:bg-emerald-500 disabled:opacity-70",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>

      {showFallback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeFallback}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-fallback-title"
            aria-describedby="profile-fallback-desc"
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="profile-fallback-title"
              className="text-lg font-semibold text-fg"
            >
              Profile temporarily unavailable
            </h2>
            <p id="profile-fallback-desc" className="mt-2 text-sm text-muted">
              The file could not be loaded right now. You can request a copy by
              email and I&apos;ll send it over.
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
