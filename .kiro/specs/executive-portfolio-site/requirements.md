# Requirements Document

## Introduction

This document defines the requirements for a world-class, production-ready personal portfolio and executive technical leadership website for Vasista Sandeep, hosted at vasistasandeep.in. The site presents 14+ years of platform architecture leadership across high-concurrency streaming platforms, positioning the individual for executive and advisory roles.

The site is a single-page, section-based application built with Next.js (App Router), Tailwind CSS with Radix/Shadcn UI primitives, Framer Motion animations, and Lucide React icons. It is dark-mode-first with a Tier-1 Silicon Valley platform aesthetic. It must be ultra-performant, fully accessible (WCAG), responsive across desktop/tablet/mobile, SEO-optimized, and deploy-ready to Vercel with all copy pre-populated. The site contains no server-side secrets; the contact form uses a Formspree endpoint with a mailto fallback.

## Glossary

- **Portfolio_Site**: The complete Next.js web application hosted at vasistasandeep.in.
- **Navbar**: The sticky glassmorphism navigation bar rendered at the top of the viewport.
- **Status_Pill**: The availability indicator displaying "Available for Executive & Advisory Roles".
- **Hero_Section**: The primary above-the-fold section containing the headline, sub-headline, metric strip, and CTAs.
- **Metric_Strip**: The set of animated numeric counters displayed in the Hero_Section.
- **Events_Grid**: The High-Concurrency Arena section presenting marquee sports and live events.
- **Platform_Evolution**: The interactive Before vs After / Evolution section with six architectural upgrade items.
- **Architecture_Tabs**: The tabbed Architectural Playbook & Observability Toolkit section.
- **Cost_Calculator**: The interactive Telemetry & Sampling Cost Calculator widget.
- **Manifesto_Section**: The Platform Leadership Manifesto four-card grid.
- **Case_Study_Drawer**: The slide-over modal/drawer component presenting expanded case studies.
- **Credentials_Bar**: The Credentials & Governance section presenting certifications.
- **Testimonials_Section**: The Leadership Endorsements & Peer Validation section.
- **Contact_Section**: The Executive Contact & Advisory Inquiries section.
- **Contact_Form**: The form within the Contact_Section submitting to Formspree.
- **Footer**: The bottom section containing copyright and attribution text.
- **Mobile_Menu**: The responsive collapsible navigation menu shown on small viewports.
- **Formspree_Endpoint**: The external Formspree URL to which the Contact_Form submits.
- **Reduced_Motion_Preference**: The user's operating system or browser `prefers-reduced-motion` setting.
- **Smooth_Scroll**: Animated scrolling that moves the viewport to a target section anchor.
- **WCAG**: Web Content Accessibility Guidelines, level AA, used as the accessibility conformance target.
- **OpenGraph_Metadata**: The `og:` meta tags plus title, description, and JSON-LD structured data used for link previews, knowledge panels, and SEO.
- **Architecture_Flow_Diagram**: The interactive visual 4-layer system sequence diagram depicting the client-to-persistence request flow.
- **Labs_Showcase**: The compact "Labs & Builder Mindset" micro-grid presenting active generative AI and modern platform prototypes.

## Requirements

### Requirement 1: Sticky Glassmorphism Navbar

**User Story:** As a visitor, I want a persistent navigation bar, so that I can move between sections and access primary actions from anywhere on the page.

#### Acceptance Criteria

