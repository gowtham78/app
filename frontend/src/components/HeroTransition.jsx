import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/siteData";

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroTransition — brief, tonal transition from dark hero into portfolio.
 * 120vh only. Gold line expands, becomes the top edge of the first project image,
 * dark background lifts, ivory enters underneath.
 */
export default function HeroTransition() {
  const containerRef = useRef(null);
  const first = PROJECTS[0];

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReduced ? true : 0.5,
        },
      });

      gsap.set(".gold-line", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".dark-veil", { yPercent: 0 });
      gsap.set(".ivory-veil", { yPercent: 100 });
      gsap.set(".t-image", { scale: 1.18, yPercent: 6 });
      gsap.set(".t-caption", { opacity: 0, yPercent: 20 });

      tl
        // Gold line draws immediately
        .to(".gold-line", { scaleX: 1, duration: 6, ease: "power2.out" }, 0)
        // Dark veil lifts up, ivory enters under
        .to(".dark-veil",  { yPercent: -100, duration: 12, ease: "power2.inOut" }, 4)
        .to(".ivory-veil", { yPercent: 0,   duration: 12, ease: "power2.inOut" }, 4)
        // Image settles
        .to(".t-image",    { scale: 1.02, yPercent: 0, duration: 14 }, 4)
        // Caption enters
        .to(".t-caption",  { opacity: 1, yPercent: 0, duration: 6 }, 10);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      data-testid="hero-transition"
      className="relative w-full bg-[#0d0d0b]"
      style={{ height: "120vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0d0d0b]">
        {/* Portfolio image underneath */}
        <img
          src={first.image}
          alt={first.title}
          className="t-image absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Dark veil — lifts upward */}
        <div className="dark-veil absolute inset-0 bg-[#0d0d0b]" />

        {/* Ivory veil — enters from below (creates the tonal swap) */}
        <div className="ivory-veil absolute inset-0 bg-[#F3F0E8] pointer-events-none" style={{ opacity: 0 }} />

        {/* Gold horizontal line — becomes the top edge of the portfolio */}
        <div className="gold-line absolute top-1/2 left-0 right-0 h-px bg-[#B89A5B] z-10" />

        {/* Caption bottom-left */}
        <div className="t-caption absolute bottom-[8vh] left-[6vw] z-20">
          <div className="text-[10px] tracking-[0.5em] uppercase text-[#B89A5B] font-sans mb-3">
            Every Space &nbsp;·&nbsp; A Possibility
          </div>
          <div className="font-display text-[#F3F0E8] text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight">
            {first.title}
          </div>
          <div className="mt-2 text-[#D8D0C2] font-sans text-sm md:text-base">
            {first.location} · {first.category}
          </div>
        </div>
      </div>
    </section>
  );
}
