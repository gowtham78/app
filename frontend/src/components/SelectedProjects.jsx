import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/siteData";

gsap.registerPlugin(ScrollTrigger);

/**
 * SelectedProjects — editorial spatial gallery.
 * ONE dominant active project (60vw × 72vh) sits centre-stage with narrow edge
 * previews of the adjacent projects. Scroll advances the sequence: active
 * expands, next moves forward, previous compresses to an edge slice.
 */
export default function SelectedProjects() {
  const trackRef = useRef(null);
  const rootRef = useRef(null);
  const total = PROJECTS.length;

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".proj-panel");

      // Set initial: first is dominant, others at compressed edge state
      panels.forEach((p, i) => {
        gsap.set(p, {
          xPercent: i === 0 ? 0 : 100 * (i),
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReduced ? true : 0.6,
        },
      });

      // Each panel slides in as the previous slides out
      panels.forEach((p, i) => {
        if (i === 0) return;
        const t = (i - 1) * 10;
        tl.to(panels[i - 1], { xPercent: -100, duration: 10 }, t)
          .to(p,             { xPercent: 0,    duration: 10 }, t)
          .to(panels[i - 1].querySelector(".proj-image"), { scale: 1.08, duration: 10 }, t)
          .to(p.querySelector(".proj-image"),             { scale: 1.0,  duration: 10 }, t);
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="projects" data-testid="projects-section" className="relative bg-ivory">
      {/* Editorial header */}
      <div className="mx-auto max-w-[1800px] px-[6vw] pt-24 md:pt-32 pb-14 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-[11px] tracking-[0.5em] uppercase text-bronze font-sans mb-6">
              Selected Spaces
            </div>
            <h2 className="font-display text-charcoal leading-[1.02] tracking-[-0.03em]" style={{ fontSize: "clamp(2.6rem, 7vw, 6.4rem)", fontWeight: 300 }}>
              A curated collection of<br /><em className="text-gold">recent work.</em>
            </h2>
          </div>
          <a href="#contact" data-testid="projects-view-all" data-cursor="expand"
             className="link-underline text-[12px] tracking-[0.3em] uppercase text-charcoal font-sans magnetic">
            View All Projects →
          </a>
        </div>
      </div>

      {/* Desktop: pinned spatial gallery */}
      <div
        ref={trackRef}
        className="hidden md:block relative"
        style={{ height: `${(total) * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-ivory">
          {/* Preview slice (next project) — narrow edge on right */}
          <div className="absolute inset-y-0 right-0 w-[10vw] pointer-events-none z-0"
               style={{ background: "linear-gradient(90deg, rgba(243,240,232,0) 0%, rgba(216,208,194,0.15) 60%, rgba(216,208,194,0.35) 100%)" }} />

          {/* Chapter counter */}
          <div className="absolute top-[6vh] left-[6vw] z-10 text-[10px] tracking-[0.5em] uppercase text-charcoal/50 font-sans">
            Projects &nbsp;·&nbsp; {String(total).padStart(2, "0")} spaces
          </div>

          {/* Panels */}
          {PROJECTS.map((p, i) => (
            <article key={p.id} data-testid={`project-panel-${p.id}`}
                     className="proj-panel absolute inset-0 flex items-center justify-center px-[6vw]">
              <div className="relative w-[62vw] h-[72vh] overflow-hidden shadow-[0_40px_80px_-40px_rgba(17,17,15,0.35)]">
                <div className="proj-image absolute inset-0 will-change-transform">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                {/* Bottom gradient for legibility */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-transparent pointer-events-none" />
                {/* Top-left index */}
                <div className="absolute top-6 left-6 text-[10px] tracking-[0.5em] uppercase text-ivory/90 font-sans">
                  {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </div>
                {/* Top-right category */}
                <div className="absolute top-6 right-6 text-[10px] tracking-[0.5em] uppercase text-ivory/90 font-sans">
                  {p.category}
                </div>
                {/* Bottom-left title */}
                <div className="absolute bottom-8 left-8 max-w-xl">
                  <div className="text-[10px] tracking-[0.4em] uppercase text-goldlight mb-3 font-sans">
                    {p.year}
                  </div>
                  <h3 className="font-display font-light text-ivory leading-[0.98] tracking-tight" style={{ fontSize: "clamp(2rem, 4.6vw, 4.5rem)" }}>
                    {p.title}
                  </h3>
                  <div className="mt-2 text-ivory/85 text-sm md:text-base font-sans font-light">
                    {p.location}
                  </div>
                </div>
              </div>
              {/* Meta panel on the right — deliberate hierarchy */}
              <div className="absolute right-[3vw] top-1/2 -translate-y-1/2 text-right">
                <div className="text-[9px] tracking-[0.5em] uppercase text-charcoal/40 font-sans mb-3">
                  Next
                </div>
                <div className="font-display text-charcoal/50 leading-none" style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)" }}>
                  {PROJECTS[(i + 1) % total].title}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="md:hidden px-6 pb-16 space-y-14">
        {PROJECTS.map((p, i) => (
          <article key={p.id} data-testid={`project-card-mobile-${p.id}`}>
            <div className="aspect-[4/5] overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-[10px] tracking-[0.4em] uppercase text-bronze font-sans">
                  {String(i + 1).padStart(2, "0")} · {p.category}
                </div>
                <div className="font-display text-2xl text-charcoal mt-1">{p.title}</div>
                <div className="text-sm text-charcoal/60 mt-1">{p.location}</div>
              </div>
              <div className="text-xs text-charcoal/50">{p.year}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
