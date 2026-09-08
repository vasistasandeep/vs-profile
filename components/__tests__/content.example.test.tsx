// components/__tests__/content.example.test.tsx
//
// Example / unit tests asserting the exact fixed copy rendered by the content
// and interactive sections (task 12.1). These are string-exactness checks that
// guard against accidental copy drift.
//
// framer-motion's `whileInView` / `useInView` do not fire under jsdom (there is
// no real IntersectionObserver-driven layout), which would leave viewport-reveal
// content and count-up counters in their initial (hidden / zero) state. To keep
// the tests robust and focused on *content*, we mock framer-motion so that:
//   - `useReducedMotion()` returns true  -> AnimatedCounter shows final values,
//     section reveals resolve to the static (fully-visible) variant.
//   - `useInView()` returns true         -> any inView-gated content is present.
// All other framer-motion exports (motion, AnimatePresence, Variants, ...) are
// preserved from the real module.
//
// Validates: Requirements 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5,
// 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.2, 5.3, 5.4, 6.1, 7.1, 9.1, 10.1, 12.1,
// 13.1, 13.3, 21.1, 21.2, 21.3, 21.4, 21.5

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// --- framer-motion mock: force reduced-motion + in-view so content renders ---
vi.mock("framer-motion", async () => {
  const actual =
    await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
    useInView: () => true,
  };
});

import { EventsGrid } from "@/components/EventsGrid";
import { PlatformEvolution } from "@/components/PlatformEvolution";
import { ArchitectureTabs } from "@/components/ArchitectureTabs";
import { ArchitectureFlowDiagram } from "@/components/ArchitectureFlowDiagram";
import { Manifesto } from "@/components/Manifesto";
import { Credentials } from "@/components/Credentials";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ResumeButton, RESUME_BUTTON_LABEL } from "@/components/ui/ResumeButton";

import { eventCategories } from "@/data/events";
import { evolutionItems } from "@/data/evolution";
import { architectureTabs } from "@/data/architecture";
import { flowLayers } from "@/data/flow";
import { manifesto } from "@/data/manifesto";
import { credentials } from "@/data/credentials";
import { testimonials } from "@/data/testimonials";
import { metrics } from "@/data/metrics";
import { site } from "@/data/site";

