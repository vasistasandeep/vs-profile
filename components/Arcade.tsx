"use client";

import { useState } from "react";
import { Gamepad2, Siren, ListOrdered } from "lucide-react";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { TriviaBlitz } from "@/components/games/TriviaBlitz";
import { IncidentCommander } from "@/components/games/IncidentCommander";
import { PrioritizationPoker } from "@/components/games/PrioritizationPoker";

/**
 * Arcade — an engagement section with domain-themed mini-games. A simple game
 * picker swaps between three self-contained games that reinforce the site's
 * expertise areas: Program/Product Management and Observability.
 *
 * The picker is a single-select control (exactly one game visible), mirroring
 * the tab-selection pattern used elsewhere on the site. New games can be added
 * by extending the GAMES array.
 */

type GameId = "trivia" | "incident" | "priority";

interface GameDef {
  id: GameId;
  label: string;
  blurb: string;
  icon: typeof Gamepad2;
  render: () => JSX.Element;
}

const GAMES: GameDef[] = [
  {
    id: "trivia",
    label: "Trivia Blitz",
    blurb: "Quick-fire questions across PM, Product, and Observability.",
    icon: Gamepad2,
    render: () => <TriviaBlitz />,
  },
  {
    id: "incident",
    label: "Incident Commander",
    blurb: "Triage a live incident. Faster, correct calls score higher.",
    icon: Siren,
    render: () => <IncidentCommander />,
  },
  {
    id: "priority",
    label: "Prioritization Poker",
    blurb: "Rank features, then compare against the optimal RICE order.",
    icon: ListOrdered,
    render: () => <PrioritizationPoker />,
  },
];

export function Arcade() {
  const [active, setActive] = useState<GameId>("trivia");
  const activeGame = GAMES.find((g) => g.id === active) ?? GAMES[0];

  return (
    <SectionWrapper
      id="arcade"
      eyebrow="Arcade"
      title="Play a Round"
    >
      <p className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-muted">
        A few interactive mini-games from the world of platform leadership.
        No sign-up, no score-keeping server &mdash; just a quick way to see how
        product prioritization, incident triage, and the vocabulary of
        observability actually feel in practice.
      </p>

      {/* Game picker */}
      <div
        role="tablist"
        aria-label="Choose a mini-game"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {GAMES.map((g) => {
          const Icon = g.icon;
          const isActive = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`arcade-panel-${g.id}`}
              id={`arcade-tab-${g.id}`}
              onClick={() => setActive(g.id)}
              className={`rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive
                  ? "border-accent/60 bg-accent/5"
                  : "border-border bg-surface hover:border-accent/40"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-fg">
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-accent" : "text-muted"}`}
                  aria-hidden="true"
                />
                {g.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                {g.blurb}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active game panel */}
      <GlassCard
        role="tabpanel"
        id={`arcade-panel-${activeGame.id}`}
        aria-labelledby={`arcade-tab-${activeGame.id}`}
        className="mt-6 p-6"
      >
        {activeGame.render()}
      </GlassCard>
    </SectionWrapper>
  );
}

export default Arcade;
