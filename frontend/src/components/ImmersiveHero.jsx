import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ImmersiveHero — 400vh pinned, scrubbed camera journey through a luxury home.
 *
 * Scene 1 (0–20)  ENTRANCE   : Extreme close-up of architectural material, pulls back.
 * Scene 2 (20–45) LIVING     : Full living room revealed, huge editorial typography.
 * Scene 3 (45–70) KITCHEN    : Camera pans sideways, walls wipe across, stats appear as architecture.
 * Scene 4 (70–90) CRAFT      : Zooms into craftsmanship details, DESIGNED / BUILT / DELIVERED.
 * Scene 5 (90–100) COMPLETED : Full home revealed with a single CTA, then doorway closes.
 */

// Curated Unsplash interior imagery — hero-critical only
const SCENE_IMAGES = {
  entrance:
    "https://images.unsplash.com/photo-1648881806148-e5c51179c826?crop=entropy&cs=srgb&fm=jpg&q=95&w=3200",
  living:
    "https://images.unsplash.com/photo-1704040686428-7534b262d0d8?crop=entropy&cs=srgb&fm=jpg&q=95&w=3000",
  kitchen:
    "https://images.unsplash.com/photo-1724582586495-d050726cf354?crop=entropy&cs=srgb&fm=jpg&q=95&w=3000",
  craft:
    "https://images.unsplash.com/photo-1724582586458-a51791349977?crop=entropy&cs=srgb&fm=jpg&q=95&w=3000",
  completed:
    "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?crop=entropy&cs=srgb&fm=jpg&q=95&w=3000",
};

const SCENE_LABELS = [
  { label: "Entrance", range: [0, 20] },
  { label: "Living", range: [20, 45] },
  { label: "Kitchen", range: [45, 70] },
  { label: "Craft", range: [70, 90] },
  { label: "Home", range: [90, 100] },
];

