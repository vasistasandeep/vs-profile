# Implementation Plan: Executive Portfolio Site

## Overview

This plan converts the design into incremental, code-only steps for a coding agent. It builds bottom-up: first project scaffolding and configuration, then the typed content model and pre-populated data, then the pure logic modules (`lib/*`) with their property-based tests, then shared UI primitives, then each section component (wiring its data, interaction, reduced-motion, and accessibility), then the layout/page/SEO/JSON-LD composition, then responsive and design-system polish, then the remaining test suites (example, interaction, integration with mocked Formspree, accessibility), and finally deployment-readiness verification.

Stack: Next.js 14+ (App Router) + TypeScript + Tailwind CSS + Radix/Shadcn primitives + Framer Motion + Lucide + Geist/Inter via `next/font`. Testing: Vitest (jsdom) + React Testing Library + `@testing-library/user-event` + `fast-check` (property-based, `numRuns: 100`) + `jest-axe`.

Property-based test tasks are tagged with the `// Feature: executive-portfolio-site, Property N` convention and configured for at least 100 iterations. Each property (1–15) is covered exactly once.

## Tasks

- [x] 1. Scaffold the Next.js project, tooling, and configuration
  - [x] 1.1 Initialize the Next.js App Router + TypeScript project structure
    - Create `package.json` with Next.js 14+, React, TypeScript, `tailwindcss`, `postcss`, `autoprefixer`, `framer-motion`, `lucide-react`, `@radix-ui/react-tabs`, `@radix-ui/react-dialog`, `@radix-ui/react-slider`, `@radix-ui/react-toggle-group`, and `geist` (or `next/font` Inter) as dependencies (pinned versions)
    - Create `tsconfig.json` (strict mode, `@/*` path alias to project root), `next.config.mjs`, `postcss.config.mjs`, and `.gitignore`
    - Create empty directory structure: `app/`, `components/`, `components/ui/`, `lib/`, `data/`, `types/`, `public/`
    - _Requirements: 14.1, 20.3_
  - [x] 1.2 Configure Tailwind theme tokens and global styles
    - Create `tailwind.config.ts` extending theme with the design tokens: obsidian/slate-950 background, emerald/cyan accents, glow shadow, `tabular-nums`, `content` globs for `app/`, `components/`
    - Create `app/globals.css` with Tailwind layers, CSS variable tokens (`--bg`), the `.bg-grid` grid-texture utility, `scrollbar-gutter: stable` on the root, and a `@media (prefers-reduced-motion: reduce)` backstop that neutralizes transitions/animations/marquee
    - _Requirements: 1.12, 16.3, 19.1, 19.2, 19.3, 19.4, 17.4_
  - [x] 1.3 Configure the Vitest + fast-check + jest-axe test harness
    - Create `vitest.config.ts` (jsdom environment, `@/*` alias, setup file) and `vitest.setup.ts` registering `@testing-library/jest-dom` and `jest-axe` matchers
    - Add dev dependencies: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `fast-check`, `jest-axe`
    - Add `test` script running `vitest --run` (single execution, no watch)
    - _Requirements: 20.3_

