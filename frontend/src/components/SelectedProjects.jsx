import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "../data/siteData";

export default function SelectedProjects() {
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Move the horizontal track so that all projects scroll past
  const numPanels = PROJECTS.length;
  // We want to translate from 0 to -((numPanels-1)/numPanels)*100%
  const xPct = -((numPanels - 1) / numPanels) * 100;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `${xPct}%`]);

  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative bg-ivory"
    >
      {/* Header */}
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24 pt-24 md:pt-32 pb-14 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-6">
              Selected Spaces
            </div>
            <h2 className="font-serif font-light text-charcoal text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-3xl">
              A curated collection<br />
              of recent work.
            </h2>
          </div>
          <a
            href="#contact"
            data-testid="projects-view-all"
            className="link-underline text-[12px] tracking-[0.25em] uppercase text-charcoal font-sans"
          >
            View All Projects →
          </a>
        </div>
      </div>

      {/* Desktop horizontal scroll */}
      <div
        ref={trackRef}
        className="hidden md:block relative"
        style={{ height: `${numPanels * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          <motion.div
            style={{ x, width: `${numPanels * 100}%` }}
            className="flex h-[82%]"
          >
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className="h-full flex items-center justify-center px-8 lg:px-16"
                style={{ width: `${100 / numPanels}%` }}
              >
                <ProjectPanel project={p} index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile vertical stack */}
      <div className="md:hidden px-6 pb-16 space-y-16">
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            data-testid={`project-card-mobile-${p.id}`}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-bronze font-sans">
                  {String(i + 1).padStart(2, "0")} / {p.category}
                </div>
                <div className="font-serif text-2xl text-charcoal mt-1">{p.title}</div>
                <div className="text-sm text-charcoal/60 mt-1">{p.location}</div>
              </div>
              <div className="text-xs text-charcoal/50">{p.year}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ProjectPanel({ project, index }) {
  return (
    <article
      data-testid={`project-panel-${project.id}`}
      className="relative w-full h-full group"
    >
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Bottom gradient for legibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal/70 to-transparent" />

        {/* Index — top-left */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 text-[10px] tracking-[0.4em] uppercase text-ivory/80 font-sans">
          {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
        </div>

        {/* Category — top-right */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 text-[10px] tracking-[0.4em] uppercase text-ivory/80 font-sans">
          {project.category}
        </div>

        {/* Title block — bottom-left */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-lg">
          <div className="text-[10px] tracking-[0.3em] uppercase text-bronze mb-3 font-sans">
            {project.year}
          </div>
          <h3 className="font-serif font-light text-ivory text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
            {project.title}
          </h3>
          <div className="mt-2 text-ivory/80 text-sm md:text-base font-sans font-light">
            {project.location}
          </div>
        </div>
      </div>
    </article>
  );
}
