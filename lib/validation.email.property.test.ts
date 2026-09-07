// Feature: executive-portfolio-site, Property 6
//
// Property 6: Invalid email format is rejected and blocks submission
//
// For any string that is NOT a valid email format, validateContact returns an
// error keyed to the `email` field and the submission guard (canSubmit) reports
// the form as not submittable. Name and message are held valid so that only the
// email field can be the source of failure.
//
// Validates: Requirements 11.6

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { isValidEmail, validateContact, canSubmit } from "@/lib/validation";
import type { ContactValues } from "@/types/content";

// A generator that biases toward strings that are NOT valid emails:
// - arbitrary unicode strings (many are malformed)
// - strings with no "@"
// - strings containing whitespace
// - empty string
// - oversized strings (> 254 chars)
const invalidEmailCandidate: fc.Arbitrary<string> = fc.oneof(
  fc.string(),
  fc.string({ minLength: 1 }).map((s) => s.replace(/@/g, "")), // guaranteed no "@"
  fc.string().map((s) => `${s} ${s}`), // contains whitespace
  fc.constant(""), // empty
  fc.string({ minLength: 255, maxLength: 400 }).map((s) => `${s}@example.com`), // oversized
);

describe("Property 6: Invalid email format is rejected and blocks submission", () => {
  it("flags email and blocks submission for any non-valid email (Req 11.6)", () => {
    fc.assert(
      fc.property(invalidEmailCandidate, (email: string) => {
        // Keep only strings that are genuinely NOT valid emails.
        fc.pre(!isValidEmail(email));

        // Build values where ONLY the email field is invalid: name and message
        // are valid and non-empty; organization is left empty (optional).
        const values: ContactValues = {
          name: "Vasista Sandeep",
          email,
          organization: "",
          message: "This is a valid message body for the contact form.",
        };

        const errors = validateContact(values);

        // An email error must be present, and the submission guard must block.
        expect(errors.email).toBeDefined();
        expect(canSubmit(values)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});