1. WHILE the visitor scrolls the Portfolio_Site, THE Navbar SHALL remain fixed at zero vertical offset from the top edge of the viewport.
2. THE Navbar SHALL display a monogram label "Vasista Sandeep" on the left side.
3. THE Navbar SHALL display the Status_Pill with the text "Available for Executive & Advisory Roles" on the left side adjacent to the monogram.
4. THE Navbar SHALL display center navigation links mapped to explicit section IDs in the following exact left-to-right order: "Overview" to `#overview` (Hero_Section); "Scale & Tournaments" to `#tournaments` (Events_Grid); "Architecture" to `#architecture` (Architecture_Flow_Diagram and Architecture_Tabs); "Case Studies" to `#case-studies` (Platform_Evolution and Case_Study_Drawer); "Governance" to `#governance` (Manifesto_Section and Credentials_Bar); "Endorsements" to `#endorsements` (Testimonials_Section); "Contact" to `#contact` (Contact_Section).
5. THE Navbar SHALL display a "Download Resume (PDF)" action and a LinkedIn icon button on the right side.
6. WHEN a visitor activates a center navigation link whose target section exists, THE Portfolio_Site SHALL Smooth_Scroll the viewport to that section within 1000 milliseconds so the section top aligns with the Navbar bottom edge.
7. IF a visitor activates a center navigation link whose target section does not exist, THEN THE Portfolio_Site SHALL preserve the current scroll position without navigation.
8. WHEN a visitor activates the LinkedIn icon button, THE Portfolio_Site SHALL open https://www.linkedin.com/in/vasistasandeep/ in a new browser tab using `rel="noopener noreferrer"` while retaining the current tab.
9. WHERE the viewport width is at or below 768 pixels, THE Navbar SHALL render a Mobile_Menu toggle control in place of the center navigation links.
10. WHEN a visitor activates the Mobile_Menu toggle control WHILE the Mobile_Menu is hidden, THE Navbar SHALL show the Mobile_Menu containing the navigation links.
11. WHEN a visitor activates the Mobile_Menu toggle control WHILE the Mobile_Menu is shown, THE Navbar SHALL hide the Mobile_Menu.
12. THE Navbar SHALL apply a glassmorphism visual style with a border of color white at 10 percent opacity and SHALL prevent layout shift during modal scroll lock via `scrollbar-gutter: stable`.

### Requirement 2: Hero Section with Animated Metrics

**User Story:** As a visitor, I want an impactful hero section, so that I immediately understand the value proposition and can navigate to key content.

#### Acceptance Criteria

1. THE Hero_Section SHALL display an eyebrow badge with the text "Platform Architecture • High-Concurrency Distributed Systems • Observability".
2. THE Hero_Section SHALL display the headline "Engineering Resilience & Scale for Global Streaming Platforms."
3. THE Hero_Section SHALL display the sub-headline "14+ years architecting distributed platforms, OTT media supply chains, and enterprise data transformations across 30M+ peak concurrent users."
4. THE Metric_Strip SHALL display five metrics with the labels and target values: "14+ Years Technical Leadership", "30M+ Peak Concurrent Viewers", "250K Requests Per Second", "99.99% System Availability", and "40% Reduction in Publishing Latency".
5. WHEN the Metric_Strip becomes at least 50 percent visible in the viewport, THE Metric_Strip SHALL animate each numeric counter from zero to its target value over a duration between 1000 and 2500 milliseconds.
6. THE Metric_Strip SHALL animate its counters one time only and SHALL NOT re-run the counter animation on subsequent viewport entries.
7. WHILE Reduced_Motion_Preference is enabled, THE Metric_Strip SHALL display each metric at its final target value without counter animation.
8. THE Hero_Section SHALL display a primary CTA labeled "Explore Architecture" and a secondary CTA labeled "Schedule Advisory Chat".
9. WHEN a visitor activates the "Explore Architecture" CTA, THE Portfolio_Site SHALL Smooth_Scroll the viewport to the Architecture_Tabs section within 1000 milliseconds.
10. WHEN a visitor activates the "Schedule Advisory Chat" CTA, THE Portfolio_Site SHALL Smooth_Scroll the viewport to the Contact_Section within 1000 milliseconds.

### Requirement 3: High-Concurrency Arena (Events Grid)

**User Story:** As a technical evaluator, I want to see marquee live-event experience, so that I can assess the scale of platforms delivered.

#### Acceptance Criteria

