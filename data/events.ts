// data/events.ts
//
// Events_Grid (High-Concurrency Arena) data (Req 3.1-3.5).
// Four event categories with exact event names and scale notes.

import type { EventCategory } from "@/types/content";

export const eventCategories: EventCategory[] = [
  {
    id: "cricket",
    title: "Cricket",
    events: [
      "India Bilateral Tours vs England, Australia, and South Africa",
      "ACC Asia Cup",
      "The Hundred",
    ],
    note: "0 to 250K RPS spikes in under 60 seconds",
    glow: "emerald",
  },
  {
    id: "football",
    title: "Football",
    events: [
      "UEFA Champions League Final",
      "UEFA Europa League Final",
      "UEFA Euro",
      "FA Cup",
    ],
    note: "zero-buffer 1080p and 4K adaptive bitrate",
    glow: "cyan",
  },
  {
    id: "multi-sport-tennis-slams",
    title: "Multi-Sport & Tennis Slams",
    events: [
      "Tokyo Olympics",
      "Asian Games",
      "Australian Open",
      "Roland Garros",
      "US Open",
    ],
    note: "15+ simultaneous live feeds with multi-language metadata",
    glow: "emerald",
  },
  {
    id: "entertainment-combat-sports",
    title: "Entertainment & Combat Sports",
    events: [
      "WWE WrestleMania",
      "WWE SummerSlam",
      "UFC Fight Nights",
      "KBC Play Along real-time interactive low-latency sync",
    ],
    note: "real-time interactive low-latency sync",
    glow: "cyan",
  },
];