export default function ImmersiveHero() {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const rootRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Preload hero-critical images
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
    // Safety fallback
    const t = setTimeout(() => setLoaded(true), 3500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // MASTER pinned timeline — scrubbed, total 100 units.
      // Note: we intentionally do NOT use GSAP `pin` because the inner container
      // already uses CSS `position: sticky`. Using both fights over layout and
      // clips width when the sticky's parent has any overflow context.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReduced ? true : 0.6,
          onUpdate: (self) => {
            setProgress(self.progress);
            const p = self.progress * 100;
            if (p < 20) setChapter(0);
            else if (p < 45) setChapter(1);
            else if (p < 70) setChapter(2);
            else if (p < 90) setChapter(3);
            else setChapter(4);
          },
        },
      });

      // ============ INITIAL STATE ============
      gsap.set(".scene-entrance", { opacity: 1, scale: 3.6, xPercent: 12, yPercent: -8, filter: "brightness(0.55) contrast(1.1) saturate(0.9)" });
      gsap.set([".scene-living", ".scene-kitchen", ".scene-craft", ".scene-completed"], { opacity: 0, scale: 1.25 });
      gsap.set(".doorway", { scale: 0.05, opacity: 0 });
      gsap.set(".final-black", { opacity: 0 });

      gsap.set(".txt-s1", { opacity: 0, y: 20 });
      gsap.set(".txt-s2-we", { opacity: 0, yPercent: 40, xPercent: -6 });
      gsap.set(".txt-s2-design", { opacity: 0, yPercent: 60, xPercent: 8 });
      gsap.set(".txt-s2-live", { opacity: 0, yPercent: 80, xPercent: -3 });
      gsap.set(".txt-s3-num", { opacity: 0, scale: 1.4, yPercent: 30 });
      gsap.set(".txt-s3-num2", { opacity: 0, scale: 1.4, yPercent: 30 });
      gsap.set(".txt-s4-a", { opacity: 0, yPercent: 40 });
      gsap.set(".txt-s4-b", { opacity: 0, yPercent: 40 });
      gsap.set(".txt-s4-c", { opacity: 0, yPercent: 40 });
      gsap.set(".txt-s5-title", { opacity: 0, yPercent: 40 });
      gsap.set(".txt-s5-cta", { opacity: 0, yPercent: 20 });

      // ============ SCENE 1 : ENTRANCE (0–18) ============
      tl.to(".scene-entrance", { scale: 1.35, xPercent: 0, yPercent: 0, filter: "brightness(0.72) contrast(1) saturate(1)", duration: 18 }, 0)
        .to(".txt-s1", { opacity: 1, y: 0, duration: 4 }, 1)
        .to(".txt-s1", { opacity: 0, y: -20, duration: 3 }, 14);

      // ============ SCENE 2 : LIVING (18–40) ============
      tl.to(".scene-entrance", { opacity: 0, duration: 4 }, 17)
        .fromTo(".scene-living", { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1.06, duration: 8 }, 17)
        .to(".scene-living", { scale: 1.0, xPercent: -2, duration: 15 }, 20)
        .to(".txt-s2-we", { opacity: 1, yPercent: 0, xPercent: 0, duration: 5 }, 20)
        .to(".txt-s2-design", { opacity: 1, yPercent: 0, xPercent: 0, duration: 5 }, 22)
        .to(".txt-s2-live", { opacity: 1, yPercent: 0, xPercent: 0, duration: 5 }, 24)
        .to([".txt-s2-we", ".txt-s2-design", ".txt-s2-live"], { opacity: 0, yPercent: -20, duration: 3, stagger: 0.2 }, 36);

      // ============ SCENE 3 : KITCHEN (40–60) ============
      tl.to(".scene-living", { opacity: 0, duration: 3 }, 39)
        .fromTo(".scene-kitchen", { opacity: 0, scale: 1.2, xPercent: 6 }, { opacity: 1, scale: 1.02, xPercent: 0, duration: 8 }, 39)
        .to(".scene-kitchen", { xPercent: -4, duration: 16 }, 43)
        .to(".txt-s3-num", { opacity: 1, scale: 1, yPercent: 0, duration: 4 }, 43)
        .to(".txt-s3-num", { opacity: 0, yPercent: -40, duration: 3 }, 50)
        .to(".txt-s3-num2", { opacity: 1, scale: 1, yPercent: 0, duration: 4 }, 51)
        .to(".txt-s3-num2", { opacity: 0, yPercent: -40, duration: 3 }, 57);

      // ============ SCENE 4 : CRAFT (60–78) ============
      tl.to(".scene-kitchen", { opacity: 0, duration: 3 }, 60)
        .fromTo(".scene-craft", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1.08, duration: 6 }, 60)
        .to(".scene-craft", { scale: 1.02, duration: 14 }, 63)
        .to(".txt-s4-a", { opacity: 1, yPercent: 0, duration: 3 }, 63)
        .to(".txt-s4-b", { opacity: 1, yPercent: 0, duration: 3 }, 67)
        .to(".txt-s4-c", { opacity: 1, yPercent: 0, duration: 3 }, 71)
        .to([".txt-s4-a", ".txt-s4-b", ".txt-s4-c"], { opacity: 0, yPercent: -20, duration: 3, stagger: 0.08 }, 76);

      // ============ SCENE 5 : COMPLETED (78–90) ============
      tl.to(".scene-craft", { opacity: 0, duration: 3 }, 77)
        .fromTo(".scene-completed", { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1.02, duration: 6 }, 77)
        .to(".txt-s5-title", { opacity: 1, yPercent: 0, duration: 4 }, 79)
        .to(".txt-s5-cta", { opacity: 1, yPercent: 0, duration: 3 }, 82)
        // Doorway closes — starts at 85, fully covers by 92
        .to(".doorway", { scale: 0.25, opacity: 1, duration: 2 }, 85)
        .to(".doorway", { scale: 28, duration: 6, ease: "power2.in" }, 86)
        // Fade out completed text as doorway closes
        .to([".txt-s5-title", ".txt-s5-cta"], { opacity: 0, duration: 3 }, 88)
        // Explicit full-black hold from 92 to 100 to keep the frame clean while sticky unsticks
        .to(".final-black", { opacity: 1, duration: 2 }, 92);

      // Cinematic vignette pulses subtly
      gsap.to(".vignette", {
        opacity: 0.85,
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // ---------- Constrained mouse parallax (desktop only) ----------
      if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
        const scenes = rootRef.current?.querySelectorAll(".hero-scene");
        const textLayers = rootRef.current?.querySelectorAll(".hero-parallax");
        const xTo = gsap.quickTo(scenes, "x", { duration: 1.6, ease: "power2.out" });
        const yTo = gsap.quickTo(scenes, "y", { duration: 1.6, ease: "power2.out" });
        const xT = gsap.quickTo(textLayers, "x", { duration: 1.4, ease: "power2.out" });
        const yT = gsap.quickTo(textLayers, "y", { duration: 1.4, ease: "power2.out" });

        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          xTo(nx * -22);
          yTo(ny * -14);
          xT(nx * 12);
          yT(ny * 8);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [loaded]);

  const circumference = 2 * Math.PI * 22;
  const dash = circumference * (1 - progress);

  return (
    <section
      ref={containerRef}
      id="top"
      data-testid="immersive-hero"
      className="relative w-full bg-[#060605]"
      style={{ height: "400vh" }}
    >
      <div
        ref={pinRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#060605]"
      >
        <div ref={rootRef} className="absolute inset-0">
          {/* ============ SCENE IMAGE LAYERS ============ */}
          <SceneImage src={SCENE_IMAGES.entrance} className="scene-entrance" alt="Architectural material close-up" />
          <SceneImage src={SCENE_IMAGES.living} className="scene-living" alt="Modern luxury living room" />
          <SceneImage src={SCENE_IMAGES.kitchen} className="scene-kitchen" alt="Kitchen and dining space" />
          <SceneImage src={SCENE_IMAGES.craft} className="scene-craft" alt="Custom carpentry craftsmanship" />
          <SceneImage src={SCENE_IMAGES.completed} className="scene-completed" alt="Completed luxury interior" />

          {/* Vignette + cinematic overlays */}
          <div
            className="vignette absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.75,
              background:
                "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/45 via-transparent to-black/70" />
          <div className="absolute inset-0 grain" />

          {/* Wall masks removed — the scene crossfades and doorway close provide the cinematic architecture */}

          {/* ============ SCENE 1 TEXT (Entrance) ============ */}
          <div className="txt-s1 absolute inset-0 pointer-events-none">
            <div className="absolute top-[38%] left-6 md:left-16 lg:left-24 max-w-2xl hero-parallax">
              <div className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#B8B1A5]/80 font-sans mb-4">
                Singapore — Since 2007
              </div>
              <h1 className="font-display text-[#F1EFE9] tracking-[-0.02em] leading-[0.9]" style={{ fontSize: "clamp(3.2rem, 9vw, 8rem)", fontWeight: 300 }}>
                Suntek<br /><em className="not-italic text-[#B8B1A5]">Designs</em>
              </h1>
            </div>
          </div>

          {/* ============ SCENE 2 TEXT (Living) — massive, staggered, spatial ============ */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="txt-s2-we hero-parallax absolute left-6 md:left-12 lg:left-24 top-[10%]" style={{ willChange: "transform, opacity" }}>
              <span className="font-display text-[#F1EFE9]" style={{ fontSize: "clamp(4rem, 13vw, 13rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.03em" }}>
                We Design
              </span>
            </div>
            <div className="txt-s2-design hero-parallax absolute right-6 md:right-12 lg:right-24 top-[36%] text-right" style={{ willChange: "transform, opacity" }}>
              <span className="font-display italic text-[#B8B1A5]" style={{ fontSize: "clamp(4rem, 13vw, 13rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.03em" }}>
                the way
              </span>
            </div>
            <div className="txt-s2-live hero-parallax absolute left-6 md:left-24 lg:left-40 bottom-[10%]" style={{ willChange: "transform, opacity" }}>
              <span className="font-display text-[#F1EFE9]" style={{ fontSize: "clamp(4rem, 13vw, 13rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.03em" }}>
                you live.
              </span>
            </div>
          </div>

          {/* ============ SCENE 3 TEXT (Numbers as architecture) ============ */}
          <div className="txt-s3-num hero-parallax absolute inset-0 pointer-events-none flex items-center justify-end pr-6 md:pr-16 lg:pr-24">
            <div className="text-right">
              <div className="font-display text-[#F1EFE9]" style={{ fontSize: "clamp(6rem, 18vw, 20rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.04em" }}>
                3500<span className="text-[#A68A64]">+</span>
              </div>
              <div className="mt-4 text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#B8B1A5] font-sans">
                Spaces Transformed
              </div>
            </div>
          </div>
          <div className="txt-s3-num2 hero-parallax absolute inset-0 pointer-events-none flex items-center px-6 md:px-16 lg:px-24">
            <div>
              <div className="font-display text-[#F1EFE9]" style={{ fontSize: "clamp(6rem, 18vw, 20rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.04em" }}>
                800<span className="text-[#A68A64]">+</span>
              </div>
              <div className="mt-4 text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#B8B1A5] font-sans">
                Clients &middot; Homes &middot; Studios
              </div>
            </div>
          </div>

          {/* ============ SCENE 4 TEXT (Craft) — layered depths ============ */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="txt-s4-a hero-parallax absolute left-6 md:left-16 lg:left-24 top-[18%]">
              <span className="font-display text-[#F1EFE9]" style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Designed.
              </span>
            </div>
            <div className="txt-s4-b hero-parallax absolute right-6 md:right-16 lg:right-24 top-[42%] text-right">
              <span className="font-display italic text-[#B8B1A5]" style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Built.
              </span>
            </div>
            <div className="txt-s4-c hero-parallax absolute left-1/2 -translate-x-1/2 bottom-[14%]">
              <span className="font-display text-[#F1EFE9]" style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Delivered.
              </span>
            </div>
          </div>

          {/* ============ SCENE 5 TEXT (Completed) ============ */}
          <div className="absolute inset-0 pointer-events-none flex items-center">
            <div className="w-full px-6 md:px-16 lg:px-24">
              <div className="txt-s5-title hero-parallax">
                <div className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#A68A64] font-sans mb-6">
                  The Vision
                </div>
                <h2 className="font-display text-[#F1EFE9] leading-[0.9] tracking-[-0.03em] max-w-6xl" style={{ fontSize: "clamp(3.5rem, 12vw, 13rem)", fontWeight: 300 }}>
                  Your Space.<br />
                  <em className="not-italic text-[#B8B1A5]">Reimagined.</em>
                </h2>
              </div>
              <div className="txt-s5-cta mt-10 md:mt-14 pointer-events-auto">
                <a
                  href="#projects"
                  data-testid="hero-cta-start"
                  className="inline-flex items-center gap-4 text-[#F1EFE9] group"
                >
                  <span className="text-[11px] tracking-[0.4em] uppercase font-sans border-b border-[#F1EFE9]/60 pb-2 group-hover:border-[#A68A64] group-hover:text-[#A68A64] transition-colors duration-500">
                    Start Your Project
                  </span>
                  <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="group-hover:translate-x-2 transition-transform duration-500">
                    <path d="M0 5h26M22 1l4 4-4 4" stroke="currentColor" strokeWidth="1.1" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ============ DOORWAY CLOSE ============ */}
          <div className="doorway absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[70vh] doorway-arch pointer-events-none" />

          {/* Final full-black hold — ensures the frame is completely dark by scene end */}
          <div className="final-black absolute inset-0 bg-[#060605] pointer-events-none" style={{ opacity: 0 }} />

          {/* ============ HUD: Chapter indicator + Circular progress + Scroll indicator ============ */}
          <HeroHUD chapter={chapter} progress={progress} circumference={circumference} dash={dash} />

          {/* Skip / mute for first-time visitors */}
          <a
            href="#projects"
            data-testid="hero-skip"
            className="absolute top-6 right-24 md:right-40 z-30 text-[10px] tracking-[0.35em] uppercase text-[#F1EFE9]/70 hover:text-[#F1EFE9] font-sans link-underline hidden md:inline"
          >
            Skip Intro
          </a>
        </div>
      </div>

      {/* Loading veil */}
      {!loaded && (
        <div className="fixed inset-0 z-[100] bg-[#060605] flex items-center justify-center">
          <div className="text-center">
            <div className="text-[10px] tracking-[0.5em] uppercase text-[#B8B1A5] font-sans mb-4">
              Preparing the space
            </div>
            <div className="w-32 h-px bg-[#B8B1A5]/20 relative overflow-hidden">
              <div className="absolute inset-y-0 w-1/3 bg-[#A68A64] animate-marquee" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SceneImage({ src, className, alt }) {
  return (
    <div className={`hero-scene absolute inset-0 will-change-transform ${className}`}>
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

function HeroHUD({ chapter, progress, circumference, dash }) {
  return (
    <>
      {/* Chapter counter — top left */}
      <div className="absolute top-6 md:top-8 left-6 md:left-16 lg:left-24 z-30 flex items-center gap-4 text-[#F1EFE9]">
        <span className="font-display text-2xl md:text-3xl leading-none">
          0{chapter + 1}
        </span>
        <div className="w-8 h-px bg-[#F1EFE9]/40" />
        <span className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-sans text-[#F1EFE9]/70">
          {SCENE_LABELS[chapter].label}
        </span>
      </div>

      {/* Circular progress — top right */}
      <div
        data-testid="hero-progress"
        className="absolute top-4 md:top-6 right-6 md:right-16 lg:right-24 z-30"
      >
        <div className="relative w-[54px] h-[54px]">
          <svg width="54" height="54" viewBox="0 0 54 54" className="-rotate-90">
            <circle cx="27" cy="27" r="22" stroke="rgba(241,239,233,0.15)" strokeWidth="1" fill="none" />
            <circle
              cx="27"
              cy="27"
              r="22"
              stroke="#A68A64"
              strokeWidth="1.2"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dash}
              style={{ transition: "stroke-dashoffset 0.15s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#F1EFE9] font-sans">
              {Math.round(progress * 100)}
            </span>
          </div>
        </div>
        <div className="mt-3 text-[9px] tracking-[0.35em] uppercase text-[#F1EFE9]/70 font-sans text-center">
          Scroll
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F1EFE9]/70 z-30">
        <span className="text-[9px] tracking-[0.5em] uppercase font-sans">
          Scroll to explore
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#F1EFE9]/60 to-transparent" />
      </div>

      {/* Chapter markers (dots) — bottom right */}
      <div className="absolute bottom-6 md:bottom-8 right-6 md:right-16 lg:right-24 z-30 flex flex-col gap-2">
        {SCENE_LABELS.map((s, i) => (
          <div
            key={s.label}
            className={`w-6 h-px transition-all duration-500 ${
              i === chapter ? "bg-[#A68A64] w-10" : "bg-[#F1EFE9]/30"
            }`}
          />
        ))}
      </div>
    </>
  );
}
