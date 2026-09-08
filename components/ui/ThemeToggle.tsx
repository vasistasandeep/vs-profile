"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle — light/dark theme switch.
 *
 * Toggles the `dark` class on `<html>`, persists the choice to
 * `localStorage["theme"]`, and reflects state with a Sun (in dark mode → click
 * to go light) / Moon (in light mode → click to go dark) lucide icon plus an
 * aria-label.
 *
 * Default (no stored preference) is LIGHT, matching the product decision. The
 * initial state is read from `document.documentElement.classList` on mount —
 * the no-flash script in app/layout.tsx has already applied the correct class
 * before paint, so reading from the DOM avoids any hydration mismatch.
 */

/** localStorage key the no-flash script and this toggle share. */
const STORAGE_KEY = "theme";

/** Extra classes appended to the toggle button. */
export interface ThemeToggleProps {
  className?: string;
}

/** Join truthy class fragments into a single className string. */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  // `null` until mounted so SSR markup stays stable and we render the resolved
  // state only after reading the DOM (set by the no-flash script).
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !(isDark ?? false);
    const root = document.documentElement;
    if (next) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Ignore storage failures (private mode, disabled storage).
    }
    setIsDark(next);
  };

  // Before mount we don't know the resolved theme; render a neutral, labelled
  // button so layout is stable and the control is still reachable.
  const dark = isDark ?? false;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={cx(
        "inline-flex h-9 w-9 items-center justify-center rounded-full",
        "border border-border text-muted transition-colors",
        "hover:border-accent/40 hover:text-accent",
        className,
      )}
    >
      {dark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

export default ThemeToggle;