1. THE Events_Grid SHALL display four event categories: "Cricket", "Football", "Multi-Sport & Tennis Slams", and "Entertainment & Combat Sports".
2. THE Events_Grid SHALL display for the Cricket category the events "India Bilateral Tours vs England, Australia, and South Africa", "ACC Asia Cup", and "The Hundred", and the scale note "0 to 250K RPS spikes in under 60 seconds".
3. THE Events_Grid SHALL display for the Football category the events "UEFA Champions League Final", "UEFA Europa League Final", "UEFA Euro", and "FA Cup", and the note "zero-buffer 1080p and 4K adaptive bitrate".
4. THE Events_Grid SHALL display for the Multi-Sport & Tennis Slams category the events "Tokyo Olympics", "Asian Games", "Australian Open", "Roland Garros", and "US Open", and the note "15+ simultaneous live feeds with multi-language metadata".
5. THE Events_Grid SHALL display for the Entertainment & Combat Sports category the events "WWE WrestleMania", "WWE SummerSlam", "UFC Fight Nights", and "KBC Play Along real-time interactive low-latency sync".
6. WHEN the Events_Grid enters the viewport, THE Events_Grid SHALL reveal its cards with a staggered entry animation.
7. WHEN a visitor hovers over an Events_Grid card using a pointer device, THE Events_Grid SHALL apply an interactive hover glow effect to that card.

### Requirement 4: Platform Evolution and Architectural Upgrades

**User Story:** As a technical evaluator, I want to see before-and-after architectural transformations, so that I can understand the depth of platform modernization delivered.

#### Acceptance Criteria

1. THE Platform_Evolution SHALL display six evolution items titled "Monolith to Cloud-Native Microservices", "Proprietary Bolt CMS", "GDFO Graceful Degradation and Fallback Operations", "Multi-Region Global Footprint", "SSAI/DAI Ad Monetization", and "Unified Observability".
2. THE Platform_Evolution SHALL display for "Monolith to Cloud-Native Microservices" the detail referencing gRPC, Kafka, and the Playback, Listing, Subscription, and XDR domains.
3. THE Platform_Evolution SHALL display for "Proprietary Bolt CMS" the detail referencing replacement of vendor lock-in, a 40 percent publishing latency reduction, and multi-million OPEX savings.
4. THE Platform_Evolution SHALL display for "GDFO Graceful Degradation and Fallback Operations" the detail referencing the Architecture Control Committee policies, Envoy and Resilience4j circuit breakers, shedding non-critical features during surges, and eliminating the 3-minute autoscaling provisioning lag.
5. THE Platform_Evolution SHALL display for "Multi-Region Global Footprint" the detail referencing regional data isolation for EU/GDPR, US, and Japan launches.
6. THE Platform_Evolution SHALL display for "SSAI/DAI Ad Monetization" the detail referencing server-side ad insertion, real-time SCTE-35 marker detection, ad revenue protection, and buffering elimination.
7. THE Platform_Evolution SHALL display for "Unified Observability" the detail referencing OpenTelemetry pipelines, tail-based sampling, MTTR reduction, and telemetry cost optimization.
8. WHEN a visitor interacts with an evolution item's Before/After control, THE Platform_Evolution SHALL toggle the displayed content between the Before state and the After state for that item.
9. WHILE Reduced_Motion_Preference is enabled, THE Platform_Evolution SHALL perform state transitions without motion-based animation.

### Requirement 5: Architectural Playbook and Observability Toolkit Tabs

**User Story:** As a technical evaluator, I want a categorized playbook of patterns and tools, so that I can quickly review technical depth by domain.

#### Acceptance Criteria

1. THE Architecture_Tabs SHALL display three tabs labeled "System Design Patterns", "Observability & Telemetry (MELT)", and "Video Streaming QoE".
2. THE Architecture_Tabs SHALL display for "System Design Patterns" the items Circuit Breakers, Token-Bucket Rate Limiting, Database-per-service isolation, Multi-CDN Origin Shielding, and Redis pre-warming.
3. THE Architecture_Tabs SHALL display for "Observability & Telemetry (MELT)" the items OpenTelemetry, Prometheus, Grafana, Datadog, Splunk, ELK, Jaeger tracing, and SLO burn-rate alerts.
4. THE Architecture_Tabs SHALL display for "Video Streaming QoE" the items VST, VSFT, VPF, EBVS, DAI/SSAI manifest stitching, and Continue Watching / XDR cross-device resume.
5. WHEN a visitor selects a tab, THE Architecture_Tabs SHALL display the content panel associated with that tab and hide the other content panels.
6. THE Architecture_Tabs SHALL indicate the currently selected tab with a distinct active visual state.
7. WHEN a visitor navigates the tab controls using the keyboard, THE Architecture_Tabs SHALL move focus between tabs and allow selection via keyboard activation.

