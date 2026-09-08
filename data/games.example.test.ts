// Example tests for the Arcade content data: shape + answer validity.

import { describe, expect, it } from "vitest";
import { triviaQuestions, incidentSteps, priorityFeatures } from "@/data/games";
import { isTriviaCorrect, riceScore } from "@/lib/games";

describe("Arcade content data", () => {
  it("every trivia question has a valid answerIndex and >= 2 options", () => {
    expect(triviaQuestions.length).toBeGreaterThan(0);
    for (const q of triviaQuestions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.answerIndex).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex).toBeLessThan(q.options.length);
      // The correct option is recognized by the pure checker.
      expect(isTriviaCorrect(q, q.answerIndex)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });

  it("trivia covers all three domains", () => {
    const domains = new Set(triviaQuestions.map((q) => q.domain));
    expect(domains.has("Program Management")).toBe(true);
    expect(domains.has("Product Management")).toBe(true);
    expect(domains.has("Observability")).toBe(true);
  });

  it("every incident step has a valid correctIndex and rationale", () => {
    expect(incidentSteps.length).toBeGreaterThan(0);
    for (const s of incidentSteps) {
      expect(s.options.length).toBeGreaterThanOrEqual(2);
      expect(s.correctIndex).toBeGreaterThanOrEqual(0);
      expect(s.correctIndex).toBeLessThan(s.options.length);
      expect(s.rationale.length).toBeGreaterThan(0);
    }
  });

  it("priority features have positive effort so RICE is finite", () => {
    expect(priorityFeatures.length).toBeGreaterThanOrEqual(3);
    for (const f of priorityFeatures) {
      expect(f.effort).toBeGreaterThan(0);
      expect(riceScore(f)).toBeGreaterThanOrEqual(0);
    }
  });
});
