// data/games.ts
//
// Content for the Arcade mini-games. Pure data; logic lives in lib/games.ts.
// Questions/scenarios reinforce the site's domains: Program Management,
// Product Management, and Observability.

import type {
  TriviaQuestion,
  IncidentStep,
  Feature,
  WorkItem,
} from "@/lib/games";
import { DEFAULT_ERROR_BUDGET } from "@/lib/games";

// --- Trivia Blitz ----------------------------------------------------------

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: "obs-melt",
    domain: "Observability",
    prompt: "In observability, what does the acronym MELT stand for?",
    options: [
      "Metrics, Events, Logs, Traces",
      "Monitoring, Errors, Latency, Throughput",
      "Metrics, Endpoints, Latency, Telemetry",
      "Messages, Events, Logs, Timers",
    ],
    answerIndex: 0,
    explanation:
      "MELT = Metrics, Events, Logs, Traces — the four core telemetry signal types.",
  },
  {
    id: "obs-slo",
    domain: "Observability",
    prompt: "An error budget is best described as:",
    options: [
      "The money allocated to fixing bugs each quarter",
      "The allowed amount of unreliability before an SLO is breached",
      "The number of on-call engineers per rotation",
      "The maximum number of open incidents",
    ],
    answerIndex: 1,
    explanation:
      "The error budget is 1 minus the SLO target — the acceptable unreliability before you must stop shipping and harden.",
  },
  {
    id: "obs-tail-sampling",
    domain: "Observability",
    prompt: "Tail-based sampling decides whether to keep a trace:",
    options: [
      "Before the request starts, at random",
      "After the trace completes, using its outcome (e.g. errors/latency)",
      "Only for the last request of the day",
      "Based on the client's IP address",
    ],
    answerIndex: 1,
    explanation:
      "Tail-based sampling waits until the trace finishes so it can retain interesting traces (errors, high latency) and drop the boring ones.",
  },
  {
    id: "pm-rice",
    domain: "Product Management",
    prompt: "In the RICE prioritization model, RICE stands for:",
    options: [
      "Reach, Impact, Confidence, Effort",
      "Revenue, Investment, Cost, Efficiency",
      "Risk, Impact, Complexity, Estimate",
      "Reach, Investment, Confidence, Execution",
    ],
    answerIndex: 0,
    explanation:
      "RICE = (Reach x Impact x Confidence) / Effort — a score to rank competing initiatives.",
  },
  {
    id: "pm-mvp",
    domain: "Product Management",
    prompt: "The primary purpose of an MVP (Minimum Viable Product) is to:",
    options: [
      "Ship the cheapest possible product",
      "Maximize features at launch",
      "Validate a hypothesis with the least effort",
      "Replace the need for user research",
    ],
    answerIndex: 2,
    explanation:
      "An MVP exists to test a core assumption and learn quickly — minimizing effort, not maximizing scope.",
  },
  {
    id: "pm-north-star",
    domain: "Product Management",
    prompt: "A good North Star Metric should primarily reflect:",
    options: [
      "Quarterly revenue only",
      "The value customers get from the product",
      "The number of features shipped",
      "Server uptime",
    ],
    answerIndex: 1,
    explanation:
      "The North Star Metric captures the core value delivered to customers, aligning teams around outcomes over output.",
  },
  {
    id: "prog-critical-path",
    domain: "Program Management",
    prompt: "The 'critical path' of a program is:",
    options: [
      "The riskiest feature in the backlog",
      "The longest sequence of dependent tasks determining the end date",
      "The path with the most engineers assigned",
      "The set of tasks with the highest cost",
    ],
    answerIndex: 1,
    explanation:
      "The critical path is the longest dependent-task chain; slipping any task on it slips the whole program.",
  },
  {
    id: "prog-raci",
    domain: "Program Management",
    prompt: "In a RACI matrix, exactly one role should be:",
    options: [
      "Responsible",
      "Consulted",
      "Accountable",
      "Informed",
    ],
    answerIndex: 2,
    explanation:
      "There should be exactly one Accountable owner per deliverable; Responsible/Consulted/Informed can be many.",
  },
  {
    id: "prog-wip",
    domain: "Program Management",
    prompt: "Limiting Work In Progress (WIP) primarily improves:",
    options: [
      "Headcount utilization",
      "Flow efficiency and cycle time",
      "The number of parallel initiatives",
      "Executive reporting frequency",
    ],
    answerIndex: 1,
    explanation:
      "Lower WIP reduces context-switching and queueing, improving flow efficiency and shortening cycle time.",
  },
];

// --- Incident Commander ----------------------------------------------------