### Requirement 6: Interactive Telemetry and Sampling Cost Calculator

**User Story:** As a technical evaluator, I want an interactive cost calculator, so that I can see the quantified impact of intelligent sampling strategies.

#### Acceptance Criteria

1. THE Cost_Calculator SHALL provide a Peak Concurrency slider with a minimum value of 5,000,000 users, a maximum value of 30,000,000 users, and a step increment of 1,000,000 users.
2. THE Cost_Calculator SHALL provide a Sampling Strategy toggle offering exactly two selectable options: "Standard 100% Ingestion" and "Tail-Based Intelligent Sampling (100% errors / 1% healthy)", with "Standard 100% Ingestion" selected as the default on initial load.
3. WHEN a visitor changes the Peak Concurrency slider value, THE Cost_Calculator SHALL recompute and display the resulting Ingested Spans Per Second within 200 milliseconds using React state.
4. WHEN a visitor changes the Sampling Strategy toggle, THE Cost_Calculator SHALL recompute and display the estimated cloud APM cost savings as a currency value and percentage within 200 milliseconds using React state.
5. WHILE the Sampling Strategy toggle is set to "Tail-Based Intelligent Sampling (100% errors / 1% healthy)", THE Cost_Calculator SHALL display an estimated cost reduction between 78 percent and 82 percent inclusive.
6. THE Cost_Calculator SHALL display the static statement that 99.9 percent MTTR fidelity is preserved and SHALL keep this statement visible for all slider and toggle input combinations.
7. THE Cost_Calculator SHALL derive all displayed values from React state driven by the slider and toggle inputs, and SHALL display no hardcoded output values independent of that state.
8. IF the Peak Concurrency slider receives a value outside the range of 5,000,000 to 30,000,000 users, THEN THE Cost_Calculator SHALL clamp the value to the nearest bound and recompute all displayed values from the clamped value.

### Requirement 7: Platform Leadership Manifesto

**User Story:** As an executive stakeholder, I want a concise leadership philosophy, so that I can assess engineering governance principles.

#### Acceptance Criteria

1. THE Manifesto_Section SHALL display four cards titled "Telemetry Precedes Features", "Graceful Degradation Over Total Outage", "Error Budgets Dictate Velocity", and "Multi-Region by Design".
2. THE Manifesto_Section SHALL display for "Telemetry Precedes Features" the principle that no service ships without OpenTelemetry instrumentation, SLIs, and SLO alert routing.
3. THE Manifesto_Section SHALL display for "Graceful Degradation Over Total Outage" the principle that survivability is engineered at the edge and non-critical dependencies fail safely.
4. THE Manifesto_Section SHALL display for "Error Budgets Dictate Velocity" the principle that the balance of tech debt versus feature delivery is governed by SLO thresholds.
5. THE Manifesto_Section SHALL display for "Multi-Region by Design" the principle that data residency for GDPR/PII and localization are baseline requirements.
6. WHEN the Manifesto_Section enters the viewport, THE Manifesto_Section SHALL reveal its cards with a staggered entry animation.

### Requirement 8: Expanded Case Study Drawers

**User Story:** As a technical evaluator, I want detailed case studies in an accessible drawer, so that I can review in-depth problem-solving without leaving the page.

#### Acceptance Criteria