- [x] 2. Define the typed content model and pre-populated data
  - [x] 2.1 Create the content type interfaces
    - Create `types/content.ts` with all interfaces from the design: `NavLink`, `Metric`, `EventCategory`, `EvolutionItem`, `ArchitectureTab`, `ManifestoCard`, `CaseStudy`, `Credential`, `Testimonial`, `LabItem`, `FlowLayer`, `SiteMeta`, and the cost/contact types (`SamplingStrategy`, `CostInput`, `CostResult`, `ContactField`, `ContactValues`, `ContactErrors`)
    - _Requirements: 14.1, 20.1_
  - [x] 2.2 Create navigation and site metadata data
    - Create `data/navigation.ts` with the seven `NavLink`s in exact order and correct target IDs (`#overview`, `#tournaments`, `#architecture`, `#case-studies`, `#governance`, `#endorsements`, `#contact`)
    - Create `data/site.ts` with `SiteMeta`: name/monogram, domain, LinkedIn URL, `contact@vasistasandeep.in`, fallback `vasista.sandeep@gmail.com`, `formspreeEndpoint` placeholder, resume path, exact footer string, OpenGraph block, and the `jsonLd` Person/ProfilePage fields
    - _Requirements: 1.4, 11.1, 12.1, 13.2, 15.1, 15.2, 20.1_
  - [x] 2.3 Create hero, events, evolution, and architecture data
    - Create `data/metrics.ts` (five metrics with exact labels/targets), `data/events.ts` (four categories with exact events + notes), `data/evolution.ts` (six items with exact before/after detail strings), `data/architecture.ts` (three tabs with exact item lists), `data/flow.ts` (four ordered layers with `"Layer N:"` labels and exact elements)
    - _Requirements: 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 5.4, 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 20.1_
  - [x] 2.4 Create governance, endorsement, case-study, and labs data
    - Create `data/manifesto.ts` (four cards with exact principles), `data/credentials.ts` (nine certifications), `data/testimonials.ts` (three cards with titles, quotes, LinkedIn placeholders, initials), `data/caseStudies.ts` (three case studies incl. Walmart streaming ML audit pipeline via Kafka event streams wording), `data/labs.ts` (micro-grid with ≥1 `ai-workflow` and ≥1 `fullstack` item, each with non-empty title + descriptor)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.3, 8.4, 8.5, 9.1, 10.1, 10.2, 10.3, 22.1, 22.2, 22.3, 20.1_
  - [x] 2.5 Write property test for the labs dataset invariant
    - `// Feature: executive-portfolio-site, Property 15`
    - **Property 15: Labs dataset covers required kinds with complete fields** — assert the built dataset has ≥1 `kind === "ai-workflow"`, ≥1 `kind === "fullstack"`, and every item has non-empty `title` and `descriptor` (`fast-check` over dataset items, `numRuns: 100`)
    - **Validates: Requirements 22.2, 22.3**

- [x] 3. Implement pure logic modules with property-based tests
  - [x] 3.1 Implement the cost calculator model
    - Create `lib/costModel.ts` with `clamp`, the model constants (`SPANS_PER_USER_PER_SECOND`, `COST_PER_MILLION_SPANS_USD`, `PEAK_EVENT_HOURS_PER_MONTH`, `SECONDS_PER_PEAK_MONTH`, `ERROR_TRACE_RATIO`, `TAIL_HEALTHY_SAMPLE_RATE`, `MTTR_FIDELITY`), and `computeCost(input: CostInput): CostResult` implementing clamp → baseline spans/sec → baseline cost → per-strategy spans/cost/savings, monotonic `savingsPercent` in `[78,82]` for tail, `0` for standard, and constant `99.9` MTTR
    - _Requirements: 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_
  - [x] 3.2 Write property test for concurrency clamping
    - `// Feature: executive-portfolio-site, Property 1`
    - **Property 1: Peak concurrency clamping is bounded and idempotent** — for any real `x`, result `concurrency` ∈ `[5M, 30M]`, equals bounds when out of range, equals `x` when in range, and re-clamping is idempotent (`fc.double`/`fc.integer` incl. out-of-range, `numRuns: 100`)
    - **Validates: Requirements 6.8**
  - [x] 3.3 Write property test for spans-per-second derivation and monotonicity
    - `// Feature: executive-portfolio-site, Property 2`
    - **Property 2: Ingested spans per second is state derived and monotonic** — standard `spansPerSecond === clamp(concurrency) * SPANS_PER_USER_PER_SECOND` and is non-decreasing in concurrency for a fixed strategy (`numRuns: 100`)
    - **Validates: Requirements 6.3, 6.7**
  - [x] 3.4 Write property test for the tail-sampling savings band
    - `// Feature: executive-portfolio-site, Property 3`
    - **Property 3: Tail based sampling savings stay within the target band** — for any concurrency (incl. out-of-range), `computeCost({concurrency, sampling:"tail"}).savingsPercent` ∈ `[78, 82]` (`numRuns: 100`)
    - **Validates: Requirements 6.5**
  - [x] 3.5 Write property test for strategy semantics and determinism
    - `// Feature: executive-portfolio-site, Property 4`
    - **Property 4: Sampling strategy determines savings semantics and computation is deterministic** — equal inputs → equal outputs; standard → `savingsPercent === 0 && savingsUsd === 0`; tail → `savingsPercent ∈ [78,82]` and `savingsUsd > 0` when `baselineCostUsd > 0` (`numRuns: 100`)
    - **Validates: Requirements 6.7, 6.4**
  - [x] 3.6 Write property test for constant MTTR fidelity
    - `// Feature: executive-portfolio-site, Property 5`
    - **Property 5: MTTR fidelity is constant across all inputs** — for any concurrency and any strategy, `mttrFidelityPercent === 99.9` (`numRuns: 100`)
    - **Validates: Requirements 6.6**
  - [x] 3.7 Implement contact validation
    - Create `lib/validation.ts` with `isValidEmail` (trim, reject empty, length ≤254, single-`@`, non-empty local, dotted domain, no whitespace), `validateContact(values): ContactErrors` (errors for each empty required field name/email/message, email format error, optional organization length ≤100), and a `canSubmit(values)` guard returning true iff `validateContact` yields no errors
    - _Requirements: 11.2, 11.3, 11.6, 11.7_
  - [x] 3.8 Write property test for invalid email rejection
    - `// Feature: executive-portfolio-site, Property 6`
    - **Property 6: Invalid email format is rejected and blocks submission** — for any non-valid-email string, `validateContact` returns an `email` error and the submission guard reports not submittable (malformed/no-`@`/whitespace/empty/oversized generators, `numRuns: 100`)
    - **Validates: Requirements 11.6**
  - [x] 3.9 Write property test for empty required-field flagging
    - `// Feature: executive-portfolio-site, Property 7`
    - **Property 7: Every empty required field is flagged and blocks submission** — for any values with one or more of name/email/message empty or whitespace-only, `validateContact` flags each empty required field and the guard reports not submittable (`numRuns: 100`)
    - **Validates: Requirements 11.7**
  - [x] 3.10 Write property test for the submission guard equivalence
    - `// Feature: executive-portfolio-site, Property 8`
    - **Property 8: Submission is permitted if and only if validation passes** — for any contact values, `canSubmit` permits sending exactly when `validateContact` returns no errors, and blocks otherwise (`numRuns: 100`)
    - **Validates: Requirements 11.3, 11.6, 11.7**
  - [x] 3.11 Implement the smooth-scroll helper
    - Create `lib/scroll.ts` with `scrollToSection(id)` that looks up `document.getElementById(id)`; if present, smooth-scrolls so the section top aligns to the navbar bottom (within 1000ms); if absent, returns without scrolling (no-op preserving position)
    - _Requirements: 1.6, 1.7, 2.9, 2.10_
  - [x] 3.12 Write property test for the nonexistent-target no-op
    - `// Feature: executive-portfolio-site, Property 12`
    - **Property 12: Activating a nonexistent nav target preserves scroll position** — for any label whose target element is absent, invoking the handler performs no scroll and leaves position unchanged (mock DOM lookup, spy on scroll, `numRuns: 100`)
    - **Validates: Requirements 1.7**

