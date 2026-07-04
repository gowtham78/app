import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ImmersiveHero — 220vh pinned, scrubbed cinematic camera journey.
 *
 * Continuous, overlapping timeline (film-like, no dead scroll):
 *   0-8    Opening entrance frame (already visible at load) + intro elements
 *   8-28   Camera pulls back, Suntek nameplate resolves
 *   28-50  "We Design / the way / you live" typography choreographed with depth
 *   50-72  Camera pans to kitchen; "3500+" and "800+" weave through the space
 *   72-88  Craft details; Designed / Built / Delivered overlap continuously
 *   88-100 Foreground wall wipes across → text emerges on the dark surface
 *
 * Design system: warm ivory / deep architectural black / Suntek gold accent.
 * 3 depth layers per scene (background, main, foreground silhouette) move at
 * different scroll rates to create real spatial parallax.
 */

const SCENE_IMAGES = {
  entrance: "https://images.unsplash.com/photo-1648881806148-e5c51179c826?crop=entropy&cs=srgb&fm=jpg&q=95&w=3200",
  living: "https://images.unsplash.com/photo-1704040686428-7534b262d0d8?crop=entropy&cs=srgb&fm=jpg&q=95&w=3000",
  kitchen: "https://images.unsplash.com/photo-1724582586495-d050726cf354?crop=entropy&cs=srgb&fm=jpg&q=95&w=3000",
  craft: "https://images.unsplash.com/photo-1724582586458-a51791349977?crop=entropy&cs=srgb&fm=jpg&q=95&w=3000",
  completed: "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?crop=entropy&cs=srgb&fm=jpg&q=95&w=3000",
};

const CHAPTERS = [
  { label: "Entrance",    range: [0, 22] },
  { label: "Living",      range: [22, 46] },
  { label: "Kitchen",     range: [46, 68] },
  { label: "Craft",       range: [68, 86] },
  { label: "Reimagined",  range: [86, 100] },
];

