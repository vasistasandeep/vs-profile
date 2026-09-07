// Feature: executive-portfolio-site — Contact validation (pure module, no React)
// Requirements: 11.2, 11.3, 11.6, 11.7
import type { ContactValues, ContactErrors } from "@/types/content";

// Field length limits (Req 11.2)
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const ORGANIZATION_MAX = 100;
const MESSAGE_MAX = 2000;

/**
 * Pragmatic email validation (Req 11.6):
 * - trims surrounding whitespace
 * - rejects empty
 * - enforces total length <= 254
 * - requires exactly one "@"
 * - requires a non-empty local part
 * - requires a domain containing a dot
 * - rejects any internal whitespace
 */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > EMAIL_MAX) return false;
  // No whitespace anywhere inside the address.
  if (/\s/.test(trimmed)) return false;

  const atParts = trimmed.split("@");
  // Exactly one "@" yields exactly two parts.
  if (atParts.length !== 2) return false;

  const [local, domain] = atParts;
  if (local.length === 0) return false;
  if (domain.length === 0) return false;

  // Domain must be dotted with non-empty labels on both sides of a dot.
  const dotIndex = domain.indexOf(".");
  if (dotIndex <= 0) return false; // no dot, or leading dot
  if (dotIndex >= domain.length - 1) return false; // trailing dot

  return true;
}

/**
 * Validate contact form values (Req 11.6, 11.7).
 * Returns an errors object with a message per invalid field. Empty object => valid.
 * - name, email, message are required; empty/whitespace-only is flagged.
 * - email additionally must be a valid format when present.
 * - organization is optional but length-checked (<= 100).
 */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const organization = values.organization.trim();
  const message = values.message.trim();

  // Required: name
  if (name.length === 0) {
    errors.name = "Name is required.";
  } else if (name.length > NAME_MAX) {
    errors.name = `Name must be ${NAME_MAX} characters or fewer.`;
  }

  // Required: email (presence, then format)
  if (email.length === 0) {
    errors.email = "Work Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Work Email must be a valid email address.";
  }

  // Required: message
  if (message.length === 0) {
    errors.message = "Message is required.";
  } else if (message.length > MESSAGE_MAX) {
    errors.message = `Message must be ${MESSAGE_MAX} characters or fewer.`;
  }

  // Optional: organization (length-checked only)
  if (organization.length > ORGANIZATION_MAX) {
    errors.organization = `Organization must be ${ORGANIZATION_MAX} characters or fewer.`;
  }

  return errors;
}

/**
 * Submission guard (Req 11.3): true iff validateContact yields no errors.
 */
export function canSubmit(values: ContactValues): boolean {
  return Object.keys(validateContact(values)).length === 0;
}