1. THE Case_Study_Drawer section SHALL display three case study cards titled "Tournament Concurrency at 250K RPS", "Bolt CMS and Global Expansion", and "Walmart FinTech Anomaly Engine".
2. WHEN a visitor activates a case study card, THE Case_Study_Drawer SHALL open a slide-over drawer displaying the expanded content for that case study with an open animation completing within 300 milliseconds.
3. THE Case_Study_Drawer SHALL display for "Tournament Concurrency at 250K RPS" the details of mitigating the 3-minute auto-scale lag, pre-warming Redis, and GDFO circuit breakers.
4. THE Case_Study_Drawer SHALL display for "Bolt CMS and Global Expansion" the details of the build versus buy decision, a 40 percent latency reduction, and GDPR, US, and Japan compliance.
5. THE Case_Study_Drawer SHALL display for "Walmart FinTech Anomaly Engine" the details of a streaming ML audit pipeline using Kafka event streams to detect financial anomalies in real time, recovering millions in revenue leakage.
6. WHILE the Case_Study_Drawer is open, THE Case_Study_Drawer SHALL trap keyboard focus within the drawer.
7. WHILE the Case_Study_Drawer is open, THE Case_Study_Drawer SHALL prevent interaction with page content behind the drawer.
8. WHEN a visitor presses the Escape key WHILE the Case_Study_Drawer is open, THE Case_Study_Drawer SHALL close and return focus to the card that opened it.
9. WHEN a visitor activates the drawer close control, THE Case_Study_Drawer SHALL close the drawer with a close animation completing within 300 milliseconds and return focus to the card that opened it.

### Requirement 9: Credentials and Governance Bar

**User Story:** As an executive stakeholder, I want to see verified certifications, so that I can validate professional credentials.

#### Acceptance Criteria

1. THE Credentials_Bar SHALL display the certifications "PMP®", "KPMG Lean Six Sigma Black Belt (LSSBB)", "Lean Six Sigma Green Belt", "Certified ScrumMaster (CSM®)", "Certified Scrum Product Owner (CSPO®)", "SAFe® 5 DevOps Practitioner", "ITIL® Certified", "Executive Education MBA in E-Business", and "PG in Big Data Analytics".
2. THE Credentials_Bar SHALL present the certifications in a badge grid or marquee layout.
3. WHEN the Credentials_Bar enters the viewport, THE Credentials_Bar SHALL reveal its badges with an entry animation.
4. WHILE Reduced_Motion_Preference is enabled, THE Credentials_Bar SHALL display all badges statically without marquee or entry motion.

### Requirement 10: Leadership Endorsements and Peer Validation

**User Story:** As an executive stakeholder, I want peer testimonials, so that I can gauge credibility from senior leaders.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL display three testimonial cards attributed to the executive titles "VP of Engineering & Cloud Infrastructure", "Head of Product & Growth", and "Global Delivery Director".
2. THE Testimonials_Section SHALL display for each testimonial card a profile badge, the endorsement text, and the executive title.
3. THE Testimonials_Section SHALL display for each testimonial card a LinkedIn placeholder link.
4. WHEN a visitor activates a testimonial LinkedIn placeholder link, THE Portfolio_Site SHALL open the linked URL in a new browser tab.
5. WHEN the Testimonials_Section enters the viewport, THE Testimonials_Section SHALL reveal its cards with a staggered entry animation.

### Requirement 11: Executive Contact and Advisory Inquiries

**User Story:** As an executive stakeholder, I want direct contact channels and a form, so that I can initiate an advisory conversation.

#### Acceptance Criteria

1. THE Contact_Section SHALL display a direct-channels column containing a LinkedIn link to https://www.linkedin.com/in/vasistasandeep/, a mailto button for contact@vasistasandeep.in, and the location line "Bengaluru, India (Open to Global Leadership & Advisory Roles)".
2. THE Contact_Form SHALL provide input fields labeled "Name", "Work Email", "Organization", and "Message", where "Name", "Work Email", and "Message" are required and "Organization" is optional, with "Name" and "Organization" accepting up to 100 characters each, "Work Email" accepting up to 254 characters, and "Message" accepting up to 2000 characters.
3. WHEN a visitor submits the Contact_Form with all required fields ("Name", "Work Email", "Message") completed and "Work Email" in a valid email format, THE Contact_Form SHALL send the submission to the Formspree_Endpoint.
4. WHEN the Formspree_Endpoint returns a successful response, THE Contact_Form SHALL display a success feedback state indicating the message was sent.
5. IF the Formspree_Endpoint returns an error response, THEN THE Contact_Form SHALL display an error feedback state and present a mailto fallback to contact@vasistasandeep.in with fallback address vasista.sandeep@gmail.com.
6. IF a visitor submits the Contact_Form with the "Work Email" field containing a value that is not a valid email format, THEN THE Contact_Form SHALL display a validation message identifying the "Work Email" field and prevent submission.
7. IF a visitor submits the Contact_Form with any required field ("Name", "Work Email", or "Message") empty, THEN THE Contact_Form SHALL display a validation message identifying each empty required field and prevent submission.
8. WHILE the Contact_Form submission is in progress, THE Contact_Form SHALL display a pending state that indicates the submission is being processed.
9. IF the Formspree_Endpoint does not return a response within 30 seconds of submission, THEN THE Contact_Form SHALL exit the pending state, display an error feedback state, and present a mailto fallback to contact@vasistasandeep.in with fallback address vasista.sandeep@gmail.com.

