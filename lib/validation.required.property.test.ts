// Feature: executive-portfolio-site, Property 7
//
// Property 7: Every empty required field is flagged and blocks submission
//
// For any ContactValues where one or more of name/email/message is empty or
// whitespace-only, validateContact flags EACH empty required field (error key
// present) and canSubmit reports the form as not submittable.
//
// Validates: Requirements 11.7

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { validateContact, canSubmit } from "@/lib/validation";
import type { ContactValues } from "@/types/content";

// Whitespace-only / empty strings that must be treated as "empty required".
const emptyGen = fc.constantFrom("", " ", "   ", "\t\n");

describe("Property 7: Every empty required field is flagged and blocks submission", () => {
  it("flags each empty/whitespace required field and blocks submission (Req 11.7)", () => {
    fc.assert(
      fc.property(
        // For each required field, independently choose either an empty/
        // whitespace-only value or a non-empty valid value.
        // - name: any non-empty, non-whitespace string when "present"
        // - email: a valid email when "present" so only empty fields drive errors
        // - message: any non-empty, non-whitespace string when "present"
        fc.oneof(
          emptyGen,
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        ),
        fc.oneof(emptyGen, fc.constantFrom("exec@example.com", "hello@company.io")),
        fc.oneof(
          emptyGen,
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        ),
        (name: string, email: string, message: string) => {
          // Require at least one required field to be empty/whitespace-only.
          const nameEmpty = name.trim().length === 0;
          const emailEmpty = email.trim().length === 0;
          const messageEmpty = message.trim().length === 0;
          fc.pre(nameEmpty || emailEmpty || messageEmpty);

          const values: ContactValues = {
            name,
            email,
            // organization is optional and left blank here.
            organization: "",
            message,
          };

          const errors = validateContact(values);

          // Each empty/whitespace required field must have a corresponding error.
          if (nameEmpty) expect(errors.name).toBeTruthy();
          if (emailEmpty) expect(errors.email).toBeTruthy();
          if (messageEmpty) expect(errors.message).toBeTruthy();

          // With at least one empty required field, submission must be blocked.
          expect(canSubmit(values)).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });
});
