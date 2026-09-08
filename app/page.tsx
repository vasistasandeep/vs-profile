// app/page.tsx
//
// Home page (React Server Component). Composes every section inside a single
// <main> element (Req 15.3) in the required order, applying the grouped
// section ids from the design's "Navigation Anchor Hierarchy" so that each
// anchor matches a nav `targetId` and smooth-scroll navigation resolves
// (Req 1.4, 1.6).
//
// Anchor map:
//   #overview     -> Hero              (Hero renders its own <section id="overview">)
//   #experience   -> Experience        (renders its own <section id="experience">)
//   #tournaments  -> EventsGrid        (renders its own <section id="tournaments">)
//   #architecture -> <section> group   (ArchitectureFlowDiagram + ArchitectureTabs + CostCalculator)
//   #case-studies -> <section> group   (PlatformEvolution + CaseStudyDrawer)
//   #governance   -> <section> group   (Manifesto + Credentials)
//   #education    -> Education          (renders its own <section id="education">)
//   #endorsements -> Testimonials      (renders its own <section id="endorsements">)
//   #contact      -> Contact           (renders its own <section id="contact">)
//   #labs         -> Labs              (renders its own <section id="labs">)
//   #arcade       -> Arcade            (renders its own <section id="arcade">)
//
// Grouped sections carry `scroll-mt-24` so the smooth-scroll offset clears the
// fixed navbar. Components that own their SectionWrapper are rendered directly
// and must NOT be double-wrapped.

import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import EventsGrid from "@/components/EventsGrid";
import ArchitectureFlowDiagram from "@/components/ArchitectureFlowDiagram";
import ArchitectureTabs from "@/components/ArchitectureTabs";
import CostCalculator from "@/components/CostCalculator";
import PlatformEvolution from "@/components/PlatformEvolution";
import CaseStudyDrawer from "@/components/CaseStudyDrawer";
import Manifesto from "@/components/Manifesto";
import Credentials from "@/components/Credentials";
import Education from "@/components/Education";
import Testimonials from "@/components/Testimonials";
import Labs from "@/components/Labs";
import Arcade from "@/components/Arcade";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4">
      <div className="flex flex-col gap-24 py-16 md:gap-32 md:py-24">
        {/* #overview — Hero owns its <section id="overview"> */}
        <Hero />

        {/* #experience — Experience owns its <section id="experience"> */}
        <Experience />

        {/* #tournaments — EventsGrid owns its <section id="tournaments"> */}
        <EventsGrid />

        {/* #architecture — group the flow diagram, tabs, and cost calculator */}
        <section id="architecture" className="scroll-mt-24 flex flex-col gap-16">
          <ArchitectureFlowDiagram />
          <ArchitectureTabs />
          <CostCalculator />
        </section>

        {/* #case-studies — group the evolution toggles and the case-study drawers */}
        <section id="case-studies" className="scroll-mt-24 flex flex-col gap-16">
          <PlatformEvolution />
          <CaseStudyDrawer />
        </section>

        {/* #governance — group the leadership manifesto and the certifications */}
        <section id="governance" className="scroll-mt-24 flex flex-col gap-16">
          <Manifesto />
          <Credentials />
        </section>

        {/* #education — Education owns its <section id="education"> */}
        <Education />

        {/* #endorsements — Testimonials owns its <section id="endorsements"> */}
        <Testimonials />

        {/* #labs — Labs owns its <section id="labs"> */}
        <Labs />

        {/* #arcade — Arcade owns its <section id="arcade"> */}
        <Arcade />

        {/* #contact — Contact owns its <section id="contact"> */}
        <Contact />
      </div>
    </main>
  );
}
