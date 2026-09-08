// Interaction tests for the Arcade mini-games section.
//
// Verifies the game picker (single-select tabs), Trivia Blitz scoring/feedback,
// and Prioritization Poker reveal. Reduced motion is forced so SectionWrapper's
// whileInView reveal renders statically in jsdom.

import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return { ...actual, useReducedMotion: () => true };
});

import { Arcade } from "@/components/Arcade";
import { triviaQuestions } from "@/data/games";

afterEach(() => {
  cleanup();
});

describe("Arcade", () => {
  it("renders a game picker with exactly one selected tab", () => {
    render(<Arcade />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(5);
    const selected = tabs.filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(1);
    // Default is Trivia Blitz.
    expect(selected[0]).toHaveTextContent(/Trivia Blitz/i);
  });

  it("switches games via the picker (single-panel mutual exclusion)", async () => {
    const user = userEvent.setup();
    render(<Arcade />);

    await user.click(screen.getByRole("tab", { name: /Prioritization Poker/i }));
    // The prioritization game shows its reveal control.
    expect(
      screen.getByRole("button", { name: /Reveal RICE ranking/i }),
    ).toBeInTheDocument();
    // Only one tabpanel is present at a time.
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
  });

  it("Trivia Blitz scores a correct answer and shows the explanation", async () => {
    const user = userEvent.setup();
    render(<Arcade />);

    const firstQuestion = triviaQuestions[0];
    // Click the correct option for the first question.
    const correctText = firstQuestion.options[firstQuestion.answerIndex];
    await user.click(screen.getByRole("button", { name: correctText }));

    // Explanation surfaces and score becomes > 0.
    expect(screen.getByText(firstQuestion.explanation)).toBeInTheDocument();
    expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
    // The status region shows a non-zero score.
    expect(screen.getByText(/[1-9][0-9,]* pts/)).toBeInTheDocument();
  });

  it("Prioritization Poker reveals a match score in [0, 1000]", async () => {
    const user = userEvent.setup();
    render(<Arcade />);

    await user.click(screen.getByRole("tab", { name: /Prioritization Poker/i }));
    const panel = screen.getByRole("tabpanel");
    await user.click(
      within(panel).getByRole("button", { name: /Reveal RICE ranking/i }),
    );

    // A "Match Score" label and an out-of-1000 value appear.
    expect(within(panel).getByText(/Match Score/i)).toBeInTheDocument();
    expect(within(panel).getByText(/\/ 1000/)).toBeInTheDocument();
  });

  it("Error Budget Balancer switches in and reveals a quarter score", async () => {
    const user = userEvent.setup();
    render(<Arcade />);

    await user.click(
      screen.getByRole("tab", { name: /Error Budget Balancer/i }),
    );
    const panel = screen.getByRole("tabpanel");
    await user.click(
      within(panel).getByRole("button", { name: /Lock in quarter/i }),
    );

    expect(within(panel).getByText(/Quarter Score/i)).toBeInTheDocument();
    expect(within(panel).getByText(/\/ 1000/)).toBeInTheDocument();
  });

  it("Sprint Capacity Planner switches in and reveals a sprint score", async () => {
    const user = userEvent.setup();
    render(<Arcade />);

    await user.click(
      screen.getByRole("tab", { name: /Sprint Capacity Planner/i }),
    );
    const panel = screen.getByRole("tabpanel");
    // Select a couple of items, then score.
    const itemButtons = within(panel).getAllByRole("button", {
      pressed: false,
    });
    await user.click(itemButtons[0]);
    await user.click(
      within(panel).getByRole("button", { name: /Score my sprint/i }),
    );

    expect(within(panel).getByText(/Sprint Score/i)).toBeInTheDocument();
    expect(within(panel).getByText(/\/ 1000/)).toBeInTheDocument();
  });
});
