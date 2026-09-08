// Example tests for the Arcade content data: shape + answer validity.

import { describe, expect, it } from "vitest";
import {
  triviaQuestions,
  incidentSteps,
  priorityFeatures,
  errorBudgetConfig,
  sprintCapacity,
  sprintBacklog,
} from "@/data/games";
import { isTriviaCorrect, riceScore, optimalValue } from "@/lib/games";

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

  it("error budget config has non-empty periods, a positive budget, and coaching copy", () => {
    expect(errorBudgetConfig.periods.length).toBeGreaterThan(0);
    for (const label of errorBudgetConfig.periods) {
      expect(label.length).toBeGreaterThan(0);
    }
    expect(errorBudgetConfig.budget).toBeGreaterThan(0);
    expect(errorBudgetConfig.intro.length).toBeGreaterThan(0);
    expect(errorBudgetConfig.withinBudgetCoaching.length).toBeGreaterThan(0);
    expect(errorBudgetConfig.overBudgetCoaching.length).toBeGreaterThan(0);
  });

  it("sprint backlog has positive points/values, a positive capacity, and a non-trivial optimum", () => {
    expect(sprintCapacity).toBeGreaterThan(0);
    expect(sprintBacklog.length).toBeGreaterThanOrEqual(6);
    expect(sprintBacklog.length).toBeLessThanOrEqual(8);
    const ids = new Set(sprintBacklog.map((i) => i.id));
    expect(ids.size).toBe(sprintBacklog.length); // unique ids
    for (const item of sprintBacklog) {
      expect(item.points).toBeGreaterThan(0);
      expect(item.value).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
    }
    // The backlog is a real puzzle: not everything fits, so the optimum is
    // below the sum of all values.
    const totalValue = sprintBacklog.reduce((s, i) => s + i.value, 0);
    expect(optimalValue(sprintBacklog, sprintCapacity)).toBeLessThan(totalValue);
    expect(optimalValue(sprintBacklog, sprintCapacity)).toBeGreaterThan(0);
  });
});