- [x] 4. Implement shared UI primitives and pure state helpers
  - [x] 4.1 Implement the motion helpers and pure state reducers
    - Create `components/ui/motion.ts` with variants `fadeUp`, `staggerContainer`, `staggerItem` and `useMotionSafe(variant)` returning a static no-op variant when `useReducedMotion()` is true
    - Create pure, DOM-free helpers/reducers for property testing: a mobile-menu toggle reducer, an evolution before/after toggle helper, a tab single-selection helper, and a run-once (animate-at-most-once) latch helper
    - _Requirements: 16.1, 17.4_
  - [x] 4.2 Write property test for reduced-motion no-op selection
    - `// Feature: executive-portfolio-site, Property 14`
    - **Property 14: Reduced motion disables non-essential motion** — for any variant, when reduced-motion is enabled `useMotionSafe` returns the static no-op variant (final state, no transform/opacity transition, no marquee) (`numRuns: 100`)
    - **Validates: Requirements 2.7, 4.9, 9.4, 17.4, 21.9, 22.5**
  - [x] 4.3 Write property test for mobile-menu toggle involution
    - `// Feature: executive-portfolio-site, Property 9`
    - **Property 9: Mobile menu toggle is an involution** — for any initial state and any toggle count `N`, result equals initial when `N` even, opposite when `N` odd (`numRuns: 100`)
    - **Validates: Requirements 1.10, 1.11**
  - [x] 4.4 Write property test for evolution toggle involution
    - `// Feature: executive-portfolio-site, Property 10`
    - **Property 10: Platform evolution Before and After toggle is an involution** — for any item and toggle sequence, one activation shows the opposite state, two restore the original (`numRuns: 100`)
    - **Validates: Requirements 4.8**
  - [x] 4.5 Write property test for tab mutual exclusion
    - `// Feature: executive-portfolio-site, Property 11`
    - **Property 11: Architecture tabs enforce single-panel mutual exclusion** — for any selected tab, exactly one panel is visible (the selected one) and all others hidden (`numRuns: 100`)
    - **Validates: Requirements 5.5**
  - [x] 4.6 Write property test for the animate-once latch
    - `// Feature: executive-portfolio-site, Property 13`
    - **Property 13: Entry and counter animations trigger at most once** — for any sequence of enter/exit events, the run-once latch triggers the animation at most one time (`numRuns: 100`)
    - **Validates: Requirements 2.6, 16.1**
  - [x] 4.7 Implement GlassCard and SectionWrapper
    - Create `components/ui/GlassCard.tsx` (glassmorphism surface, `border-white/10`, optional `glow` emerald/cyan, `interactive` hover glow gated behind `@media (hover: hover)`)
    - Create `components/ui/SectionWrapper.tsx` rendering `<section id>` (or `<article>` via `as`), optional heading/eyebrow, `whileInView` reveal with `once: true`, static under reduced motion, using the motion helpers
    - _Requirements: 3.7, 15.3, 16.1, 17.4, 19.2_
  - [x] 4.8 Implement AnimatedCounter, StatusPill, and ResumeButton
    - Create `components/ui/AnimatedCounter.tsx` (count-up 0→target over 1000–2500ms once ≥50% visible via `useInView({ amount: 0.5, once: true })`, final value immediately under reduced motion, `tabular-nums` + prefix/suffix/decimals formatting)
    - Create `components/ui/StatusPill.tsx` ("Available for Executive & Advisory Roles")
    - Create `components/ui/ResumeButton.tsx` ("Download Resume (PDF)"; HEAD availability check on `/Vasista_Sandeep_Resume.pdf`, opens/downloads on success, graceful fallback modal offering email to `contact@vasistasandeep.in` on 404/error)
    - _Requirements: 1.3, 1.5, 2.5, 2.6, 2.7, 13.1, 13.2, 13.3, 16.3_