export const incidentSteps: IncidentStep[] = [
  {
    id: "inc-first-move",
    situation:
      "PagerDuty fires: checkout error rate jumped from 0.1% to 12% in 2 minutes. A deploy went out 5 minutes ago. What is your FIRST move?",
    options: [
      "Open a war room and start reading application logs line by line",
      "Roll back the last deploy, then investigate",
      "Email the whole engineering org for help",
      "Wait 10 minutes to see if it self-recovers",
    ],
    correctIndex: 1,
    rationale:
      "Mitigate first: a recent deploy strongly correlates with the spike. Roll back to stop customer impact, then root-cause.",
  },
  {
    id: "inc-signal",
    situation:
      "Error rate is back to normal after rollback. To confirm the deploy caused it, which signal is most decisive?",
    options: [
      "CPU utilization graph",
      "A distributed trace of a failing request from that window",
      "The number of open Jira tickets",
      "Slack sentiment",
    ],
    correctIndex: 1,
    rationale:
      "A trace of a failed request shows exactly where the request broke and ties it to the changed code path.",
  },
  {
    id: "inc-comms",
    situation:
      "Impact is mitigated but not root-caused. What should the Incident Commander do about communication?",
    options: [
      "Say nothing until the root cause is fully known",
      "Post a clear status update with impact, current state, and next update time",
      "Ask each engineer to DM stakeholders individually",
      "Close the incident since errors recovered",
    ],
    correctIndex: 1,
    rationale:
      "Frequent, structured stakeholder updates (impact, status, next-update ETA) are core to incident command.",
  },
  {
    id: "inc-postmortem",
    situation:
      "The incident is resolved. What is the most valuable follow-up?",
    options: [
      "Assign blame to the engineer who deployed",
      "A blameless postmortem with concrete action items and owners",
      "Delete the alert that fired",
      "Increase the SLO so it won't page again",
    ],
    correctIndex: 1,
    rationale:
      "A blameless postmortem turns the incident into durable improvements — tracked action items with owners.",
  },
];

// --- Prioritization Poker --------------------------------------------------

export const priorityFeatures: Feature[] = [
  {
    id: "sso",
    name: "Enterprise SSO / SAML",
    reach: 8000,
    impact: 2,
    confidence: 0.9,
    effort: 4,
  },
  {
    id: "dark-mode",
    name: "Dark mode",
    reach: 40000,
    impact: 0.5,
    confidence: 1,
    effort: 2,
  },
  {
    id: "personalization",
    name: "Personalized home feed",
    reach: 30000,
    impact: 2,
    confidence: 0.7,
    effort: 8,
  },
  {
    id: "onboarding",
    name: "Guided onboarding flow",
    reach: 25000,
    impact: 1,
    confidence: 0.8,
    effort: 3,
  },
  {
    id: "offline",
    name: "Offline downloads",
    reach: 15000,
    impact: 1,
    confidence: 0.6,
    effort: 6,
  },
];

// --- Error Budget Balancer -------------------------------------------------

export interface ErrorBudgetConfig {
  /** Labels for each allocation period (one slider each). */
  periods: string[];
  /** Total quarterly error budget (normalized units). */
  budget: number;
  /** One-line framing shown above the sliders. */
  intro: string;
  /** Coaching shown when the plan stays within budget. */
  withinBudgetCoaching: string;
  /** Coaching shown when the plan blows the budget. */
  overBudgetCoaching: string;
}

export const errorBudgetConfig: ErrorBudgetConfig = {
  periods: ["Month 1", "Month 2", "Month 3"],
  budget: DEFAULT_ERROR_BUDGET,
  intro:
    "You hold one quarter of error budget from a 99.9% SLO. For each month, choose how aggressively to ship. Shipping fast burns budget but earns velocity; staying conservative preserves reliability.",
  withinBudgetCoaching:
    "Within budget. You converted reliability headroom into shipping velocity without breaching the SLO, exactly how a healthy error budget should be spent.",
  overBudgetCoaching:
    "Budget blown. You shipped past the SLO and would be forced into a change freeze to recover. Reliability work now blocks the roadmap.",
};

// --- Sprint Capacity Planner ----------------------------------------------

/** Fixed sprint capacity in story points. */
export const sprintCapacity = 20;

export const sprintBacklog: WorkItem[] = [
  { id: "checkout-fix", name: "Checkout latency fix", points: 5, value: 9 },
  { id: "sso", name: "Enterprise SSO", points: 8, value: 10 },
  { id: "search", name: "Search relevance rework", points: 6, value: 7 },
  { id: "onboarding", name: "Guided onboarding", points: 3, value: 5 },
  { id: "a11y", name: "Accessibility audit fixes", points: 4, value: 6 },
  { id: "dashboards", name: "Analytics dashboards", points: 7, value: 6 },
  { id: "notifications", name: "Push notifications", points: 2, value: 3 },
  { id: "refactor", name: "Payments refactor", points: 5, value: 4 },
];