### Requirement 12: Footer

**User Story:** As a visitor, I want a footer with attribution, so that I can confirm site ownership and identity.

#### Acceptance Criteria

1. THE Footer SHALL display the text "© 2026 Vasista Sandeep Srinivasa • vasistasandeep.in • Built with Next.js, Tailwind & OpenTelemetry Mental Models."

### Requirement 13: Resume Download

**User Story:** As a recruiter, I want to download the resume, so that I can review qualifications offline.

#### Acceptance Criteria

1. WHEN a visitor activates the "Download Resume (PDF)" action, THE Portfolio_Site SHALL open or download the file located at /Vasista_Sandeep_Resume.pdf.
2. THE Portfolio_Site SHALL reference the resume file at the path /Vasista_Sandeep_Resume.pdf served from the public directory.
3. IF a visitor activates the "Download Resume (PDF)" action and the file /Vasista_Sandeep_Resume.pdf is not found or fails to load, THEN THE Portfolio_Site SHALL present a graceful modal or notification offering the visitor to request the resume by email to contact@vasistasandeep.in.

### Requirement 14: Component Modularity

**User Story:** As a maintainer, I want modular components, so that the site is easy to extend and maintain.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL implement the sections as separate components named Navbar.tsx, Hero.tsx, EventsGrid.tsx, PlatformEvolution.tsx, ArchitectureTabs.tsx, CostCalculator.tsx, Manifesto.tsx, CaseStudyDrawer.tsx, Credentials.tsx, Testimonials.tsx, and Contact.tsx.
2. THE Portfolio_Site SHALL manage all interactive states for toggles, sliders, drawers, tabs, counters, and the Mobile_Menu using React state.

### Requirement 15: SEO and Semantic Markup

**User Story:** As a visitor sharing the site, I want rich link previews and discoverable content, so that the site presents professionally when shared and ranks in search.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL define OpenGraph_Metadata including title, description, and og: tags in the App Router metadata.
2. THE Portfolio_Site SHALL embed JSON-LD structured data of types Person and ProfilePage in the root layout.
3. THE Portfolio_Site SHALL structure its content using semantic HTML elements including a single `<main>` element, `<section>` elements with IDs matching the navigation targets, and `<article>` elements for case studies and testimonials.

### Requirement 16: Performance

**User Story:** As a visitor, I want the site to load and animate smoothly, so that the experience feels fast and polished.

#### Acceptance Criteria

1. WHEN a section with entry animation enters the viewport, THE Portfolio_Site SHALL trigger that animation one time using a viewport once configuration.
2. THE Portfolio_Site SHALL serve optimized image and font assets.
3. THE Portfolio_Site SHALL load the Inter or Geist Sans font family and apply tabular-nums styling to numeric metric displays.

### Requirement 17: Accessibility

**User Story:** As a visitor using assistive technology, I want an accessible site, so that I can navigate and understand all content.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL support keyboard navigation for all interactive controls including navigation links, tabs, toggles, sliders, drawers, and form fields.
2. THE Portfolio_Site SHALL provide ARIA attributes for interactive components including the Mobile_Menu, Architecture_Tabs, Case_Study_Drawer, and Cost_Calculator controls.
3. THE Portfolio_Site SHALL meet WCAG level AA color contrast ratios for text and interactive elements against the dark background.
4. WHILE Reduced_Motion_Preference is enabled, THE Portfolio_Site SHALL disable or reduce non-essential motion animations across all sections.
5. WHEN a visitor moves focus to an interactive control using the keyboard, THE Portfolio_Site SHALL display a visible focus indicator on that control.