- [x] 5. Checkpoint - Ensure logic, data, and primitives pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement navigation and hero sections
  - [x] 6.1 Implement the Navbar
    - Create `components/Navbar.tsx`: fixed top-0 glassmorphism bar with `border-white/10`; monogram + `StatusPill`; center links from `data/navigation.ts` in order calling `scrollToSection` (no-op on missing target); `ResumeButton` + LinkedIn `<a target="_blank" rel="noopener noreferrer">`; `Mobile_Menu` toggle at ≤768px with `aria-expanded`/`aria-controls` showing/hiding link panel and closing on selection; optional IntersectionObserver scroll-spy; relies on `scrollbar-gutter: stable`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 17.1, 17.2, 17.5_
  - [x] 6.2 Implement the Hero
    - Create `components/Hero.tsx`: eyebrow badge, headline, sub-headline (exact strings), `Metric_Strip` of five `AnimatedCounter`s from `data/metrics.ts`, and CTAs "Explore Architecture" (scrolls to `#architecture`) and "Schedule Advisory Chat" (scrolls to `#contact`)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

- [x] 7. Implement the content-display sections
  - [x] 7.1 Implement EventsGrid
    - Create `components/EventsGrid.tsx`: four `GlassCard` categories from `data/events.ts` with staggered entry reveal and pointer-only hover glow
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  - [x] 7.2 Implement Manifesto
    - Create `components/Manifesto.tsx`: four cards from `data/manifesto.ts` with staggered reveal
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  - [x] 7.3 Implement Credentials
    - Create `components/Credentials.tsx`: nine badges from `data/credentials.ts` in a grid/marquee, entry animation on viewport enter, static (no marquee/entry motion) under reduced motion
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [x] 7.4 Implement Testimonials
    - Create `components/Testimonials.tsx`: three `<article>` cards from `data/testimonials.ts` with profile badge, endorsement text, title, LinkedIn placeholder link opening in a new tab, staggered reveal
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 15.3_
  - [x] 7.5 Implement Labs
    - Create `components/Labs.tsx`: compact micro-grid from `data/labs.ts` (title + descriptor per item), staggered reveal, static under reduced motion
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_
  - [x] 7.6 Implement Footer
    - Create `components/Footer.tsx`: exact copyright/attribution string from `data/site.ts`
    - _Requirements: 12.1_

