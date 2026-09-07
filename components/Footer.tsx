import type { HTMLAttributes } from "react";

import { site } from "@/data/site";

/**
 * Footer — site attribution (Req 12.1).
 *
 * Renders a `<footer>` containing the exact copyright/attribution string from
 * `site.footerText`. This is a plain, presentational component (no
 * `"use client"`): it has no hooks or interactivity, so it works in server or
 * client trees alike. Styled subtly with slate-400 text, a hairline top border
 * (`border-white/10`), and centered content.
 */

export type FooterProps = HTMLAttributes<HTMLElement>;

/** Join truthy class fragments into a single className string. */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function Footer({ className, ...rest }: FooterProps) {
  return (
    <footer
      className={cx(
        "border-t border-white/10",
        "px-6 py-8 text-center text-sm text-slate-400",
        className,
      )}
      {...rest}
    >
      <p>{site.footerText}</p>
    </footer>
  );
}

export default Footer;
