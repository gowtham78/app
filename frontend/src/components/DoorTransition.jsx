import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/siteData";

gsap.registerPlugin(ScrollTrigger);

/**
 * DoorTransition — 2.5D architectural "open the home" sequence.
 *
 * Sequence (scroll-scrubbed):
 *   0-15    Standing outside — dark facade with warm entrance ahead;
 *           "Every Space / has a possibility." resolves.
 *   15-35   Camera dolly forward — the doorway grows, wall recedes.
 *   30-65   Double doors swing outward on their hinges (CSS 3D transform).
 *   40-75   Warm interior light spills through the widening opening.
 *   65-90   Camera passes through — wall & doorway sweep past viewport edges.
 *   85-100  Emerge inside THE BAYSHORE — first project revealed, minimal caption.
 *
 * Uses CSS perspective + transform-origin on the door hinges. No 3D model needed.
 */
export default function DoorTransition() {
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

      // Initial states
      gsap.set(".every-space", { opacity: 0, y: 20 });
      gsap.set(".door-stage",  { scale: 0.65, y: 40 });
      gsap.set(".door-left",   { rotateY: 0 });
      gsap.set(".door-right",  { rotateY: 0 });
      gsap.set(".door-light",  { opacity: 0, scale: 0.5 });
      gsap.set(".interior",    { opacity: 0, scale: 1.15 });
      gsap.set(".facade",      { opacity: 1, scale: 1 });
      gsap.set(".wall-left",   { xPercent: 0 });
      gsap.set(".wall-right",  { xPercent: 0 });
      gsap.set(".ceiling",     { yPercent: 0 });
      gsap.set(".floor",       { yPercent: 0 });
      gsap.set(".t-caption",   { opacity: 0, y: 24 });

      tl
        // 0-15: Text resolves
        .to(".every-space", { opacity: 1, y: 0, duration: 6 }, 0)
        // 15-35: Camera dolly forward — door frame grows
        .to(".door-stage", { scale: 1.05, y: 0, duration: 20 }, 12)
        // 22-28: Text fades so it doesn't block the entrance
        .to(".every-space", { opacity: 0, y: -30, duration: 6 }, 24)
        // 30-65: Doors swing open (perspective 3D rotation on the hinges)
        .to(".door-left",  { rotateY: -105, duration: 30, ease: "power2.inOut" }, 30)
        .to(".door-right", { rotateY:  105, duration: 30, ease: "power2.inOut" }, 30)
        // 40-75: Warm light expands
        .to(".door-light", { opacity: 1, scale: 1.8, duration: 32, ease: "power2.out" }, 34)
        // 55-90: Interior fades in behind the opening doors
        .to(".interior", { opacity: 1, scale: 1.02, duration: 30, ease: "power2.out" }, 52)
        // 65-100: Camera dolly THROUGH the doorway — walls sweep past edges
        .to(".door-stage", { scale: 3.4, duration: 32, ease: "power2.in" }, 66)
        .to(".facade",     { opacity: 0, duration: 12 }, 78)
        .to(".wall-left",  { xPercent: -60, duration: 32 }, 66)
        .to(".wall-right", { xPercent: 60,  duration: 32 }, 66)
        .to(".ceiling",    { yPercent: -80, duration: 32 }, 66)
        .to(".floor",      { yPercent: 80,  duration: 32 }, 66)
        // 88-100: Caption arrives inside THE BAYSHORE
        .to(".t-caption", { opacity: 1, y: 0, duration: 8 }, 88);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      data-testid="door-transition"
      className="relative w-full bg-[#0a0a08]"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a08]">
        {/* Perspective stage — everything inside participates in 3D */}
        <div className="absolute inset-0" style={{ perspective: "1400px", perspectiveOrigin: "50% 55%" }}>

          {/* INTERIOR (Bayshore) — revealed through the opening doors */}
          <div className="interior absolute inset-0 will-change-transform">
            <img src={first.image} alt={first.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(210,184,121,0.18) 0%, rgba(0,0,0,0) 60%)" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50" />
          </div>

          {/* WARM LIGHT — the glow spilling out from inside as doors open */}
          <div className="door-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{
            width: "40vmin", height: "70vmin",
            background: "radial-gradient(ellipse at center, rgba(255,205,130,0.55) 0%, rgba(184,154,91,0.28) 40%, rgba(0,0,0,0) 75%)",
            filter: "blur(20px)"
          }} />

          {/* FACADE — dark exterior wall with the doorway hole in the centre */}
          <div className="facade absolute inset-0 will-change-transform">
            {/* Foreground wall panels (left + right + ceiling + floor) that sweep off during dolly */}
            <div className="wall-left absolute inset-y-0 left-0 z-10" style={{
              width: "38%",
              background: "linear-gradient(90deg, #0a0a08 0%, #0f0e0b 65%, #14120e 100%)",
              boxShadow: "inset -1px 0 0 rgba(184,154,91,0.15)"
            }} />
            <div className="wall-right absolute inset-y-0 right-0 z-10" style={{
              width: "38%",
              background: "linear-gradient(-90deg, #0a0a08 0%, #0f0e0b 65%, #14120e 100%)",
              boxShadow: "inset 1px 0 0 rgba(184,154,91,0.15)"
            }} />
            <div className="ceiling absolute top-0 left-0 right-0 z-10" style={{
              height: "18%",
              background: "linear-gradient(180deg, #0a0a08 0%, #14120e 100%)",
              boxShadow: "inset 0 -1px 0 rgba(184,154,91,0.15)"
            }} />
            <div className="floor absolute bottom-0 left-0 right-0 z-10" style={{
              height: "14%",
              background: "linear-gradient(0deg, #0a0a08 0%, #14120e 100%)",
              boxShadow: "inset 0 1px 0 rgba(184,154,91,0.15)"
            }} />

            {/* Doorway frame (subtle gold trim visible around the opening) */}
            <div className="absolute top-[18%] bottom-[14%] left-[24%] right-[24%] z-[9] pointer-events-none" style={{
              boxShadow: "inset 0 0 0 1px rgba(210,184,121,0.35), 0 0 60px rgba(184,154,91,0.12)"
            }} />
          </div>

          {/* DOORS — two leaves that swing outward with real 3D perspective */}
          <div className="door-stage absolute top-[18%] bottom-[14%] left-[24%] right-[24%] z-20" style={{ transformStyle: "preserve-3d" }}>
            {/* Left leaf — hinge at left edge */}
            <div className="door-left absolute top-0 bottom-0 left-0 w-1/2 will-change-transform" style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              background: "linear-gradient(90deg, #1a1610 0%, #2a2216 45%, #38301f 55%, #1a1610 100%)",
              boxShadow: "inset -8px 0 20px rgba(0,0,0,0.6), inset 12px 0 24px rgba(184,154,91,0.08)",
            }}>
              {/* Panel detail lines */}
              <div className="absolute inset-4 border border-[#B89A5B]/25" />
              <div className="absolute top-6 left-6 right-6 h-[40%] border border-[#B89A5B]/15" />
              {/* Gold handle */}
              <div className="absolute top-1/2 right-3 -translate-y-1/2 w-1.5 h-14 rounded-sm" style={{ background: "linear-gradient(180deg, #D2B879, #B89A5B)" }} />
            </div>
            {/* Right leaf — hinge at right edge */}
            <div className="door-right absolute top-0 bottom-0 right-0 w-1/2 will-change-transform" style={{
              transformOrigin: "right center",
              transformStyle: "preserve-3d",
              background: "linear-gradient(-90deg, #1a1610 0%, #2a2216 45%, #38301f 55%, #1a1610 100%)",
              boxShadow: "inset 8px 0 20px rgba(0,0,0,0.6), inset -12px 0 24px rgba(184,154,91,0.08)",
            }}>
              <div className="absolute inset-4 border border-[#B89A5B]/25" />
              <div className="absolute top-6 left-6 right-6 h-[40%] border border-[#B89A5B]/15" />
              <div className="absolute top-1/2 left-3 -translate-y-1/2 w-1.5 h-14 rounded-sm" style={{ background: "linear-gradient(180deg, #D2B879, #B89A5B)" }} />
            </div>
            {/* Center seam glow visible before doors open */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px" style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(210,184,121,0.5) 50%, transparent 100%)"
            }} />
          </div>

          {/* "Every Space has a possibility" — appears just before we approach */}
          <div className="every-space absolute inset-0 flex items-center justify-center pointer-events-none px-6 z-30">
            <div className="text-center">
              <div className="h-px w-16 bg-[#B89A5B] mx-auto mb-6" />
              <div className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(2.4rem, 7vw, 7rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                Every Space
              </div>
              <div className="font-display italic text-[#D2B879] mt-1" style={{ fontSize: "clamp(2.4rem, 7vw, 7rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                has a possibility.
              </div>
            </div>
          </div>

          {/* Bayshore caption — revealed only after entering the space */}
          <div className="t-caption absolute bottom-[8vh] left-[6vw] z-40 pointer-events-none">
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#D2B879] font-sans">01</span>
              <span className="w-8 h-px bg-[#D2B879]" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#F3F0E8]/85 font-sans">
                Residential — Singapore
              </span>
            </div>
            <div className="font-display text-[#F3F0E8] leading-[0.95] tracking-tight" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", fontWeight: 300 }}>
              {first.title}
            </div>
            <div className="mt-3 text-[#D8D0C2] font-sans text-sm md:text-base">
              {first.location} · {first.category} · {first.year}
            </div>
          </div>

          {/* Grain overlay for cohesion */}
          <div className="absolute inset-0 grain pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