- [x] 8. Implement the interactive sections
  - [x] 8.1 Implement PlatformEvolution
    - Create `components/PlatformEvolution.tsx`: six items from `data/evolution.ts`, per-item Before/After toggle state (using the toggle helper), cross-fade transition, instant swap under reduced motion
    - _Requirements: 4.1, 4.8, 4.9, 14.2, 17.4_
  - [x] 8.2 Implement ArchitectureTabs
    - Create `components/ArchitectureTabs.tsx` on Radix `Tabs`: three tabs from `data/architecture.ts`, single visible panel, distinct active state (emerald/cyan), roving-tabindex keyboard navigation + `aria-selected`
    - _Requirements: 5.1, 5.5, 5.6, 5.7, 14.2, 17.1, 17.2_
  - [x] 8.3 Implement ArchitectureFlowDiagram
    - Create `components/ArchitectureFlowDiagram.tsx`: four ordered layers from `data/flow.ts` top-to-bottom with `"Layer N:"` prefixes, each a focusable keyboard/pointer-operable region applying an active visual state, staggered entry reveal, static under reduced motion
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8, 21.9, 17.1, 17.5_
  - [x] 8.4 Implement CostCalculator
    - Create `components/CostCalculator.tsx`: Radix Slider (min 5M, max 30M, step 1M, `aria-valuetext`) + two-option sampling ToggleGroup (default "Standard 100% Ingestion"), all outputs via `useMemo(computeCost)` (spans/sec, savings %/$), always-visible "99.9% MTTR fidelity preserved" statement, clamped inputs, recompute <200ms
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 14.2, 17.1, 17.2_
  - [x] 8.5 Implement CaseStudyDrawer
    - Create `components/CaseStudyDrawer.tsx`: three trigger `<article>` cards from `data/caseStudies.ts`, Radix `Dialog` right-side slide-over (focus trap, inert background overlay, Escape closes + returns focus to trigger, open/close within 300ms), Walmart Kafka streaming ML audit wording
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 14.2, 15.3, 17.1, 17.2_
  - [x] 8.6 Implement Contact
    - Create `components/Contact.tsx`: direct-channels column (LinkedIn, mailto `contact@vasistasandeep.in`, Bengaluru location line) + `Contact_Form` with Name/Work Email/Organization/Message fields (maxLength 100/254/100/2000), `validateContact` gate, `pending` state, Formspree POST wrapped in `AbortController` 30s timeout (cleared in `finally`), `success` on 200, `error` + mailto fallback (`vasista.sandeep@gmail.com`) on non-OK/network/abort
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 14.2, 17.1, 17.2_

- [x] 9. Checkpoint - Ensure all section components render and pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Compose the layout, page, and SEO/JSON-LD
  - [x] 10.1 Implement the root layout with metadata, OpenGraph, JSON-LD, fonts, and background
    - Create `app/layout.tsx` (RSC): export `metadata` (title, description, `metadataBase`, `openGraph` with siteName/url/images/type, twitter card); embed JSON-LD `Person` + `ProfilePage` `<script type="application/ld+json">` from `data/site.ts`; load Geist Sans (fallback Inter) via `next/font`; apply `.bg-grid` global background; render `Navbar` and `Footer` around children
    - _Requirements: 15.1, 15.2, 16.2, 16.3, 19.1, 19.4_
  - [x] 10.2 Compose the page with grouped section IDs
    - Create `app/page.tsx` (RSC): a single `<main>` composing sections in order with grouped IDs — `#overview` (Hero), `#tournaments` (EventsGrid), `#architecture` wrapping ArchitectureFlowDiagram + ArchitectureTabs, `#case-studies` wrapping PlatformEvolution + CaseStudyDrawer, `#governance` wrapping Manifesto + Credentials, `#endorsements` (Testimonials), `#contact` (Contact), plus Labs; section `id`s match nav `targetId`s
    - _Requirements: 1.4, 1.6, 15.3_

- [x] 11. Responsive and design-system polish
  - [x] 11.1 Apply responsive layout across sections
    - Ensure multi-column grids (events, manifesto, testimonials, labs, calculator two-column, contact two-column) collapse to single column at the mobile breakpoint; navbar center links at `md+` and mobile menu at ≤768px; clamp-based fluid heading/spacing for hero and metric strip
    - _Requirements: 18.1, 18.2, 1.9_
  - [x] 11.2 Apply focus-visible, contrast, and design tokens
    - Add global `:focus-visible` ring (emerald/cyan) on interactive elements; verify white headings / slate-400 body / accent-on-dark token pairs target WCAG AA contrast; apply glow shadows and `.bg-grid` texture consistently
    - _Requirements: 17.3, 17.5, 19.2, 19.3, 19.4_

