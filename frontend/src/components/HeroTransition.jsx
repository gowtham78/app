import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/siteData";

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroTransition — the cinematic bridge from the immersive hero into the site.
 * Layers:
 *   1) A dark near-black backdrop with the first project image loaded behind two panels.
 *   2) Two large panels (left / right) that cover the project image.
 *   3) Editorial typography "Every space has a possibility."
 * On scroll:
 *   - Panels slide apart horizontally, revealing the first project.
 *   - Typography scales/fades out.
 *   - Project caption fades in.
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
          scrub: prefersReduced ? true : 0.6,
        },
      });

      gsap.set(".panel-left", { xPercent: 0 });
      gsap.set(".panel-right", { xPercent: 0 });
      gsap.set(".t-line-1", { opacity: 0, yPercent: 40 });
      gsap.set(".t-line-2", { opacity: 0, yPercent: 40 });
      gsap.set(".project-caption", { opacity: 0, yPercent: 20 });
      gsap.set(".project-image", { scale: 1.25 });

      tl.to(".t-line-1", { opacity: 1, yPercent: 0, duration: 8 }, 2)
        .to(".t-line-2", { opacity: 1, yPercent: 0, duration: 8 }, 5)
        .to(".t-line-1", { opacity: 0, yPercent: -20, duration: 6 }, 34)
        .to(".t-line-2", { opacity: 0, yPercent: -20, duration: 6 }, 36)
        .to(".panel-left", { xPercent: -100, duration: 25, ease: "power2.inOut" }, 30)
        .to(".panel-right", { xPercent: 100, duration: 25, ease: "power2.inOut" }, 30)
        .to(".project-image", { scale: 1.03, duration: 30 }, 30)
        .to(".project-caption", { opacity: 1, yPercent: 0, duration: 6 }, 52);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      data-testid="hero-transition"
      className="relative w-full bg-[#060605]"
      style={{ height: "220vh" }}
    >
      <div className="transition-pin sticky top-0 h-screen w-full overflow-hidden bg-[#060605]">
        {/* First project image — behind panels */}
        <div className="absolute inset-0">
          <img
            src={first.image}
            alt={first.title}
            className="project-image absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        </div>

        {/* Two panels */}
        <div className="panel-left absolute inset-y-0 left-0 w-1/2 bg-[#0a0908] border-r border-[#1a1917]" />
        <div className="panel-right absolute inset-y-0 right-0 w-1/2 bg-[#0a0908] border-l border-[#1a1917]" />

        {/* Central typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
          <div className="text-center">
            <div className="t-line-1">
              <span className="font-display text-[#F1EFE9]" style={{ fontSize: "clamp(3rem, 10vw, 10rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Every Space
              </span>
            </div>
            <div className="t-line-2 mt-2">
              <span className="font-display italic text-[#B8B1A5]" style={{ fontSize: "clamp(3rem, 10vw, 10rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                has a possibility.
              </span>
            </div>
          </div>
        </div>

        {/* Project caption revealed */}
        <div className="project-caption absolute bottom-10 md:bottom-16 left-6 md:left-16 lg:left-24 z-10">
          <div className="text-[10px] tracking-[0.4em] uppercase text-[#A68A64] font-sans mb-3">
            01 / Featured Space
          </div>
          <div className="font-display text-[#F1EFE9] text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight">
            {first.title}
          </div>
          <div className="mt-2 text-[#B8B1A5] font-sans text-sm md:text-base">
            {first.location} · {first.category}
          </div>
        </div>
      </div>
    </section>
  );
}
