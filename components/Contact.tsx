"use client";

// components/Contact.tsx
//
// Contact section (Req 11) — friendly "Let's connect" voice. Two columns:
//   (1) Direct channels — LinkedIn (new tab), mailto to primaryEmail, and the
//       exact location line (Req 11.1).
//   (2) Contact_Form — Name / Work Email / Organization / Message with the
//       required maxLength limits (Req 11.2), client-side validation gate via
//       lib/validation (Req 11.6, 11.7), a pending state (Req 11.8), a
//       Formspree POST wrapped in an AbortController 30s timeout (Req 11.9),
//       a success state (Req 11.4), and an error state that surfaces a mailto
//       fallback (Req 11.5).
//
// Accessibility (Req 17.1, 17.2): every field is labeled, invalid fields set
// aria-invalid + aria-describedby pointing at their error message, and the
// submission status is announced through an aria-live region.

import { useState } from "react";
import { Linkedin, Mail, MapPin } from "lucide-react";

import { site } from "@/data/site";
import { validateContact, canSubmit } from "@/lib/validation";
import type {
  ContactValues,
  ContactErrors,
  ContactField,
} from "@/types/content";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GlassCard from "@/components/ui/GlassCard";

/** Submission lifecycle state (Req 11.8, 11.4, 11.5, 11.9). */
type Status = "idle" | "pending" | "success" | "error";

/** Per-field character limits, mirrored from lib/validation (Req 11.2). */
const MAX_LENGTH: Record<ContactField, number> = {
  name: 100,
  email: 254,
  organization: 100,
  message: 2000,
};

/** Formspree request timeout in milliseconds (Req 11.9). */
const TIMEOUT_MS = 30_000;

const INITIAL_VALUES: ContactValues = {
  name: "",
  email: "",
  organization: "",
  message: "",
};

/** Location line (Req 11.1) — brand-neutral warmth, no availability pitch. */
const LOCATION_LINE = "Bengaluru, India — always happy to talk platforms";

const inputBase =
  "w-full rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-fg " +
  "placeholder:text-muted outline-none transition focus:border-accent/60 " +
  "focus:ring-1 focus:ring-accent/40";
const inputInvalid = "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/40";

export function Contact() {
  const [values, setValues] = useState<ContactValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function updateField(field: ContactField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear a field-level error as the visitor edits it.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 1. Validate (Req 11.6, 11.7). On any error, surface field messages and
    //    do not submit.
    const validationErrors = validateContact(values);
    if (!canSubmit(values)) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // 2. Enter pending (Req 11.8) and POST to Formspree within a 30s abort
    //    window (Req 11.9).
    setStatus("pending");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          organization: values.organization,
          message: values.message,
        }),
        signal: controller.signal,
      });

      if (response.ok) {
        // 3a. Success (Req 11.4).
        setStatus("success");
        setValues(INITIAL_VALUES);
      } else {
        // 3b. Non-OK response → error + mailto fallback (Req 11.5).
        setStatus("error");
      }
    } catch {
      // 3c. Network error or 30s abort/timeout → error + mailto fallback
      //     (Req 11.5, 11.9).
      setStatus("error");
    } finally {
      // Always clear the timeout to avoid leaking a pending abort (Req 11.9).
      clearTimeout(timeoutId);
    }
  }

  const isPending = status === "pending";

  // mailto fallback surfacing both the primary address and the fallback
  // address (Req 11.5).
  const fallbackMailto = `mailto:${site.primaryEmail}?cc=${site.fallbackEmail}&subject=${encodeURIComponent(
    "Let's connect",
  )}`;

  return (
    <SectionWrapper
      id="contact"
      eyebrow="Say hello"
      title="Let's start a conversation"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Column 1 — direct channels (Req 11.1) */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-fg">Find me here</h3>
          <p className="mt-2 text-sm text-muted">
            Whether it&apos;s scaling platforms, building teams, or trading war
            stories from a live event, I&apos;m always up for a good
            conversation.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href={site.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border bg-surface2 px-4 py-3 text-sm text-fg transition hover:border-accent/60 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40"
            >
              <Linkedin className="h-5 w-5 text-accent" aria-hidden="true" />
              <span>Connect on LinkedIn</span>
            </a>

            <a
              href={`mailto:${site.primaryEmail}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface2 px-4 py-3 text-sm text-fg transition hover:border-accent/60 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40"
            >
              <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
              <span>{site.primaryEmail}</span>
            </a>

            <p className="flex items-start gap-3 rounded-lg px-4 py-3 text-sm text-muted">
              <MapPin
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span>{LOCATION_LINE}</span>
            </p>
          </div>
        </GlassCard>

        {/* Column 2 — Contact_Form (Req 11.2–11.9) */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-fg">
            Send a Message
          </h3>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Name (required) */}
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1 block text-sm font-medium text-fg"
              >
                Name <span className="text-accent">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={MAX_LENGTH.name}
                value={values.name}
                onChange={(e) => updateField("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                className={`${inputBase} ${errors.name ? inputInvalid : ""}`}
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Work Email (required) */}
            <div>
              <label
                htmlFor="contact-email"
                className="mb-1 block text-sm font-medium text-fg"
              >
                Work Email <span className="text-accent">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={MAX_LENGTH.email}
                value={values.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                className={`${inputBase} ${errors.email ? inputInvalid : ""}`}
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Organization (optional) */}
            <div>
              <label
                htmlFor="contact-organization"
                className="mb-1 block text-sm font-medium text-fg"
              >
                Organization
              </label>
              <input
                id="contact-organization"
                name="organization"
                type="text"
                maxLength={MAX_LENGTH.organization}
                value={values.organization}
                onChange={(e) => updateField("organization", e.target.value)}
                aria-invalid={Boolean(errors.organization)}
                aria-describedby={
                  errors.organization ? "contact-organization-error" : undefined
                }
                className={`${inputBase} ${
                  errors.organization ? inputInvalid : ""
                }`}
              />
              {errors.organization && (
                <p
                  id="contact-organization-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  {errors.organization}
                </p>
              )}
            </div>

            {/* Message (required) */}
            <div>
              <label
                htmlFor="contact-message"
                className="mb-1 block text-sm font-medium text-fg"
              >
                Message <span className="text-accent">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                maxLength={MAX_LENGTH.message}
                value={values.message}
                onChange={(e) => updateField("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                className={`${inputBase} resize-y ${
                  errors.message ? inputInvalid : ""
                }`}
              />
              {errors.message && (
                <p
                  id="contact-message-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-accent/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Sending…" : "Send Message"}
            </button>

            {/* Status feedback (Req 11.4, 11.5, 11.8) announced politely
                for assistive tech (Req 17.2). */}
            <div aria-live="polite" role="status" className="min-h-[1.25rem]">
              {status === "pending" && (
                <p className="text-sm text-muted">
                  Sending your message…
                </p>
              )}
              {status === "success" && (
                <p className="text-sm text-accent">
                  Message sent. Thanks for reaching out — I&apos;ll respond
                  shortly.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Something went wrong sending your message. Please email{" "}
                  <a
                    href={fallbackMailto}
                    className="font-medium underline decoration-red-500/60 underline-offset-2 hover:opacity-80"
                  >
                    {site.primaryEmail}
                  </a>{" "}
                  directly (or {site.fallbackEmail}).
                </p>
              )}
            </div>
          </form>
        </GlassCard>
      </div>
    </SectionWrapper>
  );
}

export default Contact;