- [x] 12. Example, interaction, integration, and accessibility test suites
  - [x] 12.1 Write example/unit tests for fixed content and cost-calculator cases
    - Assert exact strings for EventsGrid, Evolution details, Tab items, Manifesto, Credentials, Testimonials, Flow layers/elements, Footer, and Hero copy; cost calculator min (5M) and max (30M) under both strategies (spans/sec, cost, savings, always-present 99.9% MTTR); counter final-value on intersection; resume available vs 404 fallback
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.2, 5.3, 5.4, 6.1, 7.1, 9.1, 10.1, 12.1, 13.1, 13.3, 21.1, 21.2, 21.3, 21.4, 21.5_
  - [x] 12.2 Write interaction/component tests
    - Navbar (link scrolls to existing section, missing-target no-op, LinkedIn new tab, mobile menu toggle at ≤768px); ArchitectureTabs (pointer + keyboard arrow/Enter/Space); CaseStudyDrawer (open on activation, focus trap, Escape closes + returns focus, background non-interactive); CostCalculator (slider + toggle drive recompute); ArchitectureFlowDiagram (pointer/keyboard active state)
    - _Requirements: 1.6, 1.7, 1.8, 1.10, 1.11, 5.5, 5.6, 5.7, 6.3, 6.4, 8.2, 8.6, 8.7, 8.8, 8.9, 21.7_
  - [x] 12.3 Write integration tests with mocked Formspree
    - Mock `fetch`: resolve 200 (success + pending shown in-flight), reject/non-OK (error + mailto fallback), abort after 30s (timeout → error + fallback); 1–3 representative cases each
    - _Requirements: 11.4, 11.5, 11.8, 11.9_
  - [x] 12.4 Write accessibility tests
    - `jest-axe` no-violations on the page and key interactive components; keyboard-only traversal of nav/tabs/slider/drawer/form; ARIA presence on Mobile_Menu/Tabs/Dialog/slider; visible focus indicator assertions; automated contrast checks on token pairs (note manual WCAG AA review still required)
    - _Requirements: 17.1, 17.2, 17.3, 17.5_
  - [x] 12.5 Write smoke/static checks
    - Assert exported `metadata` includes title/description/`openGraph`; page renders exactly one `<main>` and a `<section>` per content area; no server API routes with secrets (only client-side Formspree fetch)
    - _Requirements: 15.1, 15.3, 20.2_

- [x] 13. Deployment-readiness verification
  - [x] 13.1 Add resume and OG image placeholders and configure the Formspree endpoint
    - Add placeholder `public/Vasista_Sandeep_Resume.pdf` and `public/og-image.png` (1200×630); wire `SiteMeta.formspreeEndpoint` in `data/site.ts` (documented as a public, non-secret form URL)
    - _Requirements: 13.2, 15.1, 20.2, 20.3_
  - [x] 13.2 Run the production build and full test suite
    - Run `next build` and `vitest --run`; fix any type, build, or test failures so the project is zero-config deploy-ready to Vercel
    - _Requirements: 20.3_

- [x] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test/verification sub-tasks and can be skipped for a faster MVP; core implementation tasks are never marked optional.
- Each task references specific requirement clauses (and, for property tests, a design correctness property) for traceability.
- All 15 correctness properties are covered exactly once by dedicated property-based test tasks (2.5, 3.2–3.6, 3.8–3.10, 3.12, 4.2–4.6), each tagged `// Feature: executive-portfolio-site, Property N` and configured for at least 100 `fast-check` iterations.
- State-driven UI properties (9–13) are tested against pure reducers/helpers extracted in task 4.1, with thin component tests (12.2) confirming the wiring.
- Checkpoints (5, 9, 14) provide incremental validation boundaries.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4"] },
    { "id": 4, "tasks": ["2.5", "3.1", "3.7", "3.11", "4.1"] },
    { "id": 5, "tasks": ["3.2", "3.3", "3.4", "3.5", "3.6", "3.8", "3.9", "3.10", "3.12", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8"] },
    { "id": 6, "tasks": ["6.1", "6.2", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "8.1", "8.2", "8.3", "8.4", "8.5", "8.6"] },
    { "id": 7, "tasks": ["10.1", "10.2"] },
    { "id": 8, "tasks": ["11.1", "11.2"] },
    { "id": 9, "tasks": ["12.1", "12.2", "12.3", "12.4", "12.5", "13.1"] },
    { "id": 10, "tasks": ["13.2"] }
  ]
}
```