### Requirement 18: Responsive Layout

**User Story:** As a visitor on any device, I want a responsive layout, so that the site is usable on desktop, tablet, and mobile.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a usable layout at desktop, tablet, and mobile viewport widths.
2. WHERE the viewport width is at the mobile breakpoint, THE Portfolio_Site SHALL adapt multi-column layouts into stacked single-column layouts.

### Requirement 19: Visual Design System

**User Story:** As a visitor, I want a cohesive premium aesthetic, so that the site conveys executive-level credibility.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a dark-mode-first theme using an obsidian or slate-950 background.
2. THE Portfolio_Site SHALL style cards with a glassmorphism treatment and borders of color white at 10 percent opacity.
3. THE Portfolio_Site SHALL apply emerald and cyan accent glow colors, crisp white headings, and slate-400 body text.
4. THE Portfolio_Site SHALL apply subtle grid texture treatments to background surfaces.

### Requirement 20: Deployment Readiness

**User Story:** As the site owner, I want the site to be deploy-ready to Vercel, so that publishing requires no additional configuration or secrets.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL pre-populate all copy and technical data so that the deployed site displays complete content without additional data entry.
2. THE Portfolio_Site SHALL operate without any server-side API secrets or backend services beyond the client-side Formspree_Endpoint submission.
3. THE Portfolio_Site SHALL be structured for zero-config deployment to Vercel targeting the domain vasistasandeep.in.

### Requirement 21: Interactive 4-Layer Architecture Flow Diagram

**User Story:** As a technical evaluator, I want an interactive layered architecture diagram, so that I can understand the end-to-end request flow from client to persistence.

#### Acceptance Criteria

1. THE Architecture_Flow_Diagram SHALL render four ordered layers labeled "Layer 1: Client & Edge", "Layer 2: API Gateway & SSAI Proxy", "Layer 3: Decoupled Domain Microservices", and "Layer 4: Persistence & Caching".
2. THE Architecture_Flow_Diagram SHALL display for the "Client & Edge" layer the elements Player SDKs, Multi-CDN Steering, and Token-Bucket Rate Limiting.
3. THE Architecture_Flow_Diagram SHALL display for the "API Gateway & SSAI Proxy" layer the elements Manifest manipulation, SCTE-35 marker detection, and Auth.
4. THE Architecture_Flow_Diagram SHALL display for the "Decoupled Domain Microservices" layer the elements Playback, Listing, Subscription, and XDR Continue Watching.
5. THE Architecture_Flow_Diagram SHALL display for the "Persistence & Caching" layer the elements Multi-cluster Redis pre-warming, Database-per-service, and Kafka event bus.
6. THE Architecture_Flow_Diagram SHALL present the four layers in top-to-bottom or client-to-persistence sequence order.
7. WHEN a visitor interacts with a layer or layer element using a pointer or keyboard, THE Architecture_Flow_Diagram SHALL apply an interactive visual state indicating the active layer or element.
8. WHEN the Architecture_Flow_Diagram enters the viewport, THE Architecture_Flow_Diagram SHALL reveal its layers with an entry animation.
9. WHILE Reduced_Motion_Preference is enabled, THE Architecture_Flow_Diagram SHALL display all layers statically without entry or transition motion.

### Requirement 22: Labs and Builder Mindset Showcase

**User Story:** As a technical evaluator, I want to see active prototypes and experiments, so that I can gauge hands-on builder capability with modern platforms and generative AI.

#### Acceptance Criteria

1. THE Labs_Showcase SHALL display a compact micro-grid presenting active generative AI and modern platform prototypes.
2. THE Labs_Showcase SHALL display at least one item representing an AI-automated workflow pipeline and at least one item representing a full-stack React/Node/Redis build.
3. THE Labs_Showcase SHALL display for each showcase item a title and a short descriptor.
4. WHEN the Labs_Showcase enters the viewport, THE Labs_Showcase SHALL reveal its items with a staggered entry animation.
5. WHILE Reduced_Motion_Preference is enabled, THE Labs_Showcase SHALL display all items statically without entry motion.