export default function ImmersiveHero() {
  const containerRef = useRef(null);
  const rootRef = useRef(null);
  const chapterLabelRef = useRef(null);
  const chapterNumberRef = useRef(null);
  const progressNumRef = useRef(null);
  const progressFillRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    let cancelled = false;
    const urls = Object.values(SCENE_IMAGES);
    let done = 0;
    urls.forEach((u) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        done += 1;
        if (done === urls.length && !cancelled) setLoaded(true);
      };
      img.src = u;
    });
    const t = setTimeout(() => setLoaded(true), 2500);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  useLayoutEffect(() => {
    if (!loaded) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // 1.5s entrance sequence — plays independently of scroll on load
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 0)
        .fromTo(".intro-logo", { opacity: 0, y: 24, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 0.3)
        .fromTo(".intro-sub", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.55)
        .fromTo(".intro-statement", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
        .fromTo(".intro-scroll", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.2);

      // MASTER scrubbed timeline — 220vh pinned
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReduced ? true : 0.55,
          onUpdate: (self) => {
            const p = self.progress;
            const pct = Math.round(p * 100);
            // Update HUD via refs — NO React state churn
            if (progressNumRef.current) progressNumRef.current.textContent = String(pct).padStart(2, "0");
            if (progressFillRef.current) progressFillRef.current.style.height = `${p * 100}%`;
            const ch = CHAPTERS.find((c) => pct <= c.range[1]) || CHAPTERS[CHAPTERS.length - 1];
            const idx = CHAPTERS.indexOf(ch);
            if (chapterLabelRef.current) chapterLabelRef.current.textContent = ch.label;
            if (chapterNumberRef.current) chapterNumberRef.current.textContent = `0${idx + 1} / 0${CHAPTERS.length}`;
          },
        },
      });

      // ============ INITIAL STATE ============
      // Scene 1 is already partially visible at load (30-40% brightness with warm glow)
      gsap.set(".scene-entrance", { opacity: 1, scale: 1.15, xPercent: 4, yPercent: -2, filter: "brightness(0.75) contrast(1.05) saturate(1.05)" });
      gsap.set([".scene-living", ".scene-kitchen", ".scene-craft", ".scene-completed"], { opacity: 0, scale: 1.15 });

      // Foreground silhouettes (fastest parallax) + background layers (slowest)
      gsap.set(".fg-column", { xPercent: -30, opacity: 0.85 });
      gsap.set(".fg-curtain", { xPercent: 30, opacity: 0.9 });
      gsap.set(".bg-window", { scale: 1.1 });

      // Wall wipe for final transition
      gsap.set(".wall-wipe", { xPercent: -110 });
      gsap.set(".final-text", { opacity: 0 });

      // Text initial states
      gsap.set(".txt-s1", { opacity: 1 });      // scene 1 visible at load
      gsap.set(".txt-s2-we", { opacity: 0, yPercent: 30, xPercent: -4 });
      gsap.set(".txt-s2-way", { opacity: 0, xPercent: 15, scale: 1.15 });
      gsap.set(".txt-s2-live", { opacity: 0, yPercent: 40, scale: 0.95 });
      gsap.set(".txt-s3-num", { opacity: 0, scale: 1.25, xPercent: 20 });
      gsap.set(".txt-s3-num2", { opacity: 0, scale: 1.25, xPercent: -20 });
      gsap.set(".txt-s4-a", { opacity: 0, yPercent: 30, xPercent: -8 });
      gsap.set(".txt-s4-b", { opacity: 0, yPercent: 40, xPercent: 8 });
      gsap.set(".txt-s4-c", { opacity: 0, yPercent: 50 });
      gsap.set(".txt-s5-title", { opacity: 0, yPercent: 20 });
      gsap.set(".txt-s5-cta", { opacity: 0, yPercent: 12 });

      // ============ SCENE 1 → 2 (0–28) — overlapping ============
      // Entrance pulls back
      tl.to(".scene-entrance", { scale: 1.0, xPercent: 0, yPercent: 0, filter: "brightness(0.92) contrast(1) saturate(1)", duration: 22 }, 0)
        .to(".fg-column", { xPercent: -60, duration: 22 }, 0)
        .to(".bg-window", { scale: 1.0, duration: 22 }, 0)
        .to(".txt-s1", { opacity: 0, y: -18, duration: 6 }, 14)
        // Living crossfades in BEFORE entrance fully leaves
        .to(".scene-entrance", { opacity: 0, duration: 5 }, 16)
        .fromTo(".scene-living", { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1.03, duration: 7 }, 16);

      // ============ SCENE 2 (18–46) — typography choreography with overlap ============
      tl.to(".txt-s2-we", { opacity: 1, yPercent: 0, xPercent: 0, duration: 4 }, 20)
        .to(".txt-s2-way", { opacity: 1, xPercent: 0, scale: 1, duration: 4 }, 22)
        .to(".txt-s2-live", { opacity: 1, yPercent: 0, scale: 1, duration: 4 }, 24)
        .to(".scene-living", { scale: 1.0, xPercent: -3, duration: 24 }, 20)
        .to(".fg-curtain", { xPercent: 60, opacity: 0.5, duration: 26 }, 20)
        // Text departs while camera continues moving
        .to([".txt-s2-we", ".txt-s2-way", ".txt-s2-live"], { opacity: 0, yPercent: -15, duration: 4, stagger: 0.15 }, 40);

      // ============ SCENE 3 (42–68) — stats woven through kitchen ============
      tl.to(".scene-living", { opacity: 0, duration: 4 }, 42)
        .fromTo(".scene-kitchen", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1.0, duration: 6 }, 42)
        .to(".scene-kitchen", { xPercent: -4, duration: 22 }, 46)
        .to(".txt-s3-num", { opacity: 1, scale: 1, xPercent: 0, duration: 4 }, 46)
        // Numbers overlap — the second number starts appearing before the first fully leaves
        .to(".txt-s3-num", { opacity: 0, xPercent: -12, duration: 4 }, 55)
        .to(".txt-s3-num2", { opacity: 1, scale: 1, xPercent: 0, duration: 4 }, 56)
        .to(".txt-s3-num2", { opacity: 0, xPercent: 12, duration: 4 }, 64);

      // ============ SCENE 4 (64–86) — craft, tightly overlapped ============
      tl.to(".scene-kitchen", { opacity: 0, duration: 3 }, 65)
        .fromTo(".scene-craft", { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1.02, duration: 6 }, 65)
        .to(".scene-craft", { scale: 1.0, duration: 18 }, 68)
        // Designed / Built / Delivered overlap heavily
        .to(".txt-s4-a", { opacity: 1, yPercent: 0, xPercent: 0, duration: 3 }, 68)
        .to(".txt-s4-b", { opacity: 1, yPercent: 0, xPercent: 0, duration: 3 }, 71)
        .to(".txt-s4-c", { opacity: 1, yPercent: 0, duration: 3 }, 74)
        .to([".txt-s4-a", ".txt-s4-b", ".txt-s4-c"], { opacity: 0, yPercent: -15, duration: 3, stagger: 0.1 }, 82);

      // ============ SCENE 5 (82–100) — architectural wall wipe, no long black ============
      tl.to(".scene-craft", { opacity: 0, duration: 3 }, 83)
        .fromTo(".scene-completed", { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1.0, duration: 5 }, 83)
        .to(".txt-s5-title", { opacity: 1, yPercent: 0, duration: 4 }, 85)
        .to(".txt-s5-cta", { opacity: 1, yPercent: 0, duration: 3 }, 88)
        // Wall wipe closes the room quickly — architectural transition, 0.3-0.6s of scroll
        .to(".wall-wipe", { xPercent: 0, duration: 5, ease: "power2.inOut" }, 91)
        .to([".txt-s5-title", ".txt-s5-cta"], { opacity: 0, yPercent: -10, duration: 3 }, 92)
        // Text emerges directly on the dark surface — no empty black gap
        .to(".final-text", { opacity: 1, duration: 3 }, 94);

      // ---------- Constrained mouse parallax on foreground ONLY (subtle) ----------
      if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
        const fgs = rootRef.current?.querySelectorAll(".fg-parallax");
        const bgs = rootRef.current?.querySelectorAll(".bg-parallax");
        const xFg = gsap.quickTo(fgs, "x", { duration: 1.2, ease: "power2.out" });
        const yFg = gsap.quickTo(fgs, "y", { duration: 1.2, ease: "power2.out" });
        const xBg = gsap.quickTo(bgs, "x", { duration: 1.6, ease: "power2.out" });
        const yBg = gsap.quickTo(bgs, "y", { duration: 1.6, ease: "power2.out" });
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          xFg(nx * 20);  yFg(ny * 12);
          xBg(nx * -8);  yBg(ny * -4);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section
      ref={containerRef}
      id="top"
      data-testid="immersive-hero"
      className="relative w-full bg-[#0d0d0b]"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0d0d0b]">
        <div ref={rootRef} className="absolute inset-0">
          {/* ============ DEPTH LAYER 1: BACKGROUND (slowest parallax) ============ */}
          <div className="bg-window absolute inset-0 bg-parallax">
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at 78% 38%, rgba(210, 184, 121, 0.28) 0%, rgba(210, 184, 121, 0) 42%)"
            }} />
          </div>

          {/* ============ DEPTH LAYER 2: SCENES (main) ============ */}
          <SceneImage src={SCENE_IMAGES.entrance} className="scene-entrance" alt="Warm interior at entrance" />
          <SceneImage src={SCENE_IMAGES.living}   className="scene-living"   alt="Modern luxury living room" />
          <SceneImage src={SCENE_IMAGES.kitchen}  className="scene-kitchen"  alt="Kitchen and dining space" />
          <SceneImage src={SCENE_IMAGES.craft}    className="scene-craft"    alt="Custom carpentry craftsmanship" />
          <SceneImage src={SCENE_IMAGES.completed} className="scene-completed" alt="Completed luxury interior" />

          {/* ============ DEPTH LAYER 3: FOREGROUND SILHOUETTES (fastest parallax) ============ */}
          <div className="fg-column fg-parallax absolute inset-y-0 left-0 w-[22vw] pointer-events-none"
               style={{ background: "linear-gradient(90deg, #0a0a09 0%, rgba(10,10,9,0.85) 60%, rgba(10,10,9,0) 100%)" }} />
          <div className="fg-curtain fg-parallax absolute inset-y-0 right-0 w-[22vw] pointer-events-none"
               style={{ background: "linear-gradient(-90deg, #0a0a09 0%, rgba(10,10,9,0.7) 60%, rgba(10,10,9,0) 100%)" }} />

          {/* Warm cinematic overlays: golden hour grade + vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(180deg, rgba(184, 154, 91, 0.05) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)"
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)"
          }} />
          <div className="absolute inset-0 grain" />

          {/* ============ SCENE 1 TEXT (initial state — visible immediately) ============ */}
          <div className="txt-s1 absolute inset-0 pointer-events-none">
            <div className="absolute top-[38%] left-[6vw] max-w-2xl">
              <div className="intro-line h-px w-24 bg-[#B89A5B] origin-left mb-6" />
              <div className="intro-sub text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#D8D0C2]/80 font-sans mb-5">
                Interior Architecture · Singapore — Since 2007
              </div>
              <h1 className="intro-logo font-display text-[#F3F0E8] tracking-[-0.02em] leading-[0.9]" style={{ fontSize: "clamp(3.4rem, 9vw, 8.5rem)", fontWeight: 300 }}>
                Suntek<br />
                <em className="not-italic text-[#D2B879]">Designs</em>
              </h1>
              <div className="intro-statement mt-6 font-display text-[#F3F0E8]/85 tracking-tight leading-[0.95]" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.4rem)", fontWeight: 300 }}>
                Spaces, <em className="text-[#D2B879]">considered.</em>
              </div>
            </div>
            <div className="intro-scroll absolute bottom-[6vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F3F0E8]/60">
              <span className="text-[9px] tracking-[0.5em] uppercase font-sans">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-[#F3F0E8]/60 to-transparent" />
            </div>
          </div>

          {/* ============ SCENE 2 TEXT — three depth planes ============ */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="txt-s2-we absolute left-[6vw] top-[12%]">
              <span className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(4rem, 12vw, 12rem)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.03em" }}>
                We Design
              </span>
            </div>
            <div className="txt-s2-way absolute right-[6vw] top-[38%] text-right">
              <span className="font-display italic text-[#D2B879]" style={{ fontSize: "clamp(4rem, 12vw, 12rem)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.03em" }}>
                the way
              </span>
            </div>
            <div className="txt-s2-live absolute left-[22vw] bottom-[8%]">
              <span className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(4rem, 12vw, 12rem)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.03em" }}>
                you live.
              </span>
            </div>
          </div>

          {/* ============ SCENE 3 TEXT — architectural numbers ============ */}
          <div className="txt-s3-num absolute inset-0 pointer-events-none flex items-center justify-end pr-[6vw]">
            <div className="text-right">
              <div className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(6rem, 17vw, 19rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.04em" }}>
                3500<span className="text-[#B89A5B]">+</span>
              </div>
              <div className="mt-4 text-[10px] tracking-[0.5em] uppercase text-[#D8D0C2] font-sans">
                Spaces Transformed
              </div>
            </div>
          </div>
          <div className="txt-s3-num2 absolute inset-0 pointer-events-none flex items-center px-[6vw]">
            <div>
              <div className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(6rem, 17vw, 19rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.04em" }}>
                800<span className="text-[#B89A5B]">+</span>
              </div>
              <div className="mt-4 text-[10px] tracking-[0.5em] uppercase text-[#D8D0C2] font-sans">
                Clients &middot; Homes &middot; Studios
              </div>
            </div>
          </div>

          {/* ============ SCENE 4 TEXT — Designed / Built / Delivered layered ============ */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="txt-s4-a absolute left-[6vw] top-[18%]">
              <span className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Designed.
              </span>
            </div>
            <div className="txt-s4-b absolute right-[6vw] top-[42%] text-right">
              <span className="font-display italic text-[#D2B879]" style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Built.
              </span>
            </div>
            <div className="txt-s4-c absolute left-1/2 -translate-x-1/2 bottom-[14%]">
              <span className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Delivered.
              </span>
            </div>
          </div>

          {/* ============ SCENE 5 — Reimagined + CTA ============ */}
          <div className="absolute inset-0 pointer-events-none flex items-center">
            <div className="w-full px-[6vw]">
              <div className="txt-s5-title">
                <div className="text-[10px] tracking-[0.5em] uppercase text-[#B89A5B] font-sans mb-6">
                  The Vision
                </div>
                <h2 className="font-display text-[#F3F0E8] leading-[0.9] tracking-[-0.03em] max-w-6xl" style={{ fontSize: "clamp(3.5rem, 11vw, 12rem)", fontWeight: 300 }}>
                  Your Space.<br />
                  <em className="not-italic text-[#D2B879]">Reimagined.</em>
                </h2>
              </div>
              <div className="txt-s5-cta mt-10 md:mt-14 pointer-events-auto">
                <a href="#projects" data-testid="hero-cta-start" data-cursor="expand"
                   className="inline-flex items-center gap-4 text-[#F3F0E8] group magnetic">
                  <span className="text-[11px] tracking-[0.4em] uppercase font-sans border-b border-[#D2B879]/70 pb-2 group-hover:border-[#D2B879] group-hover:text-[#D2B879] transition-colors duration-500">
                    Start Your Project
                  </span>
                  <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="group-hover:translate-x-2 transition-transform duration-500">
                    <path d="M0 5h26M22 1l4 4-4 4" stroke="currentColor" strokeWidth="1.1" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ============ ARCHITECTURAL WALL WIPE — replaces long black fade ============ */}
          <div className="wall-wipe absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(90deg, #08080699 0%, #080806 60%, #0a0a08 100%)"
          }} />

          {/* Text emerges within the dark surface — no empty black gap */}
          <div className="final-text absolute inset-0 flex items-center justify-center pointer-events-none px-6">
            <div className="text-center">
              <div className="h-px w-16 bg-[#B89A5B] mx-auto mb-8" />
              <div className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(2.6rem, 8vw, 8rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                Every Space
              </div>
              <div className="font-display italic text-[#D2B879] mt-2" style={{ fontSize: "clamp(2.6rem, 8vw, 8rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                has a possibility.
              </div>
            </div>
          </div>

          {/* ============ HUD: gold progress line + chapter counter ============ */}
          <HeroHUD
            chapterLabelRef={chapterLabelRef}
            chapterNumberRef={chapterNumberRef}
            progressNumRef={progressNumRef}
            progressFillRef={progressFillRef}
          />
        </div>
      </div>

      {/* Loading veil — brief and unobtrusive */}
      {!loaded && (
        <div className="fixed inset-0 z-[100] bg-[#0d0d0b] flex items-center justify-center">
          <div className="text-center">
            <div className="text-[10px] tracking-[0.5em] uppercase text-[#D8D0C2] font-sans mb-4">
              Suntek
            </div>
            <div className="w-32 h-px bg-[#D8D0C2]/20 relative overflow-hidden">
              <div className="absolute inset-y-0 w-1/3 bg-[#B89A5B]" style={{ animation: "loadingBar 1.2s ease-in-out infinite" }} />
            </div>
          </div>
          <style>{`
            @keyframes loadingBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
          `}</style>
        </div>
      )}
    </section>
  );
}

function SceneImage({ src, className, alt }) {
  return (
    <div className={`hero-scene absolute inset-0 warm-grade ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading="eager"
      />
    </div>
  );
}

function HeroHUD({ chapterLabelRef, chapterNumberRef, progressNumRef, progressFillRef }) {
  return (
    <>
      {/* Chapter label (bottom-left, subtle) */}
      <div className="absolute bottom-[6vh] left-[6vw] z-30 flex items-baseline gap-4 text-[#F3F0E8]/80 pointer-events-none">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#D2B879] font-sans" ref={chapterNumberRef}>01 / 05</span>
        <span className="w-6 h-px bg-[#F3F0E8]/40" />
        <span className="text-[10px] tracking-[0.4em] uppercase font-sans" ref={chapterLabelRef}>Entrance</span>
      </div>

      {/* Vertical gold progress line — right edge */}
      <div className="gold-progress hidden md:block">
        <div className="gold-progress-fill" ref={progressFillRef} />
        <div className="absolute -left-[52px] top-0 flex flex-col gap-6 items-end">
          {[1,2,3,4,5].map((n) => (
            <span key={n} className="text-[9px] tracking-[0.3em] uppercase text-[#F3F0E8]/40 font-sans">0{n}</span>
          ))}
        </div>
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col items-end">
          <span ref={progressNumRef} className="text-[9px] tracking-[0.3em] uppercase text-[#D2B879] font-sans">00</span>
        </div>
      </div>
    </>
  );
}
