"use client";

import { useCallback, useEffect, useState } from "react";
import { Share2, Check } from "lucide-react";

import { site } from "@/data/site";

/**
 * ShareButton — a tasteful "share this profile" action.
 *
 * Uses the Web Share API where available (native share sheet on mobile), and
 * falls back to copying the URL to the clipboard on desktop. A brief "Copied!"
 * / "Shared!" confirmation is announced via an aria-live region. Purely
 * client-side; no backend, no tracking.
 */

/** The canonical URL to share. Falls back to the current location at runtime. */
const SHARE_URL = site.jsonLd.url || "https://vasistasandeep.in";

export interface ShareButtonProps {
  className?: string;
}

type Status = "idle" | "copied" | "shared";

export function ShareButton({ className }: ShareButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Detect Web Share support on mount (client-only) to avoid a hydration
  // mismatch and to keep SSR markup stable.
  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  // Reset the confirmation label after a moment.
  useEffect(() => {
    if (status === "idle") return;
    const id = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(id);
  }, [status]);

  const handleShare = useCallback(async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : SHARE_URL;
    const shareData = {
      title: site.og.title,
      text: site.og.description,
      url,
    };

    // Prefer the native share sheet when available.
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        setStatus("shared");
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard.
      }
    }

    // Clipboard fallback.
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
      }
    } catch {
      // Clipboard blocked (permissions/insecure context) — no-op; the button
      // stays in its idle state rather than throwing.
    }
  }, []);

  const label =
    status === "copied"
      ? "Link copied"
      : status === "shared"
        ? "Shared"
        : canNativeShare
          ? "Share profile"
          : "Copy link";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface2 px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {status === "idle" ? (
          <Share2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Check className="h-4 w-4 text-accent" aria-hidden="true" />
        )}
        {label}
      </button>
      {/* Politely announce the copy/share confirmation for assistive tech. */}
      <span className="sr-only" aria-live="polite">
        {status === "copied"
          ? "Profile link copied to clipboard."
          : status === "shared"
            ? "Profile shared."
            : ""}
      </span>
    </div>
  );
}

export default ShareButton;
