// Feature: executive-portfolio-site, Property 8
//
// Property 8: Submission is permitted if and only if validation passes.
//
// For any ContactValues, canSubmit(values) === true exactly when
// validateContact(values) yields no errors (Object.keys length === 0), and
// false otherwise.
//
// Validates: Requirements 11.3, 11.6, 11.7

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { canSubmit, validateContact } from "@/lib/validation";
import type { ContactValues } from "@/types/content";

// Sometimes emit a well-formed email so the passing branch is reachable, and
// otherwise emit an arbitrary string that exercises the failing branch.
const emailArb: fc.Arbitrary<string> = fc.oneof(
  // Valid-looking addresses: non-empty local + dotted domain, no whitespace.
  fc
    .tuple(
      fc.stringMatching(/^[a-zA-Z0-9._%+-]{1,20}$/),
      fc.stringMatching(/^[a-zA-Z0-9-]{1,20}$/),
      fc.stringMatching(/^[a-zA-Z]{2,6}$/),
    )
    .map(([local, domain, tld]) => `${local}@${domain}.${tld}`),
  // Arbitrary strings: may or may not be valid.
  fc.string(),
);

const contactValuesArb: fc.Arbitrary<ContactValues> = fc.record({
  name: fc.string(),
  email: emailArb,
  organization: fc.string(),
  message: fc.string(),
});

describe("Property 8: Submission is permitted if and only if validation passes", () => {
  it("canSubmit(values) === (validateContact has no errors) (Req 11.3, 11.6, 11.7)", () => {
    fc.assert(
      fc.property(contactValuesArb, (values) => {
        const hasNoErrors =
          Object.keys(validateContact(values)).length === 0;
        expect(canSubmit(values)).toBe(hasNoErrors);
      }),
      { numRuns: 100 },
    );
  });
});