describe("EventsGrid — exact category titles, events, and notes (Req 3.1-3.5)", () => {
  beforeEach(() => render(<EventsGrid />));

  it("renders the section heading and every category title", () => {
    expect(screen.getByText("Scale & Tournaments")).toBeInTheDocument();
    for (const category of eventCategories) {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    }
    expect(screen.getByText("Cricket")).toBeInTheDocument();
    expect(screen.getByText("Football")).toBeInTheDocument();
    expect(
      screen.getByText("Multi-Sport & Tennis Slams"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Entertainment & Combat Sports"),
    ).toBeInTheDocument();
  });

  it("renders every event string for each category", () => {
    for (const category of eventCategories) {
      for (const event of category.events) {
        expect(screen.getByText(event)).toBeInTheDocument();
      }
    }
    expect(
      screen.getByText("UEFA Champions League Final"),
    ).toBeInTheDocument();
    expect(screen.getByText("Tokyo Olympics")).toBeInTheDocument();
    expect(screen.getByText("WWE WrestleMania")).toBeInTheDocument();
  });

  it("renders each category scale note", () => {
    expect(
      screen.getByText("0 to 250K RPS spikes in under 60 seconds"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("zero-buffer 1080p and 4K adaptive bitrate"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "15+ simultaneous live feeds with multi-language metadata",
      ),
    ).toBeInTheDocument();
  });
});

describe("PlatformEvolution — exact before/after details with toggle (Req 4.2-4.7)", () => {
  it("shows the section title and every item title", () => {
    render(<PlatformEvolution />);
    expect(screen.getByText("Platform Evolution")).toBeInTheDocument();
    for (const item of evolutionItems) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it("defaults to the Before detail for every item", () => {
    render(<PlatformEvolution />);
    for (const item of evolutionItems) {
      expect(screen.getByText(item.before)).toBeInTheDocument();
    }
  });

  it("shows the exact After detail once its After control is toggled", async () => {
    render(<PlatformEvolution />);

    for (const item of evolutionItems) {
      const afterButton = screen.getByRole("button", {
        name: `Show the after state of ${item.title}`,
      });
      fireEvent.click(afterButton);
      // AnimatePresence swaps the paragraph via an exit/enter cycle; wait for
      // the After detail to settle in the DOM.
      expect(await screen.findByText(item.after)).toBeInTheDocument();
    }

    // Spot-check the required technical wording surfaced in the After states.
    expect(
      screen.getByText(/communicating over gRPC and Kafka/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/40% publishing latency reduction/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Envoy and Resilience4j circuit breakers/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/real-time SCTE-35 marker detection/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/OpenTelemetry pipelines with tail-based sampling/),
    ).toBeInTheDocument();
  });
});

describe("ArchitectureTabs — tab labels and item lists (Req 5.2-5.4)", () => {
  beforeEach(() => render(<ArchitectureTabs />));

  it("renders all three tab labels", () => {
    for (const tab of architectureTabs) {
      expect(screen.getByRole("tab", { name: tab.label })).toBeInTheDocument();
    }
    expect(
      screen.getByRole("tab", { name: "System Design Patterns" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Observability & Telemetry (MELT)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Video Streaming QoE" }),
    ).toBeInTheDocument();
  });

  it("shows the default (first) tab's exact items", () => {
    for (const item of architectureTabs[0].items) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    expect(screen.getByText("Circuit Breakers")).toBeInTheDocument();
    expect(screen.getByText("Multi-CDN Origin Shielding")).toBeInTheDocument();
  });

  it("reveals another tab's exact items after activation", async () => {
    const user = userEvent.setup();
    // Radix Tabs activate on pointer interaction; userEvent fires the full
    // pointer sequence so the target panel mounts its content.
    await user.click(
      screen.getByRole("tab", { name: "Observability & Telemetry (MELT)" }),
    );
    for (const item of architectureTabs[1].items) {
      expect(await screen.findByText(item)).toBeInTheDocument();
    }
    expect(screen.getByText("OpenTelemetry")).toBeInTheDocument();
    expect(screen.getByText("Jaeger tracing")).toBeInTheDocument();
  });
});

describe("ArchitectureFlowDiagram — Layer labels and elements (Req 21.1-21.5)", () => {
  beforeEach(() => render(<ArchitectureFlowDiagram />));

  it('renders each "Layer N:" prefixed label', () => {
    for (const layer of flowLayers) {
      expect(screen.getByText(layer.label)).toBeInTheDocument();
    }
    expect(screen.getByText("Layer 1: Client & Edge")).toBeInTheDocument();
    expect(
      screen.getByText("Layer 2: API Gateway & SSAI Proxy"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Layer 3: Decoupled Domain Microservices"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Layer 4: Persistence & Caching"),
    ).toBeInTheDocument();
  });

  it("renders every element of every layer", () => {
    for (const layer of flowLayers) {
      for (const element of layer.elements) {
        expect(screen.getByText(element)).toBeInTheDocument();
      }
    }
    expect(screen.getByText("Player SDKs")).toBeInTheDocument();
    expect(screen.getByText("SCTE-35 marker detection")).toBeInTheDocument();
    expect(screen.getByText("Kafka event bus")).toBeInTheDocument();
  });
});

describe("Manifesto — exact card titles (Req 7.1)", () => {
  it("renders the manifesto heading and all four card titles", () => {
    render(<Manifesto />);
    expect(
      screen.getByText("Platform Leadership Manifesto"),
    ).toBeInTheDocument();
    for (const card of manifesto) {
      expect(screen.getByText(card.title)).toBeInTheDocument();
    }
    expect(
      screen.getByText("Telemetry Precedes Features"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Graceful Degradation Over Total Outage"),
    ).toBeInTheDocument();
  });
});

describe("Credentials — seven certification names (Req 9.1)", () => {
  it("renders all seven resume-accurate certification names exactly", () => {
    render(<Credentials />);
    expect(credentials).toHaveLength(7);
    for (const credential of credentials) {
      expect(screen.getByText(credential.name)).toBeInTheDocument();
    }
    expect(screen.getByText("PMP Certified")).toBeInTheDocument();
    expect(
      screen.getByText("Lean Six Sigma Black Belt"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Certified Scrum Product Owner (CSPO)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ITIL Certified & Practitioner"),
    ).toBeInTheDocument();
  });
});

describe("Testimonials — role-only attribution titles (Req 10.1)", () => {
  it("renders the section heading and all role-only attribution titles", () => {
    render(<Testimonials />);
    expect(
      screen.getByText("What people I've worked with say"),
    ).toBeInTheDocument();
    for (const testimonial of testimonials) {
      expect(screen.getByText(testimonial.title)).toBeInTheDocument();
    }
    expect(screen.getByText("Head of Technology")).toBeInTheDocument();
    expect(screen.getByText("Chief Product Officer")).toBeInTheDocument();
    expect(
      screen.getByText("Research Head, Personalization"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Chief Technology Officer"),
    ).toBeInTheDocument();
  });
});

describe("Footer — exact attribution string (Req 12.1)", () => {
  it("renders the exact footer text from site metadata", () => {
    render(<Footer />);
    // Assert against site.footerText as the single source of truth so the
    // test tracks the configured attribution string without duplicating it.
    expect(screen.getByText(site.footerText)).toBeInTheDocument();
    expect(site.footerText.length).toBeGreaterThan(0);
  });
});

describe("Hero — exact eyebrow, headline, and sub-headline (Req 2.1-2.4)", () => {
  beforeEach(() => render(<Hero />));

  it("renders the exact eyebrow badge text", () => {
    expect(
      screen.getByText(
        "Program & Product Leadership \u00b7 OTT \u00b7 FinTech \u00b7 Retail",
      ),
    ).toBeInTheDocument();
  });

  it("renders the exact headline", () => {
    expect(
      screen.getByRole("heading", {
        name: "Building platforms that scale to 30M+ users.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the exact sub-headline", () => {
    expect(
      screen.getByText(
        "I turn ambitious roadmaps into resilient, high-concurrency products, aligning engineering, product, and delivery so the platform stays fast when the audience shows up all at once.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the two CTAs and every metric label", () => {
    expect(
      screen.getByRole("button", { name: "Explore my work" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Get in touch" }),
    ).toBeInTheDocument();
    for (const metric of metrics) {
      // Each label appears twice: an sr-only <dt> and the visible <span>.
      expect(screen.getAllByText(metric.label).length).toBeGreaterThan(0);
    }
  });
});

describe("AnimatedCounter — final value on intersection (Req 2.5-2.7)", () => {
  it("renders the formatted final value when in view (mocked useInView=true)", () => {
    // The framer-motion mock forces useReducedMotion=true, so the counter
    // shows its final formatted value immediately.
    render(<AnimatedCounter target={30} suffix="M+" decimals={0} />);
    expect(screen.getByText("30M+")).toBeInTheDocument();
  });

  it("formats decimals, prefix, and suffix on the final value", () => {
    render(<AnimatedCounter target={99.99} suffix="%" decimals={2} />);
    expect(screen.getByText("99.99%")).toBeInTheDocument();
  });
});

describe("ResumeButton — available (HEAD 200) vs 404 fallback (Req 13.1, 13.3)", () => {
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
    vi.restoreAllMocks();
  });

  it("renders the exact button label", () => {
    render(<ResumeButton />);
    expect(
      screen.getByRole("button", { name: RESUME_BUTTON_LABEL }),
    ).toBeInTheDocument();
  });

  it("triggers a download (no fallback modal) when the resume is available (HEAD 200)", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

    render(<ResumeButton />);
    fireEvent.click(screen.getByRole("button", { name: RESUME_BUTTON_LABEL }));

    // Allow the async availability check + download to resolve.
    await screen.findByRole("button", { name: RESUME_BUTTON_LABEL });

    expect(global.fetch).toHaveBeenCalledWith(site.resumePath, {
      method: "HEAD",
    });
    expect(clickSpy).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the email fallback modal when the resume is missing (HEAD 404)", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 404 }) as unknown as typeof fetch;

    render(<ResumeButton />);
    fireEvent.click(screen.getByRole("button", { name: RESUME_BUTTON_LABEL }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // Fallback offers the primary contact email.
    expect(
      within(dialog).getByText(`Email ${site.primaryEmail}`),
    ).toBeInTheDocument();
  });
});
